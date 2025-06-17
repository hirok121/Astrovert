import React, { useRef } from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import { GLView, ExpoWebGLRenderingContext } from "expo-gl";
import { Renderer } from "expo-three";
import { Asset } from "expo-asset";
import * as THREE from "three";
import { loadAsync } from "expo-three";

const { width, height } = Dimensions.get("window");

// Simple Andromeda 3D Model Viewer
const TestAndromedaPage = () => {
  const objectRef = useRef<THREE.Object3D | null>(null);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    // Create a Three.JS Scene
    const scene = new THREE.Scene();

    // Create a new camera with positions and angles
    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    ); // Instantiate a new renderer with transparent background
    const renderer = new Renderer({ gl, alpha: true });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    // Set how far the camera will be from the 3D model
    camera.position.z = 100;

    // Add lights to the scene, so we can actually see the 3D model
    const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
    topLight.position.set(500, 500, 500); // top-left-ish
    topLight.castShadow = true;
    scene.add(topLight);

    const ambientLight = new THREE.AmbientLight(0x333333, 1);
    scene.add(ambientLight);

    // Load the Andromeda model
    try {
      console.log("Loading Andromeda model..."); // Try multiple paths for different platforms
      let modelPaths: string[] = [];

      if (Platform.OS === "web") {
        modelPaths = [
          "./models/andromeda/scene.gltf", // Web relative path
          "/models/andromeda/scene.gltf", // Web absolute path
          "models/andromeda/scene.gltf", // Alternative web path
          "http://localhost:8081/models/andromeda/scene.gltf", // Dev server path
        ];
      } else {
        // For mobile platforms, try local asset bundle paths
        modelPaths = [
          // These don't work in React Native, so we'll skip model loading for mobile
          // and just show the fallback cube
        ];
      }

      let gltf;
      let loadSuccess = false;

      for (const modelPath of modelPaths) {
        try {
          console.log(`Trying to load model from: ${modelPath}`);
          gltf = await loadAsync(modelPath);
          loadSuccess = true;
          console.log(`Successfully loaded model from: ${modelPath}`);
          break;
        } catch (pathError) {
          console.log(`Failed to load from ${modelPath}:`, pathError);
          continue;
        }
      }

      if (!loadSuccess) {
        throw new Error("All model paths failed");
      }

      // If the file is loaded, add it to the scene
      const object = gltf.scene;
      objectRef.current = object;
      scene.add(object);

      console.log("Andromeda model loaded and added to scene successfully!");
    } catch (error) {
      // If there is an error, log it and create a fallback cube
      console.error("Error loading Andromeda model:", error);

      // Create a simple cube as fallback
      const geometry = new THREE.BoxGeometry(50, 50, 50);
      const material = new THREE.MeshPhongMaterial({ color: 0x4472c4 });
      const cube = new THREE.Mesh(geometry, material);
      objectRef.current = cube;
      scene.add(cube);

      console.log("Using fallback cube instead of Andromeda model");
    }

    // Render the scene
    function animate() {
      requestAnimationFrame(animate);

      // Add some automatic rotation to the model
      if (objectRef.current) {
        objectRef.current.rotation.y += 0.01;
        objectRef.current.rotation.x += 0.005;
      }

      renderer.render(scene, camera);
    }

    // Start the 3D rendering
    animate();
  };

  return (
    <View style={styles.container}>
      {" "}
      <View style={styles.header}>
        <Text style={styles.title}>Andromeda 3D Model</Text>
        <Text style={styles.subtitle}>Simple 3D Model Viewer</Text>
      </View>
      <View style={styles.glContainer}>
        <GLView style={styles.glView} onContextCreate={onContextCreate} />
      </View>{" "}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>🌌 Andromeda Galaxy 3D Viewer</Text>
        <Text style={styles.infoText}>
          {Platform.OS === "web"
            ? "Loading model from local files..."
            : "Showing 3D cube (model loading not supported on mobile yet)"}
        </Text>
        <Text style={styles.infoText}>Model will auto-rotate when loaded</Text>
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
  },
  glView: {
    width: width - 40,
    height: height * 0.7,
    backgroundColor: "#111",
    borderRadius: 10,
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
    textAlign: "center",
  },
});

export default TestAndromedaPage;
