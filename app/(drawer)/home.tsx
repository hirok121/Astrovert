import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

const { width } = Dimensions.get("window");

// Astronomy facts for the "Fact of the Day" feature
const astronomyFacts = [
  "A day on Venus is longer than its year! Venus rotates so slowly that a single day (243 Earth days) lasts longer than its year (225 Earth days).",
  "The Milky Way galaxy is on a collision course with the Andromeda galaxy, but don't worry - they won't collide for another 4.5 billion years.",
  "Neutron stars are so dense that a teaspoon of neutron star material would weigh about 6 billion tons on Earth.",
  "Jupiter's Great Red Spot is a storm that has been raging for over 400 years and is larger than Earth.",
  "Saturn would float in water if there was a bathtub big enough, as it's less dense than water.",
  "The observable universe contains an estimated 2 trillion galaxies, each containing billions of stars.",
  "One year on Neptune equals 165 Earth years, so it has completed only one orbit since its discovery in 1846.",
  "The temperature in space is approximately -270°C (-454°F), just 3 degrees above absolute zero.",
];

export default function HomeScreen() {
  const { user } = useAuth();
  const [dailyFact, setDailyFact] = useState("");

  useEffect(() => {
    // Set a random fact of the day
    const randomFact =
      astronomyFacts[Math.floor(Math.random() * astronomyFacts.length)];
    setDailyFact(randomFact);
  }, []);
  const navigateToScreen = (screen: string) => {
    // No longer blocking access for guest users - they can play games and quizzes
    router.push(`./${screen}`);
  };
  const menuItems = [
    {
      title: "Astronomy Blog",
      subtitle: "Latest discoveries and cosmic insights",
      icon: "📚",
      screen: "blog",
      gradient: ["#FF6B6B", "#FF8E53"] as const,
    },
    {
      title: "3D Galaxy Explorer",
      subtitle: "Interactive galactic exploration",
      icon: "🌌",
      screen: "galaxies",
      gradient: ["#4ECDC4", "#44A08D"] as const,
    },
    {
      title: "Asteroid Dodger",
      subtitle: "Test your piloting skills",
      icon: "🚀",
      screen: "game",
      gradient: ["#A8E6CF", "#7FCDCD"] as const,
    },
    {
      title: "Astronomy Quiz",
      subtitle: "Challenge your cosmic knowledge",
      icon: "🌟",
      screen: "quiz",
      gradient: ["#FFD93D", "#6BCF7F"] as const,
    },
    ...(user
      ? [
          {
            title: user.isGuest ? "Guest Profile" : "Profile",
            subtitle: user.isGuest
              ? "Your guest progress & achievements"
              : `Welcome back, ${user.username}!`,
            icon: "👨‍🚀",
            screen: "profile",
            gradient: ["#A8CABA", "#5D4E75"] as const,
          },
        ]
      : []),
  ];
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/TwoFace.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}
          style={styles.gradient}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <View style={styles.headerContainer}>
              <View style={styles.header}>
                <Text style={styles.appTitle}>ASTROVERT</Text>
                <Text style={styles.welcomeText}>
                  {user
                    ? `Welcome back, ${user.username}!`
                    : "Welcome to the Cosmos!"}
                </Text>
                <Text style={styles.headerSubtitle}>
                  Your gateway to the wonders of the universe
                </Text>
              </View>
            </View>
            {/* Fact of the Day Section */}
            <View style={styles.factSection}>
              <LinearGradient
                colors={["rgba(74, 144, 226, 0.9)", "rgba(53, 122, 189, 0.9)"]}
                style={styles.factCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.factContent}>
                  <Text style={styles.factTitle}>
                    🌠 Astronomy Fact of the Day
                  </Text>
                  <Text style={styles.factText}>{dailyFact}</Text>
                </View>
              </LinearGradient>
            </View>
            {/* Menu Grid */}
            <View style={styles.menuContainer}>
              <Text style={styles.sectionTitle}>Explore the Universe</Text>
              <View style={styles.menuGrid}>
                {menuItems.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.menuItem}
                    onPress={() => navigateToScreen(item.screen)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={item.gradient}
                      style={styles.menuCardGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.menuCard}>
                        <Text style={styles.menuIcon}>{item.icon}</Text>
                        <Text style={styles.menuTitle}>{item.title}</Text>
                        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {/* User Stats (if logged in) */}
            {user && (
              <View style={styles.statsContainer}>
                <Text style={styles.sectionTitle}>Your Journey</Text>
                <LinearGradient
                  colors={[
                    "rgba(255, 255, 255, 0.1)",
                    "rgba(255, 255, 255, 0.05)",
                  ]}
                  style={styles.statsCard}
                >
                  <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                      <View style={styles.statValueContainer}>
                        <Text style={styles.statValue}>
                          {user.gameHighScore}
                        </Text>
                      </View>
                      <Text style={styles.statLabel}>Game High Score</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <View style={styles.statValueContainer}>
                        <Text style={styles.statValue}>
                          {user.quizHighScore}
                        </Text>
                      </View>
                      <Text style={styles.statLabel}>Quiz Best Score</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            )}
            {/* Guest User Notice */}
            {user && user.isGuest && (
              <View style={styles.guestNoticeSection}>
                <LinearGradient
                  colors={["rgba(76, 175, 80, 0.8)", "rgba(67, 160, 71, 0.8)"]}
                  style={styles.guestNoticeCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.guestNoticeContent}>
                    <Text style={styles.guestNoticeTitle}>
                      🚀 Guest Explorer Mode Active
                    </Text>
                    <Text style={styles.guestNoticeText}>
                      You're exploring as a guest! Your progress is being saved
                      locally. Create an account to sync your achievements
                      across devices.
                    </Text>
                    <TouchableOpacity
                      style={styles.guestLoginButton}
                      onPress={() => router.push("../login")}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.guestLoginButtonText}>
                        Create Account
                      </Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            )}
            {!user && (
              <View style={styles.guestNoticeSection}>
                <LinearGradient
                  colors={["rgba(255, 165, 0, 0.8)", "rgba(255, 140, 0, 0.8)"]}
                  style={styles.guestNoticeCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.guestNoticeContent}>
                    <Text style={styles.guestNoticeTitle}>
                      🌟 Start Your Space Journey
                    </Text>
                    <Text style={styles.guestNoticeText}>
                      Ready to begin exploring? Choose to create an account for
                      full features or continue as a guest to start immediately!
                    </Text>
                    <TouchableOpacity
                      style={styles.guestLoginButton}
                      onPress={() => router.push("../../")}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.guestLoginButtonText}>
                        Get Started
                      </Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            )}
            {/* Footer */}
            <View style={styles.footerContainer}>
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Explore • Learn • Discover • Play
                </Text>
              </View>
            </View>
          </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    paddingBottom: 20,
    minHeight: 120,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 3,
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  welcomeText: {
    fontSize: 20,
    color: "#4A90E2",
    fontWeight: "600",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    fontStyle: "italic",
  },
  factSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  factCard: {
    borderRadius: 15,
    elevation: 5,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    minHeight: 120,
  },
  factContent: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  factTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  factText: {
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
    textAlign: "center",
    flex: 1,
    textAlignVertical: "center",
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "stretch",
    gap: 15,
  },
  menuItem: {
    width: "48%",
    minHeight: 140,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: "45%",
  },
  menuCardGradient: {
    flex: 1,
    borderRadius: 15,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  menuCard: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
    textAlign: "center",
  },
  menuSubtitle: {
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 16,
  },
  loginRequired: {
    fontSize: 12,
    color: "#FFD700",
    marginTop: 5,
    fontWeight: "600",
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statsCard: {
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValueContainer: {
    backgroundColor: "rgba(74, 144, 226, 0.3)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 20,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 14,
    color: "#CCCCCC",
    textAlign: "center",
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: "auto",
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  footerText: {
    fontSize: 16,
    color: "#888888",
    fontStyle: "italic",
    textAlign: "center",
  },
  guestNoticeSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  guestNoticeCard: {
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    minHeight: 150,
  },
  guestNoticeContent: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  guestNoticeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
  },
  guestNoticeText: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 18,
    opacity: 0.95,
    flex: 1,
  },
  guestLoginButton: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    elevation: 2,
    alignSelf: "center",
  },
  guestLoginButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
