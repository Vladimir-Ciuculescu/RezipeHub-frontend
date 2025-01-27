import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/scale";
import RNIcon from "@/components/shared/RNIcon";
import RNPressable from "@/components/shared/RNPressable";
import { $sizeStyles } from "@/theme/typography";
import { colors } from "@/theme/colors";
import RNShadowView from "@/components/shared/RNShadowView";
import { spacing } from "@/theme/spacing";
import { Switch } from "react-native-ui-lib";
import { ACCESS_TOKEN, IS_LOGGED_IN, NOTIFICATIONS, storage } from "@/storage";
import { useNotification } from "@/context/NotificationContext";
import NotificationService from "@/api/services/notifications.service";
import Purchases from "react-native-purchases";
import { useAuth } from "@clerk/clerk-expo";
import useUserStore from "@/zustand/useUserStore";
import RevenueCatUI from "react-native-purchases-ui";
import * as Linking from "expo-linking";
import AuthService from "@/api/services/auth.service";

interface NotificationItemProps {
  label: string;
  icon: string;
  rightElement?: React.ReactNode;
  onPress: () => void;
}

const SettingsItem: React.FC<NotificationItemProps> = ({ label, icon, rightElement, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <RNShadowView>
        <View style={styles.$settingsItemContainerStyle}>
          <View style={styles.$settingsLabelContainerStyle}>
            <View>
              <RNIcon
                name={icon}
                color={colors.accent300}
                height={verticalScale(24)}
                width={verticalScale(24)}
              />
            </View>
            <Text style={styles.$settingsLabelStyle}>{label}</Text>
          </View>

          {rightElement || (
            <View style={styles.$arrowBtnStyle}>
              <RNIcon
                name="arrow_right"
                color={colors.greyscale50}
                height={moderateScale(14)}
                width={moderateScale(14)}
              />
            </View>
          )}
        </View>
      </RNShadowView>
    </TouchableOpacity>
  );
};

const Settings = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { signOut } = useAuth();
  const setLoggedStatus = useUserStore.use.setLoggedStatus();
  const { id } = useUserStore.use.user();

  const { expoPushToken } = useNotification();

  const notificationsPermissions = storage.getBoolean(NOTIFICATIONS);

  const [notifications, toggleNotifications] = useState(notificationsPermissions ? true : false);
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    Purchases.addCustomerInfoUpdateListener((info) => {
      const hasPro = info.entitlements.active["Pro"];

      setHasSubscription(!!hasPro);
    });

    //* Initial check
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const getCustomerInfo = await Purchases.getCustomerInfo();
      const hasPro = getCustomerInfo.entitlements.active["Pro"];

      setHasSubscription(!!hasPro);
    } catch (error) {
      console.log("Error checking the subscription:", error);
    }
  };

  const toggleSystemNotifications = async () => {
    toggleNotifications((oldValue) => !oldValue);

    await NotificationService.toggleDeviceNotifications(expoPushToken!);
  };

  const goToSection = (section: string) => {
    router.navigate(section);
  };

  const unlockPremium = async () => {
    await RevenueCatUI.presentPaywallIfNeeded({ requiredEntitlementIdentifier: "Pro" });
  };

  const logOut = async () => {
    storage.delete(ACCESS_TOKEN);
    storage.delete(IS_LOGGED_IN);
    setLoggedStatus(false);
    router.replace("home");

    //* Delete refresh token from BE
    await AuthService.logOut(id);

    //* Log out from clerk
    await signOut();

    //* Log out associated customer from RevenueCat
    await Purchases.logOut();
  };

  const handleManageSubscription = async () => {
    try {
      // Get management URL from RevenueCat
      const info = await Purchases.getCustomerInfo();

      if (info.managementURL) {
        // Open subscription management in browser/settings
        await Linking.openURL(info.managementURL);
      } else {
        // Fallback for different stores
        if (Platform.OS === "ios") {
          await Linking.openURL("itms-apps://apps.apple.com/account/subscriptions");
        } else {
          await Linking.openURL("https://play.google.com/store/account/subscriptions");
        }
      }
    } catch (error) {
      console.error("Error managing subscription:", error);
    }
  };

  const ITEMS = [
    {
      label: "Notifications",
      icon: "notification",
      rightElement: (
        <View style={styles.$settingsRightElementStyle}>
          <Text>On</Text>
          <Switch
            onColor={colors.accent300}
            value={notifications}
            onValueChange={toggleSystemNotifications}
          />
        </View>
      ),
    },
    {
      label: "About the app",
      icon: "info_square",
      onPress: () => goToSection("about"),
    },
    {
      label: "Contact",
      icon: "profile",
      onPress: () => goToSection("contact"),
    },
    //TODO: This will need to be added back when app is actually deployed
    // {
    //   label: "Rate",
    //   icon: "rate",
    //   onPress: () => {},
    // },
    ...(!hasSubscription
      ? [
          {
            label: "Unlock Premium",
            icon: "diamond",
            onPress: unlockPremium,
          },
        ]
      : []),
    ...(hasSubscription
      ? [
          {
            label: "Manage subscription",
            icon: "diamond",
            onPress: handleManageSubscription,
          },
        ]
      : []),

    {
      label: "Log out",
      icon: "logout",
      onPress: logOut,
    },
  ];

  const goBack = () => {
    router.back();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <RNPressable onPress={goBack}>
          <RNIcon
            name="arrow_left"
            height={moderateScale(20)}
            width={moderateScale(20)}
          />
        </RNPressable>
      ),
      headerTitle: () => <Text style={{ ...$sizeStyles.h2 }}>Settings</Text>,
    });
  }, [navigation]);

  return (
    <ScrollView
      style={styles.$containerStyle}
      contentContainerStyle={styles.$contentContainerStyle}
      showsVerticalScrollIndicator={false}
    >
      {ITEMS.map((item, index) => (
        <SettingsItem
          key={index}
          label={item.label}
          icon={item.icon}
          rightElement={item.rightElement}
          onPress={item.onPress}
        />
      ))}
    </ScrollView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  $containerStyle: {
    flex: 1,
    backgroundColor: colors.greyscale75,
    paddingHorizontal: spacing.spacing16,
    paddingTop: spacing.spacing48,
  },

  $contentContainerStyle: {
    gap: verticalScale(spacing.spacing16),
  },

  $arrowBtnStyle: {
    backgroundColor: colors.brandPrimary,
    height: horizontalScale(28),
    width: horizontalScale(28),
    borderRadius: spacing.spacing8,
    justifyContent: "center",
    alignItems: "center",
  },

  //? Settings item

  $settingsItemContainerStyle: {
    height: verticalScale(64),
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(16),
  },

  $settingsLabelContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(spacing.spacing8),
  },

  $settingsLabelStyle: {
    ...$sizeStyles.n,
    fontFamily: "sofia800",
  },

  $settingsRightElementStyle: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(spacing.spacing12),
  },
});
