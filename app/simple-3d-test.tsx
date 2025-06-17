import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import { GLView, ExpoWebGLRenderingContext } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";

const { width, height } = Dimensions.get("window");

// Simple Test Component - Just Basic 3D Rendering
const SimpleTest = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Initializing...");

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cubeRef = useRef<THREE.Mesh | null>(null);
  const animationIdRef = useRef<number | null>(null);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    console.log("SimpleTest: GL context created");
    setStatus("Setting up 3D scene...");

    try {
      // Basic Three.js setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        0.1,
        1000
      );
      const renderer = new Renderer({ gl });

      sceneRef.current = scene;
      cameraRef.current = camera;
      rendererRef.current = renderer;

      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      setStatus("Adding lights...");
      console.log("SimpleTest: Adding lights");

      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      setStatus("Creating test geometry...");
      console.log("SimpleTest: Creating cube");

      // Create a simple cube
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshPhongMaterial({
        color: 0x4472c4,
        transparent: true,
        opacity: 0.8,
      });
      const cube = new THREE.Mesh(geometry, material);

      cubeRef.current = cube;
      scene.add(cube);

      // Position camera
      camera.position.set(0, 0, 3);
      camera.lookAt(0, 0, 0);

      console.log("SimpleTest: Setup complete, starting animation");
      setLoading(false);
      setStatus("Rendering 3D cube!");

      // Start animation
      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate);

        if (cube) {
          cube.rotation.x += 0.01;
          cube.rotation.y += 0.01;
        }

        renderer.render(scene, camera);
      };
      animate();
    } catch (err: any) {
      console.error("SimpleTest: Error during setup:", err);
      setError(`Failed to setup 3D scene: ${err.message}`);
      setLoading(false);
    }
  };

  const cleanup = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }

    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = null;
    }

    if (cubeRef.current && sceneRef.current) {
      sceneRef.current.remove(cubeRef.current);
      cubeRef.current = null;
    }

    sceneRef.current = null;
    cameraRef.current = null;
  };

  useEffect(() => {
    return cleanup;
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>3D Rendering Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setLoading(true);
              setStatus("Retrying...");
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Simple 3D Test</Text>
        <Text style={styles.subtitle}>Basic Three.js Rendering Test</Text>
      </View>

      <View style={styles.glContainer}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>{status}</Text>
          </View>
        )}

        <GLView style={styles.glView} onContextCreate={onContextCreate} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Platform: {Platform.OS}</Text>
        <Text style={styles.infoText}>Status: {status}</Text>
        {!loading && !error && (
          <Text style={styles.successText}>✓ 3D rendering working</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
  },
  glContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  glView: {
    width: width - 40,
    height: height * 0.6,
    backgroundColor: "#111",
    borderRadius: 10,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    borderRadius: 10,
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff6b6b",
    marginBottom: 10,
  },
  errorText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  infoContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
  },
  infoText: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 5,
  },
  successText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 5,
  },
});

export default SimpleTest;
