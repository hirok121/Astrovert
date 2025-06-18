# 🌌 ASTROVERT - Comprehensive Astronomy Mobile App

**Explore the Cosmos, Discover the Universe**

A visually stunning and comprehensive React Native mobile application designed for astronomy enthusiasts. Astrovert combines education, entertainment, and exploration to create an immersive cosmic journey with 3D visualizations, interactive games, educational content, and personalized user experiences.

![Astrovert Logo](assets/images/icon.png)

## 🚀 Overview

Astrovert is a feature-rich astronomy app that offers multiple ways to explore and learn about space. Whether you're a curious beginner or an astronomy enthusiast, this app provides an engaging platform to discover the wonders of the universe through interactive content, games, and educational resources.

## ✨ Key Features

### 🎯 Core Features

#### 📚 **Astronomy Blog**

- Curated collection of space-related articles and discoveries
- Featured topics include James Webb telescope findings, galaxy formations, and cosmic phenomena
- Search functionality to find specific astronomical topics
- Beautiful card-based layout with hero images
- Categories: Discoveries, Research, Space Exploration
- Sample articles cover spiral galaxies, fast radio bursts, exoplanet discoveries, and more

#### 🎮 **Interactive Asteroid Dodger Game**

- Real-time space-themed arcade game with smooth controls
- Player spaceship with touch/gesture-based movement
- Dynamic asteroid generation with varying sizes and speeds
- Power-up system (Shield, Speed Boost, Score Multiplier)
- Lives system with collision detection
- High score tracking and leaderboards
- Sound effects and background music
- Haptic feedback for enhanced gaming experience
- Pause/resume functionality
- Game state persistence

#### 🧠 **Astronomy Quiz Challenge**

- Comprehensive quiz system with 50+ questions
- Multiple categories: Solar System, Stars & Galaxies, Space Exploration, Cosmology
- Detailed explanations for each answer
- Progress tracking and scoring system
- Visual feedback with animations
- Timer-based questions
- Achievement system based on performance
- Educational insights after each quiz session

#### 🌌 **3D Galaxy Explorer**

- Interactive 3D galaxy visualizations using Three.js
- Real-time rendering of procedural galaxies
- Touch gestures for rotation, zoom, and pan controls
- Multiple galaxy models (Spiral, Andromeda-type)
- Ambient space audio for immersive experience
- WebGL-based rendering for smooth performance
- Dynamic particle systems for cosmic effects

#### 👨‍🚀 **User Authentication & Profiles**

- Flexible authentication system with multiple access modes:
  - **Guest Mode**: Full app access with local progress storage
  - **Registered Users**: Account-based progress sync across devices
- Personalized user profiles with achievement tracking
- Progress statistics for games and quizzes
- Achievement badge system with unlock conditions
- Total score calculation and ranking system
- Profile customization and user preferences

#### 🎵 **Audio System**

- Comprehensive sound management with category-based audio
- Background ambient space sounds
- Game sound effects (collisions, power-ups, scoring)
- Quiz audio feedback (correct/incorrect answers)
- Button interaction sounds
- Volume control and audio preferences
- Support for silent mode and background audio

#### 🎨 **Beautiful UI/UX Design**

- Modern dark theme with cosmic aesthetics
- Gradient overlays and space-themed backgrounds
- Smooth animations and transitions
- Responsive design for various screen sizes
- Custom navigation drawer with user context
- Loading states and progress indicators
- Haptic feedback for better user interaction
- Accessible design with proper contrast ratios

## 🛠️ Technical Architecture

### **Frontend Framework**

- **React Native** with Expo SDK for cross-platform development
- **TypeScript** for type safety and better code maintainability
- **Expo Router** for file-based navigation system

### **3D Graphics & Visualization**

- **Three.js** for 3D rendering and graphics
- **@react-three/fiber** for React integration with Three.js
- **@react-three/drei** for additional 3D components and helpers
- **expo-gl** for WebGL context and rendering
- **expo-three** for Three.js integration with Expo

### **State Management & Storage**

- **React Context API** for global state management
- **AsyncStorage** for local data persistence
- User authentication state management
- Game progress and high score storage
- User preferences and settings persistence

### **Audio & Multimedia**

- **expo-av** for audio playback and management
- **expo-audio** for additional audio features
- **expo-haptics** for haptic feedback
- Sound effect management system
- Background music control

### **Navigation & UI**

- **@react-navigation/drawer** for drawer navigation
- **@react-navigation/native** for core navigation features
- **expo-linear-gradient** for gradient UI elements
- **react-native-gesture-handler** for touch interactions
- **react-native-reanimated** for smooth animations

### **Additional Libraries**

- **expo-blur** for UI blur effects
- **expo-constants** for app configuration
- **expo-font** for custom typography
- **expo-linking** for deep linking
- **expo-splash-screen** for app launch experience

## 📱 App Structure

### **Navigation Architecture**

```
App Root (/)
├── Welcome Screen (index.tsx)
├── Authentication
│   ├── Login Screen (/login)
│   └── Register Screen (/register)
└── Main App (/(drawer)/)
    ├── Home Dashboard (/home)
    ├── Astronomy Blog (/blog)
    │   └── Article Detail (/blog/[id])
    ├── 3D Galaxy Explorer (/galaxies)
    ├── Asteroid Dodger Game (/game)
    ├── Astronomy Quiz (/quiz)
    └── User Profile (/profile)
```

### **Component Structure**

