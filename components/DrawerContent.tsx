import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function DrawerContent(props: any) {
  const { user, logout } = useAuth();
  const menuItems = [
    { title: "Home", icon: "home-outline", route: "/(drawer)/home" },
    { title: "Blog", icon: "book-outline", route: "/(drawer)/blog" },
    {
      title: "3D Galaxies",
      icon: "planet-outline",
      route: "/(drawer)/galaxies",
    },
    {
      title: "Asteroid Game",
      icon: "game-controller-outline",
      route: "/(drawer)/game",
      requiresAuth: true,
    },
    {
      title: "Quiz",
      icon: "help-circle-outline",
      route: "/(drawer)/quiz",
      requiresAuth: true,
    },
    {
      title: "Profile",
      icon: "person-outline",
      route: "/(drawer)/profile",
      requiresAuth: true,
    },
  ];

  const handleMenuPress = (item: any) => {
    if (item.requiresAuth && !user) {
      Alert.alert("Login Required", "Please log in to access this feature.", [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => router.push("/login") },
      ]);
      return;
    }
    router.push(item.route);
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.push("/");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f1027"]}
        style={styles.gradient}
      >
        <DrawerContentScrollView {...props} style={styles.scrollView}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>ASTROVERT</Text>
              <Text style={styles.logoSubtext}>Explore the Cosmos</Text>
            </View>

            {user && (
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <Ionicons name="person" size={30} color="#4A90E2" />
                </View>
                <Text style={styles.userName}>{user.username}</Text>
                <Text style={styles.userLevel}>Space Explorer</Text>
              </View>
            )}
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => handleMenuPress(item)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemContent}>
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color="#4A90E2"
                    style={styles.menuIcon}
                  />
                  <Text style={styles.menuText}>{item.title}</Text>
                  {item.requiresAuth && !user && (
                    <Ionicons
                      name="lock-closed"
                      size={16}
                      color="#666"
                      style={styles.lockIcon}
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            {user ? (
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Ionicons name="log-out-outline" size={20} color="#ff4757" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push("/login")}
                activeOpacity={0.7}
              >
                <Ionicons name="log-in-outline" size={20} color="#4A90E2" />
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            )}
          </View>
        </DrawerContentScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 10,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
  },
  logoSubtext: {
    fontSize: 12,
    color: "#4A90E2",
    marginTop: 5,
    fontStyle: "italic",
  },
  userInfo: {
    alignItems: "center",
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(74, 144, 226, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#4A90E2",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  userLevel: {
    fontSize: 14,
    color: "#4A90E2",
    fontStyle: "italic",
  },
  menuContainer: {
    paddingHorizontal: 10,
    flex: 1,
  },
  menuItem: {
    marginVertical: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: "#fff",
    flex: 1,
    fontWeight: "500",
  },
  lockIcon: {
    marginLeft: "auto",
  },
  bottomSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "rgba(255, 71, 87, 0.2)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ff4757",
  },
  logoutText: {
    color: "#ff4757",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "rgba(74, 144, 226, 0.2)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4A90E2",
  },
  loginText: {
    color: "#4A90E2",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});
