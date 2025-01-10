import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { spacing } from "@/theme/spacing";
import { colors } from "@/theme/colors";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/scale";
import RNShadowView from "./shared/RNShadowView";
import RNIcon from "./shared/RNIcon";
import { $sizeStyles } from "@/theme/typography";
import { Notification } from "@/types/notification.types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { id, body, title, createdAt } = notification;

  const getRelativeTime = (timestamp: Date) => {
    const now = dayjs();
    const date = dayjs(timestamp);
    const diffInMinutes = now.diff(date, "minute");
    const diffInHours = now.diff(date, "hour");
    const diffInDays = now.diff(date, "day");
    const diffInWeeks = now.diff(date, "week");
    const diffInMonths = now.diff(date, "month");
    const diffInYears = now.diff(date, "year");

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d`;
    } else if (diffInWeeks < 4) {
      return `${diffInWeeks}w`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths}mo`;
    } else {
      return `${diffInYears}y`;
    }
  };

  return (
    <RNShadowView>
      <View style={styles.$containerStyle}>
        <View
          style={{ flexDirection: "row", alignItems: "center", gap: spacing.spacing8, flex: 1 }}
        >
          <View style={styles.$iconContainerStyle}>
            <RNIcon
              name="bowl"
              color={colors.accent200}
            />
          </View>

          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.$notificationTextStyle}
          >
            <Text style={[styles.$notificationTextStyle, { fontFamily: "sofia800" }]}>
              {title}{" "}
            </Text>
            {body}
          </Text>
        </View>
        <View
          style={{
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: verticalScale(spacing.spacing12),
          }}
        >
          <Text style={[{ marginLeft: spacing.spacing8 }, styles.$notificationTimeLapseStyle]}>
            {/* 2m ago */}
            {getRelativeTime(createdAt)}
          </Text>
          <View
            style={{
              height: horizontalScale(8),
              width: horizontalScale(8),
              borderRadius: 16,
              backgroundColor: colors.red400,
            }}
          />
        </View>
      </View>
    </RNShadowView>
  );
};

const styles = StyleSheet.create({
  $containerStyle: {
    height: moderateScale(80),
    width: "100%",
    borderRadius: spacing.spacing16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: horizontalScale(spacing.spacing16),
    justifyContent: "space-between",
  },

  $iconContainerStyle: {
    height: horizontalScale(48),
    width: horizontalScale(48),
    backgroundColor: colors.greyscale150,
    borderRadius: spacing.spacing8,
    justifyContent: "center",
    alignItems: "center",
  },

  $notificationTextStyle: {
    flex: 1,
    ...$sizeStyles.xs,
    fontFamily: "sofia400",
  },

  $notificationTimeLapseStyle: {
    ...$sizeStyles.xs,
    fontFamily: "sofia200",
  },
});

export default NotificationItem;
