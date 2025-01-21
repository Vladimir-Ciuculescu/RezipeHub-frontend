import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/scale";
import RNIcon from "@/components/shared/RNIcon";
import RNPressable from "@/components/shared/RNPressable";
import { $sizeStyles } from "@/theme/typography";
import { colors } from "@/theme/colors";
import RNShadowView from "@/components/shared/RNShadowView";
import { spacing } from "@/theme/spacing";
import { Switch } from "react-native-ui-lib";
import RNButton from "@/components/shared/RNButton";
import { NOTIFICATIONS, storage } from "@/storage";
import { useNotification } from "@/context/NotificationContext";
import NotificationService from "@/api/services/notifications.service";

interface NotificationItemProps {
  label: string;
  icon: string;
  rightElement?: React.ReactNode;
  onPress: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  label,
  icon,
  rightElement,
  onPress,
}) => {
  return (
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
          <RNButton
            style={styles.$arrowBtnStyle}
            onPress={onPress}
            iconSource={() => (
              <RNIcon
                name="arrow_right"
                color={colors.greyscale50}
                height={moderateScale(14)}
                width={moderateScale(14)}
              />
            )}
          />
        )}
      </View>
    </RNShadowView>
  );
};

const Settings = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const { expoPushToken } = useNotification();

  const notificationsPermissions = storage.getBoolean(NOTIFICATIONS);

  const [notifications, toggleNotifications] = useState(notificationsPermissions ? true : false);

  const toggleSystemNotifications = async () => {
    toggleNotifications((oldValue) => !oldValue);

    await NotificationService.toggleDeviceNotifications(expoPushToken!);
  };

  const goToSection = (section: string) => {
    router.navigate(section);
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
    {
      label: "Rate",
      icon: "rate",
      onPress: () => {},
    },
    {
      label: "Unlock Premium",
      icon: "diamond",
      onPress: () => {},
    },
    {
      label: "Log out",
      icon: "logout",
      onPress: () => {},
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
        <NotificationItem
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
