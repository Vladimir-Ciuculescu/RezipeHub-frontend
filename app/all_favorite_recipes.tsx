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
import { useNavigation, useRouter } from "expo-router";
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
import FastImage from "react-native-fast-image";

const { width, height } = Dimensions.get("screen");

const GRID_CONTAINER_SIZE = width * 0.4;
const GRID_COLUMNS = 2;

const AllFavoriteRecipes = () => {
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
        <Pressable onPress={goBack}>
          <RNIcon name="arrow_left" />
        </Pressable>
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
                  size={16}
                  color={layoutIndex === 0 ? colors.greyscale50 : colors.slate900}
                />
              ) as any,
            },
            {
              label: (
                <Feather
                  size={16}
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

  const goToFavoriteRecipe = (
    recipeId: number,
    user: { id: number; firstName: string; lastName: string; photoUrl: string },
  ) => {
    router.navigate({
      pathname: "/recipe_details",
      params: { id: recipeId, owner: JSON.stringify(user) },
    });
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
      <Pressable
        onPress={() => goToFavoriteRecipe(item.id, item.user)}
        key={item.id}
      >
        <RNShadowView
          style={[styles.$gridContainerStyle, layout === "LIST" && styles.$rowContainerStyle]}
        >
          <View
            style={[
              styles.$innerContainerStyle,
              layout === "GRID" ? styles.$innerGridContainerStyle : styles.$innerRowContainerStyle,
            ]}
          >
            {layout === "LIST" && (
              <View style={styles.$innerRowInfoStyle}>
                <View style={styles.$contentRowStyle}>
                  {item.photoUrl ? (
                    <View style={styles.$rowImageStyle}>
                      <FastImage
                        source={{ uri: item.photoUrl, cache: FastImage.cacheControl.web }}
                        style={{ flex: 1 }}
                      />
                      <View
                        style={{
                          height: 28,
                          width: 28,
                          backgroundColor: colors.greyscale50,
                          position: "absolute",
                          borderRadius: spacing.spacing12,
                          justifyContent: "center",
                          alignItems: "center",
                          right: spacing.spacing8,
                          top: spacing.spacing8,
                        }}
                      >
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
                      <View
                        style={{
                          height: 28,
                          width: 28,
                          backgroundColor: colors.greyscale50,
                          position: "absolute",
                          borderRadius: spacing.spacing12,
                          justifyContent: "center",
                          alignItems: "center",
                          right: spacing.spacing8,
                          top: spacing.spacing8,
                        }}
                      >
                        <RNIcon name="heart" />
                      </View>
                      <Ionicons
                        name="image-outline"
                        size={35}
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
                      style={{ flexDirection: "row", alignItems: "center", gap: spacing.spacing8 }}
                    >
                      {item.user.photoUrl ? (
                        <FastImage
                          source={{ uri: item.user.photoUrl }}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: spacing.spacing16,
                            borderWidth: 2,
                            borderColor: colors.accent200,
                          }}
                        />
                      ) : (
                        <View
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: spacing.spacing16,

                            backgroundColor: colors.greyscale300,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Feather
                            name="user"
                            size={15}
                            color={colors.greyscale50}
                          />
                        </View>
                      )}
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[
                          {
                            ...$sizeStyles.s,
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
                      height={12}
                      width={12}
                    />
                  )}
                />
              </View>
            )}
            {layout === "GRID" && (
              <View style={styles.$innerGridInfoStyle}>
                {item.photoUrl ? (
                  <View style={styles.$gridImageStyle}>
                    <FastImage
                      source={{ uri: item.photoUrl, cache: FastImage.cacheControl.web }}
                      style={{ flex: 1 }}
                    />
                    <View
                      style={{
                        height: 28,
                        width: 28,
                        backgroundColor: colors.greyscale50,
                        position: "absolute",
                        borderRadius: spacing.spacing12,
                        justifyContent: "center",
                        alignItems: "center",
                        right: spacing.spacing8,
                        top: spacing.spacing8,
                      }}
                    >
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
                    <View
                      style={{
                        height: 28,
                        width: 28,
                        backgroundColor: colors.greyscale50,
                        position: "absolute",
                        borderRadius: spacing.spacing12,
                        justifyContent: "center",
                        alignItems: "center",
                        right: spacing.spacing8,
                        top: spacing.spacing8,
                      }}
                    >
                      <RNIcon name="heart" />
                    </View>
                    <Ionicons
                      name="image-outline"
                      size={35}
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
                    style={{ flexDirection: "row", alignItems: "center", gap: spacing.spacing8 }}
                  >
                    {/* <FastImage
                      source={{ uri: item.user.photoUrl }}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: spacing.spacing16,
                        borderWidth: 2,
                        borderColor: colors.accent200,
                      }}
                    /> */}
                    {item.user.photoUrl ? (
                      <FastImage
                        source={{ uri: item.user.photoUrl }}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: spacing.spacing16,
                          borderWidth: 2,
                          borderColor: colors.accent200,
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: spacing.spacing16,

                          backgroundColor: colors.greyscale300,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Feather
                          name="user"
                          size={15}
                          color={colors.greyscale50}
                        />
                      </View>
                    )}
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[
                        {
                          ...$sizeStyles.s,
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
    height: 34,
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
    width: GRID_CONTAINER_SIZE,
    marginBottom: spacing.spacing16,
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
    height: 198,
    padding: spacing.spacing12,
  },

  $innerRowContainerStyle: {
    height: 100,
    paddingLeft: spacing.spacing8,
    paddingRight: spacing.spacing16,
    paddingTop: spacing.spacing12,
    paddingBottom: spacing.spacing12,
  },

  $innerGridInfoStyle: {
    width: "100%",
    height: "100%",
    gap: spacing.spacing8,
    // justifyContent: "space-between",
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
    width: 100,
    borderRadius: spacing.spacing16,
    overflow: "hidden",
  },

  $gridImageStyle: {
    height: 88,
    width: "100%",
    borderRadius: spacing.spacing16,
    display: "flex",
    overflow: "hidden",
  },

  $rowTextStyle: {
    flex: 1,
    flexWrap: "wrap",
    fontFamily: "sofia800",
    color: colors.greyscale500,
    paddingRight: spacing.spacing4,
  },

  $gridTextStyle: {
    fontFamily: "sofia800",
    color: colors.greyscale500,
  },

  $userDetailsBtnStyle: {
    backgroundColor: colors.brandPrimary,
    height: 24,
    width: 24,
  },
});
