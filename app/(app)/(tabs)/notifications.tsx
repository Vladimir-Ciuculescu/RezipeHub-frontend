import { Text, StyleSheet, View } from "react-native";
import React from "react";
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

interface Contact {
  firstName: string;
  lastName: string;
}

interface Section {
  title: string;
  data: Contact[];
}

const Notifications = () => {
  const user = useUserData();
  const isFocused = useIsFocused();

  const {
    data: notifications,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["all-notifications"],
    queryFn: NotificationService.getNotifications,
    initialPageParam: { page: 0, userId: user.id },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      return !lastPage || !lastPage.length
        ? undefined
        : { ...lastPageParam, page: lastPageParam.page + 1 };
    },
  });

  console.log(222, notifications);

  const contacts: (string | Contact)[] = [
    "Today",
    { firstName: "John", lastName: "Aaron" },
    { firstName: "Alice", lastName: "Anderson" },
    { firstName: "Adam", lastName: "Avery" },
    "Yesterday",
    { firstName: "Bob", lastName: "Baker" },
    { firstName: "Bill", lastName: "Brown" },
    { firstName: "Betty", lastName: "Barnes" },
    "Last Monday",
    { firstName: "Chris", lastName: "Cooper" },
    { firstName: "Carol", lastName: "Clark" },
    { firstName: "Charles", lastName: "Campbell" },
    "Last Tuesday",
    { firstName: "David", lastName: "Davis" },
    { firstName: "Daniel", lastName: "Diaz" },
    { firstName: "Diana", lastName: "Dixon" },
    "Last Wednesday",
    { firstName: "Emily", lastName: "Evans" },
    { firstName: "Edward", lastName: "Ellis" },
    "Last Thursday",
    { firstName: "Frank", lastName: "Foster" },
    { firstName: "Fred", lastName: "Fisher" },
    "Last Friday",
    { firstName: "George", lastName: "Garcia" },
    { firstName: "Grace", lastName: "Green" },
    "Last Saturday",
    { firstName: "Henry", lastName: "Harris" },
    { firstName: "Helen", lastName: "Hall" },
    "Last Sunday",
    { firstName: "Michael", lastName: "Miller" },
    { firstName: "Mary", lastName: "Martinez" },
    "2 Weeks Ago",
    { firstName: "Sarah", lastName: "Smith" },
    { firstName: "Steve", lastName: "Scott" },
    "Last Month",
    { firstName: "William", lastName: "Wilson" },
    { firstName: "Walter", lastName: "White" },
  ];

  const ContactsFlashList = () => {
    return (
      <FlashList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: verticalScale(100),
        }}
        ItemSeparatorComponent={() => <View style={{ height: spacing.spacing16 }} />}
        data={contacts}
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
                <NotificationItem />
              </RNFadeInTransition>
            );
          }
        }}
        getItemType={(item) => {
          // To achieve better performance, specify the type based on the item
          return typeof item === "string" ? "sectionHeader" : "row";
        }}
        estimatedItemSize={100}
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
        <View style={{ flex: 1, paddingTop: verticalScale(spacing.spacing24) }}>
          <ContactsFlashList />
        </View>
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
});
