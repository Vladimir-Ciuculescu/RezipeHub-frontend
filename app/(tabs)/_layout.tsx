import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function TabLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            title: "Homeee",
            tabBarIcon: ({ color }) => (
              <FontAwesome
                size={28}
                name="home"
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,

            title: "Settings",
            tabBarIcon: ({ color }) => (
              <FontAwesome
                size={28}
                name="cog"
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
