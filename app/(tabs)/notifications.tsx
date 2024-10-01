import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  Pressable,
  Keyboard,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { spacing } from "@/theme/spacing";
import RecipeSearchResultItem from "@/components/RecipeSearchResultItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import RecipeService from "@/api/services/recipe.service";
import useFilterStore from "@/zustand/useFilterStore";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import RnInput from "@/components/shared/RNInput";
import RNIcon from "@/components/shared/RNIcon";
import { colors } from "@/theme/colors";
import RNShadowView from "@/components/shared/RNShadowView";
import FiltersBottomSheet from "@/components/FiltersBottomSheet";
import CategoryFilter from "@/components/CategoryFilter";
import RNSlider from "@/components/Slider/RNSlider";
import { MAX_CALORIES, MAX_PREPARATION_TIME } from "@/constants";
import RNButton from "@/components/shared/RNButton";
import { $sizeStyles } from "@/theme/typography";

const SearchScreen = () => {
  // Shared value to track the scroll position
  const scrollY = useSharedValue(0);

  // Dummy data for the FlatList (empty initially)
  const [data, setData] = useState([]); // Can add data items here

  // Scroll handler to update shared value when scrolling
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Animated style for the header (fade out when scrolling)
  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 50], [1, 0], Extrapolation.CLAMP);
    return { opacity };
  });

  // Animated style for the search input (move to header's place when scrolling)
  const inputStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [0, 50], [0, -50], Extrapolation.CLAMP); // Move up to header position
    return { transform: [{ translateY }] };
  });

  const containerStyle = useAnimatedStyle(() => {
    const height = interpolate(scrollY.value, [0, 50], [100, 50], Extrapolation.CLAMP); // Move up to header position

    return {
      height,
    };
  });

  const categories = useFilterStore.use.categories();
  const preparationTimeRange = useFilterStore.use.preparationTimeRange();
  const caloriesRange = useFilterStore.use.caloriesRange();
  const text = useFilterStore.use.text();
  const { dismiss } = useBottomSheetModal();

  const [filters, setFilters] = useState({
    text,
    minCalories: caloriesRange[0],
    maxCalories: caloriesRange[1],
    categories: categories,
    minPreparationTime: preparationTimeRange[0],
    maxPreparationTime: preparationTimeRange[1],
  });

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const filterObject = {
    text,
    categories,
    preparationTimeRange,
    caloriesRange,
  };

  const loadNextPage = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const {
    data: recipess,
    hasNextPage,
    fetchNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["recipes", filterObject],

    queryFn: RecipeService.getRecipes,
    initialPageParam: { page: 0 },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      return !lastPage || !lastPage.length
        ? undefined
        : { ...lastPageParam, page: lastPageParam.page + 1 };
    },
  });

  const setFiltersAction = useFilterStore.use.setFiltersAction();

  const getRecipes = useMemo(() => {
    if (recipess && recipess.pages) {
      const recipes = recipess.pages.flatMap((page) => page);

      return recipes;
    }
  }, [recipess]);

  const applyText = () => {
    setFiltersAction({ ...filters, text: filters.text });
  };

  const openBottomSheetFilters = () => {
    Keyboard.dismiss();

    if (bottomSheetRef.current) {
      bottomSheetRef.current.present();
    }
  };

  const toggleCategory = useCallback((id: number) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      categories: prevFilters.categories.map((category) =>
        category.id === id ? { ...category, checked: !category.checked } : category,
      ),
    }));
  }, []);

  const applyFilters = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      text: filters.text,
      minCalories: filters.minCalories,
      maxCalories: filters.maxCalories,
      minPreparationTime: filters.minPreparationTime,
      maxPreparationTime: filters.maxPreparationTime,
      filterCategories: filters.categories,
    }));

    setFiltersAction(filters);

    dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[containerStyle, { marginBottom: 30 }]}>
        <Animated.View style={[styles.header, headerStyle]}>
          <Text style={styles.headerText}>Search</Text>
        </Animated.View>

        <Animated.View style={[styles.inputContainer, inputStyle]}>
          <RNShadowView>
            <RnInput
              onSubmitEditing={applyText}
              returnKeyType="search"
              placeholder="Search a recipe"
              value={filters.text}
              onChangeText={(text) => setFilters((prev) => ({ ...prev, text }))}
              wrapperStyle={{ width: "100%" }}
              containerStyle={{ borderColor: "transparent" }}
              leftIcon={
                <RNIcon
                  color={colors.accent200}
                  name={"search"}
                />
              }
              rightIcon={
                <Pressable onPress={openBottomSheetFilters}>
                  <RNIcon
                    color={colors.accent200}
                    name={"filter"}
                  />
                </Pressable>
              }
            />
          </RNShadowView>
        </Animated.View>
      </Animated.View>

      <Animated.FlatList
        // data={data}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyList}>
            <Text>No items found</Text>
          </View>
        )}
        // onScroll={scrollHandler}
        scrollEventThrottle={16} // Smoother scrolling
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: spacing.spacing16 }} />}
        data={getRecipes}
        renderItem={({ item }) => <RecipeSearchResultItem recipe={item} />}
        onEndReached={loadNextPage}
        onScroll={scrollHandler}
        // scrollEventThrottle={16} // Smooth scroll events
      />
      <FiltersBottomSheet ref={bottomSheetRef}>
        <View style={styles.$bottomSheetContainerStyle}>
          <View>
            <Text style={styles.$bottomSheetTitleStyle}>Filters</Text>
            <View style={{ gap: spacing.spacing32 }}>
              <View style={{ gap: spacing.spacing16 }}>
                <Text style={[styles.$bottomSheetSectionStyle, { paddingLeft: spacing.spacing24 }]}>
                  Category
                </Text>

                <View style={styles.listContainer}>
                  {filters.categories.map((category) => {
                    return (
                      <CategoryFilter
                        key={category.id}
                        label={category.label}
                        checked={category.checked}
                        onPress={() => {
                          toggleCategory(category.id);
                        }}
                      />
                    );
                  })}
                </View>
              </View>
              <View style={{ gap: spacing.spacing32 }}>
                <RNSlider
                  label="Calories"
                  unit="Kcal"
                  minValue={0}
                  maxValue={MAX_CALORIES}
                  lowerValue={filters.minCalories}
                  greaterValue={filters.maxCalories}
                  onChangeMinValue={(minCalories) =>
                    setFilters((prev) => ({ ...prev, minCalories }))
                  }
                  onChangeMaxValue={(maxCalories) =>
                    setFilters((prev) => ({ ...prev, maxCalories }))
                  }
                />

                <RNSlider
                  label="Preparation time"
                  unit="minutes"
                  minValue={0}
                  maxValue={MAX_PREPARATION_TIME}
                  lowerValue={filters.minPreparationTime}
                  greaterValue={filters.maxPreparationTime}
                  onChangeMinValue={(minTime) =>
                    setFilters((prev) => ({ ...prev, minPreparationTime: minTime }))
                  }
                  onChangeMaxValue={(maxTime) =>
                    setFilters((prev) => ({ ...prev, maxPreparationTime: maxTime }))
                  }
                />
              </View>
              <View>
                <RNButton
                  onPress={applyFilters}
                  loading={isLoading}
                  label="Apply Filters"
                  style={styles.$applyBtnStyle}
                  labelStyle={styles.$applyBtnLabelStyle}
                />
                <RNButton
                  label="Clear"
                  link
                  style={styles.$clearBtnStyle}
                  labelStyle={styles.$clearBtnLabelStyle}
                />
              </View>
            </View>
          </View>
        </View>
      </FiltersBottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: spacing.spacing16,
    paddingVertical: spacing.spacing12,
    // backgroundColor: "#f8f8f8",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  inputContainer: {
    paddingHorizontal: spacing.spacing16,
    paddingVertical: spacing.spacing8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  listContainer: {
    paddingHorizontal: spacing.spacing16,
    paddingVertical: spacing.spacing8,
    paddingBottom: 140, // Space at the bottom
  },
  listItem: {
    paddingVertical: spacing.spacing12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  emptyList: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  $bottomSheetSectionStyle: {
    ...$sizeStyles.l,
    fontFamily: "sofia800",
  },

  $applyBtnLabelStyle: {
    ...$sizeStyles.n,
    color: colors.greyscale50,
    fontFamily: "sofia800",
    fontSize: spacing.spacing16,
  },

  $clearBtnStyle: {
    marginHorizontal: spacing.spacing16,
    height: 64,
  },

  $clearBtnLabelStyle: {
    ...$sizeStyles.n,
    color: colors.accent200,
    fontFamily: "sofia800",
    fontSize: spacing.spacing16,
  },
  $applyBtnStyle: {
    marginHorizontal: spacing.spacing16,
    backgroundColor: colors.accent200,
    height: 64,
  },
  $bottomSheetContainerStyle: {
    flex: 1,
    justifyContent: "space-between",
  },

  $bottomSheetTitleStyle: {
    textAlign: "center",
    ...$sizeStyles.h3,
    fontFamily: "sofia800",
    color: colors.greyscale500,
    paddingBottom: spacing.spacing32,
  },
});

export default SearchScreen;
