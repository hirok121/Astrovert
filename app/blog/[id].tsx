import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, router } from "expo-router";

// Same blog data as in the main blog screen
const blogPosts = [
  {
    id: "1",
    title: "James Webb Telescope Discovers Ancient Galaxies",
    snippet:
      "The James Webb Space Telescope has captured images of galaxies that formed when the universe was just 400 million years old, providing unprecedented insights into cosmic evolution...",
    image: require("../../assets/images/react-logo.png"),
    author: "Dr. Sarah Chen",
    date: "2024-01-15",
    category: "Discoveries",
    readTime: "5 min read",
    content: `The James Webb Space Telescope has made groundbreaking discoveries that are reshaping our understanding of the early universe. These ancient galaxies, observed as they were over 13 billion years ago, reveal that massive galaxy formation occurred much earlier than previously thought.

The telescope's infrared capabilities allow it to peer through cosmic dust and see the first light from these primordial galaxies. What's particularly fascinating is that these galaxies appear to be surprisingly massive and well-formed for their age.

Key Discoveries:
• Galaxies formed just 400 million years after the Big Bang
• Some early galaxies are 10 times more massive than expected
• Star formation rates were incredibly high in the early universe
• The cosmic web structure was already taking shape

These findings challenge existing models of galaxy formation and suggest that the universe evolved more rapidly in its early stages than cosmologists had predicted. The implications for our understanding of dark matter, star formation, and cosmic evolution are profound.

The James Webb telescope continues to revolutionize astronomy, and these discoveries are just the beginning of what promises to be a golden age of cosmic exploration.`,
  },
  {
    id: "2",
    title: "The Mystery of Fast Radio Bursts Solved",
    snippet:
      "Scientists have finally identified the source of mysterious fast radio bursts that have puzzled astronomers for years. These powerful cosmic signals originate from magnetars...",
    image: require("../../assets/images/react-logo.png"),
    author: "Prof. Michael Torres",
    date: "2024-01-10",
    category: "Research",
    readTime: "4 min read",
    content: `Fast Radio Bursts (FRBs) have been one of astronomy's greatest mysteries since their discovery in 2007. These incredibly powerful bursts of radio waves last only milliseconds but release more energy than the Sun produces in three days.

Recent breakthroughs have finally solved this cosmic puzzle. The culprits are magnetars - highly magnetized neutron stars with magnetic fields trillions of times stronger than Earth's.

What are Magnetars?
• Ultra-dense remnants of massive stars
• Magnetic fields 100 trillion times stronger than Earth's
• Only 30 known magnetars in our galaxy
• Can be 20 kilometers wide but contain more mass than our Sun

The connection between magnetars and FRBs was confirmed when astronomers detected an FRB from a known magnetar in our own galaxy. This observation provided the missing link in understanding these phenomena.

The discovery has opened new avenues for studying extreme physics and could help us understand the conditions in the early universe. FRBs might also serve as cosmic lighthouses, helping us map the distribution of matter in the universe.

Future research will focus on using FRBs as tools to study the cosmos, potentially revealing new insights about dark matter and the evolution of galaxies.`,
  },
  {
    id: "3",
    title: "Mars Perseverance Rover Finds Organic Molecules",
    snippet:
      "NASA's Perseverance rover has discovered complex organic molecules in Martian rocks, bringing us closer to answering the age-old question: Was there ever life on Mars?",
    image: require("../../assets/images/react-logo.png"),
    author: "Dr. Jennifer Walsh",
    date: "2024-01-05",
    category: "Planetary Science",
    readTime: "6 min read",
    content: `NASA's Perseverance rover has made a groundbreaking discovery that could change our understanding of Mars' potential for life. The rover has found organic molecules - the building blocks of life as we know it - preserved in ancient Martian rocks.

This discovery is significant because organic molecules can form through biological processes, though they can also be created by non-biological means. The key is in the diversity and complexity of the molecules found.

Key Findings:
• Multiple types of organic molecules detected
• Molecules preserved in rocks billions of years old
• Evidence of ancient water activity in the same areas
• Complex carbon-based compounds similar to those on Earth

The molecules were found in rocks that formed when Mars had liquid water on its surface, approximately 3.5 billion years ago. This was during a period when Mars had a thicker atmosphere and more Earth-like conditions.

The Perseverance rover used its PIXL (Planetary Instrument for X-ray Lithochemistry) and SHERLOC (Scanning Habitable Environments with Raman & Luminescence for Organics & Chemicals) instruments to make these detections.

While these organic molecules don't definitively prove that life existed on Mars, they show that the Red Planet had the chemical conditions necessary for life to potentially emerge. The next step is bringing these samples back to Earth for more detailed analysis through the Mars Sample Return mission.

This discovery adds to the growing body of evidence that Mars was once a more habitable world and strengthens the case for continued exploration of our planetary neighbor.`,
  },
  {
    id: "4",
    title: "Breakthrough in Exoplanet Atmosphere Analysis",
    snippet:
      "Using advanced spectroscopy techniques, astronomers have detected water vapor, clouds, and even potential biosignatures in the atmospheres of distant exoplanets...",
    image: require("../../assets/images/react-logo.png"),
    author: "Dr. Amanda Rodriguez",
    date: "2024-01-01",
    category: "Exoplanets",
    readTime: "5 min read",
    content: `The field of exoplanet research has taken a giant leap forward with new techniques for analyzing the atmospheres of planets orbiting distant stars. These breakthroughs are bringing us closer to finding potentially habitable worlds and even signs of life beyond our solar system.

Recent observations have successfully detected:
• Water vapor in exoplanet atmospheres
• Cloud formations on distant worlds
• Atmospheric composition including oxygen and methane
• Temperature variations across planetary surfaces

The key to these discoveries is transit spectroscopy, where astronomers analyze the light filtering through an exoplanet's atmosphere as it passes in front of its host star. Different molecules absorb specific wavelengths of light, creating a unique "fingerprint."

Revolutionary Discoveries:
• K2-18b shows signs of water vapor in its atmosphere
• WASP-96b has clear skies with water vapor detected
• Some exoplanets show signs of atmospheric escape
• Evidence of weather patterns on distant worlds

The James Webb Space Telescope has revolutionized this field with its incredible sensitivity to infrared light. It can detect even trace amounts of molecules in exoplanet atmospheres, opening up possibilities for finding biosignatures.

Biosignatures are molecules that could indicate the presence of life, such as oxygen combined with water vapor, or methane in the presence of other reactive gases. While we haven't definitively found life yet, we're developing the tools and techniques that could make this discovery possible in the coming decades.

The next generation of telescopes, including the Extremely Large Telescopes currently under construction, will further enhance our ability to study exoplanet atmospheres and search for signs of life in the cosmos.`,
  },
  {
    id: "5",
    title: "Black Hole Collision Creates Gravitational Waves",
    snippet:
      "The LIGO-Virgo collaboration has detected gravitational waves from the most massive black hole merger ever observed, providing new insights into these cosmic phenomena...",
    image: require("../../assets/images/react-logo.png"),
    author: "Prof. David Kim",
    date: "2023-12-28",
    category: "Gravitational Physics",
    readTime: "4 min read",
    content: `The Laser Interferometer Gravitational-Wave Observatory (LIGO) and its European counterpart Virgo have detected gravitational waves from the most massive black hole merger ever observed. This discovery provides unprecedented insights into the nature of black holes and the fabric of spacetime itself.

The collision involved two black holes with masses 85 and 66 times that of our Sun, creating a final black hole of approximately 142 solar masses. The "missing" 9 solar masses were converted into gravitational wave energy according to Einstein's famous equation E=mc².

Significance of the Discovery:
• Confirms existence of intermediate-mass black holes
• Validates Einstein's predictions about gravitational waves
• Provides insights into black hole formation in the early universe
• Opens new window for studying extreme physics

What makes this detection particularly exciting is that it falls into the "mass gap" - a range where black holes were thought to be rare. This suggests that our understanding of stellar evolution and black hole formation needs revision.

The gravitational waves from this event traveled for approximately 7 billion years before reaching Earth, carrying information about conditions in the distant universe. The waves were detected as tiny distortions in spacetime - changes in distance smaller than 1/10,000th the width of a proton.

Advanced Detection Technology:
• Laser interferometry with incredible precision
• Multiple detectors confirm signals
• Advanced data analysis algorithms
• International collaboration of scientists

This discovery opens new avenues for understanding the universe's most extreme objects and could lead to insights about the nature of gravity itself. Future detectors will be even more sensitive, potentially detecting gravitational waves from the Big Bang itself.

The field of gravitational wave astronomy is still in its infancy, but it's already revolutionizing our understanding of the cosmos and providing a completely new way to observe the universe.`,
  },
];

