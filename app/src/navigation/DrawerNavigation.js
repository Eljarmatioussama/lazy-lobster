import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Pressable, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ModalNavigation from "./ModalNavigation";
import ColorsApp from "../config/ColorsApp";
import usePreferences from "../hooks/usePreferences";

const Tab = createBottomTabNavigator();

const items = [
  { screen: "home", label: "Home", icon: "home-outline" },
  { screen: "workouts", label: "Workouts", icon: "dumbbell" },
  { screen: "diets", label: "Diets", icon: "food-apple-outline" },
  { screen: "favorites", label: "Favorites", icon: "heart-outline" },
  { screen: "settings", label: "Settings", icon: "cog-outline" },
];

function BottomBar({ navigation }) {
  const { theme } = usePreferences();
  const insets = useSafeAreaInsets();
  const isDark = theme === "dark";
  const foreground = isDark ? "#fff" : "#222";
  const background = isDark ? "#111" : "#fff";

  return (
    <View style={{ flexDirection: "row", backgroundColor: background, borderTopWidth: 1, borderTopColor: theme === "dark" ? "#292929" : "#e8e8e8", paddingBottom: Math.max(insets.bottom, 6), paddingTop: 6 }}>
      {items.map((item) => (
        <Pressable key={item.screen} accessibilityRole="button" accessibilityLabel={item.label} onPress={() => navigation.navigate("App", { screen: "Main", params: { screen: item.screen } })} style={{ flex: 1, alignItems: "center", justifyContent: "center", minHeight: 48 }}>
          <Icon name={item.icon} size={23} color={isDark ? '#fff' : '#222'} />
          <Text style={{ color: foreground, fontSize: 11, marginTop: 2 }}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const DrawerNavigation = () => (
  <Tab.Navigator tabBar={(props) => <BottomBar {...props} />}>
    <Tab.Screen name="App" component={ModalNavigation} options={{ headerShown: false }} />
  </Tab.Navigator>
);

export default DrawerNavigation;
