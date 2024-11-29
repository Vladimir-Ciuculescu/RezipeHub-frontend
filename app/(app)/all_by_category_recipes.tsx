import { Text, Pressable, StyleSheet, FlatList, ActivityIndicator, Dimensions } from "react-native";
import React, { useLayoutEffect, useMemo } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import RNIcon from "@/components/shared/RNIcon";
import { $sizeStyles } from "@/theme/typography";
import FastImage from "react-native-fast-image";
import { View } from "react-native-ui-lib";
import { spacing } from "@/theme/spacing";
import { useInfiniteQuery } from "@tanstack/react-query";
import RecipeService from "@/api/services/recipe.service";
import useUserData from "@/hooks/useUserData";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/colors";
import { No_results } from "@/assets/illustrations";
import { Feather, Ionicons } from "@expo/vector-icons";
import RNShadowView from "@/components/shared/RNShadowView";
import RNPressable from "@/components/shared/RNPressable";
import { horizontalScale, moderateScale } from "@/utils/scale";

interface SearchParams {
  [key: string]: string;
  category: string;
}

const { width, height } = Dimensions.get("screen");

const GRID_CONTAINER_SIZE = width * 0.4;
const GRID_COLUMNS = 2;

const AllByCategoryRecipes = () => {
  const navigation = useNavigation();

  const { category } = useLocalSearchParams<SearchParams>();

  const user = useUserData();

  const {
    data: byCategoryRecipes,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["all-by-category-recipes", category], // Added category to query key
    queryFn: RecipeService.getPaginatedByCategoryRecipes,
    initialPageParam: { page: 0, userId: user.id, category },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      return !lastPage || !lastPage.length
        ? undefined
        : { ...lastPageParam, page: lastPageParam.page + 1 };
    },
  });

  const categoryType = category!.charAt(0).toLowerCase() + category!.slice(1);

  const getCategoryImage = (category: string) => {
    switch (category) {
      case "pizza":
        return require("../../assets/images/categories/pizza.png");
      case "hamburger":
        return require("../../assets/images/categories/hamburger.png");
      case "asiatic":
        return require("../../assets/images/categories/asiatic.png");
      case "burrito":
        return require("../../assets/images/categories/burrito.png");
      case "noodles":
        return require("../../assets/images/categories/noodles.png");
      case "pasta":
        return require("../../assets/images/categories/pasta.png");
      case "barbecue":
        return require("../../assets/images/categories/barbecue.png");
      case "fish":
        return require("../../assets/images/categories/fish.png");
      case "salad":
        return require("../../assets/images/categories/salad.png");
      case "appetizer":
        return require("../../assets/images/categories/appetizer.png");
      case "kebab":
        return require("../../assets/images/categories/kebab.png");
      case "sushi":
        return require("../../assets/images/categories/sushi.png");
      case "brunch":
        return require("../../assets/images/categories/brunch.png");
      case "sandwich":
        return require("../../assets/images/categories/sandwich.png");
      case "coffee":
        return require("../../assets/images/categories/coffee.png");
      case "taco":
        return require("../../assets/images/categories/taco.png");
      case "vegetarian":
        return require("../../assets/images/categories/vegetarian.png");
      case "vegan":
        return require("../../assets/images/categories/vegan.png");
      case "other":
        return require("../../assets/images/categories/other.png");
      default:
        return null;
    }
  };
  const path = getCategoryImage(categoryType);

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
      headerTitle: () => (
        <View
          row
          style={{ justifyContent: "center", alignItems: "center", gap: spacing.spacing8 }}
        >
          <FastImage
            style={{ width: horizontalScale(25), height: horizontalScale(25) }}
            source={path}
          />
          <Text style={$sizeStyles.h2}>{category}</Text>
        </View>
      ),
    });
  }, [navigation]);

  const goBack = () => {
    navigation.goBack();
  };

  const getItems = useMemo(() => {
    if (byCategoryRecipes && byCategoryRecipes.pages) {
      const allItems = byCategoryRecipes.pages.flatMap((page) => page);

      return allItems;
    }

    return [];
  }, [byCategoryRecipes]);

  const loadNextPage = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const goToRecipeDetails = (item: any) => {
    router.navigate({
      pathname: "/recipe_details",
      params: { id: item.id, userId: item.user.id, owner: JSON.stringify(item.user) },
    });
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <Pressable
        onPress={() => goToRecipeDetails(item)}
        key={item.id}
      >
        <RNShadowView style={[{ marginBottom: spacing.spacing16 }, styles.$rowContainerStyle]}>
          <View style={[styles.$innerContainerStyle, styles.$innerRowContainerStyle]}>
            <View style={styles.$innerRowInfoStyle}>
              <View style={styles.$contentRowStyle}>
                {item.photoUrl ? (
                  <View style={styles.$rowImageStyle}>
                    <FastImage
                      source={{ uri: item.photoUrl, cache: FastImage.cacheControl.web }}
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
                <View style={styles.$contentDetailsStyle}>
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
                        <FastImage
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
    );
  };

  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={styles.$containerStyle}
    >
      {getItems && getItems.length ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={getItems}
          renderItem={renderItem}
          contentContainerStyle={styles.$contentContainerStyle}
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
          <Text style={styles.$noResultsTextStyle}>No results found!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AllByCategoryRecipes;

const styles = StyleSheet.create({
  $containerStyle: {
    flex: 1,
  },
  $contentContainerStyle: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.spacing24,
    paddingTop: spacing.spacing32,
  },
  $emptyContainerStyle: {
    width: GRID_CONTAINER_SIZE * GRID_COLUMNS,
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
    paddingLeft: spacing.spacing8,
    paddingRight: spacing.spacing16,
    paddingTop: spacing.spacing12,
    paddingBottom: spacing.spacing12,
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
    // width: 100,
    width: horizontalScale(100),
    borderRadius: spacing.spacing16,
    overflow: "hidden",
  },
  $placeholderImageStyle: {
    backgroundColor: colors.greyscale200,
    justifyContent: "center",
    alignItems: "center",
  },
  $flexStyle: {
    flex: 1,
  },
  $contentDetailsStyle: {
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
    width: horizontalScale(24),
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
    width: horizontalScale(24),
    borderRadius: spacing.spacing16,
    borderWidth: 2,
    borderColor: colors.accent200,
  },
  $userAvatarPlaceholderStyle: {
    height: horizontalScale(24),
    width: horizontalScale(24),
    borderRadius: spacing.spacing16,
    backgroundColor: colors.greyscale300,
    justifyContent: "center",
    alignItems: "center",
  },
  $userNameStyle: {
    ...$sizeStyles.xs,
    fontFamily: "sofia400",
    color: colors.greyscale300,
    maxWidth: horizontalScale(120),
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
    ...$sizeStyles.xs,
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
