// if (__DEV__) {
//   require("../ReactotronConfig");
// }

import React, { useEffect } from "react";
import { LogBox, StyleSheet } from "react-native";
import { colors } from "@/theme/colors";
import { useFonts } from "expo-font";
import { fontsToLoad } from "@/theme/typography";
import { Stack } from "expo-router/stack";
import { ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";

import { ACCESS_TOKEN, IS_LOGGED_IN, ONBOARDED, storage } from "@/storage";
import { jwtDecode } from "jwt-decode";
import { CurrentUser } from "@/types/user.types";
import UserService from "@/api/services/user.service";
import useUserStore from "@/zustand/useUserStore";
import TokenService from "@/api/services/token.service";

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
const queryClient = new QueryClient();

const AppLayout = () => {
  const router = useRouter();
  const setUser = useUserStore.use.setUser();

  const isLoggedIn = storage.getBoolean(IS_LOGGED_IN);
  const onboarded = storage.getBoolean(ONBOARDED);

  useEffect(() => {
    if (!onboarded) {
      router.replace("onboarding");
      return;
    }

    if (!isLoggedIn || isLoggedIn === undefined) {
      router.replace("home");
    } else {
      (async () => {
        await getProfile();
      })();
    }
  }, []);

  const getProfile = async () => {
    const accessToken = storage.getString(ACCESS_TOKEN);

    const userData = jwtDecode(accessToken!) as CurrentUser;

    const newAccessToken = await UserService.getProfile(userData.id);

    const newUserData = jwtDecode(newAccessToken) as CurrentUser;

    setUser(newUserData);

    if (newUserData.isVerified) {
      router.replace("(tabs)");
    } else {
      const payload = { userId: newUserData.id, email: newUserData.email as string };
      await TokenService.resendToken(payload);
      router.replace({
        pathname: "otp_verification",
        params: { userId: newUserData.id, email: newUserData.email },
      });
    }
  };

  return (
    <Stack screenOptions={{ contentStyle: styles.$stackContainerStyle }}>
      <Stack.Screen
        options={{ headerShown: false, gestureEnabled: false }}
        name="index"
      />
      <Stack.Screen
        options={{ headerShown: false, gestureEnabled: false, animation: "fade" }}
        name="onboarding"
      />
      <Stack.Screen
        options={{ headerShown: false, gestureEnabled: false, animation: "fade" }}
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
          animation: "fade",
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
          animation: "fade",
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
