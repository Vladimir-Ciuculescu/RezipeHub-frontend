import {
  Dimensions,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  FlatList,
  ActivityIndicator,
} from "react-native";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Feather, Ionicons, Octicons } from "@expo/vector-icons";
import _ from "lodash";
import { Link, useNavigation, useRouter, useSegments } from "expo-router";
import RNButton from "@/components/shared/RNButton";
import { View } from "react-native-ui-lib";
import RNIcon from "@/components/shared/RNIcon";
import RNShadowView from "@/components/shared/RNShadowView";
import { colors } from "@/theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { spacing } from "@/theme/spacing";
import { Image } from "expo-image";
import RNSegmentedControl from "@/components/shared/RnSegmentedControl";
import { useInfiniteQuery } from "@tanstack/react-query";
import RecipeService from "@/api/services/recipe.service";
import useUserData from "@/hooks/useUserData";
import { $sizeStyles } from "@/theme/typography";
import { formatFloatingValue } from "@/utils/formatFloatingValue";
import RNPressable from "@/components/shared/RNPressable";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/scale";

const { width } = Dimensions.get("screen");

const GRID_CONTAINER_SIZE = width * 0.4;
const GRID_COLUMNS = 2;

const LayoutGridAnimation = () => {
  const user = useUserData();

  const [layoutIndex, setLayoutIndex] = useState(0);
  const [layout, setLayout] = useState<"LIST" | "GRID">("LIST");

  const navigation = useNavigation();
  const router = useRouter();

  const {
    data: recipes,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["all-personal-recipes"],
    queryFn: RecipeService.getPaginatedRecipesPerUser,
    initialPageParam: { page: 0, userId: user.id },

    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      return !lastPage || !lastPage.length
        ? undefined
        : { ...lastPageParam, page: lastPageParam.page + 1 };
    },

    //TODO : Keep for future
    // getPreviousPageParam: (lastPage, allPages, lastPageParam) => {
    //   return !lastPage || !lastPage.length
    //     ? undefined
    //     : { ...lastPageParam, page: lastPageParam.page - 1 };
    // },
  });

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
      headerTitle: () => <Text style={{ ...$sizeStyles.h2 }}>Recipes</Text>,
      headerRight: () => (
        <RNSegmentedControl
          backgroundColor={colors.greyscale50}
          segmentsStyle={styles.$segmentStyle}
          segmentLabelStyle={styles.$segmentLabelStyle}
          onChangeIndex={handleLayoutChange}
          initialIndex={layoutIndex}
          borderRadius={50}
          segments={[
            {
              label: (
                <Octicons
                  name="rows"
                  size={moderateScale(12)}
                  color={layoutIndex === 0 ? colors.greyscale50 : colors.slate900}
                />
              ) as any,
            },
            {
              label: (
                <Feather
                  size={moderateScale(12)}
                  name="grid"
                  color={layoutIndex === 1 ? colors.greyscale50 : colors.slate900}
                />
              ) as any,
            },
          ]}
        />
      ),
    });
  }, [navigation, layoutIndex]);

  const getItems = useMemo(() => {
    if (recipes && recipes.pages) {
      const cols = Math.floor(width / GRID_CONTAINER_SIZE);

      const allItems = recipes.pages.flatMap((page) => page);

      const rows = allItems.length / cols;

      const dividedRowsCols = rows / cols;
      const itemsToAdd = Math.ceil((dividedRowsCols - parseInt(`${dividedRowsCols}`)) * cols);

      if (layout === "GRID") {
        const newData = [...allItems, ..._.range(0, itemsToAdd).map(() => null)];
        return newData;
      }

      return allItems;
    }

    return [];
  }, [layout, recipes]);

  useEffect(() => {
    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, []);

  const goBack = () => {
    router.back();
  };

  const handleLayoutChange = (index: number) => {
    setLayoutIndex(index);

    setTimeout(() => {
      LayoutAnimation.configureNext({
        duration: 300,
        create: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
        update: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.scaleXY,
        },
        delete: {
          type: LayoutAnimation.Types.spring,
          property: LayoutAnimation.Properties.opacity,
          springDamping: 0.7,
        },
      });

      setLayout((layout) => (layout === "GRID" ? "LIST" : "GRID"));
    }, 0.00000001);
  };

  const loadNextPage = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    if (item === null && layout === "GRID") {
      return (
        <View
          key={String(index)}
          style={styles.$gridContainerStyle}
        />
      );
    }

    return (
      <Link
        asChild
        href={{
          pathname: "/recipe_details",
          params: {
            recipePhotoUrl: item.photoUrl,
            id: item.id,
            userId: user.id,
          },
        }}
      >
        <Pressable key={item.id}>
          <RNShadowView
            style={[styles.$gridContainerStyle, layout === "LIST" && styles.$rowContainerStyle]}
          >
            <View
              style={[
                styles.$innerContainerStyle,
                layout === "GRID"
                  ? styles.$innerGridContainerStyle
                  : styles.$innerRowContainerStyle,
              ]}
            >
              {layout === "LIST" && (
                <View style={styles.$innerRowInfoStyle}>
                  <View style={styles.$contentRowStyle}>
                    {item.photoUrl ? (
                      <Image
                        source={{ uri: item.photoUrl }}
                        style={styles.$rowImageStyle}
                      />
                    ) : (
                      <View
                        style={[
                          styles.$rowImageStyle,
                          {
                            backgroundColor: colors.greyscale200,
                            justifyContent: "center",
                            alignItems: "center",
                          },
                        ]}
                      >
                        <Ionicons
                          name="image-outline"
                          size={moderateScale(35)}
                          color={colors.greyscale400}
                        />
                      </View>
                    )}
                    <View
                      style={{
                        flex: 1,
                        paddingRight: spacing.spacing4,
                      }}
                    >
                      <Text
                        numberOfLines={3}
                        style={styles.$rowTextStyle}
                      >
                        {item.title}
                      </Text>

                      <View
                        row
                        style={{
                          alignItems: "center",
                          gap: horizontalScale(spacing.spacing8),
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          row
                          style={{ alignItems: "flex-start" }}
                        >
                          <RNIcon
                            name="fire"
                            style={{ color: colors.greyscale300 }}
                            height={moderateScale(20)}
                          />
                          <Text
                            style={[
                              {
                                ...$sizeStyles.xs,
                                fontFamily: "sofia800",
                                color: colors.greyscale300,
                              },
                            ]}
                          >
                            {formatFloatingValue(item.totalCalories)} Kcal
                          </Text>
                        </View>
                        <RNIcon
                          name="separator"
                          style={{ color: colors.greyscale300 }}
                        />
                        <View
                          row
                          style={{ alignItems: "center", gap: 2 }}
                        >
                          <RNIcon
                            name="clock"
                            style={{ color: colors.greyscale300 }}
                            height={moderateScale(16)}
                          />
                          <Text
                            style={[
                              {
                                ...$sizeStyles.xs,
                                fontFamily: "sofia800",
                                color: colors.greyscale300,
                              },
                            ]}
                          >
                            {item.preparationTime} min
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <RNButton
                    style={styles.$userDetailsBtnStyle}
                    iconSource={() => (
                      <RNIcon
                        name="arrow_right"
                        color={colors.greyscale50}
                        height={moderateScale(12)}
                        width={moderateScale(12)}
                      />
                    )}
                  />
                </View>
              )}
              {layout === "GRID" && (
                <View style={styles.$innerGridInfoStyle}>
                  {item.photoUrl ? (
                    <Image
                      source={{ uri: item.photoUrl }}
                      style={styles.$gridImageStyle}
                    />
                  ) : (
                    <View
                      style={[
                        styles.$gridImageStyle,
                        {
                          backgroundColor: colors.greyscale200,
                          justifyContent: "center",
                          alignItems: "center",
                        },
                      ]}
                    >
                      <Ionicons
                        name="image-outline"
                        size={moderateScale(40)}
                        color={colors.greyscale400}
                      />
                    </View>
                  )}
                  <Text
                    numberOfLines={2}
                    style={styles.$gridTextStyle}
                    ellipsizeMode="tail"
                  >
                    {item.title} with chilli con carne boss awd wad awd
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "flex-end",
                    }}
                  >
                    <View
                      row
                      style={{ alignItems: "center", gap: spacing.spacing2 }}
                    >
                      <RNIcon
                        name="fire"
                        style={{ color: colors.greyscale300 }}
                        height={moderateScale(16)}
                      />
                      <Text
                        style={[
                          {
                            ...$sizeStyles.xs,
                            fontFamily: "sofia800",
                            color: colors.greyscale300,
                          },
                        ]}
                      >
                        {formatFloatingValue(item.totalCalories)} Kcal
                      </Text>
                    </View>
                    <View
                      row
                      style={{ alignItems: "center", gap: spacing.spacing2 }}
                    >
                      <RNIcon
                        name="clock"
                        style={{ color: colors.greyscale300 }}
                        height={moderateScale(16)}
                      />
                      <Text
                        style={[
                          {
                            ...$sizeStyles.xs,
                            fontFamily: "sofia800",
                            color: colors.greyscale300,
                          },
                        ]}
                      >
                        {item.preparationTime} min
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </RNShadowView>
        </Pressable>
      </Link>
    );
  };

  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={styles.$containerStyle}
    >
      {recipes && (
        <FlatList
          showsVerticalScrollIndicator={false}
          key={layout === "GRID" ? GRID_COLUMNS : 1}
          data={getItems}
          renderItem={renderItem}
          numColumns={layout === "GRID" ? GRID_COLUMNS : 1}
          contentContainerStyle={styles.$contentContainerStyle}
          ListEmptyComponent={<View style={styles.$emptyContainerStyle} />}
          columnWrapperStyle={layout === "GRID" ? { gap: spacing.spacing16 } : undefined}
          onEndReached={loadNextPage}
          //TODO Keep in mind for the future
          // getItemLayout={getItemLayout}
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
      )}
    </SafeAreaView>
  );
};

