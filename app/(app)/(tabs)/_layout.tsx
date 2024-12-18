import RNIcon from "@/components/shared/RNIcon";
import { ACCESS_TOKEN, storage } from "@/storage";
import { colors } from "@/theme/colors";
import useRecipeStore from "@/zustand/useRecipeStore";
import useUserStore from "@/zustand/useUserStore";
import { useAuth } from "@clerk/clerk-expo";
import { Tabs, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, Pressable, StyleSheet } from "react-native";

const TabLayout = () => {
  const router = useRouter();

  const reset = useRecipeStore.use.reset();
  const setUser = useUserStore.use.setUser();

  const openAddRecipeModal = () => {
    reset();
    router.navigate("add_recipe");
  };

  return (
    <>
      <StatusBar style="dark" />

      <Tabs
        sceneContainerStyle={{ backgroundColor: colors.greyscale75 }}
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: styles.$tabBarStyle,
          unmountOnBlur: true,
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
              <RNIcon name={focused ? "notification_focused" : "notification"} />
            ),
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
