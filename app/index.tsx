import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

const { width, height } = Dimensions.get("window");

export default function App() {
  const { loginAsGuest } = useAuth();

  const handleEnterApp = () => {
    router.push("/(drawer)/home");
  };

  const handleGuestEntry = async () => {
    await loginAsGuest();
    router.push("/(drawer)/home");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Image */}
      <ImageBackground
        source={require("../assets/images/andremeda.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Gradient Overlay */}
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>ASTROVERT</Text>
              <Text style={styles.subtitle}>
                Explore the Cosmos, Discover the Universe
              </Text>
              <View style={styles.divider} />
              <Text style={styles.description}>
                Journey through space, learn about galaxies, play cosmic games,
                and test your astronomy knowledge in this interactive space
                experience.
              </Text>
            </View>
            {/* Authentication Buttons */}
            <View style={styles.authSection}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push("/login")}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#4A90E2", "#357ABD"]}
                  style={styles.authButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.authButtonText}>LOGIN</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.guestButton}
                onPress={handleGuestEntry}
                activeOpacity={0.8}
              >
                <View style={styles.guestButtonBackground}>
                  <Text style={styles.guestButtonText}>CONTINUE AS GUEST</Text>
                </View>
              </TouchableOpacity>
            </View>
            {/* Bottom Info */}
            <View style={styles.bottomInfo}>
              <Text style={styles.bottomText}>
                🌌 Interactive 3D Models • 🎮 Space Games • 📚 Astronomy Blog
              </Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 80,
  },
  titleSection: {
    alignItems: "center",
    marginTop: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 4,
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: "#B0B0B0",
    textAlign: "center",
    marginBottom: 20,
    fontStyle: "italic",
  },
  divider: {
    width: 100,
    height: 2,
    backgroundColor: "#4A90E2",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  authSection: {
    alignItems: "center",
    marginBottom: 40,
    width: "100%",
  },
  loginButton: {
    marginBottom: 15,
    width: "80%",
  },
  registerButton: {
    marginBottom: 15,
    width: "80%",
  },
  guestButton: {
    marginTop: 10,
    width: "80%",
  },
  authButtonGradient: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 6,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  authButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 1,
  },
  guestButtonBackground: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  guestButtonText: {
    color: "#CCCCCC",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 1,
  },
  enterButton: {
    marginBottom: 40,
  },
  buttonGradient: {
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 1,
  },
  bottomInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  bottomText: {
    fontSize: 14,
    color: "#888888",
    textAlign: "center",
    lineHeight: 20,
  },
});