```
components/
├── CustomHeader.tsx        # App-wide header with navigation
├── DrawerContent.tsx       # Custom drawer navigation content
└── [Additional Components]

contexts/
├── AuthContext.tsx         # Authentication state management
└── [Theme/Settings contexts]

utils/
├── soundManager.ts         # Audio system management
└── [Additional utilities]
```

### **Asset Organization**

```
assets/
├── 3DModels/              # GLTF models for 3D scenes
│   ├── andromeda/         # Andromeda galaxy model
│   └── galaxy_und44700129/ # Spiral galaxy model
├── audio/                 # Sound effects and music
├── fonts/                 # Custom typography
└── images/                # UI images and backgrounds
```

## 🎯 User Experience Features

### **Guest vs Registered User Experience**

- **Guest Users**:
  - Immediate access to all features
  - Local progress storage
  - Achievement tracking
  - Upgrade prompts for account creation
- **Registered Users**:
  - Cross-device progress synchronization
  - Persistent high scores
  - Enhanced profile customization
  - Community features (future expansion)

### **Achievement System**

- **First Flight**: Play Asteroid Dodger game
- **Scholar**: Complete astronomy quiz
- **Speed Demon**: Score 50+ points in game
- **Star Student**: Score 8+ in quiz
- **Cosmic Explorer**: Reach 100+ total points
- **Universe Commander**: Achieve 300+ total points

### **Progressive Enhancement**

- App functions fully offline after initial load
- Graceful degradation for low-performance devices
- Adaptive UI based on screen size and device capabilities
- Optional features that enhance but don't block core functionality

## 🔧 Development Setup

### **Prerequisites**

- Node.js (v16 or higher)
- npm or yarn package manager
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development on macOS)

### **Installation**

```bash
# Clone the repository
git clone <repository-url>
cd Astrovert

# Install dependencies
npm install

# Start the development server
npm start

# Run on specific platforms
npm run android  # Android emulator/device
npm run ios      # iOS simulator/device
npm run web      # Web browser
```

### **Available Scripts**

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Run in web browser
- `npm test` - Run test suite
- `npm run lint` - Run ESLint for code quality

## 📦 Dependencies

### **Core Dependencies**

```json
{
  "expo": "~53.0.11",
  "react": "^19.0.0",
  "react-native": "^0.79.3",
  "expo-router": "~5.1.0",
  "typescript": "~5.8.3"
}
```

### **UI & Navigation**

```json
{
  "@react-navigation/drawer": "^7.4.2",
  "@react-navigation/native": "^7.0.14",
  "expo-linear-gradient": "~14.1.5",
  "react-native-gesture-handler": "~2.24.0",
  "react-native-reanimated": "~3.17.0"
}
```

### **3D Graphics**

```json
{
  "@react-three/fiber": "^9.1.2",
  "@react-three/drei": "^10.3.0",
  "three": "^0.166.1",
  "expo-three": "^8.0.0",
  "expo-gl": "~15.1.6"
}
```

### **Audio & Multimedia**

```json
{
  "expo-av": "^15.1.6",
  "expo-audio": "^0.4.6",
  "expo-haptics": "~14.1.4"
}
```

## 🎨 Design Philosophy

### **Visual Design**

- **Dark Theme**: Space-inspired dark interface with cosmic backgrounds
- **Gradient Accents**: Strategic use of gradients for depth and visual interest
- **Typography**: Clean, readable fonts with proper hierarchy
- **Iconography**: Consistent space-themed icons throughout the app
- **Color Palette**: Blues, purples, and cosmic colors for astronomical feel

### **User Experience**

- **Progressive Disclosure**: Features revealed based on user engagement
- **Immediate Gratification**: Instant access through guest mode
- **Educational Value**: Learning integrated naturally into entertainment
- **Accessibility**: Designed for users of various technical backgrounds
- **Performance**: Smooth interactions even on lower-end devices

## 🚀 Future Enhancements

### **Planned Features**

- [ ] Social features (user rankings, achievements sharing)
- [ ] More 3D models and interactive space objects
- [ ] AR integration for real-world space viewing
- [ ] Expanded quiz categories and difficulty levels
- [ ] Real-time astronomy news integration
- [ ] Constellation identification game
- [ ] Voice-guided tours of the galaxy
- [ ] Offline content synchronization
- [ ] Multi-language support
- [ ] Advanced user analytics and learning insights

### **Technical Improvements**

- [ ] Performance optimization for 3D rendering
- [ ] Enhanced caching strategies
- [ ] Push notifications for astronomy events
- [ ] Background sync capabilities
- [ ] Advanced error tracking and reporting
- [ ] Automated testing suite expansion
- [ ] CI/CD pipeline integration

## 🤝 Contributing

### **Development Guidelines**

1. Follow TypeScript best practices
2. Maintain consistent code formatting with ESLint
3. Write descriptive commit messages
4. Test on both iOS and Android platforms
5. Ensure accessibility compliance
6. Document new features and APIs

### **Code Structure**

- Use functional components with hooks
- Implement proper error handling
- Follow React Navigation patterns
- Maintain separation of concerns
- Use TypeScript interfaces for all data structures

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- NASA for providing inspiration and educational content
- Three.js community for 3D graphics resources
- Expo team for the excellent development platform
- React Native community for continuous innovation
- Space image providers for stunning background visuals

## 📞 Support

For questions, issues, or feature requests:

- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common solutions

---

**Astrovert** - _Where curiosity meets the cosmos_ 🌌✨
