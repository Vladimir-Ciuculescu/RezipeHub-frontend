import { Text, StyleSheet, View, Dimensions, ActivityIndicator } from "react-native";
import React, { useMemo } from "react";
import RNFadeInView from "@/components/shared/RNFadeInView";
import { $sizeStyles } from "@/theme/typography";
import { SafeAreaView } from "react-native-safe-area-context";
import { horizontalScale, verticalScale } from "@/utils/scale";
import { spacing } from "@/theme/spacing";
import { FlashList } from "@shopify/flash-list";
import NotificationItem from "@/components/NotificationItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import NotificationService from "@/api/services/notifications.service";
import useUserData from "@/hooks/useUserData";
import RNFadeInTransition from "@/components/shared/RNFadeinTransition";
import { useIsFocused } from "@react-navigation/native";
import { No_notificatins } from "@/assets/illustrations";
import { colors } from "@/theme/colors";
import { Notification } from "@/types/notification.types";
import dayjs from "dayjs";

interface Contact {
  firstName: string;
  lastName: string;
}

const { width, height } = Dimensions.get("screen");

const Notifications = () => {
  const user = useUserData();
  const isFocused = useIsFocused();

  const {
    data: notifications,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["all-notifications", user.id],
    queryFn: NotificationService.getNotifications,
    initialPageParam: { page: 0, userId: user.id },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      return !lastPage || !lastPage.length
        ? undefined
        : { ...lastPageParam, page: lastPageParam.page + 1 };
    },
  });

  const formatNotificationList = (notifications: Notification[]): any[] => {
    const formattedList: any[] = [];
    let currentSection = "";

    notifications.forEach((notification) => {
      const date = dayjs(notification.createdAt);
      const now = dayjs();
      const diffInDays = now.diff(date, "day");
      const diffInWeeks = now.diff(date, "week");
      const diffInMonths = now.diff(date, "month");

      let section = "";

      if (diffInDays === 0) {
        section = "Today";
      } else if (diffInDays === 1) {
        section = "Yesterday";
      } else if (diffInDays < 7) {
        section = "This Week";
      } else if (diffInDays < 14) {
        section = "Last Week";
      } else if (diffInWeeks < 4) {
        section = `${diffInWeeks} Weeks Ago`;
      } else if (diffInMonths === 1) {
        section = "Last Month";
      } else if (diffInMonths > 1) {
        section = `${diffInMonths} Months Ago`;
      }

      // Add section header if we're entering a new section
      if (section !== currentSection) {
        formattedList.push(section);
        currentSection = section;
      }

      formattedList.push(notification);
    });

    return formattedList;
  };

  const getNotifications = useMemo(() => {
    if (notifications && notifications.pages) {
      const allNotifications = notifications.pages.flatMap((notification) => notification);

      return allNotifications;
    }

    return [];
  }, [notifications]);

  const loadNextPage = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  console.log(formatNotificationList(getNotifications));

  const NotificationsFlashList = () => {
    return (
      <FlashList
        keyExtractor={(item: Notification | string) =>
          typeof item === "string" ? item : item.id.toString()
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: verticalScale(100),
        }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.spacing16 }} />}
        data={formatNotificationList(getNotifications)}
        renderItem={({ item, index }) => {
          if (typeof item === "string") {
            // Rendering header
            return (
              <RNFadeInTransition
                index={2 + (index + 0.25)}
                animate={isFocused}
                direction="top"
                key={`notification-event-${index}`}
              >
                <Text style={styles.$sectionTitleStyle}>{item}</Text>
              </RNFadeInTransition>
            );
          } else {
            return (
              <RNFadeInTransition
                index={2 + (index + 0.25)}
                animate={isFocused}
                direction="top"
                key={`notification-event-${index}`}
              >
                <NotificationItem notification={item} />
              </RNFadeInTransition>
            );
          }
        }}
        getItemType={(item) => {
          // To achieve better performance, specify the type based on the item
          return typeof item === "string" ? "sectionHeader" : "row";
        }}
        estimatedItemSize={100}
        onEndReached={loadNextPage}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator
              size="large"
              color={colors.brandPrimary}
            />
          ) : null
        }
      />
    );
  };

  return (
    <RNFadeInView>
      <SafeAreaView style={styles.$safeAreaViewContainerStyle}>
        <RNFadeInTransition
          index={1}
          animate={isFocused}
          direction="top"
        >
          <Text style={{ ...$sizeStyles.h2 }}>Notifications</Text>
        </RNFadeInTransition>

        {getNotifications && getNotifications.length ? (
          <View style={{ flex: 1, paddingTop: verticalScale(spacing.spacing24) }}>
            <NotificationsFlashList />
          </View>
        ) : (
          <View style={styles.$noResultsContainerStyle}>
            <No_notificatins
              height={height / 3}
              width={width}
            />
            <Text style={styles.$noResultsTextStyle}>No notifications yet </Text>
          </View>
        )}
      </SafeAreaView>
    </RNFadeInView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  $safeAreaViewContainerStyle: {
    flex: 1,
    paddingHorizontal: horizontalScale(spacing.spacing24),
  },

  $sectionTitleStyle: {
    ...$sizeStyles.l,
    fontFamily: "sofia800",
  },
  $noResultsContainerStyle: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.spacing12,
  },
  $noResultsTextStyle: {
    color: colors.slate900,
    ...$sizeStyles.h2,
  },
});
