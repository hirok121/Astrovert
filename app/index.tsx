import { Redirect } from "expo-router";
import React from "react";

export default function App() {
  // Redirect to welcome screen declaratively
  return <Redirect href="./welcome" />;
}
