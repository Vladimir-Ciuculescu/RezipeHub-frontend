import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { spacing } from "@/theme/spacing";
import RecipeSearchResultItem from "@/components/RecipeSearchResultItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import RecipeService from "@/api/services/recipe.service";
import { colors } from "@/theme/colors";
import RNShadowView from "@/components/shared/RNShadowView";
import RnInput from "@/components/shared/RNInput";
import RNIcon from "@/components/shared/RNIcon";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import CategoryFilter from "@/components/CategoryFilter";
import { MAX_CALORIES, MAX_PREPARATION_TIME, RECIPE_TYPES } from "@/constants";
import useFilterStore from "@/zustand/useFilterStore";
import RNSlider from "@/components/Slider/RNSlider";
import { $sizeStyles } from "@/theme/typography";
import RNButton from "@/components/shared/RNButton";
import { Skeleton } from "moti/skeleton";
import { No_results } from "@/assets/illustrations";
import FilterCard from "@/components/FilterCard";
import { CategoryItem } from "@/types/category.types";
import { isEqual } from "lodash";
import { SafeAreaView } from "react-native-safe-area-context";
import useUserData from "@/hooks/useUserData";
import RNPressable from "@/components/shared/RNPressable";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/scale";
import { FlashList } from "@shopify/flash-list";
import RNFadeInView from "@/components/shared/RNFadeInView";
import { useIsFocused } from "@react-navigation/native";
import RNFadeInTransition from "@/components/shared/RNFadeinTransition";

const { width, height } = Dimensions.get("screen");

