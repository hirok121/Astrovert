import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { router } from "expo-router";

// Get the status bar height for Android
const getStatusBarHeight = () => {
  return Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;
};

interface CustomHeaderProps {
  title?: string;
  onMenuPress?: () => void;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export default function CustomHeader({
  title = "ASTROVERT",
  onMenuPress,
  showBackButton = false,
  onBackPress,
}: CustomHeaderProps) {
  const { user } = useAuth();
  const handleProfilePress = () => {
    if (user) {
      router.push("/(drawer)/profile");
    } else {
      router.push("/login");
    }
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={["#1a1a2e", "#16213e"]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.header}>
            {/* Left Side - Menu or Back Button */}
            <View style={styles.leftContainer}>
              {showBackButton ? (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={onBackPress}
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={onMenuPress}
                  activeOpacity={0.7}
                >
                  <Ionicons name="menu" size={24} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
            {/* Center - Title */}
            <View style={styles.centerContainer}>
              <Text style={styles.title}>{title}</Text>
            </View>{" "}
            {/* Right Side - Profile Icon */}
            <View style={styles.rightContainer}>
              {user ? (
                <TouchableOpacity
                  style={styles.profileButton}
                  onPress={handleProfilePress}
                  activeOpacity={0.7}
                >
                  <View style={styles.profileIconContainer}>
                    <Text style={styles.astronautIcon}>👨‍🚀</Text>
                  </View>
                  <View style={styles.onlineIndicator} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.loginPromptButton}
                  onPress={handleProfilePress}
                  activeOpacity={0.7}
                >
                  <Ionicons name="person-outline" size={24} color="#666" />
                </TouchableOpacity>
              )}
            </View>{" "}
          </View>
        </LinearGradient>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a2e",
    paddingTop: 0, //getStatusBarHeight(),
  },
  safeArea: {
    backgroundColor: "#1a1a2e",
  },
  gradient: {
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    height: 60,
  },
  leftContainer: {
    width: 50,
    alignItems: "flex-start",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
  },
  rightContainer: {
    width: 50,
    alignItems: "flex-end",
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  profileButton: {
    position: "relative",
  },
  profileIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(74, 144, 226, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4A90E2",
  },
  onlineIndicator: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2ecc71",
    borderWidth: 2,
    borderColor: "#1a1a2e",
  },
  astronautIcon: {
    fontSize: 18,
  },
  loginPromptButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
});