export default function BlogDetailScreen() {
  const { id } = useLocalSearchParams();
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const formatContent = (content: string) => {
    return content.split("\n").map((paragraph, index) => {
      if (paragraph.trim() === "") return null;

      if (paragraph.includes("•")) {
        // Handle bullet points
        const lines = paragraph.split("•").filter((line) => line.trim());
        return (
          <View key={index} style={styles.bulletContainer}>
            {lines.map((line, bulletIndex) => (
              <Text key={bulletIndex} style={styles.bulletPoint}>
                • {line.trim()}
              </Text>
            ))}
          </View>
        );
      } else {
        return (
          <Text key={index} style={styles.contentParagraph}>
            {paragraph}
          </Text>
        );
      }
    });
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
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header with back button */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[
                    "rgba(255, 255, 255, 0.2)",
                    "rgba(255, 255, 255, 0.1)",
                  ]}
                  style={styles.backButtonGradient}
                >
                  <Text style={styles.backButtonText}>← Back</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Hero Image */}
            <View style={styles.heroContainer}>
              <Image source={post.image} style={styles.heroImage} />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={styles.heroOverlay}
              />
            </View>

            {/* Article Content */}
            <View style={styles.contentContainer}>
              <LinearGradient
                colors={[
                  "rgba(255, 255, 255, 0.1)",
                  "rgba(255, 255, 255, 0.05)",
                ]}
                style={styles.contentCard}
              >
                {/* Article Meta */}
                <View style={styles.metaContainer}>
                  <View style={styles.metaRow}>
                    <Text style={styles.category}>{post.category}</Text>
                    <Text style={styles.readTime}>{post.readTime}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={styles.author}>By {post.author}</Text>
                    <Text style={styles.date}>{post.date}</Text>
                  </View>
                </View>

                {/* Title */}
                <Text style={styles.title}>{post.title}</Text>

                {/* Content */}
                <View style={styles.contentBody}>
                  {formatContent(post.content)}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                  <LinearGradient
                    colors={[
                      "rgba(74, 144, 226, 0.2)",
                      "rgba(53, 122, 189, 0.2)",
                    ]}
                    style={styles.footerGradient}
                  >
                    <Text style={styles.footerText}>
                      🌌 Thanks for reading! Explore more cosmic discoveries in
                      our blog.
                    </Text>
                  </LinearGradient>
                </View>
              </LinearGradient>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    alignSelf: "flex-start",
  },
  backButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  heroContainer: {
    height: 200,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  contentCard: {
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  metaContainer: {
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    color: "#4A90E2",
    fontWeight: "600",
    backgroundColor: "rgba(74, 144, 226, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  readTime: {
    fontSize: 14,
    color: "#888888",
    fontStyle: "italic",
  },
  author: {
    fontSize: 14,
    color: "#4A90E2",
    fontWeight: "600",
  },
  date: {
    fontSize: 14,
    color: "#888888",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    lineHeight: 36,
    marginBottom: 25,
    textAlign: "center",
  },
  contentBody: {
    marginBottom: 30,
  },
  contentParagraph: {
    fontSize: 16,
    color: "#CCCCCC",
    lineHeight: 26,
    marginBottom: 20,
    textAlign: "justify",
  },
  bulletContainer: {
    marginBottom: 20,
  },
  bulletPoint: {
    fontSize: 16,
    color: "#CCCCCC",
    lineHeight: 24,
    marginBottom: 8,
    paddingLeft: 10,
  },
  footer: {
    marginTop: 20,
  },
  footerGradient: {
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    fontStyle: "italic",
  },
});