const SearchScreen = () => {
  const categories = useFilterStore.use.categories();
  const preparationTimeRange = useFilterStore.use.preparationTimeRange();
  const caloriesRange = useFilterStore.use.caloriesRange();
  const text = useFilterStore.use.text();
  const user = useUserData();

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const snapPoints = useMemo(() => ["85%", "85%"], []);

  const renderBackDrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    [],
  );

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

  const isFocused = useIsFocused();

  const filterCopyRef = useRef(filters);
  const initialFilters = useRef(filters);

  const [debouncedText, setDebouncedText] = useState(filters.text);

  const filterObject = {
    userId: user.id,
    text: debouncedText,
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
    //@ts-ignore
    queryFn: RecipeService.getRecipes,
    initialPageParam: { page: 0 },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      return !lastPage || !lastPage.length
        ? undefined
        : { ...lastPageParam, page: lastPageParam.page + 1 };
    },
  });

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedText(filters.text);
    }, 750);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [filters.text]);
  const loadNextPage = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const openBottomSheetFilters = () => {
    Keyboard.dismiss();

    if (bottomSheetRef.current) {
      filterCopyRef.current = filters;

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

    filterCopyRef.current = filters;

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

  const onDismissBottomSheet = () => {
    const filtersChanged = !isEqual(filters, filterCopyRef.current);
    const filtersApplied = !isEqual(filters, initialFilters.current);

    if (filtersChanged) {
      //If there are filters modify from the moment of opening the bottom sheet and save button is not clicked, revert back to initial filters applied
      if (filtersApplied) {
        setFilters(filterCopyRef.current);
        //Otherwise if there are no filters applied in the first place, the user modifies it and doesn't hit Save button, clear them
      } else {
        clearFilters();
      }
    }
  };

  const Filters = () => {
    const { categories, preparationTimeRange, caloriesRange } = filterObject;

    const selectedCategories = categories.filter((category) => category.checked);

    const hasPreparationTimeRange =
      preparationTimeRange[0] !== 0 || preparationTimeRange[1] !== 180;

    const hasCaloriesRange = caloriesRange[0] !== 0 || caloriesRange[1] !== 3000;

    if (selectedCategories.length === 0 && !hasPreparationTimeRange && !hasCaloriesRange) {
      return null;
    }

    const removeCategory = (category: CategoryItem) => {
      setFilters((oldFilters) => ({
        ...oldFilters,
        categories: oldFilters.categories.filter((item) => item.label !== category.label),
      }));

      setFiltersAction({
        ...filters,
        categories: filters.categories.filter((item) => item.label !== category.label),
      });
    };

    const removePreparationTimeRange = () => {
      setFilters((oldFilters) => ({
        ...oldFilters,
        minPreparationTime: 0,
        maxPreparationTime: MAX_PREPARATION_TIME,
      }));

      setFiltersAction({
        ...filters,
        minPreparationTime: 0,
        maxPreparationTime: MAX_PREPARATION_TIME,
      });
    };

    const removeCaloriesRange = () => {
      setFilters((oldFilters) => ({
        ...oldFilters,
        minCalories: 0,
        maxCalories: MAX_CALORIES,
      }));

      setFiltersAction({
        ...filters,
        minCalories: 0,
        maxCalories: MAX_CALORIES,
      });
    };

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: horizontalScale(spacing.spacing16) }}
      >
        <View
          style={{ flexDirection: "row", gap: spacing.spacing8 }}
          onStartShouldSetResponder={() => true}
        >
          {selectedCategories.map((category) => (
            <FilterCard
              onRemove={() => removeCategory(category)}
              key={category.id}
              label={category.label}
            />
          ))}

          {hasPreparationTimeRange && (
            <FilterCard
              onRemove={removePreparationTimeRange}
              label={`${preparationTimeRange[0]} - ${preparationTimeRange[1]} minutes`}
            />
          )}

          {hasCaloriesRange && (
            <FilterCard
              onRemove={removeCaloriesRange}
              label={`${caloriesRange[0]} - ${caloriesRange[1]} Kcal`}
            />
          )}
        </View>
      </ScrollView>
    );
  };

  return (
    <RNFadeInView>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={styles.container}>
          <RNFadeInTransition
            index={1}
            animate={isFocused}
            direction="top"
          >
            <View style={styles.header}>
              <View style={{ paddingHorizontal: spacing.spacing16 }}>
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
                        name="search"
                      />
                    }
                    rightIcon={
                      <RNPressable onPress={openBottomSheetFilters}>
                        <RNIcon
                          color={colors.accent200}
                          name={"filter"}
                        />
                      </RNPressable>
                    }
                  />
                </RNShadowView>
              </View>

              <Filters />
            </View>
          </RNFadeInTransition>

          {isLoading ? (
            <View
              style={{
                gap: spacing.spacing16,
                paddingHorizontal: spacing.spacing24,
                paddingTop: 30,
              }}
            >
              {Array(8)
                .fill(null)
                .map((_: number, key: number) => (
                  <Skeleton
                    key={key}
                    colorMode="light"
                    width="100%"
                    height={moderateScale(100)}
                  />
                ))}
            </View>
          ) : getRecipes && getRecipes.length ? (
            <FlashList
              data={getRecipes}
              renderItem={({ item, index }) => (
                <RNFadeInTransition
                  direction="top"
                  animate={isFocused}
                  key={`notification-event-${index}`}
                  index={2 + (index + 0.25)}
                >
                  <RecipeSearchResultItem recipe={item} />
                </RNFadeInTransition>
              )}
              estimatedItemSize={15}
              onScroll={() => Keyboard.dismiss()}
              onEndReached={loadNextPage}
              ItemSeparatorComponent={() => <View style={{ height: spacing.spacing16 }} />}
              contentContainerStyle={{
                paddingHorizontal: spacing.spacing24,
                paddingTop: verticalScale(30),
                paddingBottom: verticalScale(110),
              }}
              showsVerticalScrollIndicator={false}
            />
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

          <BottomSheetModal
            index={0}
            snapPoints={snapPoints}
            ref={bottomSheetRef}
            onDismiss={onDismissBottomSheet}
            backdropComponent={renderBackDrop}
            handleIndicatorStyle={{ backgroundColor: colors.greyscale300, width: 50, height: 5 }}
            backgroundStyle={{ borderRadius: spacing.spacing24 }}
          >
            <BottomSheetScrollView
              contentContainerStyle={{
                paddingBottom: verticalScale(spacing.spacing32),
              }}
              style={{ flex: 1, height: "100%" }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.$bottomSheetContainerStyle}>
                <View>
                  <Text style={styles.$bottomSheetTitleStyle}>Filters</Text>
                  <View style={{ gap: moderateScale(spacing.spacing32) }}>
                    <View style={{ gap: moderateScale(spacing.spacing16) }}>
                      <Text
                        style={[
                          styles.$bottomSheetSectionStyle,
                          { paddingLeft: horizontalScale(spacing.spacing24) },
                        ]}
                      >
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
                        label="Clear Filters"
                        link
                        style={styles.$clearBtnStyle}
                        labelStyle={styles.$clearBtnLabelStyle}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </BottomSheetScrollView>
          </BottomSheetModal>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </RNFadeInView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: verticalScale(10),
    justifyContent: "space-between",
    gap: spacing.spacing16,
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
    paddingBottom: verticalScale(spacing.spacing32),
  },
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: horizontalScale(spacing.spacing12),
    width: "100%",
    paddingHorizontal: horizontalScale(spacing.spacing24),
  },
  $applyBtnStyle: {
    marginHorizontal: spacing.spacing16,
    backgroundColor: colors.accent200,
    height: moderateScale(64),
  },

  $bottomSheetSectionStyle: {
    ...$sizeStyles.l,
    fontFamily: "sofia800",
  },

  $applyBtnLabelStyle: {
    ...$sizeStyles.n,
    color: colors.greyscale50,
    fontFamily: "sofia800",
  },

  $clearBtnStyle: {
    marginHorizontal: spacing.spacing16,
    height: moderateScale(64),
  },

  $clearBtnLabelStyle: {
    ...$sizeStyles.n,
    color: colors.accent200,
    fontFamily: "sofia800",
    fontSize: spacing.spacing16,
  },
});

export default SearchScreen;
