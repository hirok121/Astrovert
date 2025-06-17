import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("./home");
        },
      },
    ]);
  };

  const navigateToGame = () => {
    router.push("./game");
  };

  const navigateToQuiz = () => {
    router.push("./quiz");
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please login to view your profile</Text>
      </View>
    );
  }

  // Calculate achievement level based on scores
  const totalScore = user.gameHighScore + user.quizHighScore;
  let achievementLevel = "Space Cadet";
  let achievementIcon = "🚀";

  if (totalScore >= 100) {
    achievementLevel = "Cosmic Explorer";
    achievementIcon = "🌌";
  }
  if (totalScore >= 200) {
    achievementLevel = "Galaxy Master";
    achievementIcon = "⭐";
  }
  if (totalScore >= 300) {
    achievementLevel = "Universe Commander";
    achievementIcon = "👨‍🚀";
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/TwoFace.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.8)"]}
          style={styles.gradient}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Profile Header */}
            <View style={styles.header}>
              <LinearGradient
                colors={["rgba(74, 144, 226, 0.9)", "rgba(53, 122, 189, 0.9)"]}
                style={styles.profileCard}
              >
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatar}>👨‍🚀</Text>
                </View>
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.achievementLevel}>
                  {achievementIcon} {achievementLevel}
                </Text>
              </LinearGradient>
            </View>

            {/* Stats Section */}
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>🏆 Your Achievements</Text>

              <View style={styles.statsGrid}>
                {/* Game Score Card */}
                <LinearGradient
                  colors={[
                    "rgba(168, 230, 207, 0.9)",
                    "rgba(127, 205, 205, 0.9)",
                  ]}
                  style={styles.statCard}
                >
                  <Text style={styles.statIcon}>🎮</Text>
                  <Text style={styles.statValue}>{user.gameHighScore}</Text>
                  <Text style={styles.statLabel}>Asteroid Dodger</Text>
                  <Text style={styles.statSubLabel}>High Score</Text>
                </LinearGradient>

                {/* Quiz Score Card */}
                <LinearGradient
                  colors={[
                    "rgba(255, 217, 61, 0.9)",
                    "rgba(107, 207, 127, 0.9)",
                  ]}
                  style={styles.statCard}
                >
                  <Text style={styles.statIcon}>🧠</Text>
                  <Text style={styles.statValue}>{user.quizHighScore}</Text>
                  <Text style={styles.statLabel}>Astronomy Quiz</Text>
                  <Text style={styles.statSubLabel}>Best Score</Text>
                </LinearGradient>
              </View>

              {/* Total Score */}
              <LinearGradient
                colors={[
                  "rgba(255, 255, 255, 0.1)",
                  "rgba(255, 255, 255, 0.05)",
                ]}
                style={styles.totalScoreCard}
              >
                <Text style={styles.totalScoreTitle}>Total Space Points</Text>
                <Text style={styles.totalScoreValue}>{totalScore}</Text>
                <Text style={styles.totalScoreSubtext}>
                  Combine your game and quiz scores to unlock achievements!
                </Text>
              </LinearGradient>
            </View>

            {/* Achievement Badges */}
            <View style={styles.badgesSection}>
              <Text style={styles.sectionTitle}>🏅 Achievement Badges</Text>

              <View style={styles.badgesGrid}>
                <View
                  style={[
                    styles.badge,
                    user.gameHighScore > 0 && styles.badgeEarned,
                  ]}
                >
                  <Text style={styles.badgeIcon}>🎯</Text>
                  <Text style={styles.badgeText}>First Flight</Text>
                  <Text style={styles.badgeDesc}>Play Asteroid Dodger</Text>
                </View>

                <View
                  style={[
                    styles.badge,
                    user.gameHighScore >= 50 && styles.badgeEarned,
                  ]}
                >
                  <Text style={styles.badgeIcon}>⚡</Text>
                  <Text style={styles.badgeText}>Speed Demon</Text>
                  <Text style={styles.badgeDesc}>Score 50+ in game</Text>
                </View>

                <View
                  style={[
                    styles.badge,
                    user.quizHighScore > 0 && styles.badgeEarned,
                  ]}
                >
                  <Text style={styles.badgeIcon}>📚</Text>
                  <Text style={styles.badgeText}>Scholar</Text>
                  <Text style={styles.badgeDesc}>Take the quiz</Text>
                </View>

                <View
                  style={[
                    styles.badge,
                    user.quizHighScore >= 8 && styles.badgeEarned,
                  ]}
                >
                  <Text style={styles.badgeIcon}>🌟</Text>
                  <Text style={styles.badgeText}>Star Student</Text>
                  <Text style={styles.badgeDesc}>Score 8+ in quiz</Text>
                </View>

                <View
                  style={[
                    styles.badge,
                    totalScore >= 100 && styles.badgeEarned,
                  ]}
                >
                  <Text style={styles.badgeIcon}>🌌</Text>
                  <Text style={styles.badgeText}>Cosmic Explorer</Text>
                  <Text style={styles.badgeDesc}>100+ total points</Text>
                </View>

                <View
                  style={[
                    styles.badge,
                    totalScore >= 300 && styles.badgeEarned,
                  ]}
                >
                  <Text style={styles.badgeIcon}>👨‍🚀</Text>
                  <Text style={styles.badgeText}>Universe Commander</Text>
                  <Text style={styles.badgeDesc}>300+ total points</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsSection}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={navigateToGame}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#A8E6CF", "#7FCDCD"]}
                  style={styles.actionButtonGradient}
                >
                  <Text style={styles.actionButtonIcon}>🎮</Text>
                  <Text style={styles.actionButtonText}>
                    Play Asteroid Dodger
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={navigateToQuiz}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#FFD93D", "#6BCF7F"]}
                  style={styles.actionButtonGradient}
                >
                  <Text style={styles.actionButtonIcon}>🧠</Text>
                  <Text style={styles.actionButtonText}>
                    Take Astronomy Quiz
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[
                    "rgba(255, 107, 107, 0.9)",
                    "rgba(255, 142, 83, 0.9)",
                  ]}
                  style={styles.actionButtonGradient}
                >
                  <Text style={styles.actionButtonIcon}>🚪</Text>
                  <Text style={styles.actionButtonText}>Logout</Text>
                </LinearGradient>
              </TouchableOpacity>
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
    paddingBottom: 30,
  },
  errorText: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
    marginTop: 100,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  profileCard: {
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    fontSize: 40,
  },
  username: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  achievementLevel: {
    fontSize: 16,
    color: "#E8F4FD",
    fontStyle: "italic",
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 20,
    marginHorizontal: 5,
    borderRadius: 15,
    alignItems: "center",
    minHeight: 120,
  },
  statIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
  },
  statSubLabel: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.8,
    textAlign: "center",
  },
  totalScoreCard: {
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  totalScoreTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  totalScoreValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 10,
  },
  totalScoreSubtext: {
    fontSize: 14,
    color: "#CCCCCC",
    textAlign: "center",
    fontStyle: "italic",
  },
  badgesSection: {
    padding: 20,
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  badge: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
    opacity: 0.5,
  },
  badgeEarned: {
    opacity: 1,
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    borderColor: "rgba(76, 175, 80, 0.5)",
  },
  badgeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 4,
  },
  badgeDesc: {
    fontSize: 12,
    color: "#CCCCCC",
    textAlign: "center",
  },
  actionsSection: {
    padding: 20,
  },
  actionButton: {
    marginBottom: 15,
  },
  logoutButton: {
    marginTop: 20,
  },
  actionButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
