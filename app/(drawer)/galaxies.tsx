// Clean procedural galaxy viewer - no GLTF dependencies
import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import {
  PanGestureHandler,
  PinchGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { GLView, ExpoWebGLRenderingContext } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import { useFocusEffect } from "@react-navigation/native";
// import { SoundManager, SoundType } from "../../utils/soundManager";
import {
  playSound,
  SoundType,
  configureAudio,
  playLoopingSound,
  stopLoopingSound,
} from "../../utils/soundManager";

export default function GalaxiesScreen() {
  const [currentModel, setCurrentModel] = useState<"galaxy" | "andromeda">(
    "galaxy"
  );
  const [status, setStatus] = useState("Ready to load 3D model");

  // Play/stop ambient sound based on screen focus
  useFocusEffect(
    useCallback(() => {
      // Play ambient sound when screen is focused
      playLoopingSound(SoundType.SPACE_AMBIENT, 0.3);

      return () => {
        // Stop ambient sound when screen loses focus
        stopLoopingSound(SoundType.SPACE_AMBIENT);
      };
    }, [])
  );

  // Rotation state for manual control
  const rotationRef = useRef({ x: 0, y: 0 });
  const autoRotationRef = useRef({ y: 0 }); // For automatic rotation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const lastPanRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(5); // Initial camera distance
  const lastPinchScale = useRef(1);
  const isInteractingRef = useRef(false); // Track if user is interacting
  const interactionTimeoutRef = useRef<number | null>(null);

  const onPanGestureEvent = (event: any) => {
    const { translationX, translationY } = event.nativeEvent;
    isInteractingRef.current = true; // User is interacting

    // Calculate rotation delta with improved sensitivity
    const deltaX = (translationX - lastPanRef.current.x) * 0.005;
    const deltaY = (translationY - lastPanRef.current.y) * 0.005;

    // Update rotation with constraints to prevent over-rotation
    rotationRef.current.y += deltaX;
    rotationRef.current.x += deltaY;

    // Clamp vertical rotation to prevent flipping
    rotationRef.current.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, rotationRef.current.x)
    );

    // Apply rotation to scene objects
    if (sceneRef.current) {
      sceneRef.current.children.forEach((child) => {
        if (child.type === "Points" || child.type === "Mesh") {
          child.rotation.y = rotationRef.current.y;
          child.rotation.x = rotationRef.current.x;
        }
      });
    }

    lastPanRef.current = { x: translationX, y: translationY };
  };
  const onPanGestureEnd = (event: any) => {
    lastPanRef.current = { x: 0, y: 0 };

    // Clear any existing timeout
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }

    // Set a timeout before resuming automatic animation
    interactionTimeoutRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 1000); // Wait 1 second after user stops interacting
  };
  const onPinchGestureEvent = (event: any) => {
    const { scale } = event.nativeEvent;
    isInteractingRef.current = true; // User is interacting

    // Calculate zoom delta based on scale change
    const scaleChange = scale / lastPinchScale.current;
    const newZoom = zoomRef.current / scaleChange;

    // Clamp zoom to reasonable limits (closer = smaller number, farther = larger number)
    zoomRef.current = Math.max(1, Math.min(20, newZoom));

    // Apply zoom to camera position
    if (cameraRef.current) {
      // Keep camera direction but change distance
      const direction = cameraRef.current.position.clone().normalize();
      cameraRef.current.position.copy(
        direction.multiplyScalar(zoomRef.current)
      );
    }

    lastPinchScale.current = scale;
  };
  const onPinchGestureEnd = (event: any) => {
    lastPinchScale.current = 1;

    // Clear any existing timeout
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }

    // Set a timeout before resuming automatic animation
    interactionTimeoutRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 1000); // Wait 1 second after user stops interacting
  };
  const resetRotation = () => {
    rotationRef.current = { x: 0, y: 0 };
    autoRotationRef.current = { y: 0 }; // Reset auto rotation too
    zoomRef.current = 5; // Reset zoom to initial value
    isInteractingRef.current = false; // Reset interaction state

    if (sceneRef.current) {
      sceneRef.current.children.forEach((child) => {
        if (child.type === "Points" || child.type === "Mesh") {
          child.rotation.y = 0;
          child.rotation.x = 0;
        }
      });
    }

    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 5);
    }
  };
  const zoomIn = () => {
    zoomRef.current = Math.max(1, zoomRef.current - 1);
    if (cameraRef.current) {
      const direction = cameraRef.current.position.clone().normalize();
      cameraRef.current.position.copy(
        direction.multiplyScalar(zoomRef.current)
      );
    }
  };

  const zoomOut = () => {
    zoomRef.current = Math.min(20, zoomRef.current + 1);
    if (cameraRef.current) {
      const direction = cameraRef.current.position.clone().normalize();
      cameraRef.current.position.copy(
        direction.multiplyScalar(zoomRef.current)
      );
    }
  };
  const onContextCreate = useCallback(
    async (gl: ExpoWebGLRenderingContext) => {
      console.log("GalaxiesScreen: Creating 3D scene");
      setStatus("Creating 3D galaxy...");

      try {
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        renderer.setClearColor(0x000011, 1);
        const scene = new THREE.Scene();
        sceneRef.current = scene; // Store scene reference for gesture handling

        const camera = new THREE.PerspectiveCamera(
          75,
          gl.drawingBufferWidth / gl.drawingBufferHeight,
          0.1,
          1000
        );
        camera.position.set(0, 0, 5);
        cameraRef.current = camera; // Store camera reference for zoom control

        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        if (currentModel === "andromeda") {
          createAndromedaGalaxy(scene);
        } else {
          createSpiralGalaxy(scene);
        }
        setStatus("Drag to rotate, pinch to zoom.");

        const animate = () => {
          requestAnimationFrame(animate); // If user is not interacting, apply automatic rotation
          if (!isInteractingRef.current) {
            autoRotationRef.current.y += 0.003; // Reduced rotation speed

            // Apply automatic rotation to all objects
            scene.children.forEach((child) => {
              if (child.type === "Points" || child.type === "Mesh") {
                child.rotation.y =
                  autoRotationRef.current.y + rotationRef.current.y;
                child.rotation.x = rotationRef.current.x;
              }
            });
          } else {
            // If user is interacting, apply manual rotation only
            scene.children.forEach((child) => {
              if (child.type === "Points" || child.type === "Mesh") {
                child.rotation.y =
                  rotationRef.current.y + autoRotationRef.current.y;
                child.rotation.x = rotationRef.current.x;
              }
            });
          }

          renderer.render(scene, camera);
          gl.endFrameEXP();
        };

        animate();
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error("GalaxiesScreen: Error:", errorMessage);
        setStatus(`Error: ${errorMessage}`);
      }
    },
    [currentModel]
  );

  const createSpiralGalaxy = (scene: THREE.Scene) => {
    const centerGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const centerMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.8,
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    scene.add(center);

    const pointsGeometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    for (let i = 0; i < 3000; i++) {
      const angle = (i / 3000) * Math.PI * 6;
      const radius = (i / 3000) * 4;

      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.3;
      const y = (Math.random() - 0.5) * 0.2;
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.3;

      positions.push(x, y, z);

      const intensity = Math.max(0.1, 1 - radius / 4);
      colors.push(intensity, intensity * 0.7, intensity * 0.9);
    }

    pointsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    pointsGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);
  };

  const createAndromedaGalaxy = (scene: THREE.Scene) => {
    const centerGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const centerMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0.9,
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    scene.add(center);

    const pointsGeometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    for (let i = 0; i < 4000; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 3;
      const ellipse = 0.6;

      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 0.3;
      const z = Math.sin(angle) * radius * ellipse;

      positions.push(x, y, z);

      const intensity = Math.max(0.2, 1 - radius / 3);
      colors.push(intensity * 0.9, intensity * 0.6, intensity);
    }

    pointsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    pointsGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../assets/images/andremeda.jpg")}
        style={styles.container}
        blurRadius={3}
      >
        <View style={styles.overlay}>
          <Text
            style={styles.title}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
          >
            🌌 Cosmic Galaxy Explorer
          </Text>
          <View style={styles.controls}>
            <TouchableOpacity
              style={[
                styles.button,
                currentModel === "galaxy" && styles.activeButton,
              ]}
              onPress={() => setCurrentModel("galaxy")}
            >
              <Text style={styles.buttonText}>Spiral Galaxy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                currentModel === "andromeda" && styles.activeButton,
              ]}
              onPress={() => setCurrentModel("andromeda")}
            >
              <Text style={styles.buttonText}>Andromeda</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.status}>{status}</Text>
          <View style={styles.canvasContainer}>
            <PinchGestureHandler
              onGestureEvent={onPinchGestureEvent}
              onEnded={onPinchGestureEnd}
            >
              <PanGestureHandler
                onGestureEvent={onPanGestureEvent}
                onEnded={onPanGestureEnd}
              >
                <View style={{ flex: 1 }}>
                  <GLView
                    key={currentModel}
                    style={styles.canvas}
                    onContextCreate={onContextCreate}
                  />
                </View>
              </PanGestureHandler>
            </PinchGestureHandler>
          </View>
          <View style={styles.modelControls}>
            <TouchableOpacity
              style={[styles.button, styles.zoomButton]}
              onPress={zoomIn}
            >
              <Text style={styles.buttonText}>Zoom In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.zoomButton]}
              onPress={zoomOut}
            >
              <Text style={styles.buttonText}>Zoom Out</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoPanel}>
            <Text style={styles.infoTitle}>
              {currentModel === "andromeda"
                ? "Andromeda Galaxy"
                : "Spiral Galaxy"}
            </Text>
            <Text
              style={styles.infoText}
              numberOfLines={4}
              ellipsizeMode="tail"
            >
              {currentModel === "andromeda"
                ? "The Andromeda Galaxy (M31) is our closest major galactic neighbor at 2.5 million light-years away. This massive elliptical galaxy contains over one trillion stars and is on a collision course with the Milky Way, expected to merge in 4.5 billion years."
                : "A spiral galaxy with rotating arms extending from a bright central bulge. These cosmic structures contain billions of stars, gas, and dust organized in a distinctive pinwheel pattern. Our Milky Way is a similar spiral galaxy."}
            </Text>
          </View>
        </View>
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.7)", padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  button: {
    backgroundColor: "rgba(74, 144, 226, 0.8)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 5,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  activeButton: {
    backgroundColor: "rgba(74, 144, 226, 1)",
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  resetButton: {
    backgroundColor: "rgba(226, 74, 74, 0.8)",
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  zoomControls: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
  },
  modelControls: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 0,
    flexWrap: "wrap",
  },
  zoomButton: {
    backgroundColor: "rgba(74, 226, 74, 0.8)",
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  status: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 20,
  },
  canvasContainer: {
    height: "50%",
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#000",
    borderWidth: 2,
    borderColor: "rgba(74, 144, 226, 0.5)",
  },
  canvas: { flex: 1 },
  infoPanel: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: 0,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 10,
  },
  infoText: { fontSize: 14, color: "#ccc", lineHeight: 20 },
});
