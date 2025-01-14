import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: { allowAlert: true, allowBadge: true, allowSound: true },
      });
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      throw new Error("Permission not grantedto get push token for push notification !");
    }

    const projectId = Constants.expoConfig?.extra?.eas.projectId ?? Constants.easConfig?.projectId;

    if (!projectId) {
      throw new Error("Project ID not found");
    }

    try {
      const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

      return pushTokenString;
    } catch (error: any) {
      throw new Error(error);
    }
  } else {
    throw new Error("Must use a physical device for push notifications");
  }
}
