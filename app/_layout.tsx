if (__DEV__) {
  require("../ReactotronConfig");
}

import React from "react";
import { LogBox, StyleSheet } from "react-native";
import { colors } from "@/theme/colors";
import { useFonts } from "expo-font";
import { fontsToLoad } from "@/theme/typography";
import { Stack } from "expo-router/stack";
import { ClerkProvider } from "@clerk/clerk-expo";

import * as SecureStore from "expo-secure-store";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import toastConfig from "@/components/Toast/ToastConfing";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

LogBox.ignoreLogs([
  "Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
]);

const tokenCache = {
  getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return null;
    }
  },
};

const clerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const unstable_settings = {
  initialRouteName: "home",
};

const queryClient = new QueryClient();

export default function Layout() {
  let [fontsLoaded] = useFonts(fontsToLoad);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <ActionSheetProvider>
          <BottomSheetModalProvider>
            <ClerkProvider
              publishableKey={clerkKey!}
              // tokenCache={tokenCache as any}
            >
              <Stack
                screenOptions={{
                  contentStyle: styles.$stackContainerStyle,
                }}
              >
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="index"
                />

                <Stack.Screen
                  name="home"
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name="login"
                  options={{
                    headerBackVisible: false,
                    headerShadowVisible: false,
                    headerTitleAlign: "center",
                  }}
                />

                <Stack.Screen
                  name="register"
                  options={{
                    headerBackVisible: false,
                    headerShadowVisible: false,
                    headerTitleAlign: "center",
                  }}
                />
                <Stack.Screen
                  name="forgot_password"
                  options={{
                    headerBackVisible: false,
                    headerShadowVisible: false,
                    headerTitleAlign: "center",
                  }}
                />
                <Stack.Screen
                  name="reset_password"
                  options={{
                    headerBackVisible: false,
                    headerShadowVisible: false,
                    headerTitleAlign: "center",
                  }}
                />
                <Stack.Screen
                  name="otp_verification"
                  options={{
                    headerBackVisible: false,
                    headerShadowVisible: false,
                    headerTitleAlign: "center",
                  }}
                />

                <Stack.Screen
                  name="add_recipe"
                  options={{ presentation: "fullScreenModal", headerShown: false }}
                />
                <Stack.Screen
                  name="edit_recipe"
                  options={{ presentation: "modal", headerShown: false }}
                />
                <Stack.Screen
                  name="(tabs)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="recipe_details"
                  options={{ headerShown: true, headerTransparent: true }}
                />

                <Stack.Screen
                  name="all_personal_recipes"
                  options={{
                    headerBackVisible: false,
                    headerShadowVisible: false,
                    headerTitleAlign: "center",
                    headerStyle: { backgroundColor: colors.greyscale150 },
                    contentStyle: { backgroundColor: colors.greyscale150 },
                  }}
                />
              </Stack>
              <Toast
                config={toastConfig}
                position="bottom"
                bottomOffset={50}
              />
            </ClerkProvider>
          </BottomSheetModalProvider>
        </ActionSheetProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  $stackContainerStyle: { backgroundColor: colors.neutral100 },
});
