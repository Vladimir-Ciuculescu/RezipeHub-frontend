// if (__DEV__) {
//   require("../ReactotronConfig");
// }

import { Redirect, Slot, useSegments } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  LogBox,
  Platform,
  StyleSheet,
} from "react-native";
import { colors } from "@/theme/colors";
import { isLoading, useFonts } from "expo-font";
import { fontsToLoad } from "@/theme/typography";
import { Stack } from "expo-router/stack";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { View } from "react-native-ui-lib";
import { No_results } from "@/assets/illustrations";
import LottieView from "lottie-react-native";
import { ACCESS_TOKEN, storage } from "@/storage";
import { jwtDecode } from "jwt-decode";
import { CurrentUser } from "@/types/user.types";
import UserService from "@/api/services/user.service";
import useUserStore from "@/zustand/useUserStore";
import TokenService from "@/api/services/token.service";

LogBox.ignoreLogs([
  "Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
]);

const { width, height } = Dimensions.get("screen");

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
const queryClient = new QueryClient();

const AppLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const hasNavigated = useRef(false);
  const setUser = useUserStore.use.setUser();

  const [cacat, setCacat] = useState(false);

  //TODO: Vladi you retarded, USE THE STORAGE TOKEN INSTEAD OF isSignedIn and isLoaded

  useEffect(() => {
    // Check if loading has completed or if navigation is already handled
    if (!isLoaded || hasNavigated.current) return;

    // Mark as navigated
    hasNavigated.current = true;

    // Proceed only if the user is signed in
    if (isSignedIn) {
      getProfile();
      // router.replace("(tabs)");
    } else {
      router.replace("home");
    }

    // setCacat(true);
  }, [isLoaded, isSignedIn, router]); // Only re-run when these dependencies change

  const getProfile = async () => {
    // Retrieve the token and user data from storage
    const accessToken = storage.getString(ACCESS_TOKEN);
    if (!accessToken) {
      return; // Handle the case where there's no token (e.g., log out or redirect)
    }

    const userData = jwtDecode(accessToken!) as CurrentUser;

    // Make the API call to get the profile
    const newAccessToken = await UserService.getProfile(userData.id);
    const newUserData = jwtDecode(newAccessToken) as CurrentUser;

    // Save the new access token and user data
    await storage.set(ACCESS_TOKEN, newAccessToken);
    setUser(newUserData);

    // Based on whether the user is verified, navigate accordingly
    if (newUserData.isVerified) {
      router.replace("(tabs)");
    } else {
      router.navigate({
        pathname: "otp_verification",
        params: { userId: newUserData.id, email: newUserData.email },
      });

      // Resend the verification token
      const payload = { userId: newUserData.id, email: newUserData.email };
      await TokenService.resendToken(payload);
    }
  };

  return isLoaded ? (
    <Stack screenOptions={{ contentStyle: styles.$stackContainerStyle }}>
      <Stack.Screen
        options={{ headerShown: false, gestureEnabled: false }}
        name="index"
      />
      <Stack.Screen
        options={{ headerShown: false, gestureEnabled: false }}
        name="home"
      />
      <Stack.Screen
        name="login"
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerTitleAlign: "center",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerTitleAlign: "center",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="forgot_password"
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerTitleAlign: "center",
          gestureEnabled: false,
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
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="add_recipe"
        options={{
          presentation: "fullScreenModal",
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="edit_recipe"
        options={{ presentation: "modal", headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="recipe_details"
        options={{ headerShown: true, headerTransparent: true, gestureEnabled: false }}
      />
      <Stack.Screen
        name="edit_profile"
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerTitleAlign: "center",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="all_personal_recipes"
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: colors.greyscale75 },
          contentStyle: { backgroundColor: colors.greyscale150 },
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="all_favorite_recipes"
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: colors.greyscale75 },
          contentStyle: { backgroundColor: colors.greyscale150 },
          gestureEnabled: false,
        }}
      />
    </Stack>
  ) : (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <LottieView
        autoPlay
        style={{ height: 100, width }}
        source={require("../../assets/gifs/Animation - 1730897212963.json")}
      />
    </View>
  );
};

const Layout = () => {
  let [fontsLoaded] = useFonts(fontsToLoad);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <ActionSheetProvider>
          <BottomSheetModalProvider>
            <ClerkProvider
              publishableKey={clerkKey!}
              tokenCache={tokenCache as any}
            >
              <AppLayout />
            </ClerkProvider>
          </BottomSheetModalProvider>
        </ActionSheetProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default Layout;

const styles = StyleSheet.create({
  $stackContainerStyle: { backgroundColor: colors.neutral100 },
});
