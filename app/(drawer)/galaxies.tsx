// Clean procedural galaxy viewer - no GLTF dependencies
import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  PanGestureHandler,
  PinchGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
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
    // Enhanced galactic center with glow effect
    const centerGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const centerMaterial = new THREE.MeshBasicMaterial({
      color: 0xffcc00,
      transparent: true,
      opacity: 1.0,
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    scene.add(center);

    // Supermassive black hole at center
    const blackHoleGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const blackHoleMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      opacity: 0.9,
    });
    const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
    scene.add(blackHole);

    // Create multiple spiral arms with different densities
    const spiralArms = 4;
    const totalStars = 8000;

    const pointsGeometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];

    for (let arm = 0; arm < spiralArms; arm++) {
      const armOffset = (arm / spiralArms) * Math.PI * 2;
      const starsPerArm = totalStars / spiralArms;

      for (let i = 0; i < starsPerArm; i++) {
        const t = i / starsPerArm;
        const angle = t * Math.PI * 8 + armOffset; // More spiral turns
        const radius = t * 5 + Math.random() * 0.8; // Extended reach

        // Add some randomness for realistic distribution
        const armWidth = 0.3 + t * 0.5; // Arms get wider towards edges
        const randomOffset = (Math.random() - 0.5) * armWidth;

        const x =
          Math.cos(angle) * radius +
          Math.cos(angle + Math.PI / 2) * randomOffset;
        const y = (Math.random() - 0.5) * (0.1 + t * 0.2); // Thicker disk towards edges
        const z =
          Math.sin(angle) * radius +
          Math.sin(angle + Math.PI / 2) * randomOffset;

        positions.push(x, y, z);

        // Enhanced color variation based on position and stellar type
        const distanceFromCenter = Math.sqrt(x * x + y * y + z * z);
        const intensity = Math.max(0.1, 1.2 - distanceFromCenter / 5);

        // Stellar classification colors
        const stellarType = Math.random();
        if (stellarType < 0.1) {
          // Blue giants (rare, hot stars)
          colors.push(intensity * 0.6, intensity * 0.8, intensity * 1.0);
        } else if (stellarType < 0.3) {
          // White/yellow stars
          colors.push(intensity * 1.0, intensity * 0.9, intensity * 0.7);
        } else if (stellarType < 0.7) {
          // Orange stars
          colors.push(intensity * 1.0, intensity * 0.6, intensity * 0.3);
        } else {
          // Red dwarfs (most common)
          colors.push(intensity * 0.9, intensity * 0.3, intensity * 0.1);
        }

        // Variable star sizes
        sizes.push(0.02 + Math.random() * 0.04);
      }
    }

    // Add dust lanes with darker particles
    for (let i = 0; i < 1000; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1 + Math.random() * 3;
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 0.05; // Very thin dust layer
      const z = Math.sin(angle) * radius;

      positions.push(x, y, z);

      // Dark dust particles
      const dustIntensity = 0.2 + Math.random() * 0.3;
      colors.push(
        dustIntensity * 0.4,
        dustIntensity * 0.2,
        dustIntensity * 0.1
      );
      sizes.push(0.01 + Math.random() * 0.02);
    }

    pointsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    pointsGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );
    pointsGeometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(sizes, 1)
    );

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending, // Enhanced glow effect
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);

    // Add subtle rotation animation
    const animate = () => {
      if (!isInteractingRef.current && sceneRef.current) {
        autoRotationRef.current.y += 0.001;
        sceneRef.current.children.forEach((child) => {
          if (
            child.type === "Points" ||
            (child.type === "Mesh" && child !== blackHole)
          ) {
            child.rotation.y = autoRotationRef.current.y;
          }
        });
      }
      requestAnimationFrame(animate);
    };
    animate();
  };
  const createAndromedaGalaxy = (scene: THREE.Scene) => {
    // Massive galactic bulge (elliptical structure)
    const bulgeGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const bulgeMaterial = new THREE.MeshBasicMaterial({
      color: 0xff8800,
      transparent: true,
      opacity: 0.7,
    });
    const bulge = new THREE.Mesh(bulgeGeometry, bulgeMaterial);
    bulge.scale.set(1, 0.6, 0.8); // Elliptical shape
    scene.add(bulge);

    // Central supermassive black hole (larger than Milky Way)
    const blackHoleGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const blackHoleMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      opacity: 1.0,
    });
    const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
    scene.add(blackHole);

    // Create Andromeda's structure with dense core and spiral arms
    const totalStars = 12000; // More stars for larger galaxy

    const pointsGeometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];

    // Dense galactic core
    for (let i = 0; i < 3000; i++) {
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const radius = Math.random() * 1.2;

      const x = radius * Math.sin(theta) * Math.cos(phi) * 0.8; // Elliptical
      const y = radius * Math.sin(theta) * Math.sin(phi) * 0.4; // Flattened
      const z = radius * Math.cos(theta) * 0.6;

      positions.push(x, y, z);

      // Old, red stars in the core
      const intensity = Math.max(0.3, 1.5 - radius);
      colors.push(intensity * 0.9, intensity * 0.4, intensity * 0.1);
      sizes.push(0.015 + Math.random() * 0.025);
    }

    // Spiral arms (Andromeda has prominent arms)
    const spiralArms = 2; // Andromeda has 2 main arms
    for (let arm = 0; arm < spiralArms; arm++) {
      const armOffset = (arm / spiralArms) * Math.PI * 2;

      for (let i = 0; i < 4000; i++) {
        const t = i / 4000;
        const angle = t * Math.PI * 6 + armOffset;
        const radius = 1.2 + t * 4.5; // Starts from bulge edge

        // Andromeda's distinctive arm structure
        const armWidth = 0.4 + t * 0.8;
        const randomOffset = (Math.random() - 0.5) * armWidth;

        const x =
          Math.cos(angle) * radius +
          Math.cos(angle + Math.PI / 2) * randomOffset;
        const y = (Math.random() - 0.5) * (0.08 + t * 0.15); // Thin disk
        const z =
          Math.sin(angle) * radius * 0.7 +
          Math.sin(angle + Math.PI / 2) * randomOffset; // Elliptical

        positions.push(x, y, z);

        // Mixed stellar populations in arms
        const distanceFromCenter = Math.sqrt(x * x + y * y + z * z);
        const intensity = Math.max(0.15, 1.3 - distanceFromCenter / 5);

        const stellarType = Math.random();
        if (stellarType < 0.15) {
          // Blue star forming regions
          colors.push(intensity * 0.5, intensity * 0.7, intensity * 1.0);
        } else if (stellarType < 0.4) {
          // Yellow-white stars
          colors.push(intensity * 1.0, intensity * 0.8, intensity * 0.6);
        } else {
          // Red stars (majority)
          colors.push(intensity * 0.8, intensity * 0.3, intensity * 0.1);
        }

        sizes.push(0.02 + Math.random() * 0.035);
      }
    }

    // Halo of old stars (extended structure)
    for (let i = 0; i < 2000; i++) {
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const radius = 3 + Math.random() * 5; // Extended halo

      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi) * 0.3; // Flattened halo
      const z = radius * Math.cos(theta) * 0.7;

      positions.push(x, y, z);

      // Dim, old halo stars
      const intensity = 0.1 + Math.random() * 0.2;
      colors.push(intensity * 0.6, intensity * 0.2, intensity * 0.1);
      sizes.push(0.01 + Math.random() * 0.015);
    }

    // Dust lanes and nebulae
    for (let i = 0; i < 1500; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.5 + Math.random() * 3;
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 0.08;
      const z = Math.sin(angle) * radius * 0.7;

      positions.push(x, y, z);

      // Dark dust with occasional bright nebulae
      if (Math.random() < 0.1) {
        // Bright nebulae
        const nebulaIntensity = 0.5 + Math.random() * 0.5;
        colors.push(
          nebulaIntensity * 0.8,
          nebulaIntensity * 0.4,
          nebulaIntensity * 1.0
        );
      } else {
        // Dust lanes
        const dustIntensity = 0.1 + Math.random() * 0.2;
        colors.push(
          dustIntensity * 0.3,
          dustIntensity * 0.1,
          dustIntensity * 0.05
        );
      }
      sizes.push(0.008 + Math.random() * 0.02);
    }

    pointsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    pointsGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );
    pointsGeometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(sizes, 1)
    );

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);

    // Slower rotation for massive galaxy
    const animate = () => {
      if (!isInteractingRef.current && sceneRef.current) {
        autoRotationRef.current.y += 0.0005; // Slower rotation
        sceneRef.current.children.forEach((child) => {
          if (
            child.type === "Points" ||
            (child.type === "Mesh" && child !== blackHole)
          ) {
            child.rotation.y = autoRotationRef.current.y;
          }
        });
      }
      requestAnimationFrame(animate);
    };
    animate();
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../assets/images/andremeda.jpg")}
        style={styles.container}
        blurRadius={3}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={[
              "rgba(0, 0, 30, 0.9)",
              "rgba(0, 0, 0, 0.8)",
              "rgba(30, 0, 60, 0.9)",
            ]}
            style={styles.overlay}
          >
            <View style={styles.headerContainer}>
              <Text
                style={styles.title}
                numberOfLines={2}
                adjustsFontSizeToFit={true}
              >
                🌌 Cosmic Galaxy Explorer
              </Text>
              <Text style={styles.subtitle}>
                Interactive 3D Galaxy Visualization
              </Text>
            </View>
            <View style={styles.controlsCard}>
              <View style={styles.controls}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.galaxyButton,
                    currentModel === "galaxy" && styles.activeButton,
                  ]}
                  onPress={() => setCurrentModel("galaxy")}
                >
                  <Text style={styles.buttonText}>🌀 Spiral Galaxy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.galaxyButton,
                    currentModel === "andromeda" && styles.activeButton,
                  ]}
                  onPress={() => setCurrentModel("andromeda")}
                >
                  <Text style={styles.buttonText}>🌌 Andromeda</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.status}>{status}</Text>
            <View style={styles.canvasCard}>
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
            </View>
            <View style={styles.zoomControlsCard}>
              <View style={styles.zoomControls}>
                <TouchableOpacity
                  style={[styles.button, styles.zoomButton]}
                  onPress={zoomIn}
                >
                  <Text style={styles.buttonText}>🔍 Zoom In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.zoomButton]}
                  onPress={zoomOut}
                >
                  <Text style={styles.buttonText}>🔍 Zoom Out</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>
                {currentModel === "andromeda"
                  ? "🌌 Andromeda Galaxy (M31)"
                  : "🌀 Spiral Galaxy Structure"}
              </Text>
              <Text style={styles.infoText}>
                {currentModel === "andromeda"
                  ? "The Andromeda Galaxy (M31) is our closest major galactic neighbor at 2.5 million light-years away. This massive elliptical galaxy contains over one trillion stars and is on a collision course with the Milky Way, expected to merge in 4.5 billion years creating a spectacular cosmic event known as 'Milkomeda'."
                  : "A spiral galaxy with rotating arms extending from a bright central bulge. These cosmic structures contain billions of stars, gas, and dust organized in a distinctive pinwheel pattern. Our Milky Way is a similar spiral galaxy with approximately 400 billion stars distributed across its spiral arms."}
              </Text>

              <View style={styles.factsContainer}>
                <Text style={styles.factsTitle}>Quick Facts:</Text>
                {currentModel === "andromeda" ? (
                  <View style={styles.factsList}>
                    <Text style={styles.factItem}>
                      • Distance: 2.5 million light-years
                    </Text>
                    <Text style={styles.factItem}>
                      • Stars: Over 1 trillion
                    </Text>
                    <Text style={styles.factItem}>
                      • Diameter: 220,000 light-years
                    </Text>
                    <Text style={styles.factItem}>
                      • Will merge with Milky Way in 4.5 billion years
                    </Text>
                  </View>
                ) : (
                  <View style={styles.factsList}>
                    <Text style={styles.factItem}>
                      • Structure: Central bulge + spiral arms
                    </Text>
                    <Text style={styles.factItem}>
                      • Rotation: Arms trail behind rotation
                    </Text>
                    <Text style={styles.factItem}>
                      • Star formation: Active in spiral arms
                    </Text>
                    <Text style={styles.factItem}>
                      • Dark matter: 85% of total mass
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </ScrollView>
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 15,
  },
  overlay: {
    flex: 1,
    padding: 15,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#A0A0FF",
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.9,
  },
  controlsCard: {
    backgroundColor: "transparent",
    borderRadius: 0,
    padding: 8,
    marginBottom: 12,
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "transparent",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    minWidth: 120,
  },
  galaxyButton: {
    backgroundColor: "rgba(74, 144, 226, 0.8)",
    borderColor: "rgba(74, 144, 226, 0.4)",
  },
  activeButton: {
    backgroundColor: "rgba(74, 144, 226, 1)",
    borderColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#4A90E2",
    shadowOpacity: 0.5,
    transform: [{ scale: 1.05 }],
  },
  zoomButton: {
    backgroundColor: "rgba(74, 226, 74, 0.8)",
    borderColor: "rgba(74, 226, 74, 0.4)",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  status: {
    fontSize: 13,
    color: "#A0A0FF",
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 12,
  },
  canvasCard: {
    backgroundColor: "transparent",
    borderRadius: 0,
    padding: 8,
    marginBottom: 12,
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "transparent",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  canvasContainer: {
    height: height * 0.4,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#000",
    borderWidth: 2,
    borderColor: "rgba(74, 144, 226, 0.5)",
    shadowColor: "#4A90E2",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  canvas: {
    flex: 1,
  },
  zoomControlsCard: {
    backgroundColor: "transparent",
    borderRadius: 0,
    padding: 8,
    marginBottom: 12,
    borderWidth: 0,
    borderColor: "transparent",
    shadowColor: "transparent",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  zoomControls: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  infoCard: {
    backgroundColor: "rgba(0, 0, 40, 0.8)",
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: "rgba(74, 144, 226, 0.3)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 15,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 16,
    color: "#E0E0E0",
    lineHeight: 24,
    marginBottom: 20,
    textAlign: "justify",
  },
  factsContainer: {
    backgroundColor: "transparent",
    borderRadius: 15,
    padding: 20,
    borderWidth: 0,
    borderColor: "transparent",
  },
  factsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#A0A0FF",
    marginBottom: 12,
    textAlign: "center",
  },
  factsList: {
    paddingLeft: 10,
  },
  factItem: {
    fontSize: 15,
    color: "#C0C0C0",
    lineHeight: 22,
    marginBottom: 6,
  },
});
