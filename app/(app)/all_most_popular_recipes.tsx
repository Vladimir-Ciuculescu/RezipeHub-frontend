import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useLayoutEffect, useMemo } from "react";
import { Link, useNavigation, useRouter } from "expo-router";
import RNIcon from "@/components/shared/RNIcon";
import { $sizeStyles } from "@/theme/typography";
import { useInfiniteQuery } from "@tanstack/react-query";
import RecipeService from "@/api/services/recipe.service";
import useUserData from "@/hooks/useUserData";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/colors";
import RNShadowView from "@/components/shared/RNShadowView";
import { Image } from "expo-image";
import { Feather, Ionicons } from "@expo/vector-icons";
import { spacing } from "@/theme/spacing";
import RNPressable from "@/components/shared/RNPressable";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/scale";
import { No_results } from "@/assets/illustrations";
import { FlashList } from "@shopify/flash-list";
import RNFadeInTransition from "@/components/shared/RNFadeinTransition";
import { useIsFocused } from "@react-navigation/native";

const { width, height } = Dimensions.get("screen");

const GRID_CONTAINER_SIZE = width * 0.4;
const GRID_COLUMNS = 2;

const AllMostPopularRecipes = () => {
  const navigation = useNavigation();
  const user = useUserData();
  const isFocused = useIsFocused();

  const goBack = () => {
    navigation.goBack();
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
      headerTitle: () => <Text style={styles.$headerTitleStyle}>Most popular</Text>,
    });
  }, [navigation]);

  const {
    data: mostPopularRecipes,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["all-most-popular-recipes"],
    queryFn: RecipeService.getPaginatedMostPopularRecipes,
    initialPageParam: { page: 0, userId: user.id },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      return !lastPage || !lastPage.length
        ? undefined
        : { ...lastPageParam, page: lastPageParam.page + 1 };
    },
  });

  const getItems = useMemo(() => {
    if (mostPopularRecipes && mostPopularRecipes.pages) {
      const allItems = mostPopularRecipes.pages.flatMap((page) => page);

      return allItems;
    }

    return [];
  }, [mostPopularRecipes]);

  const loadNextPage = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const { id, photoUrl, user } = item;

    return (
      <RNFadeInTransition
        direction="top"
        animate={isFocused}
        key={`notification-event-${index}`}
        index={2 + (index + 0.25)}
      >
        <Link
          asChild
          href={{
            pathname: "/recipe_details",
            params: {
              id: id,
              firstName: user.firstName,
              lastName: user.lastName,
              recipePhotoUrl: photoUrl,
              userPhotoUrl: user.photoUrl,
              userId: user.id,
            },
          }}
        >
          <Pressable key={item.id}>
            <RNShadowView style={[styles.$rowContainerStyle]}>
              <View style={[styles.$innerContainerStyle, styles.$innerRowContainerStyle]}>
                <View style={styles.$innerRowInfoStyle}>
                  <View style={styles.$contentRowStyle}>
                    {item.photoUrl ? (
                      <View style={styles.$rowImageStyle}>
                        <Image
                          source={{ uri: item.photoUrl }}
                          style={styles.$flexStyle}
                        />
                      </View>
                    ) : (
                      <View style={[styles.$rowImageStyle, styles.$placeholderImageStyle]}>
                        <Ionicons
                          name="image-outline"
                          size={moderateScale(40)}
                          color={colors.greyscale400}
                        />
                      </View>
                    )}
                    <View style={styles.$contentColumnStyle}>
                      <Text
                        numberOfLines={3}
                        style={styles.$rowTextStyle}
                        ellipsizeMode="tail"
                      >
                        {item.title}
                      </Text>

                      <View style={styles.$arrowContainerStyle}>
                        <View style={styles.$userDetailsBtnStyle}>
                          <RNIcon
                            name="arrow_right"
                            color={colors.greyscale50}
                            height={horizontalScale(12)}
                            width={horizontalScale(12)}
                          />
                        </View>
                      </View>

                      <View style={styles.$footerContainerStyle}>
                        <View style={styles.$userInfoContainerStyle}>
                          {item.user.photoUrl ? (
                            <Image
                              source={{ uri: item.user.photoUrl }}
                              style={styles.$userAvatarStyle}
                            />
                          ) : (
                            <View style={styles.$userAvatarPlaceholderStyle}>
                              <Feather
                                name="user"
                                size={moderateScale(16)}
                                color={colors.greyscale50}
                              />
                            </View>
                          )}
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={styles.$userNameStyle}
                          >
                            {item.user ? item.user.lastName : ""}
                          </Text>
                        </View>

                        <View style={styles.$timeContainerStyle}>
                          <RNIcon
                            name="clock"
                            height={moderateScale(16)}
                            width={moderateScale(16)}
                            style={styles.$clockIconStyle}
                          />
                          <Text style={styles.$timeTextStyle}>{item.preparationTime} Min</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </RNShadowView>
          </Pressable>
        </Link>
      </RNFadeInTransition>
    );
  };

  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={styles.$containerStyle}
    >
      {getItems && getItems.length ? (
        <FlashList
          estimatedItemSize={15}
          showsVerticalScrollIndicator={false}
          data={getItems}
          renderItem={renderItem}
          contentContainerStyle={styles.$contentContainerStyle}
          ItemSeparatorComponent={() => <View style={{ height: spacing.spacing16 }} />}
          ListEmptyComponent={<View style={styles.$emptyContainerStyle} />}
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
      ) : (
        <View style={styles.$noResultsContainerStyle}>
          <No_results
            height={height / 3}
            width={width}
          />
          <Text style={styles.$noResultsTextStyle}>No results found !</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AllMostPopularRecipes;

const styles = StyleSheet.create({
  $containerStyle: {
    flex: 1,
    backgroundColor: colors.greyscale150,
  },
  $contentContainerStyle: {
    paddingHorizontal: spacing.spacing24,
    paddingTop: spacing.spacing32,
    paddingBottom: 120,
  },
  $headerTitleStyle: {
    ...$sizeStyles.h2,
  },
  $flexStyle: {
    flex: 1,
  },
  $emptyContainerStyle: {
    width: horizontalScale(GRID_CONTAINER_SIZE * GRID_COLUMNS),
    height: moderateScale(198),

    justifyContent: "center",
    alignItems: "center",
  },

  $rowContainerStyle: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: spacing.spacing16,
    backgroundColor: colors.greyscale50,
  },
  $innerContainerStyle: {
    borderRadius: spacing.spacing16,
    width: "100%",
  },

  $innerRowContainerStyle: {
    height: moderateScale(100),
    paddingLeft: horizontalScale(spacing.spacing8),
    paddingRight: horizontalScale(spacing.spacing16),
    paddingTop: verticalScale(spacing.spacing12),
    paddingBottom: verticalScale(spacing.spacing12),
  },
  $innerRowInfoStyle: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  $contentRowStyle: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: horizontalScale(spacing.spacing12),
    flexShrink: 1,
    height: "100%",
    width: "100%",
  },
  $rowImageStyle: {
    display: "flex",
    height: "100%",
    width: horizontalScale(100),
    borderRadius: spacing.spacing16,
    overflow: "hidden",
  },
  $placeholderImageStyle: {
    backgroundColor: colors.greyscale200,
    justifyContent: "center",
    alignItems: "center",
  },
  $contentColumnStyle: {
    flex: 1,
    paddingHorizontal: spacing.spacing4,
    flexDirection: "column",
    gap: spacing.spacing4,
  },
  $rowTextStyle: {
    flex: 1,
    flexWrap: "wrap",
    fontFamily: "sofia800",
    color: colors.greyscale500,
    paddingRight: spacing.spacing4,
    ...$sizeStyles.n,
  },
  $arrowContainerStyle: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  $userDetailsBtnStyle: {
    backgroundColor: colors.brandPrimary,

    height: horizontalScale(24),
    width: verticalScale(24),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: spacing.spacing8,
  },
  $footerContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  $userInfoContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.spacing4,
  },
  $userAvatarStyle: {
    height: horizontalScale(24),
    width: verticalScale(24),
    borderRadius: spacing.spacing16,
    borderWidth: 2,
    borderColor: colors.accent200,
  },
  $userAvatarPlaceholderStyle: {
    height: horizontalScale(24),
    width: verticalScale(24),
    borderRadius: spacing.spacing16,
    backgroundColor: colors.greyscale300,
    justifyContent: "center",
    alignItems: "center",
  },
  $userNameStyle: {
    ...$sizeStyles.s,
    fontFamily: "sofia400",
    color: colors.greyscale300,
    maxWidth: horizontalScale(100),
  },
  $timeContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.spacing4,
  },
  $clockIconStyle: {
    color: colors.greyscale300,
  },
  $timeTextStyle: {
    ...$sizeStyles.s,
    color: colors.greyscale300,
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
