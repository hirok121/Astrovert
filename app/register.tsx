import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const validateForm = () => {
    if (!username.trim()) {
      Alert.alert("Error", "Please enter a username");
      return false;
    }

    if (username.trim().length < 3) {
      Alert.alert("Error", "Username must be at least 3 characters long");
      return false;
    }

    if (!password) {
      Alert.alert("Error", "Please enter a password");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const success = await register(username.trim(), password);
      if (success) {
        Alert.alert(
          "Success",
          "Account created successfully! Welcome to Astrovert!",
          [{ text: "OK", onPress: () => router.replace("./home") }]
        );
      } else {
        Alert.alert(
          "Error",
          "Username already exists. Please choose a different username."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/TwoFace.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
          style={styles.gradient}
        >
          <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Join the Cosmos</Text>
                <Text style={styles.subtitle}>
                  Create your account to begin exploring
                </Text>
              </View>

              {/* Register Form */}
              <View style={styles.formContainer}>
                <LinearGradient
                  colors={[
                    "rgba(255, 255, 255, 0.1)",
                    "rgba(255, 255, 255, 0.05)",
                  ]}
                  style={styles.formCard}
                >
                  {/* Username Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Username</Text>
                    <TextInput
                      style={styles.textInput}
                      value={username}
                      onChangeText={setUsername}
                      placeholder="Choose a unique username"
                      placeholderTextColor="#888"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <Text style={styles.inputHint}>At least 3 characters</Text>
                  </View>

                  {/* Password Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput
                      style={styles.textInput}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Create a strong password"
                      placeholderTextColor="#888"
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <Text style={styles.inputHint}>At least 6 characters</Text>
                  </View>

                  {/* Confirm Password Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Confirm Password</Text>
                    <TextInput
                      style={styles.textInput}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Re-enter your password"
                      placeholderTextColor="#888"
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>

                  {/* Register Button */}
                  <TouchableOpacity
                    style={styles.registerButton}
                    onPress={handleRegister}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#4A90E2", "#357ABD"]}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.buttonText}>
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Divider */}
                  <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.divider} />
                  </View>

                  {/* Back to Login Button */}
                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleBackToLogin}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[
                        "rgba(255, 255, 255, 0.1)",
                        "rgba(255, 255, 255, 0.05)",
                      ]}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.loginButtonText}>
                        Already have an account? Sign In
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </LinearGradient>
              </View>

              {/* Info Section */}
              <View style={styles.infoSection}>
                <LinearGradient
                  colors={["rgba(76, 175, 80, 0.1)", "rgba(76, 175, 80, 0.05)"]}
                  style={styles.infoCard}
                >
                  <Text style={styles.infoTitle}>🚀 What You'll Get</Text>
                  <Text style={styles.infoText}>
                    • Access to the Asteroid Dodger game
                  </Text>
                  <Text style={styles.infoText}>• Take the Astronomy Quiz</Text>
                  <Text style={styles.infoText}>• Track your high scores</Text>
                  <Text style={styles.infoText}>
                    • Personalized space journey
                  </Text>
                </LinearGradient>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  🌟 Ready to explore the universe? Let's get started! 🌟
                </Text>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
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
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    fontStyle: "italic",
  },
  formContainer: {
    marginBottom: 30,
  },
  formCard: {
    padding: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 8,
    fontWeight: "600",
  },
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: "#FFFFFF",
  },
  inputHint: {
    fontSize: 12,
    color: "#888888",
    marginTop: 4,
    fontStyle: "italic",
  },
  registerButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  buttonGradient: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  dividerText: {
    color: "#CCCCCC",
    paddingHorizontal: 15,
    fontSize: 14,
  },
  loginButton: {
    marginTop: 10,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  infoSection: {
    marginBottom: 30,
  },
  infoCard: {
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.2)",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
    textAlign: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#CCCCCC",
    marginBottom: 5,
    paddingLeft: 10,
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
    fontStyle: "italic",
  },
});
