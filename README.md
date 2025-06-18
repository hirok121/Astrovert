# 🌌 ASTROVERT - Comprehensive Astronomy Mobile App

A visually stunning and comprehensive React Native mobile application designed for astronomy enthusiasts. Astrovert combines education, entertainment, and exploration to create an immersive cosmic journey.

![Astrovert Logo](assets/images/icon.png)

## ✨ Features

### 🎯 Core Features Implemented

#### 1. 🏠 Welcome & Home Screen

- **Dynamic Welcome Page**: Beautiful astronomy-themed background with smooth animations
- **Interactive Home Screen**: Quick navigation to all main sections
- **Astronomy Fact of the Day**: New interesting facts displayed on each visit
- **User-Aware Interface**: Personalized greetings for logged-in users
- **Quick Stats Display**: Shows user's game and quiz high scores

#### 2. 🌌 3D Galaxy Explorer

- **Interactive 3D Models**: Switch between Andromeda Galaxy and generic spiral galaxy
- **Realistic Rendering**: Uses Three.js and React Three Fiber for smooth 3D rendering
- **Intuitive Controls**:
  - Drag to rotate the model
  - Pinch to zoom in/out
  - Reset view functionality
- **Educational Information**: Detailed facts about galaxies and the Andromeda Galaxy
- **Performance Optimized**: Smooth rendering across different devices

#### 3. 📚 Astronomy Blog Section

- **Rich Content**: 5 comprehensive blog posts covering various astronomy topics
- **Smart Search**: Filter posts by title, content, or category
- **Detailed Post View**: Full articles with images, author info, and publication dates
- **Content Categories**: Discoveries, Research, Exoplanets, Physics, etc.
- **Responsive Design**: Beautiful cards with gradients and proper typography

#### 4. 🔐 User Authentication System

- **Local Storage**: All user data stored locally using AsyncStorage
- **Simple Registration**: Username and password-based signup
- **Secure Login**: User credentials validation
- **Profile Management**: View and manage user profile with achievements
- **Demo Account**: Pre-configured demo account (username: demo, password: password)

#### 5. 🎮 Interactive Asteroid Dodger Game

- **Engaging Gameplay**: Control a spaceship to avoid falling asteroids
- **Touch Controls**: Drag your spaceship around the screen
- **Power-ups System**:
  - 🛡️ Shield: Temporary protection from collisions
  - ⚡ Speed Boost: Slows down asteroid speed temporarily
  - ⭐ Score Bonus: Instant score boost
- **Progressive Difficulty**: Game speed increases over time
- **Lives System**: 3 lives with brief invulnerability after collision
- **High Score Tracking**: Personal best scores saved locally
- **Sound Effects**: Audio feedback for collisions, power-ups, and scoring

#### 6. 🧠 Multiple Choice Quiz (MCQ)

- **10 Comprehensive Questions**: Covering various astronomy topics
- **Categories**: Solar System, Stars & Galaxies, Physics, Cosmology, Space Technology
- **Timed Questions**: 30 seconds per question with visual timer
- **Immediate Feedback**: Correct/incorrect indication with detailed explanations
- **Performance Analytics**: Score tracking with percentage and performance messages
- **Achievement System**: Personal best tracking and celebration of new records
- **Question Summary**: Review of all answers after completion

### 🎨 Design & User Experience

#### Visual Design

- **Dark Theme**: Beautiful night sky-inspired color scheme
- **Gradient Backgrounds**: Smooth color transitions throughout the app
- **Astronomy Imagery**: Real space images and cosmic backgrounds
- **Responsive Layout**: Optimized for various screen sizes
- **Smooth Animations**: Subtle transitions and loading states

#### Navigation

- **Intuitive Flow**: Clear navigation between all sections
- **Login Protection**: Game and quiz require user authentication
- **Quick Access**: Home screen provides direct access to all features
- **Back Navigation**: Proper navigation stack management

### 🔧 Technical Implementation

#### Technologies Used

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tooling
- **React Navigation**: Screen navigation and routing
- **Three.js & React Three Fiber**: 3D model rendering
- **AsyncStorage**: Local data persistence
- **Expo AV**: Audio management for sound effects
- **Linear Gradient**: Beautiful gradient backgrounds
- **TypeScript**: Type-safe development

#### Architecture

- **Component-Based**: Modular and reusable components
- **Context API**: Global state management for authentication
- **Custom Hooks**: Reusable logic for audio and game mechanics
- **Local Storage**: All user data persisted locally
- **Error Handling**: Graceful error handling throughout the app

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device

### Installation

1. **Clone the repository**

   ```bash
   git clone [your-repo-url]
   cd Astrovert
   ```

2. **Install dependencies**

   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Run on device**
   - Scan the QR code with Expo Go app (Android) or Camera app (iOS)
   - Or use `npm run android` / `npm run ios` for simulators

### Demo Account

For quick testing, use the pre-configured demo account:

- **Username**: demo
- **Password**: password

## 📱 App Structure

