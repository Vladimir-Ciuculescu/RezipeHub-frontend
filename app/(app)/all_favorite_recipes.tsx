import {
  Text,
  Pressable,
  Platform,
  UIManager,
  LayoutAnimation,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Link, useNavigation, useRouter } from "expo-router";
import RNIcon from "@/components/shared/RNIcon";
import RNSegmentedControl from "@/components/shared/RnSegmentedControl";
import { colors } from "@/theme/colors";
import { Feather, Ionicons, Octicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useInfiniteQuery } from "@tanstack/react-query";
import FavoritesService from "@/api/services/favorites.service";
import useUserData from "@/hooks/useUserData";
import _ from "lodash";
import { No_results } from "@/assets/illustrations";
import { $sizeStyles } from "@/theme/typography";
import { spacing } from "@/theme/spacing";
import { View } from "react-native-ui-lib";
import RNShadowView from "@/components/shared/RNShadowView";
import RNButton from "@/components/shared/RNButton";
import { Image } from "expo-image";
import RNPressable from "@/components/shared/RNPressable";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/scale";
import RNFadeInTransition from "@/components/shared/RNFadeinTransition";
import { useIsFocused } from "@react-navigation/native";

const { width, height } = Dimensions.get("screen");

const GRID_CONTAINER_SIZE = width * 0.4;
const GRID_COLUMNS = 2;

