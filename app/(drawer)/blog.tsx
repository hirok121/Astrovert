import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

// Mock blog data
// Updated Mock Blog Data with Andromeda and Spiral Galaxies
const blogPosts = [
  {
    id: "1",
    title: "James Webb Telescope Uncovers Ancient Spiral Galaxies",
    snippet:
      "The James Webb Space Telescope has discovered well-formed spiral galaxies from the early universe, including some similar to Andromeda, reshaping our understanding of galaxy evolution...",
    image: require("../../assets/images/spiralGalaxy.jpeg"),
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
    image: require("../../assets/images/Fast Radio Bursts Linked to Magnetars in Nearby Galaxies.jpeg"),
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
    image: require("../../assets/images/Perseverance Rover Finds Organic Molecules, Echoes in Andromeda's Conditions.jpeg"),
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
    image: require("../../assets/images/Biosignatures Detected in Exoplanet Atmospheres Across Spiral Galaxies.jpeg"),
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
    image: require("../../assets/images/Black Hole Collision Detected Near Spiral Galaxy Cluster.jpeg"),
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

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const renderBlogPost = ({ item }: { item: (typeof blogPosts)[0] }) => (
    <TouchableOpacity
      style={styles.blogCard}
      onPress={() => router.push(`./blog/${item.id}` as any)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]}
        style={styles.cardGradient}
      >
        <View style={styles.cardContent}>
          <Image source={item.image} style={styles.cardImage} />
          <View style={styles.cardTextContainer}>
            <View style={styles.cardHeader}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.readTime}>{item.readTime}</Text>
            </View>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.cardSnippet} numberOfLines={3}>
              {item.snippet}
            </Text>
            <View style={styles.cardFooter}>
              <Text style={styles.author}>By {item.author}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Astronomy Blog</Text>
      <Text style={styles.headerSubtitle}>
        Latest discoveries and cosmic insights from the universe
      </Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]}
          style={styles.searchGradient}
        >
          <TextInput
            style={styles.searchInput}
            placeholder="Search articles..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <Text style={styles.searchIcon}>🔍</Text>
        </LinearGradient>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🔍</Text>
      <Text style={styles.emptyStateTitle}>No articles found</Text>
      <Text style={styles.emptyStateText}>
        Try adjusting your search terms or browse all articles
      </Text>
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
          colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.8)"]}
          style={styles.gradient}
        >
          <FlatList
            data={filteredPosts}
            renderItem={renderBlogPost}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderEmptyState}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
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
  listContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    marginBottom: 25,
    fontStyle: "italic",
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchGradient: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchIcon: {
    position: "absolute",
    right: 20,
    top: 15,
    fontSize: 16,
  },
  blogCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  cardGradient: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardContent: {
    flexDirection: "row",
    padding: 15,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    color: "#4A90E2",
    fontWeight: "600",
    backgroundColor: "rgba(74, 144, 226, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  readTime: {
    fontSize: 12,
    color: "#888888",
    fontStyle: "italic",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    lineHeight: 22,
  },
  cardSnippet: {
    fontSize: 14,
    color: "#CCCCCC",
    lineHeight: 20,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  author: {
    fontSize: 12,
    color: "#4A90E2",
    fontWeight: "600",
  },
  date: {
    fontSize: 12,
    color: "#888888",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    lineHeight: 24,
  },
});
