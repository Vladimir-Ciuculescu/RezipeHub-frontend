if (__DEV__) {
  require("../ReactotronConfig");
}

import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useRootNavigationState, useRouter } from "expo-router";
import { colors } from "@/theme/colors";
import { useFonts } from "expo-font";
import { fontsToLoad } from "@/theme/typography";
import { ACCESS_TOKEN, ONBOARDED, storage } from "@/storage";
import { Stack } from "expo-router/stack";
import * as SplashScreen from "expo-splash-screen";
import { ClerkProvider } from "@clerk/clerk-expo";

import * as SecureStore from "expo-secure-store";
import { Text } from "react-native-ui-lib";

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

export default function Layout() {
  const rootNavigationState = useRootNavigationState();
  const [initialRouterName, setInitialRouteName] = useState<string>("");
  const navigatorReady = rootNavigationState?.key != null;

  const router = useRouter();

  let [fontsLoaded] = useFonts(fontsToLoad);

  useEffect(() => {
    const determineRoute = () => {
      const onboarded = storage.getBoolean(ONBOARDED);
      const user = storage.getString(ACCESS_TOKEN);

      if (!onboarded) {
        setInitialRouteName("index");
      } else if (user) {
        setInitialRouteName("(tabs)");
      } else {
        setInitialRouteName("home");
      }
    };

    determineRoute();
  }, []);

  useEffect(() => {
    if (navigatorReady && initialRouterName) {
      router.replace(initialRouterName);
    }
  }, [navigatorReady, initialRouterName]);

  if (!fontsLoaded) return null;

  return (
    <ClerkProvider
      publishableKey={clerkKey!}
      // tokenCache={tokenCache as any}
    >
      <Stack screenOptions={{ contentStyle: styles.$stackContainerStyle }}>
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
          name="otp_verification"
          options={{
            headerBackVisible: false,
            headerShadowVisible: false,
            headerTitleAlign: "center",
          }}
        />
      </Stack>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  $stackContainerStyle: { backgroundColor: colors.neutral100 },
});
