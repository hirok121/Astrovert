import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Alert,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../contexts/AuthContext";
import { playSound, SoundType, configureAudio } from "../../utils/soundManager";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the closest star to Earth besides the Sun?",
    options: ["Alpha Centauri", "Proxima Centauri", "Sirius", "Vega"],
    correctAnswer: 1,
    explanation:
      "Proxima Centauri is the closest known star to the Sun, located approximately 4.24 light-years away in the Alpha Centauri star system.",
    category: "Stars & Galaxies",
  },
  {
    id: 2,
    question: "How long does it take light from the Sun to reach Earth?",
    options: ["8 minutes", "1 minute", "1 hour", "1 day"],
    correctAnswer: 0,
    explanation:
      "Light from the Sun takes approximately 8 minutes and 20 seconds to travel the 93 million miles (150 million kilometers) to Earth.",
    category: "Solar System",
  },
  {
    id: 3,
    question: "Which planet has the most moons in our solar system?",
    options: ["Jupiter", "Saturn", "Neptune", "Uranus"],
    correctAnswer: 1,
    explanation:
      "Saturn has the most confirmed moons with 146 known natural satellites, surpassing Jupiter's 95 confirmed moons.",
    category: "Solar System",
  },
  {
    id: 4,
    question: "What is a supernova?",
    options: [
      "A newly formed star",
      "The explosive death of a massive star",
      "A type of galaxy",
      "A comet impact",
    ],
    correctAnswer: 1,
    explanation:
      "A supernova is the explosive death of a massive star that has exhausted its nuclear fuel, creating one of the most energetic events in the universe.",
    category: "Cosmic Phenomena",
  },
  {
    id: 5,
    question:
      "What is the Andromeda Galaxy's fate with respect to the Milky Way?",
    options: [
      "It will move away from us",
      "It will collide and merge with the Milky Way",
      "It will remain at the same distance",
      "It will break apart",
    ],
    correctAnswer: 1,
    explanation:
      "The Andromeda Galaxy is moving toward the Milky Way and is expected to collide and merge with it in approximately 4.5 billion years.",
    category: "Galaxies",
  },
  {
    id: 6,
    question: "What makes up approximately 68% of the universe?",
    options: ["Dark matter", "Dark energy", "Normal matter", "Black holes"],
    correctAnswer: 1,
    explanation:
      "Dark energy makes up about 68% of the universe and is responsible for the accelerating expansion of the universe.",
    category: "Cosmology",
  },
  {
    id: 7,
    question:
      "Which telescope discovered the most distant galaxies we know of?",
    options: [
      "Hubble Space Telescope",
      "James Webb Space Telescope",
      "Spitzer Space Telescope",
      "Kepler Space Telescope",
    ],
    correctAnswer: 1,
    explanation:
      "The James Webb Space Telescope has detected the most distant and oldest galaxies, seeing them as they were over 13 billion years ago.",
    category: "Space Technology",
  },
  {
    id: 8,
    question: "What is the Great Red Spot on Jupiter?",
    options: [
      "A mountain",
      "A giant storm",
      "An impact crater",
      "A moon shadow",
    ],
    correctAnswer: 1,
    explanation:
      "The Great Red Spot is a giant anticyclonic storm on Jupiter that has been raging for at least 400 years and is larger than Earth.",
    category: "Solar System",
  },
  {
    id: 9,
    question: "What type of galaxy is the Milky Way?",
    options: ["Elliptical", "Spiral", "Irregular", "Lenticular"],
    correctAnswer: 1,
    explanation:
      "The Milky Way is a barred spiral galaxy with distinctive spiral arms extending from a central bar-shaped structure.",
    category: "Galaxies",
  },
  {
    id: 10,
    question: "What is the speed of light in a vacuum?",
    options: [
      "299,792,458 meters per second",
      "300,000,000 meters per second",
      "186,000 miles per second",
      "Both A and C are correct",
    ],
    correctAnswer: 3,
    explanation:
      "The speed of light in a vacuum is exactly 299,792,458 meters per second, which is approximately 186,000 miles per second.",
    category: "Physics",
  },
];

