import RNIcon from "@/components/shared/RNIcon";
import { colors } from "@/theme/colors";
import useRecipeStore from "@/zustand/useRecipeStore";
import { Tabs, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet } from "react-native";
import * as Notifications from "expo-notifications";
import { useNotification } from "@/context/NotificationContext";
import NotificationService from "@/api/services/notifications.service";
import { checkSubscription } from "@/utils/checkSubscription";
import RecipeService from "@/api/services/recipe.service";
import { useCurrentUser } from "@/context/UserContext";

const TabLayout = () => {
  const router = useRouter();

  const reset = useRecipeStore.use.reset();
  const { user } = useCurrentUser();

  const [badgeCount, setBadgeCount] = useState(0);

  const { expoPushToken } = useNotification();

  const openAddRecipeModal = async () => {
    //TODO: Comment it just for testing

    const recipes = await RecipeService.getRecipesByUser({ limit: 5, page: 0, userId: user.id });

    if (recipes && recipes.length === 3) {
      const hasSubscription = await checkSubscription();

      if (!hasSubscription) {
        return;
      }
    }

    reset();
    router.navigate("/add_recipe");
  };

  useEffect(() => {
    const updateBadgeCount = async () => {
      const appBadgeCount = await Notifications.getBadgeCountAsync();
      setBadgeCount(appBadgeCount);
    };

    updateBadgeCount();

    const interval = setInterval(updateBadgeCount, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <StatusBar style="dark" />

      <Tabs
        sceneContainerStyle={{ backgroundColor: colors.greyscale75 }}
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: styles.$tabBarStyle,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => <RNIcon name={focused ? "home_focused" : "home"} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <RNIcon
                color={colors.greyscale300}
                name={focused ? "search_focused" : "search"}
              />
            ),
            headerShadowVisible: false,
          }}
        />
        <Tabs.Screen
          name="no_screen"
          options={{
            headerShown: false,
            tabBarIcon: () => (
              <Pressable
                onPress={openAddRecipeModal}
                style={styles.$addRecipeBtnStyle}
              >
                <RNIcon
                  name="chef"
                  color={colors.greyscale50}
                />
              </Pressable>
            ),
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <RNIcon
                name={focused ? "notification_focused" : "notification"}
                color={colors.greyscale300}
              />
            ),
            tabBarBadge: badgeCount || undefined,
          }}
          listeners={{
            tabPress: async () => {
              await Notifications.setBadgeCountAsync(0);

              if (expoPushToken && badgeCount > 0) {
                await NotificationService.resetBadgeCountNotification(expoPushToken);
              }
            },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <RNIcon
                name={focused ? "profile_focused" : "profile"}
                color={colors.greyscale300}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabLayout;

const styles = StyleSheet.create({
  $tabBarStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    height: Platform.OS === "ios" ? 83 : 63,
    paddingTop: Platform.OS === "ios" ? 10 : 0,
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5, // Shadow for Android
    // shadowColor: "rgba(6, 51, 54, 1)", // Use solid color here for shadowColor
    // shadowOffset: { width: 0, height: 2 }, // Corresponds to "0px 2px"
    // shadowOpacity: 0.1, // Corresponds to the alpha of rgba (0.10)
    // shadowRadius: 16, // Corresponds to the blur radius "16px"
    // elevation: 5, // Android shadow approximation (elevation creates shadow)
  },

  $addRecipeBtnStyle: {
    width: 66,
    height: 66,
    backgroundColor: colors.brandPrimary,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
    borderWidth: 5,
    borderStyle: "solid",
    borderColor: "transparent",
  },
});
