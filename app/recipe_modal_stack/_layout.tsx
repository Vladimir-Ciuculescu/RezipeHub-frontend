import { colors } from "@/theme/colors";
import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: styles.$stackContainerStyle,
      }}
    >
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerTitleAlign: "center",
        }}
        name="recipe_title"
      />
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerTitleAlign: "center",
        }}
        name="recipe_items"
      />
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerTitleAlign: "center",
        }}
        name="recipe_search_ingredients"
      />
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerTitleAlign: "center",
        }}
        name="recipe_confirm_ingredient"
      />
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerTitleAlign: "center",
        }}
        name="recipe_add_steps"
      />
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerTitleAlign: "center",
          //headerShown: false,
        }}
        name="recipe_submit"
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  $stackContainerStyle: { backgroundColor: colors.neutral100 },
});
