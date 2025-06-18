import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// User interface
interface User {
  username: string;
  gameHighScore: number;
  quizHighScore: number;
  isGuest?: boolean;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  updateGameScore: (score: number) => Promise<void>;
  updateQuizScore: (score: number) => Promise<void>;
  isLoading: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data on app start
  useEffect(() => {
    loadUserData();
  }, []);
  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("currentUser");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        // Check if there's guest data
        const guestData = await AsyncStorage.getItem("guestUser");
        if (guestData) {
          setUser(JSON.parse(guestData));
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsGuest = async () => {
    try {
      // Check if guest user already exists
      const existingGuestData = await AsyncStorage.getItem("guestUser");
      let guestUser: User;

      if (existingGuestData) {
        guestUser = JSON.parse(existingGuestData);
      } else {
        guestUser = {
          username: "Guest Explorer",
          gameHighScore: 0,
          quizHighScore: 0,
          isGuest: true,
        };
        await AsyncStorage.setItem("guestUser", JSON.stringify(guestUser));
      }

      setUser(guestUser);
      await AsyncStorage.setItem("currentUser", JSON.stringify(guestUser));
    } catch (error) {
      console.error("Error setting up guest user:", error);
    }
  };

  const register = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      // Check if user already exists
      const existingUsers = await AsyncStorage.getItem("users");
      const users = existingUsers ? JSON.parse(existingUsers) : {};

      if (users[username]) {
        return false; // User already exists
      }

      // Create new user
      users[username] = {
        password: password, // In production, hash this password
        gameHighScore: 0,
        quizHighScore: 0,
      };

      // Save users data
      await AsyncStorage.setItem("users", JSON.stringify(users));

      // Auto-login after registration
      const newUser: User = {
        username,
        gameHighScore: 0,
        quizHighScore: 0,
      };

      setUser(newUser);
      await AsyncStorage.setItem("currentUser", JSON.stringify(newUser));

      return true;
    } catch (error) {
      console.error("Error registering user:", error);
      return false;
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const existingUsers = await AsyncStorage.getItem("users");
      const users = existingUsers ? JSON.parse(existingUsers) : {};

      if (users[username] && users[username].password === password) {
        const loggedInUser: User = {
          username,
          gameHighScore: users[username].gameHighScore || 0,
          quizHighScore: users[username].quizHighScore || 0,
        };

        setUser(loggedInUser);
        await AsyncStorage.setItem("currentUser", JSON.stringify(loggedInUser));
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error logging in:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem("currentUser");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const updateGameScore = async (score: number) => {
    if (!user) return;

    try {
      const updatedUser = { ...user };
      if (score > user.gameHighScore) {
        updatedUser.gameHighScore = score;
        setUser(updatedUser);
        await AsyncStorage.setItem("currentUser", JSON.stringify(updatedUser));

        if (user.isGuest) {
          // Update guest data
          await AsyncStorage.setItem("guestUser", JSON.stringify(updatedUser));
        } else {
          // Update in users data for registered users
          const existingUsers = await AsyncStorage.getItem("users");
          const users = existingUsers ? JSON.parse(existingUsers) : {};
          if (users[user.username]) {
            users[user.username].gameHighScore = score;
            await AsyncStorage.setItem("users", JSON.stringify(users));
          }
        }
      }
    } catch (error) {
      console.error("Error updating game score:", error);
    }
  };

  const updateQuizScore = async (score: number) => {
    if (!user) return;

    try {
      const updatedUser = { ...user };
      if (score > user.quizHighScore) {
        updatedUser.quizHighScore = score;
        setUser(updatedUser);
        await AsyncStorage.setItem("currentUser", JSON.stringify(updatedUser));

        if (user.isGuest) {
          // Update guest data
          await AsyncStorage.setItem("guestUser", JSON.stringify(updatedUser));
        } else {
          // Update in users data for registered users
          const existingUsers = await AsyncStorage.getItem("users");
          const users = existingUsers ? JSON.parse(existingUsers) : {};
          if (users[user.username]) {
            users[user.username].quizHighScore = score;
            await AsyncStorage.setItem("users", JSON.stringify(users));
          }
        }
      }
    } catch (error) {
      console.error("Error updating quiz score:", error);
    }
  };
  const value: AuthContextType = {
    user,
    login,
    register,
    loginAsGuest,
    logout,
    updateGameScore,
    updateQuizScore,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
