import RNIcon from "@/components/shared/RNIcon";
import { colors } from "@/theme/colors";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";

export default function TabLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "blue",
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
            tabBarIcon: ({ focused }) => <RNIcon name={focused ? "search_focused" : "search"} />,
          }}
        />
        <Tabs.Screen
          name="no_screen"
          options={{
            headerShown: false,
            tabBarIcon: () => (
              <TouchableOpacity style={styles.$addRecipeBtnStyle}>
                <RNIcon
                  name="chef"
                  color={colors.greyscale50}
                />
              </TouchableOpacity>
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
}

const styles = StyleSheet.create({
  $tabBarStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    position: "absolute",
    height: Platform.OS === "ios" ? 83 : 63,
    paddingTop: Platform.OS === "ios" ? 10 : 0,
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
