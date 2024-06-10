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
  );
}

const styles = StyleSheet.create({
  $stackContainerStyle: { backgroundColor: colors.neutral100 },
});