```
app/
├── _layout.tsx          # Main navigation layout
├── index.tsx            # App entry point
├── welcome.tsx          # Welcome screen
├── home.tsx             # Home dashboard
├── blog.tsx             # Blog listing
├── blog/[id].tsx        # Individual blog post
├── galaxies.tsx         # 3D galaxy viewer
├── game.tsx             # Asteroid Dodger game
├── quiz.tsx             # Astronomy quiz
├── login.tsx            # User login
├── register.tsx         # User registration
└── profile.tsx          # User profile

contexts/
└── AuthContext.tsx      # Authentication context

utils/
└── soundManager.ts      # Audio management utility

assets/
├── 3DModels/           # GLTF 3D models
├── images/             # App images and backgrounds
└── fonts/              # Custom fonts
```

## 🎯 Key Features Breakdown

### 🏠 Home Screen Features

- Personalized welcome message
- Daily astronomy facts
- Quick navigation cards
- User statistics display (if logged in)
- Beautiful space-themed background

### 🌌 3D Galaxy Viewer

- Interactive Andromeda Galaxy model
- Alternative spiral galaxy model
- Smooth rotation and zoom controls
- Educational information panels
- Model switching functionality

### 📚 Blog System

- 5 detailed astronomy articles
- Search and filter functionality
- Rich content with images
- Author and publication information
- Category-based organization

### 🎮 Asteroid Dodger Game

- Touch-based spaceship control
- Dynamic asteroid generation
- Three types of power-ups
- Progressive difficulty system
- Sound effects and visual feedback
- High score persistence

### 🧠 Quiz System

- 10 carefully crafted questions
- Multiple astronomy categories
- Timed question format
- Detailed explanations
- Performance tracking
- Achievement celebrations

### 👤 User System

- Local account creation
- Secure authentication
- Profile with achievements
- Score tracking across games
- Achievement badge system

## 🎨 Visual Highlights

### Color Scheme

- **Primary**: Deep space blues (#4A90E2, #357ABD)
- **Secondary**: Cosmic gradients (purples, teals, golds)
- **Accent**: Stellar yellows and cosmic greens
- **Background**: Rich space imagery with overlays

### Typography

- **Headers**: Bold, space-themed fonts
- **Body**: Clean, readable text with proper contrast
- **UI Elements**: Consistent sizing and spacing

### Animations

- Smooth screen transitions
- Gradient animations
- Loading states
- Feedback animations for interactions

## 🔧 Advanced Features

### Sound System

- Comprehensive sound manager
- Multiple sound effects for different actions
- Volume controls
- Graceful fallback for audio errors
- Audio configuration for different platforms

### Performance Optimizations

- Efficient 3D rendering
- Optimized image loading
- Smooth animations with proper frame rates
- Memory management for games
- Responsive design patterns

### Error Handling

- Network error management
- Audio system fallbacks
- User input validation
- Graceful degradation
- Comprehensive logging

## 📊 User Achievement System

### Achievement Levels

- **Space Cadet**: Starting level (0-99 points)
- **Cosmic Explorer**: Intermediate (100-199 points)
- **Galaxy Master**: Advanced (200-299 points)
- **Universe Commander**: Expert (300+ points)

### Badges

- 🎯 **First Flight**: Play Asteroid Dodger
- ⚡ **Speed Demon**: Score 50+ in game
- 📚 **Scholar**: Take the astronomy quiz
- 🌟 **Star Student**: Score 8+ in quiz
- 🌌 **Cosmic Explorer**: Reach 100 total points
- 👨‍🚀 **Universe Commander**: Reach 300 total points

## 🌟 Educational Content

### Blog Topics

1. **James Webb Telescope Discoveries**: Ancient galaxies and cosmic evolution
2. **Fast Radio Bursts**: Mysterious cosmic signals and their sources
3. **Mars Exploration**: Latest discoveries from the Red Planet
4. **Exoplanet Atmospheres**: Breakthrough analysis techniques
5. **Gravitational Waves**: Black hole collisions and spacetime

### Quiz Categories

- **Solar System**: Planets, moons, and space exploration
- **Stars & Galaxies**: Stellar evolution and galactic structures
- **Physics**: Fundamental concepts and cosmic phenomena
- **Cosmology**: Universe structure and dark matter/energy
- **Space Technology**: Telescopes and space missions

## 🔮 Future Enhancements

### Planned Features

- Real sound effects and music
- More 3D models (planets, spacecraft)
- Additional game modes
- Expanded quiz questions
- User-generated content
- Social features and leaderboards
- Offline mode improvements
- Push notifications for astronomical events

### Technical Improvements

- Advanced 3D graphics optimization
- AR features for stargazing
- Real-time astronomical data integration
- Cloud sync for user data
- Advanced analytics and insights

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **3D Models**: Licensed under CC-BY-4.0
  - Andromeda Galaxy model by per.rb1 on Sketchfab
  - Galaxy model by prototypus on Sketchfab
- **Images**: Space imagery from various sources
- **Expo Team**: For the excellent development platform
- **React Native Community**: For the amazing ecosystem

## 📞 Support

For support, email [your-email@example.com] or join our Discord community.

---

**🌌 Explore the cosmos with Astrovert - Where curiosity meets the universe! 🚀**
