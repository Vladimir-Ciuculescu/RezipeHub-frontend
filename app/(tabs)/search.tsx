import { Keyboard, Pressable, StyleSheet, Text, useWindowDimensions } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import RnInput from "@/components/shared/RNInput";
import RNIcon from "@/components/shared/RNIcon";
import { colors } from "@/theme/colors";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { spacing } from "@/theme/spacing";
import CustomFlatList from "@/components/CustomFlatList/CustomFlatList";
import { $sizeStyles } from "@/theme/typography";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import FiltersBottomSheet from "@/components/FiltersBottomSheet";
import RNSlider from "@/components/Slider/RNSlider";
import { View } from "react-native-ui-lib";
import RNButton from "@/components/shared/RNButton";
import CategoryFilter from "@/components/CategoryFilter";
import { RECIPE_TYPES } from "@/constants";
import useFilterStore from "@/zustand/useFilterStore";
import RNShadowView from "@/components/shared/RNShadowView";
import { formatFloatingValue } from "@/utils/formatFloatingValue";
import FastImage from "react-native-fast-image";

const PADDING_HORIZONTAL = spacing.spacing16;
const GAP = spacing.spacing16;

const MAX_CALORIES = 5000;
const MAX_PREPARATION_TIME = 180;

export default function Search() {
  const CATEGORIES = RECIPE_TYPES.map((category, index) => ({
    id: index,
    label: category.label,
    value: category.value,
    checked: false,
  }));
  const { dismiss } = useBottomSheetModal();
  const [text, setText] = useState("");
  const [splitted, setSplitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [minCalories, setMinCalories] = useState(0);
  const [maxCalories, setMaxCalories] = useState(MAX_CALORIES);
  const [filterCategories, setFilterCategories] = useState(CATEGORIES);
  const [minPreparationTime, setMinPreparationTime] = useState(0);
  const [maxPreparationTime, setMaxPreparationTime] = useState(MAX_PREPARATION_TIME);
  const { width: windowWidth } = useWindowDimensions();
  const fullWidth = windowWidth - PADDING_HORIZONTAL * 2 - GAP;

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const setFiltersAction = useFilterStore.use.setFiltersAction();

  const categories = useFilterStore.use.categories();
  const preparationTimeRange = useFilterStore.use.preparationTimeRange();
  const caloriesRange = useFilterStore.use.caloriesRange();

  const toggleCategory = useCallback((id: number) => {
    setFilterCategories((prevCategories) => {
      return prevCategories.map((category) => {
        if (category.id === id) {
          return {
            ...category,
            checked: !category.checked,
          };
        }
        return category;
      });
    });
  }, []);

  const rLeftButtonStyle = useAnimatedStyle(() => {
    const leftButtonWidth = splitted ? fullWidth - 64 : fullWidth + GAP;

    return {
      width: withTiming(leftButtonWidth),
      opacity: withTiming(1),
    };
  }, [splitted]);

  const rMainButtonStyle = useAnimatedStyle(() => {
    return {
      width: 64,
      marginLeft: withTiming(splitted ? spacing.spacing12 : spacing.spacing12),
      backgroundColor: colors.accent200,
      opacity: withTiming(splitted ? 1 : 0),
    };
  }, [splitted, text]);

  const clearSearch = () => {
    setText("");
  };

  const handleSearch = async () => {
    Keyboard.dismiss();
  };

  const data = Array(25).fill(1);

  const AnimatedFilterBtn = Animated.createAnimatedComponent(Pressable);

  const applyFilters = () => {
    setIsLoading(true);

    let payload: any = {};

    const categoriesPayload = filterCategories
      .filter((category) => category.checked)
      .map((category) => ({ label: category.value }));

    if (filterCategories.length) {
      payload.categories = categoriesPayload;
    }

    payload.caloriesRange = [minCalories, maxCalories];
    payload.preparationTimeRange = [minPreparationTime, maxPreparationTime];

    setFiltersAction(payload);

    setTimeout(() => {
      setIsLoading(false);
      dismiss();
    }, 3000);
  };

  const layout: any = "LIST";

  const renderItem = ({ item }) => {
    return (
      <Pressable
        onPress={() => {}}
        key={item.id}
      >
        <RNShadowView style={styles.$rowContainerStyle}>
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
                    <FastImage
                      source={{ uri: item.photoUrl, cache: FastImage.cacheControl.web }}
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
                      awdawdad
                    </Text>

                    <View
                      row
                      style={{
                        alignItems: "center",
                        gap: spacing.spacing8,
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        row
                        style={{ alignItems: "flex-start", gap: spacing.spacing4 }}
                      >
                        <RNIcon
                          name="fire"
                          style={{ color: colors.greyscale300 }}
                          height={20}
                        />
                        <Text
                          style={[
                            {
                              ...$sizeStyles.s,
                              fontFamily: "sofia800",
                              color: colors.greyscale300,
                            },
                          ]}
                        >
                          {formatFloatingValue(34343.23)} Kcal
                        </Text>
                      </View>
                      <RNIcon
                        name="separator"
                        style={{ color: colors.greyscale300 }}
                      />
                      <View
                        row
                        style={{ alignItems: "center", gap: spacing.spacing4 }}
                      >
                        <RNIcon
                          name="clock"
                          style={{ color: colors.greyscale300 }}
                          height={18}
                        />
                        <Text
                          style={[
                            {
                              ...$sizeStyles.s,
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
                      height={12}
                      width={12}
                    />
                  )}
                />
              </View>
            )}
          </View>
        </RNShadowView>
      </Pressable>
    );
  };

  return (
    <SafeAreaView>
      <CustomFlatList
        contentContainerStyle={styles.$flatListContaienrStyle}
        showsVerticalScrollIndicator={false}
        data={data}
        style={styles.list}
        // TopListElementComponent={
        //   <View
        //     style={{
        //       // borderColor: "orange",
        //       // borderWidth: 5,
        //       height: 70,
        //       width: "100%",
        //       justifyContent: "center",
        //     }}
        //   >
        //     {/* <Text>Filter applied</Text> */}
        //   </View>
        // }
        // renderItem={() => <View style={styles.item} />}
        renderItem={renderItem}
        HeaderComponent={
          <View style={styles.header}>
            <Text style={[{ ...$sizeStyles.h2 }]}>Search a recipe</Text>
          </View>
        }
        StickyElementComponent={
          <View style={styles.$stickyFlatlistComponentStyle}>
            <Animated.View style={[rLeftButtonStyle, styles.button]}>
              <RnInput
                onFocus={() => setSplitted(true)}
                onBlur={() => setSplitted(false)}
                returnKeyType="search"
                wrapperStyle={{ width: "100%" }}
                containerStyle={{ height: "100%" }}
                onSubmitEditing={handleSearch}
                placeholder="Search"
                blurOnSubmit={false}
                value={text}
                onChangeText={setText}
                leftIcon={<RNIcon name="search" />}
                rightIcon={
                  text ? (
                    <Pressable onPress={clearSearch}>
                      <AntDesign
                        name="close"
                        size={24}
                        color="black"
                      />
                    </Pressable>
                  ) : undefined
                }
              />
            </Animated.View>
            <AnimatedFilterBtn
              onPress={() => {
                Keyboard.dismiss();
                bottomSheetRef.current?.present();
              }}
              style={[rMainButtonStyle, styles.button]}
            >
              <RNIcon
                name="filter"
                color={colors.greyscale50}
              />
            </AnimatedFilterBtn>
          </View>
        }
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
                  {filterCategories.map((category) => {
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
                  lowerValue={minCalories}
                  greaterValue={maxCalories}
                  onChangeMinValue={setMinCalories}
                  onChangeMaxValue={setMaxCalories}
                />

                <RNSlider
                  label="Preparation time"
                  unit="minutes"
                  minValue={0}
                  maxValue={MAX_PREPARATION_TIME}
                  lowerValue={minPreparationTime}
                  greaterValue={maxPreparationTime}
                  onChangeMinValue={setMinPreparationTime}
                  onChangeMaxValue={setMaxPreparationTime}
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
}

const borderWidth = 4;

const styles = StyleSheet.create({
  $flatListContaienrStyle: {
    gap: spacing.spacing16,
    paddingHorizontal: spacing.spacing16,
  },

  $stickyFlatlistComponentStyle: {
    width: "100%",
    paddingHorizontal: PADDING_HORIZONTAL,
    flexDirection: "row",
    backgroundColor: colors.greyscale150,
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

  $bottomSheetSectionStyle: {
    ...$sizeStyles.l,
    fontFamily: "sofia800",
  },

  $bottomSheetSectionValueStyle: {
    ...$sizeStyles.l,
    fontFamily: "sofia400",
  },

  $applyBtnStyle: {
    marginHorizontal: spacing.spacing16,
    backgroundColor: colors.accent200,
    height: 64,
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

  header: {
    padding: 20,
    alignItems: "center",
  },

  item: {
    backgroundColor: colors.greyscale150,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },

  button: {
    borderRadius: spacing.spacing16,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    overflow: "hidden",
  },
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    width: "100%",
    paddingHorizontal: 24,
  },

  label: {
    fontSize: 16,
    color: "black",
  },

  activeMark: {
    borderColor: "red",
    borderWidth,
    left: -borderWidth / 2,
  },
  inactiveMark: {
    borderColor: "grey",
    borderWidth,
    left: -borderWidth / 2,
  },
  sliderContainer: {
    paddingVertical: 16,
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  ////
  $segmentLabelStyle: {
    width: 20,
    textAlign: "center",
  },
  $segmentStyle: {
    height: 34,
  },

  $containerStyle: {
    flex: 1,
  },
  $contentContainerStyle: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.spacing24,
    paddingTop: spacing.spacing32,
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
    height: "100%",
    width: 100,
    borderRadius: spacing.spacing16,
  },

  $gridImageStyle: {
    height: 88,
    width: "100%",
    borderRadius: spacing.spacing16,
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

  $emptyContainerStyle: {
    // width: GRID_CONTAINER_SIZE * GRID_COLUMNS,
    height: 198,
    justifyContent: "center",
    alignItems: "center",
  },
});
