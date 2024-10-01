import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { spacing } from "@/theme/spacing";
import RecipeSearchResultItem from "@/components/RecipeSearchResultItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import RecipeService from "@/api/services/recipe.service";
import { colors } from "@/theme/colors";
import RNShadowView from "@/components/shared/RNShadowView";
import RnInput from "@/components/shared/RNInput";
import RNIcon from "@/components/shared/RNIcon";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import FiltersBottomSheet from "@/components/FiltersBottomSheet";
import CategoryFilter from "@/components/CategoryFilter";
import { MAX_CALORIES, MAX_PREPARATION_TIME, RECIPE_TYPES } from "@/constants";
import useFilterStore from "@/zustand/useFilterStore";
import RNSlider from "@/components/Slider/RNSlider";
import { $sizeStyles } from "@/theme/typography";
import RNButton from "@/components/shared/RNButton";
import { Skeleton } from "moti/skeleton";
import { No_results } from "@/assets/illustrations";

const { width, height } = Dimensions.get("screen");

const SearchScreen = () => {
  const categories = useFilterStore.use.categories();
  const preparationTimeRange = useFilterStore.use.preparationTimeRange();
  const caloriesRange = useFilterStore.use.caloriesRange();
  const text = useFilterStore.use.text();

  console.log(333, caloriesRange);

  const { dismiss } = useBottomSheetModal();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [filters, setFilters] = useState({
    text,
    minCalories: caloriesRange[0],
    maxCalories: caloriesRange[1],
    categories: categories,
    minPreparationTime: preparationTimeRange[0],
    maxPreparationTime: preparationTimeRange[1],
  });

  const filterObject = {
    text,
    categories,
    preparationTimeRange,
    caloriesRange,
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

  const loadNextPage = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const openBottomSheetFilters = () => {
    Keyboard.dismiss();

    if (bottomSheetRef.current) {
      bottomSheetRef.current.present();
    }
  };

  const getRecipes = useMemo(() => {
    if (recipess && recipess.pages) {
      const recipes = recipess.pages.flatMap((page) => page);

      return recipes;
    }
  }, [recipess]);

  const toggleCategory = useCallback((id: number) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      categories: prevFilters.categories.map((category) =>
        category.id === id ? { ...category, checked: !category.checked } : category,
      ),
    }));
  }, []);

  const setFiltersAction = useFilterStore.use.setFiltersAction();
  const resetFiltersAction = useFilterStore.use.resetFiltersAction();

  const applyFilters = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      text: filters.text,
      minCalories: filters.minCalories,
      maxCalories: filters.maxCalories,
      minPreparationTime: filters.minPreparationTime,
      maxPreparationTime: filters.maxPreparationTime,
      categories: filters.categories,
    }));

    setFiltersAction(filters);

    dismiss();
  };

  const clearFilters = () => {
    setFilters({
      text: "",
      minCalories: 0,
      maxCalories: MAX_CALORIES,
      minPreparationTime: 0,
      maxPreparationTime: MAX_PREPARATION_TIME,
      categories: RECIPE_TYPES.map((category, index) => ({
        id: index,
        label: category.label,
        value: category.value,
        checked: false,
      })),
    });

    resetFiltersAction();

    dismiss();
  };

  const applyText = () => {
    setFiltersAction({ ...filters, text: filters.text });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
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
              <TouchableOpacity onPress={openBottomSheetFilters}>
                <RNIcon
                  color={colors.accent200}
                  name={"filter"}
                />
              </TouchableOpacity>
            }
          />
        </RNShadowView>
      </View>

      {isLoading ? (
        <View
          style={{ gap: spacing.spacing16, paddingHorizontal: spacing.spacing24, paddingTop: 30 }}
        >
          {Array(8)
            .fill(null)
            .map((_: number, key: number) => (
              <Skeleton
                key={key}
                colorMode="light"
                width="100%"
                height={100}
              />
            ))}
        </View>
      ) : getRecipes && getRecipes.length ? (
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: spacing.spacing24,
            paddingTop: 30,
            paddingBottom: 110,
          }}
          scrollEnabled={getRecipes && getRecipes?.length > 4}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: spacing.spacing16 }} />}
          data={getRecipes}
          renderItem={({ item }) => <RecipeSearchResultItem recipe={item} />}
          onEndReached={loadNextPage}
          scrollEventThrottle={16}
        />
      ) : (
        <View
          style={{ alignItems: "center", paddingTop: spacing.spacing64, gap: spacing.spacing48 }}
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
                  onPress={clearFilters}
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
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  searchText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchBar: {
    height: 40,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 10,
  },
  contentContainer: {
    paddingTop: 10,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    width: "100%",
    paddingHorizontal: 24,
  },
  $applyBtnStyle: {
    marginHorizontal: spacing.spacing16,
    backgroundColor: colors.accent200,
    height: 64,
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
});

export default SearchScreen;
