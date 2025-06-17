import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { GLView, ExpoWebGLRenderingContext } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";

export default function CleanTestPage() {
  const [status, setStatus] = useState("Ready");

  const onContextCreate = useCallback(async (gl: ExpoWebGLRenderingContext) => {
    setStatus("Creating 3D scene...");

    try {
      const renderer = new Renderer({ gl });
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
      renderer.setClearColor(0x000011, 1);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 5);

      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);

      // Create a simple rotating cube
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      setStatus("Success! Cube created");

      const animate = () => {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
        gl.endFrameEXP();
      };

      animate();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setStatus(`Error: ${errorMessage}`);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clean 3D Test</Text>
      <Text style={styles.status}>{status}</Text>
      <GLView style={styles.glView} onContextCreate={onContextCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20 },
  title: { fontSize: 24, color: "#fff", textAlign: "center", marginBottom: 10 },
  status: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 20,
  },
  glView: { flex: 1, borderRadius: 10 },
});
