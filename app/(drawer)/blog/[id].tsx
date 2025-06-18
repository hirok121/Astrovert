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
    title: "James Webb Telescope Uncovers Ancient Spiral Galaxies",
    snippet:
      "The James Webb Space Telescope has discovered well-formed spiral galaxies from the early universe, including some similar to Andromeda, reshaping our understanding of galaxy evolution...",
    image: require("../../../assets/images/spiralGalaxy.jpeg"),
    author: "Dr. Sarah Chen",
    date: "2024-01-15",
    category: "Discoveries",
    readTime: "5 min read",
    content: `The James Webb Space Telescope has made a stunning breakthrough by detecting ancient spiral galaxies that resemble present-day giants like Andromeda. These galaxies formed just 400 million years after the Big Bang — far earlier than scientists anticipated for such complex structures.

Webb’s infrared vision has revealed that the early universe was far more dynamic and structured than previously believed. Among the most intriguing findings is a galaxy with spiral arms remarkably similar to the Andromeda galaxy, the Milky Way's massive neighbor.

Key Discoveries:
• Spiral galaxies identified in the first 500 million years
• Structures resembling Andromeda in early formation
• High star formation rates and early galactic order
• Cosmic web patterns forming earlier than expected

These results challenge conventional models of galactic formation, suggesting massive spiral galaxies began forming far earlier. Andromeda, which is expected to collide with the Milky Way in about 4 billion years, now appears less unique in its structural complexity.

This marks a new chapter in cosmic archaeology, as scientists delve deeper into how grand-design galaxies like Andromeda came to be.`,
  },
  {
    id: "2",
    title: "Fast Radio Bursts Linked to Magnetars in Nearby Galaxies",
    snippet:
      "Scientists have connected mysterious fast radio bursts to highly magnetized neutron stars, possibly located in galaxies like Andromeda, offering new insights into cosmic phenomena...",
    image: require("../../../assets/images/Fast Radio Bursts Linked to Magnetars in Nearby Galaxies.jpeg"),
    author: "Prof. Michael Torres",
    date: "2024-01-10",
    category: "Research",
    readTime: "4 min read",
    content: `Fast Radio Bursts (FRBs), powerful millisecond-long radio signals from space, have mystified astronomers for over a decade. Recently, scientists linked them to magnetars — highly magnetized neutron stars — some of which may exist in neighboring galaxies, including Andromeda.

These violent outbursts are believed to result from sudden reconfigurations of magnetic fields in magnetars, releasing immense energy. The discovery of an FRB from within our galaxy confirmed this theory.

What Are Magnetars?
• Ultra-dense remnants with magnetic fields trillions of times stronger than Earth’s
• Rare — only about 30 confirmed in the Milky Way
• Theorized to exist in nearby galaxies like Andromeda

The ability to trace FRBs back to spiral galaxies such as Andromeda gives scientists an exciting new way to map intergalactic space and explore the universe’s invisible matter — especially dark matter and cosmic filaments.

As telescope sensitivity improves, scientists hope to detect more FRBs from known spiral galaxies, unraveling how these cosmic lighthouses can act as probes of the distant universe.`,
  },
  {
    id: "3",
    title:
      "Perseverance Rover Finds Organic Molecules, Echoes in Andromeda's Conditions",
    snippet:
      "NASA’s rover has detected complex organic molecules on Mars, hinting at conditions once similar to those in spiral galaxies like Andromeda...",
    image: require("../../../assets/images/Perseverance Rover Finds Organic Molecules, Echoes in Andromeda's Conditions.jpeg"),
    author: "Dr. Jennifer Walsh",
    date: "2024-01-05",
    category: "Planetary Science",
    readTime: "6 min read",
    content: `NASA’s Perseverance rover has identified diverse organic molecules in Martian rock samples, reinforcing theories that Mars once had conditions conducive to life — much like certain zones within spiral galaxies such as Andromeda.

These organic molecules, preserved for over 3 billion years, are potential biosignatures — chemical hints that life may have existed on Mars.

Highlights:
• Multiple complex carbon-based molecules detected
• Preservation in ancient sedimentary rocks
• Indications of long-lost lakes and rivers
• Analytical tools: PIXL and SHERLOC

What’s compelling is the comparison to habitable zones found in spiral galaxies like Andromeda, where Earth-like planets could exist. If Mars — within a spiral galaxy — had conditions for life, other planets in similar galaxies might too.

As we study Andromeda’s star systems, findings from Mars help set a baseline for what signs of habitability look like across the cosmos.`,
  },
  {
    id: "4",
    title:
      "Biosignatures Detected in Exoplanet Atmospheres Across Spiral Galaxies",
    snippet:
      "Breakthrough spectroscopy reveals water vapor, clouds, and potential biosignatures in exoplanet atmospheres — some within spiral galaxies like Andromeda...",
    image: require("../../../assets/images/Biosignatures Detected in Exoplanet Atmospheres Across Spiral Galaxies.jpeg"),
    author: "Dr. Amanda Rodriguez",
    date: "2024-01-01",
    category: "Exoplanets",
    readTime: "5 min read",
    content: `Recent observations using advanced transit spectroscopy have revolutionized our understanding of exoplanet atmospheres. Scientists have identified biosignatures — including water vapor and methane — on planets located within nearby spiral galaxies, including Andromeda.

This leap in analysis allows us to study not just planets in the Milky Way, but potentially habitable worlds orbiting stars in other galaxies.

Key Observations:
• Biosignature gases: oxygen, methane, and water vapor
• Temperature gradients and atmospheric escape detected
• Weather patterns found on gas giants
• Detection in galaxies like Andromeda adds cosmic perspective

The James Webb Space Telescope's deep-space reach means we're not limited to our galaxy. Its powerful instruments can study transiting exoplanets across spiral galaxies, where habitable conditions might mirror those of Earth.

As our understanding of galactic environments grows, Andromeda and other spiral galaxies are now among the most promising hunting grounds for extraterrestrial life.`,
  },
  {
    id: "5",
    title: "Black Hole Collision Detected Near Spiral Galaxy Cluster",
    snippet:
      "A massive black hole merger has been detected near a spiral galaxy cluster, adding depth to our understanding of gravitational waves and early galactic environments...",
    image: require("../../../assets/images/Black Hole Collision Detected Near Spiral Galaxy Cluster.jpeg"),
    author: "Prof. David Kim",
    date: "2023-12-28",
    category: "Gravitational Physics",
    readTime: "4 min read",
    content: `The LIGO-Virgo collaboration has recorded gravitational waves from a record-breaking black hole merger that occurred near a cluster of spiral galaxies, including ones resembling Andromeda.

The collision involved two massive black holes — 85 and 66 times the mass of our Sun — forming an intermediate-mass black hole.

Significance:
• Located in a region populated with spiral galaxies
• Supports the existence of black holes in all galaxy types
• Gravitational waves traveled for 7 billion years to Earth
• Validates models of black hole dynamics in dense star-forming regions

The proximity of the event to spiral galaxies suggests such environments play a role in the frequency and intensity of these mergers. Galaxies like Andromeda, rich in stars and dark matter, are perfect cradles for such extreme phenomena.

With upcoming detectors and more gravitational wave events expected, spiral galaxies are becoming key players in understanding the evolution of black holes and cosmic structure.`,
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
        source={require("../../../assets/images/TwoFace.jpg")}
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
