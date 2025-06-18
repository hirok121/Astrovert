import React from "react";
import { Drawer } from "expo-router/drawer";
import { useAuth } from "../../contexts/AuthContext";
import DrawerContent from "../../components/DrawerContent";
import CustomHeader from "../../components/CustomHeader";

export default function DrawerLayout() {
  const { user } = useAuth();

  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        header: ({ route }) => (
          <CustomHeader
            title={getScreenTitle(route.name)}
            onMenuPress={() => navigation.openDrawer()}
          />
        ),
        drawerStyle: {
          width: 280,
        },
        drawerType: "front",
        overlayColor: "rgba(0, 0, 0, 0.5)",
      })}
    >
      <Drawer.Screen
        name="home"
        options={{
          title: "Home",
          drawerLabel: "Home",
        }}
      />
      <Drawer.Screen
        name="blog"
        options={{
          title: "Astronomy Blog",
          drawerLabel: "Blog",
        }}
      />
      <Drawer.Screen
        name="galaxies"
        options={{
          title: "3D Galaxy Explorer",
          drawerLabel: "3D Galaxies",
        }}
      />
      <Drawer.Screen
        name="game"
        options={{
          title: "Asteroid Dodger",
          drawerLabel: "Asteroid Game",
        }}
      />
      <Drawer.Screen
        name="quiz"
        options={{
          title: "Astronomy Quiz",
          drawerLabel: "Quiz",
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: "User Profile",
          drawerLabel: "Profile",
        }}
      />
    </Drawer>
  );
}

function getScreenTitle(routeName: string): string {
  const titles: { [key: string]: string } = {
    home: "ASTROVERT",
    blog: "Astronomy Blog",
    galaxies: "3D Galaxy Explorer",
    game: "Asteroid Dodger",
    quiz: "Astronomy Quiz",
    profile: "User Profile",
  };
  return titles[routeName] || "ASTROVERT";
}
