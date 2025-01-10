import { Text, StyleSheet, View, Dimensions, ActivityIndicator, FlatList } from "react-native";
import React, { useMemo } from "react";
import { $sizeStyles } from "@/theme/typography";
import { SafeAreaView } from "react-native-safe-area-context";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/scale";
import { spacing } from "@/theme/spacing";
import NotificationItem from "@/components/NotificationItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import NotificationService from "@/api/services/notifications.service";
import useUserData from "@/hooks/useUserData";
import { No_results } from "@/assets/illustrations";
import { colors } from "@/theme/colors";
import { Notification } from "@/types/notification.types";
import dayjs from "dayjs";
import { Skeleton } from "moti/skeleton";

const { width, height } = Dimensions.get("screen");

const Notifications = () => {
  const user = useUserData();

  const {
    data: notifications,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery({
    queryKey: ["all-notifications", user.id],
    queryFn: NotificationService.getNotifications,
    initialPageParam: { page: 0, userId: user.id },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      return !lastPage || !lastPage.length
        ? undefined
        : { ...lastPageParam, page: lastPageParam.page + 1 };
    },
    // refetchInterval: 5000,
  });

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

  const formattedNotificationsList = () => {
    const formattedList: any[] = [];
    let currentSection = "";

    notifications?.pages
      .flatMap((page) =>
        page.map((notification: Notification) => ({
          ...notification,
          timestamp: getRelativeTime(notification.createdAt),
        })),
      )
      .forEach((notification) => {
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

  return (
    <SafeAreaView style={styles.$safeAreaViewContainerStyle}>
      <Text style={{ ...$sizeStyles.h2 }}>Notifications</Text>

      {isLoading ? (
        <View
          style={{
            gap: spacing.spacing16,

            paddingTop: verticalScale(spacing.spacing24),
          }}
        >
          {Array(8)
            .fill(null)
            .map((_: number, key: number) => (
              <Skeleton
                key={key}
                colorMode="light"
                width="100%"
                height={moderateScale(80)}
              />
            ))}
        </View>
      ) : getNotifications && getNotifications.length ? (
        <View style={{ flex: 1, paddingTop: verticalScale(spacing.spacing24) }}>
          <FlatList
            keyExtractor={(item) => (typeof item === "string" ? item : item.id.toString())}
            contentContainerStyle={{
              paddingBottom: verticalScale(100),
            }}
            ItemSeparatorComponent={() => <View style={{ height: spacing.spacing16 }} />}
            data={formattedNotificationsList()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              if (typeof item === "string") {
                return <Text style={styles.$sectionTitleStyle}>{item}</Text>;
              } else {
                return <NotificationItem notification={item} />;
              }
            }}
            onEndReached={loadNextPage}
            onEndReachedThreshold={8}
            ListFooterComponent={
              isFetchingNextPage && !hasPreviousPage ? (
                <ActivityIndicator
                  color={colors.brandPrimary}
                  size="large"
                />
              ) : null
            }
            ListFooterComponentStyle={{
              paddingTop: spacing.spacing24,
            }}
          />
        </View>
      ) : (
        <View
          style={{
            alignItems: "center",
            paddingTop: spacing.spacing64,
            gap: spacing.spacing48,
          }}
        >
          <No_results
            height={height / 3}
            width={width}
          />

          <Text style={{ color: colors.slate900, ...$sizeStyles.h2 }}>
            Oops, no results found ...{" "}
          </Text>
        </View>
      )}
    </SafeAreaView>
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
