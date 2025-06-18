import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Alert,
  Animated,
  PanResponder,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../contexts/AuthContext";
import { playSound, SoundType, configureAudio } from "../../utils/soundManager";

const { width, height } = Dimensions.get("window");

interface Asteroid {
  id: string;
  x: number;
  y: number;
  speed: number;
  size: number;
}

interface PowerUp {
  id: string;
  x: number;
  y: number;
  type: "shield" | "speed" | "score";
}

export default function AsteroidDodgerGame() {
  const { user, updateGameScore } = useAuth();
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">(
    "menu"
  );
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [playerPosition, setPlayerPosition] = useState({
    x: width / 2,
    y: height - 100,
  });
  const [isInvulnerable, setIsInvulnerable] = useState(false);
  const [hasShield, setHasShield] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1);

  const gameLoopRef = useRef<NodeJS.Timeout>();
  const asteroidSpawnRef = useRef<NodeJS.Timeout>();
  const powerUpSpawnRef = useRef<NodeJS.Timeout>();
  // Load sound effects
  useEffect(() => {
    configureAudio();
  }, []);
  // Player movement with pan responder
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => gameState === "playing",
    onPanResponderGrant: () => {},
    onPanResponderMove: (evt, gestureState) => {
      if (gameState === "playing") {
        const newX = Math.max(25, Math.min(width - 25, gestureState.moveX));
        const newY = Math.max(50, Math.min(height - 50, gestureState.moveY));
        setPlayerPosition({ x: newX, y: newY });
      }
    },
    onPanResponderRelease: () => {},
  });

  // Generate random asteroid
  const generateAsteroid = useCallback((): Asteroid => {
    return {
      id: Math.random().toString(),
      x: Math.random() * (width - 40),
      y: -50,
      speed: 2 + Math.random() * 3 * gameSpeed,
      size: 20 + Math.random() * 20,
    };
  }, [gameSpeed]);

  // Generate random power-up
  const generatePowerUp = useCallback((): PowerUp => {
    const types: PowerUp["type"][] = ["shield", "speed", "score"];
    return {
      id: Math.random().toString(),
      x: Math.random() * (width - 30),
      y: -30,
      type: types[Math.floor(Math.random() * types.length)],
    };
  }, []);

  // Check collision between two objects
  const checkCollision = (
    obj1: any,
    obj2: any,
    radius1: number,
    radius2: number
  ): boolean => {
    const distance = Math.sqrt(
      Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2)
    );
    return distance < radius1 + radius2;
  };

  // Start game
  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setLives(3);
    setAsteroids([]);
    setPowerUps([]);
    setPlayerPosition({ x: width / 2, y: height - 100 });
    setIsInvulnerable(false);
    setHasShield(false);
    setGameSpeed(1);

    // Start game loops
    gameLoopRef.current = setInterval(updateGame, 50);
    asteroidSpawnRef.current = setInterval(spawnAsteroid, 1500);
    powerUpSpawnRef.current = setInterval(spawnPowerUp, 8000);
  };

  // Update game state
  const updateGame = () => {
    setAsteroids((prev) => {
      const updated = prev
        .map((asteroid) => ({ ...asteroid, y: asteroid.y + asteroid.speed }))
        .filter((asteroid) => asteroid.y < height + 50);

      return updated;
    });

    setPowerUps((prev) => {
      const updated = prev
        .map((powerUp) => ({ ...powerUp, y: powerUp.y + 3 }))
        .filter((powerUp) => powerUp.y < height + 50);

      return updated;
    });

    // Increase score over time
    setScore((prev) => prev + 1);

    // Increase game speed gradually
    setGameSpeed((prev) => Math.min(3, prev + 0.001));
  };

  // Spawn asteroid
  const spawnAsteroid = () => {
    setAsteroids((prev) => [...prev, generateAsteroid()]);
  };

  // Spawn power-up
  const spawnPowerUp = () => {
    if (Math.random() < 0.3) {
      // 30% chance to spawn power-up
      setPowerUps((prev) => [...prev, generatePowerUp()]);
    }
  };

  // Handle collisions
  useEffect(() => {
    if (gameState !== "playing" || isInvulnerable) return;

    // Check asteroid collisions
    asteroids.forEach((asteroid) => {
      if (checkCollision(playerPosition, asteroid, 25, asteroid.size / 2)) {
        if (hasShield) {
          setHasShield(false);
          playSound(SoundType.POWER_UP, 0.5);
        } else {
          handleCollision();
        }
      }
    });

    // Check power-up collisions
    powerUps.forEach((powerUp) => {
      if (checkCollision(playerPosition, powerUp, 25, 15)) {
        collectPowerUp(powerUp);
      }
    });
  }, [
    asteroids,
    powerUps,
    playerPosition,
    gameState,
    isInvulnerable,
    hasShield,
  ]);
  // Handle collision with asteroid
  const handleCollision = () => {
    playSound(SoundType.COLLISION, 0.5);
    setLives((prev) => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        endGame();
      } else {
        // Brief invulnerability period
        setIsInvulnerable(true);
        setTimeout(() => setIsInvulnerable(false), 2000);
      }
      return newLives;
    });
  };

  // Collect power-up
  const collectPowerUp = (powerUp: PowerUp) => {
    playSound(SoundType.POWER_UP, 0.5);
    setPowerUps((prev) => prev.filter((p) => p.id !== powerUp.id));

    switch (powerUp.type) {
      case "shield":
        setHasShield(true);
        setTimeout(() => setHasShield(false), 5000);
        break;
      case "speed":
        setGameSpeed((prev) => Math.max(0.5, prev - 0.5));
        setTimeout(() => setGameSpeed((prev) => prev + 0.5), 3000);
        break;
      case "score":
        setScore((prev) => prev + 100);
        playSound(SoundType.SCORE_UP, 0.5);
        break;
    }
  };

  // End game
  const endGame = () => {
    setGameState("gameOver");

    // Clear intervals
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (asteroidSpawnRef.current) clearInterval(asteroidSpawnRef.current);
    if (powerUpSpawnRef.current) clearInterval(powerUpSpawnRef.current);

    // Update high score if logged in
    if (user && score > user.gameHighScore) {
      updateGameScore(score);
      Alert.alert(
        "🎉 New High Score!",
        `Congratulations! You scored ${score} points!`,
        [{ text: "Awesome!", style: "default" }]
      );
    }
  };

  // Restart game
  const restartGame = () => {
    startGame();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (asteroidSpawnRef.current) clearInterval(asteroidSpawnRef.current);
      if (powerUpSpawnRef.current) clearInterval(powerUpSpawnRef.current);
    };
  }, []);

  const renderGameMenu = () => (
    <View style={styles.menuContainer}>
      <LinearGradient
        colors={["rgba(74, 144, 226, 0.9)", "rgba(53, 122, 189, 0.9)"]}
        style={styles.menuCard}
      >
        <Text style={styles.gameTitle}>🚀 ASTEROID DODGER</Text>
        <Text style={styles.gameSubtitle}>
          Navigate through the asteroid field!
        </Text>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>How to Play:</Text>
          <Text style={styles.instructionText}>
            • Drag your spaceship to move
          </Text>
          <Text style={styles.instructionText}>
            • Avoid the falling asteroids
          </Text>
          <Text style={styles.instructionText}>
            • Collect power-ups for bonuses
          </Text>
          <Text style={styles.instructionText}>
            • Survive as long as possible!
          </Text>
        </View>

        {user && (
          <View style={styles.highScoreContainer}>
            <Text style={styles.highScoreText}>
              Your High Score: {user.gameHighScore}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.startButton}
          onPress={startGame}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#A8E6CF", "#7FCDCD"]}
            style={styles.startButtonGradient}
          >
            <Text style={styles.startButtonText}>START GAME</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const renderGameOver = () => (
    <View style={styles.gameOverContainer}>
      <LinearGradient
        colors={["rgba(255, 107, 107, 0.9)", "rgba(255, 142, 83, 0.9)"]}
        style={styles.gameOverCard}
      >
        <Text style={styles.gameOverTitle}>💥 GAME OVER</Text>
        <Text style={styles.finalScore}>Final Score: {score}</Text>

        {user && score > user.gameHighScore && (
          <Text style={styles.newHighScore}>🎉 NEW HIGH SCORE!</Text>
        )}

        <TouchableOpacity
          style={styles.restartButton}
          onPress={restartGame}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#4A90E2", "#357ABD"]}
            style={styles.restartButtonGradient}
          >
            <Text style={styles.restartButtonText}>PLAY AGAIN</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/TwoFace.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
          style={styles.gradient}
        >
          {gameState === "menu" && renderGameMenu()}
          {gameState === "gameOver" && renderGameOver()}

          {gameState === "playing" && (
            <View style={styles.gameArea} {...panResponder.panHandlers}>
              {/* Game UI */}
              <View style={styles.gameUI}>
                <Text style={styles.scoreText}>Score: {score}</Text>
                <Text style={styles.livesText}>
                  Lives: {"❤️".repeat(lives)}
                </Text>
                {hasShield && (
                  <Text style={styles.shieldText}>🛡️ SHIELD ACTIVE</Text>
                )}
              </View>

              {/* Player spaceship */}
              <View
                style={[
                  styles.player,
                  {
                    left: playerPosition.x - 25,
                    top: playerPosition.y - 25,
                    opacity: isInvulnerable ? 0.5 : 1,
                  },
                ]}
              >
                <Text style={styles.playerIcon}>🚀</Text>
                {hasShield && (
                  <View style={styles.shieldEffect}>
                    <Text style={styles.shieldIcon}>🛡️</Text>
                  </View>
                )}
              </View>

              {/* Asteroids */}
              {asteroids.map((asteroid) => (
                <View
                  key={asteroid.id}
                  style={[
                    styles.asteroid,
                    {
                      left: asteroid.x,
                      top: asteroid.y,
                      width: asteroid.size,
                      height: asteroid.size,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.asteroidIcon,
                      { fontSize: asteroid.size / 2 },
                    ]}
                  >
                    ☄️
                  </Text>
                </View>
              ))}

              {/* Power-ups */}
              {powerUps.map((powerUp) => (
                <View
                  key={powerUp.id}
                  style={[
                    styles.powerUp,
                    {
                      left: powerUp.x,
                      top: powerUp.y,
                    },
                  ]}
                >
                  <Text style={styles.powerUpIcon}>
                    {powerUp.type === "shield"
                      ? "🛡️"
                      : powerUp.type === "speed"
                      ? "⚡"
                      : "⭐"}
                  </Text>
                </View>
              ))}
            </View>
          )}
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
  menuContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  menuCard: {
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    elevation: 10,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gameTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  gameSubtitle: {
    fontSize: 16,
    color: "#E8F4FD",
    marginBottom: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
  instructionsContainer: {
    marginBottom: 20,
    alignSelf: "stretch",
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    color: "#E8F4FD",
    marginBottom: 5,
  },
  highScoreContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
  },
  highScoreText: {
    fontSize: 16,
    color: "#FFD700",
    fontWeight: "bold",
    textAlign: "center",
  },
  startButton: {
    width: "80%",
  },
  startButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  gameOverCard: {
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    elevation: 10,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gameOverTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  finalScore: {
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 10,
    fontWeight: "bold",
  },
  newHighScore: {
    fontSize: 16,
    color: "#FFD700",
    marginBottom: 20,
    fontWeight: "bold",
  },
  restartButton: {
    width: "80%",
  },
  restartButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
  },
  restartButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  gameArea: {
    flex: 1,
    position: "relative",
  },
  gameUI: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 100,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  livesText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shieldText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4ECDC4",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    position: "absolute",
    top: 100,
    left: 20,
  },
  player: {
    position: "absolute",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
  },
  playerIcon: {
    fontSize: 30,
    textAlign: "center",
  },
  shieldEffect: {
    position: "absolute",
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    justifyContent: "center",
    alignItems: "center",
  },
  shieldIcon: {
    fontSize: 40,
    opacity: 0.7,
  },
  asteroid: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  asteroidIcon: {
    textAlign: "center",
  },
  powerUp: {
    position: "absolute",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  powerUpIcon: {
    fontSize: 20,
    textAlign: "center",
  },
});
