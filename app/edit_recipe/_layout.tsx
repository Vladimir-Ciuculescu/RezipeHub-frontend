import { colors } from "@/theme/colors";
import { Stack } from "expo-router/stack";
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
        name="recipe_edit_summary"
      />
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerTitleAlign: "center",
        }}
        name="recipe_edit_step"
      />
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerTitleAlign: "center",
        }}
        name="recipe_edit_ingredient"
      />
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerTitleAlign: "center",
        }}
        name="recipe_edit_add_ingredient"
      />
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerTitleAlign: "center",
        }}
        name="recipe_edit_search_ingredients"
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  $stackContainerStyle: { backgroundColor: colors.neutral100 },
});
