import React, { useEffect } from "react";
import {
  Alert,
  Appearance,
  AppState,
  AppStateStatus,
  BackHandler,
  Platform,
  StyleSheet,
} from "react-native";
import { colors } from "@/theme/colors";
import { useFonts } from "expo-font";
import { fontsToLoad } from "@/theme/typography";
import { Stack } from "expo-router/stack";
import { ClerkProvider } from "@clerk/clerk-expo";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { ACCESS_TOKEN, ONBOARDED, storage } from "@/storage";
import TokenService from "@/api/services/token.service";
import { NotificationProvider } from "@/context/NotificationContext";
import * as Notifications from "expo-notifications";
import Purchases from "react-native-purchases";
import { useCurrentUser, UserProvider } from "@/context/UserContext";
import * as SplashScreen from "expo-splash-screen";

Purchases.setLogLevel(Purchases.LOG_LEVEL.VERBOSE);

SplashScreen.preventAutoHideAsync();

Appearance.setColorScheme("light");

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// const tokenCache = {
//   getToken(key: string) {
//     try {
//       return SecureStore.getItemAsync(key);
//     } catch (err) {
//       return null;
//     }
//   },
//   saveToken(key: string, value: string) {
//     try {
//       return SecureStore.setItemAsync(key, value);
//     } catch (err) {
//       return null;
//     }
//   },
// };

const clerkKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const queryClient = new QueryClient();

const AppLayout = () => {
  const [fontsLoaded, error] = useFonts(fontsToLoad);
  const { user, mounted, serverHealth } = useCurrentUser();

  const router = useRouter();
  const invalidateQueryClient = useQueryClient();

  const onboarded = storage.getBoolean(ONBOARDED);
  const accessToken = storage.getString(ACCESS_TOKEN);

  useEffect(() => {
    //TODO : Configure revenuecat subscriber idr
    const checkOnboarding = async () => {
      if (serverHealth) {
        if (!onboarded) {
          router.replace("/onboarding");
          await SplashScreen.hideAsync();
          return;
        }

        if (!accessToken) {
          router.replace("/home");
          await SplashScreen.hideAsync();
          return;
        }
        if (user) {
          if (user.isVerified) {
            router.replace("/(tabs)");
            await SplashScreen.hideAsync();
            return;
          } else {
            const payload = { userId: user.id, email: user.email as string };
            await TokenService.resendToken(payload);

            router.replace({
              pathname: "/otp_verification",
              params: { userId: user.id, email: user.email },
            });
            await SplashScreen.hideAsync();
            return;
          }
        }
      } else {
        await SplashScreen.hideAsync();
        return;
      }
    };

    if (mounted && fontsLoaded) {
      checkOnboarding();
    }
  }, [mounted, fontsLoaded]);

  useEffect(() => {
    const configurePurchases = () => {
      if (Platform.OS === "ios") {
        if (!process.env.EXPO_PUBLIC_RC_IOS) {
          Alert.alert("Error configuring RC", "RevenueCat API key not provided");
        } else {
          Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_RC_IOS });
        }
      } else if (Platform.OS === "android") {
        if (!process.env.EXPO_PUBLIC_RC_ANDROID) {
          Alert.alert("Error configuring RC", "RevenueCat API key not provided");
        } else {
          Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_RC_ANDROID });
        }
      }
    };

    configurePurchases();

    const appStateSubscription = AppState.addEventListener(
      "change",
      async (nextAppState: AppStateStatus) => {
        const appBadgeCount = await Notifications.getBadgeCountAsync();

        if (nextAppState === "active" && appBadgeCount > 0) {
          invalidateQueryClient.invalidateQueries({ queryKey: ["all-notifications"] });
        }
      },
    );

    // * Disable hardware back press from android bottom bar devices
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      return true;
    });

    return () => {
      backHandler.remove();
      appStateSubscription.remove();
    };
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ contentStyle: styles.$stackContainerStyle }}>
      <Stack.Screen
        options={{ headerShown: false, gestureEnabled: false }}
        name="index"
      />
      <Stack.Screen
        name="all_latest_recipes"
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: colors.greyscale150 },
          contentStyle: { backgroundColor: colors.greyscale150 },
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="all_most_popular_recipes"
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: colors.greyscale150 },
          contentStyle: { backgroundColor: colors.greyscale150 },
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="all_by_category_recipes"
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: colors.greyscale150 },
          contentStyle: { backgroundColor: colors.greyscale150 },
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: false,
          animation: "fade",
        }}
        name="onboarding"
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

      <Stack.Screen
        name="settings"
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
        name="about"
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: colors.greyscale75 },
          contentStyle: { backgroundColor: colors.greyscale75 },

          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="contact"
        options={{
          headerBackVisible: false,
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: colors.greyscale75 },
          contentStyle: { backgroundColor: colors.greyscale75 },
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
};

const Layout = () => {
  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <ActionSheetProvider>
          <BottomSheetModalProvider>
            <ClerkProvider
              publishableKey={clerkKey!}
              // tokenCache={tokenCache as any}
            >
              <UserProvider>
                <NotificationProvider>
                  <AppLayout />
                </NotificationProvider>
              </UserProvider>
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
