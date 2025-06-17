import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { View, Text } from "react-native";
import { GLView } from "expo-gl";
import * as THREE from "three";
import { Renderer } from "expo-three";
import { Assets } from "expo-asset";

export default function ModelViewer() {
  return (
    <View style={{ flex: 1 }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} />
        <Model />
      </Canvas>
    </View>
  );
}

function Model() {
  const modeluri = Assets.fromModule(
    require("@/assets/3DModels/galaxy_und44700129/scene.gltf")
  ).uri;
  console.log(modeluri);
  const { scene, isLoading, error } = useGLTF(modeluri); // Load model

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error loading model</Text>;
  }

  return <primitive object={scene} scale={1} />;
}
