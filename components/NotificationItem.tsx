import { View, Text, StyleSheet, Pressable, Alert, Linking, TouchableOpacity } from "react-native";
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
import NotificationService from "@/api/services/notifications.service";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/context/UserContext";

dayjs.extend(relativeTime);

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { id, body, title, timestamp, data, read } = notification;
  const router = useRouter();
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const goToRecipeScreen = async () => {
    router.navigate({
      pathname: "/recipe_details",
      params: {
        recipePhotoUrl: data.recipePhotoUrl,
        id: data.recipeId,
        userId: user.id,
      },
    });

    await NotificationService.markAsReadNotification(id);

    queryClient.invalidateQueries({ queryKey: ["all-notifications"] });
  };

  return (
    <TouchableOpacity onPress={goToRecipeScreen}>
      <RNShadowView style={read ? {} : { backgroundColor: colors.accent100 }}>
        <View style={styles.$containerStyle}>
          <View
            style={{ flexDirection: "row", alignItems: "center", gap: spacing.spacing8, flex: 1 }}
          >
            {data && data.recipePhotoUrl ? (
              <Image
                transition={300}
                contentFit="fill"
                source={{ uri: data.recipePhotoUrl }}
                style={styles.$iconContainerStyle}
              />
            ) : (
              <View style={styles.$iconContainerStyle}>
                <RNIcon
                  name="bowl"
                  color={colors.accent200}
                />
              </View>
            )}

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
              height: "100%",
              paddingVertical: verticalScale(spacing.spacing16),
            }}
          >
            <Text style={[{ marginLeft: spacing.spacing8 }, styles.$notificationTimeLapseStyle]}>
              {timestamp}
            </Text>
            {!read && (
              <View
                style={{
                  height: horizontalScale(8),
                  width: horizontalScale(8),
                  borderRadius: 16,
                  backgroundColor: colors.red400,
                }}
              />
            )}
          </View>
        </View>
      </RNShadowView>
    </TouchableOpacity>
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