export default function AstronomyQuiz() {
  const { user, updateQuizScore } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const [timerActive, setTimerActive] = useState(false);
  // Animation for correct/incorrect feedback
  const feedbackAnimation = new Animated.Value(0);
  // Load sound effects
  useEffect(() => {
    configureAudio();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      // Time's up, auto-submit answer
      handleAnswerSubmit();
    }

    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // Play sound effect with error handling
  const playSoundEffect = async (soundType: SoundType) => {
    try {
      await playSound(soundType, 0.5);
    } catch (error) {
      console.log("Sound play failed:", error);
    }
  };

  // Start quiz
  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setShowExplanation(false);
    setQuizCompleted(false);
    setScore(0);
    setTimeLeft(30);
    setTimerActive(true);
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation || selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);
  };

  // Submit answer and show explanation
  const handleAnswerSubmit = () => {
    if (selectedAnswer === null && timeLeft > 0) return;

    setTimerActive(false);

    const finalAnswer = selectedAnswer !== null ? selectedAnswer : -1; // -1 for timeout
    const newAnswers = [...userAnswers, finalAnswer];
    setUserAnswers(newAnswers);

    const isCorrect =
      finalAnswer === quizQuestions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      playSoundEffect(SoundType.CORRECT);
    } else {
      playSoundEffect(SoundType.INCORRECT);
    }

    // Animate feedback
    Animated.sequence([
      Animated.timing(feedbackAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(feedbackAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setShowExplanation(true);
  };

  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(30);
      setTimerActive(true);
    } else {
      completeQuiz();
    }
  };
  // Complete quiz
  const completeQuiz = () => {
    setQuizCompleted(true);
    setTimerActive(false);
    playSoundEffect(SoundType.COMPLETE);

    // Update high score if logged in
    if (user && score > user.quizHighScore) {
      updateQuizScore(score);
      Alert.alert(
        "🎉 New High Score!",
        `Congratulations! You scored ${score}/${quizQuestions.length}!`,
        [{ text: "Awesome!", style: "default" }]
      );
    }
  };

  // Restart quiz
  const restartQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setShowExplanation(false);
    setQuizCompleted(false);
    setScore(0);
    setTimeLeft(30);
    setTimerActive(false);
  };
  // Get color for answer option
  const getOptionColor = (optionIndex: number): [string, string] => {
    if (!showExplanation) {
      if (selectedAnswer === optionIndex) {
        return ["rgba(74, 144, 226, 0.8)", "rgba(53, 122, 189, 0.8)"];
      }
      return ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"];
    }

    // Show correct/incorrect after submission
    if (optionIndex === quizQuestions[currentQuestion].correctAnswer) {
      return ["rgba(76, 175, 80, 0.8)", "rgba(139, 195, 74, 0.8)"]; // Green for correct
    } else if (selectedAnswer === optionIndex) {
      return ["rgba(244, 67, 54, 0.8)", "rgba(229, 115, 115, 0.8)"]; // Red for incorrect selection
    }

    return ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"];
  };

  const renderQuizStart = () => (
    <ScrollView contentContainerStyle={styles.startContainer}>
      <LinearGradient
        colors={["rgba(74, 144, 226, 0.9)", "rgba(53, 122, 189, 0.9)"]}
        style={styles.startCard}
      >
        <Text style={styles.quizTitle}>🌟 ASTRONOMY QUIZ</Text>
        <Text style={styles.quizSubtitle}>Test your cosmic knowledge!</Text>

        <View style={styles.quizInfo}>
          <Text style={styles.infoTitle}>Quiz Information:</Text>
          <Text style={styles.infoText}>
            • {quizQuestions.length} multiple choice questions
          </Text>
          <Text style={styles.infoText}>• 30 seconds per question</Text>
          <Text style={styles.infoText}>
            • Immediate feedback with explanations
          </Text>
          <Text style={styles.infoText}>
            • Categories: Solar System, Stars, Galaxies, Physics
          </Text>
        </View>

        {user && (
          <View style={styles.highScoreContainer}>
            <Text style={styles.highScoreText}>
              Your Best Score: {user.quizHighScore}/{quizQuestions.length}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.startButton}
          onPress={startQuiz}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#A8E6CF", "#7FCDCD"]}
            style={styles.startButtonGradient}
          >
            <Text style={styles.startButtonText}>START QUIZ</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );

  const renderQuizComplete = () => {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    let performanceMessage = "";
    let performanceColor = "#FF6B6B";

    if (percentage >= 90) {
      performanceMessage = "Outstanding! You're a true space expert! 🌟";
      performanceColor = "#4ECDC4";
    } else if (percentage >= 70) {
      performanceMessage = "Great job! You have solid astronomy knowledge! 🚀";
      performanceColor = "#A8E6CF";
    } else if (percentage >= 50) {
      performanceMessage = "Good effort! Keep exploring the cosmos! 🌙";
      performanceColor = "#FFD93D";
    } else {
      performanceMessage = "Keep learning! The universe has much to teach! 🌌";
      performanceColor = "#FF6B6B";
    }

    return (
      <ScrollView contentContainerStyle={styles.completeContainer}>
        <LinearGradient
          colors={["rgba(74, 144, 226, 0.9)", "rgba(53, 122, 189, 0.9)"]}
          style={styles.completeCard}
        >
          <Text style={styles.completeTitle}>🎯 QUIZ COMPLETE!</Text>

          <View style={styles.scoreContainer}>
            <Text style={styles.finalScore}>
              {score}/{quizQuestions.length}
            </Text>
            <Text style={styles.percentage}>{percentage}%</Text>
          </View>

          <Text
            style={[styles.performanceMessage, { color: performanceColor }]}
          >
            {performanceMessage}
          </Text>

          {user && score > user.quizHighScore && (
            <View style={styles.newRecordContainer}>
              <Text style={styles.newRecordText}>🏆 NEW PERSONAL BEST! 🏆</Text>
            </View>
          )}

          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Question Summary:</Text>
            {quizQuestions.map((question, index) => (
              <View key={index} style={styles.summaryItem}>
                <Text style={styles.summaryQuestion}>
                  {index + 1}. {question.question}
                </Text>
                <Text
                  style={[
                    styles.summaryResult,
                    {
                      color:
                        userAnswers[index] === question.correctAnswer
                          ? "#4ECDC4"
                          : "#FF6B6B",
                    },
                  ]}
                >
                  {userAnswers[index] === question.correctAnswer
                    ? "✓ Correct"
                    : userAnswers[index] === -1
                    ? "⏰ Time Out"
                    : "✗ Incorrect"}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.restartButton}
              onPress={restartQuiz}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#A8E6CF", "#7FCDCD"]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>RETAKE QUIZ</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ScrollView>
    );
  };

  const renderQuestion = () => {
    const question = quizQuestions[currentQuestion];

    return (
      <ScrollView contentContainerStyle={styles.questionContainer}>
        {/* Progress and Timer */}
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              Question {currentQuestion + 1} of {quizQuestions.length}
            </Text>
            <Text style={styles.categoryText}>{question.category}</Text>
          </View>
          <View style={styles.timerContainer}>
            <Text
              style={[
                styles.timerText,
                { color: timeLeft <= 5 ? "#FF6B6B" : "#FFFFFF" },
              ]}
            >
              ⏰ {timeLeft}s
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  ((currentQuestion + 1) / quizQuestions.length) * 100
                }%`,
              },
            ]}
          />
        </View>

        {/* Question Card */}
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]}
          style={styles.questionCard}
        >
          <Text style={styles.questionText}>{question.question}</Text>

          {/* Answer Options */}
          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={getOptionColor(index)}
                  style={styles.optionGradient}
                >
                  <Text style={styles.optionLetter}>
                    {String.fromCharCode(65 + index)}.
                  </Text>
                  <Text style={styles.optionText}>{option}</Text>
                  {showExplanation && index === question.correctAnswer && (
                    <Text style={styles.correctIcon}>✓</Text>
                  )}
                  {showExplanation &&
                    selectedAnswer === index &&
                    index !== question.correctAnswer && (
                      <Text style={styles.incorrectIcon}>✗</Text>
                    )}
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Explanation */}
          {showExplanation && (
            <View style={styles.explanationContainer}>
              <LinearGradient
                colors={["rgba(74, 144, 226, 0.2)", "rgba(53, 122, 189, 0.2)"]}
                style={styles.explanationCard}
              >
                <Text style={styles.explanationTitle}>💡 Explanation</Text>
                <Text style={styles.explanationText}>
                  {question.explanation}
                </Text>
              </LinearGradient>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            {!showExplanation ? (
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { opacity: selectedAnswer !== null ? 1 : 0.5 },
                ]}
                onPress={handleAnswerSubmit}
                disabled={selectedAnswer === null}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#4A90E2", "#357ABD"]}
                  style={styles.actionButtonGradient}
                >
                  <Text style={styles.actionButtonText}>SUBMIT ANSWER</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNextQuestion}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#A8E6CF", "#7FCDCD"]}
                  style={styles.actionButtonGradient}
                >
                  <Text style={styles.actionButtonText}>
                    {currentQuestion < quizQuestions.length - 1
                      ? "NEXT QUESTION"
                      : "FINISH QUIZ"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </ScrollView>
    );
  };

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
          {!quizStarted && renderQuizStart()}
          {quizStarted && !quizCompleted && renderQuestion()}
          {quizCompleted && renderQuizComplete()}
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
  startContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  startCard: {
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  quizTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  quizSubtitle: {
    fontSize: 16,
    color: "#E8F4FD",
    marginBottom: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
  quizInfo: {
    marginBottom: 20,
    alignSelf: "stretch",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#E8F4FD",
    marginBottom: 5,
  },
  highScoreContainer: {
    marginBottom: 20,
    padding: 15,
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
  questionContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressInfo: {
    flex: 1,
  },
  progressText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  categoryText: {
    fontSize: 14,
    color: "#4A90E2",
    fontStyle: "italic",
  },
  timerContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    marginBottom: 20,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4A90E2",
    borderRadius: 2,
  },
  questionCard: {
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  questionText: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 20,
    lineHeight: 28,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    marginBottom: 12,
  },
  optionGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  optionLetter: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginRight: 12,
    width: 25,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    lineHeight: 22,
  },
  correctIcon: {
    fontSize: 18,
    color: "#4ECDC4",
    fontWeight: "bold",
  },
  incorrectIcon: {
    fontSize: 18,
    color: "#FF6B6B",
    fontWeight: "bold",
  },
  explanationContainer: {
    marginBottom: 20,
  },
  explanationCard: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(74, 144, 226, 0.3)",
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
  },
  actionContainer: {
    alignItems: "center",
  },
  submitButton: {
    width: "80%",
  },
  nextButton: {
    width: "80%",
  },
  actionButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  completeContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  completeCard: {
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  finalScore: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  percentage: {
    fontSize: 24,
    color: "#4A90E2",
    fontWeight: "bold",
  },
  performanceMessage: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  newRecordContainer: {
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  newRecordText: {
    fontSize: 16,
    color: "#FFD700",
    fontWeight: "bold",
    textAlign: "center",
  },
  summaryContainer: {
    width: "100%",
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  summaryItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
  },
  summaryQuestion: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  summaryResult: {
    fontSize: 12,
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  restartButton: {
    width: "80%",
  },
  buttonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
