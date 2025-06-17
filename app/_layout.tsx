import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { AuthProvider } from "../contexts/AuthContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  return (
    <AuthProvider>
      <ThemeProvider value={DarkTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="blog" options={{ title: "Astronomy Blog" }} />
          <Stack.Screen
            name="andromeda"
            options={{ title: "3D Andromeda Galaxy" }}
          />
          <Stack.Screen
            name="test-andromeda"
            options={{ title: "Test Andromeda Model" }}
          />
          <Stack.Screen
            name="simple-3d-test"
            options={{ title: "Simple 3D Test" }}
          />
          <Stack.Screen name="game" options={{ title: "Asteroid Dodger" }} />
          <Stack.Screen name="quiz" options={{ title: "Astronomy Quiz" }} />
          <Stack.Screen name="login" options={{ title: "Login" }} />
          <Stack.Screen name="register" options={{ title: "Register" }} />
          <Stack.Screen name="profile" options={{ title: "User Profile" }} />
          <Stack.Screen name="blog/[id]" options={{ title: "Blog Post" }} />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </AuthProvider>
  );
}