export default LayoutGridAnimation;

const styles = StyleSheet.create({
  $segmentLabelStyle: {
    width: 20,
    textAlign: "center",
  },
  $segmentStyle: {},

  $containerStyle: {
    flex: 1,
    backgroundColor: colors.greyscale75,
  },
  $contentContainerStyle: {
    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: horizontalScale(spacing.spacing24),
    paddingTop: verticalScale(spacing.spacing32),
  },

  $gridContainerStyle: {
    width: horizontalScale(GRID_CONTAINER_SIZE),
    marginBottom: verticalScale(spacing.spacing16),
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

  $innerGridContainerStyle: {
    height: moderateScale(220),
    padding: spacing.spacing12,
  },

  $innerRowContainerStyle: {
    height: moderateScale(100),
    paddingLeft: horizontalScale(spacing.spacing8),
    paddingRight: horizontalScale(spacing.spacing16),
    paddingTop: verticalScale(spacing.spacing12),
    paddingBottom: verticalScale(spacing.spacing12),
  },

  $innerGridInfoStyle: {
    width: "100%",
    height: "100%",
    gap: verticalScale(spacing.spacing8),
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
    gap: spacing.spacing12,
    flexShrink: 1,
    height: "100%",
    width: "100%",
  },

  $rowImageStyle: {
    height: "100%",
    width: moderateScale(100),
    borderRadius: spacing.spacing16,
  },

  $gridImageStyle: {
    height: "45%",
    width: "100%",
    borderRadius: spacing.spacing16,
  },

  $rowTextStyle: {
    flex: 1,
    flexWrap: "wrap",
    fontFamily: "sofia800",
    color: colors.greyscale500,
  },

  $gridTextStyle: {
    fontFamily: "sofia800",
    color: colors.greyscale500,
  },

  $userDetailsBtnStyle: {
    backgroundColor: colors.brandPrimary,

    height: horizontalScale(24),
    width: horizontalScale(24),
  },

  $emptyContainerStyle: {
    width: GRID_CONTAINER_SIZE * GRID_COLUMNS,
    height: verticalScale(198),
    justifyContent: "center",
    alignItems: "center",
  },
});