const AllFavoriteRecipes = () => {
  const isFocused = useIsFocused();

  const navigation = useNavigation();

  const router = useRouter();

  const user = useUserData();

  const [layoutIndex, setLayoutIndex] = useState(0);
  const [layout, setLayout] = useState<"LIST" | "GRID">("LIST");

  const {
    data: favorites,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["all-favorites-recipes"],
    queryFn: FavoritesService.getPaginatedFavorites,
    initialPageParam: { page: 0, userId: user.id },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      return !lastPage || !lastPage.length
        ? undefined
        : { ...lastPageParam, page: lastPageParam.page + 1 };
    },
  });

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
      headerTitle: () => <Text style={{ ...$sizeStyles.h2 }}>Favorites</Text>,

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
                  // size={16}
                  size={moderateScale(12)}
                  color={layoutIndex === 0 ? colors.greyscale50 : colors.slate900}
                />
              ) as any,
            },
            {
              label: (
                <Feather
                  // size={16}
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

  useEffect(() => {
    if (Platform.OS === "android") {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }
  }, []);

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

  const getItems = useMemo(() => {
    if (favorites && favorites.pages) {
      const cols = Math.floor(width / GRID_CONTAINER_SIZE);

      const allItems = favorites.pages.flatMap((page) => page);

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
  }, [layout, favorites]);

  const loadNextPage = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    if (item === null) {
      return (
        <View
          key={String(index)}
          style={styles.$gridContainerStyle}
        />
      );
    }

    const { id, photoUrl, user } = item;

    return (
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
                      <View style={styles.$rowImageStyle}>
                        <Image
                          source={{ uri: item.photoUrl }}
                          style={{ flex: 1 }}
                        />
                        <View style={styles.$hearRowContainerstyle}>
                          <RNIcon name="heart" />
                        </View>
                      </View>
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
                        <View style={styles.$hearRowContainerstyle}>
                          <RNIcon name="heart" />
                        </View>
                        <Ionicons
                          name="image-outline"
                          size={moderateScale(25)}
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
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: spacing.spacing8,
                        }}
                      >
                        {item.user.photoUrl ? (
                          <Image
                            source={{ uri: item.user.photoUrl }}
                            style={styles.userImageStyle}
                          />
                        ) : (
                          <View style={styles.$userPlaceholderStyle}>
                            <Feather
                              name="user"
                              size={moderateScale(12)}
                              color={colors.greyscale50}
                            />
                          </View>
                        )}
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={[
                            {
                              ...$sizeStyles.xs,
                              fontFamily: "sofia400",
                              color: colors.greyscale300,
                              paddingRight: 30,
                            },
                          ]}
                        >
                          {item.user ? `${item.user.firstName} ${item.user.lastName}` : ""}
                        </Text>
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
                    <View style={styles.$gridImageStyle}>
                      <Image
                        source={{ uri: item.photoUrl }}
                        style={{ flex: 1 }}
                      />
                      <View style={styles.$heartGridStyle}>
                        <RNIcon name="heart" />
                      </View>
                    </View>
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
                      <View style={styles.$headerGridPlaceholderStyle}>
                        <RNIcon name="heart" />
                      </View>
                      <Ionicons
                        name="image-outline"
                        size={moderateScale(40)}
                        color={colors.greyscale400}
                      />
                    </View>
                  )}
                  <View style={{ flex: 1, justifyContent: "space-between" }}>
                    <Text
                      numberOfLines={3}
                      style={styles.$gridTextStyle}
                    >
                      {item.title}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.spacing8,
                      }}
                    >
                      {item.user.photoUrl ? (
                        <Image
                          source={{ uri: item.user.photoUrl }}
                          style={styles.$userImageGridStyle}
                        />
                      ) : (
                        <View style={styles.$userImagePlaceholderGridStyle}>
                          <Feather
                            name="user"
                            size={moderateScale(12)}
                            color={colors.greyscale50}
                          />
                        </View>
                      )}
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[
                          {
                            ...$sizeStyles.xs,
                            fontFamily: "sofia400",
                            color: colors.greyscale300,
                            paddingRight: 30,
                          },
                        ]}
                      >
                        {item.user ? `${item.user.lastName}` : ""}
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
      {getItems && getItems.length ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          key={layout === "GRID" ? GRID_COLUMNS : 1}
          data={getItems}
          numColumns={layout === "GRID" ? GRID_COLUMNS : 1}
          renderItem={renderItem}
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
      ) : (
        <View
          style={{
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: spacing.spacing12,
          }}
        >
          <No_results
            height={height / 3}
            width={width}
          />
          <Text style={{ color: colors.slate900, ...$sizeStyles.h2 }}>
            Add meals to favorites !
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AllFavoriteRecipes;

const styles = StyleSheet.create({
  $segmentLabelStyle: {
    width: 20,
    textAlign: "center",
  },
  $segmentStyle: {
    // height: moderateScale(44),
  },

  $containerStyle: {
    flex: 1,
    backgroundColor: colors.greyscale75,
  },
  $contentContainerStyle: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.spacing24,
    paddingTop: spacing.spacing32,
  },

  $emptyContainerStyle: {
    width: GRID_CONTAINER_SIZE * GRID_COLUMNS,
    height: 198,
    justifyContent: "center",
    alignItems: "center",
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
    gap: spacing.spacing8,
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
    display: "flex",
    height: "100%",
    width: moderateScale(100),
    borderRadius: spacing.spacing16,
    overflow: "hidden",
  },

  $heartContainerStyle: {
    height: 28,
    width: 28,
    backgroundColor: colors.greyscale50,
    position: "absolute",
    borderRadius: spacing.spacing12,
    justifyContent: "center",
    alignItems: "center",
    right: spacing.spacing8,
    top: spacing.spacing8,
  },

  $hearRowContainerstyle: {
    height: horizontalScale(28),
    width: horizontalScale(28),
    backgroundColor: colors.greyscale50,
    position: "absolute",
    borderRadius: spacing.spacing12,
    justifyContent: "center",
    alignItems: "center",

    right: horizontalScale(spacing.spacing8),
    top: verticalScale(spacing.spacing8),
  },

  $gridImageStyle: {
    height: moderateScale(88),
    width: "100%",
    borderRadius: spacing.spacing16,
    display: "flex",
    overflow: "hidden",
  },

  $heartGridStyle: {
    height: horizontalScale(28),
    width: horizontalScale(28),
    backgroundColor: colors.greyscale50,
    position: "absolute",
    borderRadius: spacing.spacing12,
    justifyContent: "center",
    alignItems: "center",
    right: spacing.spacing8,
    top: spacing.spacing8,
  },

  $userImageGridStyle: {
    width: horizontalScale(24),
    height: horizontalScale(24),
    borderRadius: spacing.spacing16,
    borderWidth: 2,
    borderColor: colors.accent200,
  },

  $userImagePlaceholderGridStyle: {
    width: horizontalScale(24),
    height: horizontalScale(24),
    borderRadius: spacing.spacing16,

    backgroundColor: colors.greyscale300,
    justifyContent: "center",
    alignItems: "center",
  },

  $headerGridPlaceholderStyle: {
    height: horizontalScale(28),
    width: horizontalScale(28),
    backgroundColor: colors.greyscale50,
    position: "absolute",
    borderRadius: spacing.spacing12,
    justifyContent: "center",
    alignItems: "center",
    right: spacing.spacing8,
    top: spacing.spacing8,
  },

  $rowTextStyle: {
    flex: 1,
    flexWrap: "wrap",
    fontFamily: "sofia800",
    color: colors.greyscale500,
    paddingRight: spacing.spacing4,
  },

  userImageStyle: {
    width: horizontalScale(24),
    height: horizontalScale(24),
    borderRadius: spacing.spacing16,
    borderWidth: 2,
    borderColor: colors.accent200,
  },

  $userPlaceholderStyle: {
    width: horizontalScale(24),
    height: horizontalScale(24),
    borderRadius: spacing.spacing16,
    backgroundColor: colors.greyscale300,
    justifyContent: "center",
    alignItems: "center",
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
});
