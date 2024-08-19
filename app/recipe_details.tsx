import {
  Text,
  ImageBackground,
  Dimensions,
  StyleSheet,
  FlatList,
  ListRenderItem,
  Alert,
} from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import RNButton from "@/components/shared/RNButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import { spacing } from "@/theme/spacing";
import { colors } from "@/theme/colors";
import Feather from "@expo/vector-icons/Feather";

import { View } from "react-native-ui-lib";
import { $sizeStyles } from "@/theme/typography";
import RNSegmentedControl, { SegmentItem } from "@/components/shared/RnSegmentedControl";
import IngredientsList from "@/components/IngredientsList";
import StepsList from "@/components/StepsList";
import NutritionalInfo from "@/components/NutritionalInfo";
import { useRecipe } from "@/hooks/recipes.hooks";
import { Skeleton } from "moti/skeleton";
import { MotiView } from "moti";
import { StatusBar } from "expo-status-bar";
import { IngredientItem, IngredientItemResponse } from "@/types/ingredient.types";
import { Step, StepItemResponse } from "@/types/step.types";
import useNutritionalTotals from "@/hooks/useNutritionalTotals";
import { Ionicons } from "@expo/vector-icons";
import * as DropdownMenu from "zeego/dropdown-menu";

const { height, width } = Dimensions.get("screen");

const SEGMENTS: SegmentItem[] = [{ label: "Ingredients" }, { label: "Instructions" }];

interface MenuItem {
  label: string;
  key: string;
  iosIcon: string;
  onSelect: () => void;
}

const RecipeDetails = () => {
  const ITEMS: MenuItem[] = [
    { label: "Edit", key: "edit", iosIcon: "pencil", onSelect: () => openEditModal() },
    {
      label: "Add to favorites",
      key: "favorites",
      iosIcon: "heart",
      onSelect: () => openAddToFavoritesAlert(),
    },
    { label: "Delete", key: "trash", iosIcon: "trash", onSelect: () => openDeleteAlert() },
  ];

  const [index, setIndex] = useState(0);
  const [segmentIndex, setSegmentIndex] = useState(0);

  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: recipe, isLoading } = useRecipe(parseInt(id!));

  const navigation = useNavigation();

  const router = useRouter();

  const inputsFlatlListRef = useRef<FlatList>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <RNButton
          onPress={goBack}
          style={styles.$headerBtnStyle}
          iconSource={() => (
            <AntDesign
              name="close"
              size={24}
              color="black"
            />
          )}
        />
      ),
      headerTitle: "",
      headerRight: () => (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <RNButton
              style={styles.$headerBtnStyle}
              iconSource={() => (
                <Feather
                  name="menu"
                  size={24}
                  color="black"
                />
              )}
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            {ITEMS.map((item) => (
              <DropdownMenu.Item
                onSelect={item.onSelect}
                key={item.key}
              >
                <DropdownMenu.ItemTitle>{item.label}</DropdownMenu.ItemTitle>
                <DropdownMenu.ItemIcon ios={{ name: item.iosIcon }} />
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ),
    });
  }, [navigation, recipe]);

  const handleIndex = (index: number) => {
    setIndex(index);
  };

  const heightValue = height / 2;

  const goBack = () => {
    router.back();
  };

  const openAddToFavoritesAlert = () => {
    Alert.alert("Feature under development", "", [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  };

  const openEditModal = () => {
    router.navigate({ pathname: "/recipe_edit_modal", params: { recipe: JSON.stringify(recipe) } });
  };

  const openDeleteAlert = () => {};

  const ingredients: IngredientItem[] = recipe
    ? recipe.ingredients.map((ingredient: IngredientItemResponse) => ({
        foodId: ingredient.id,
        measure: ingredient.unit,
        quantity: ingredient.quantity,
        title: ingredient.name,
        calories: ingredient.calories,
        carbs: ingredient.carbs,
        proteins: ingredient.proteins,
        fats: ingredient.fats,
      }))
    : [];

  const steps: Step[] = recipe
    ? recipe.steps.map((step: StepItemResponse) => ({
        id: step.id,
        step: step.step,
        number: step.step,
        description: step.text,
      }))
    : [];

  const { totalCalories, totalCarbs, totalFats, totalProteins } = useNutritionalTotals(ingredients);

  const sections = [
    {
      section: (
        <IngredientsList
          loading={isLoading}
          swipeable={false}
          ingredients={ingredients}
        />
      ),
    },
    {
      section: (
        <StepsList
          loading={isLoading}
          swipeable={false}
          steps={steps}
        />
      ),
    },
  ];

  const renderItem: ListRenderItem<any> = ({ item }) => {
    return <View style={{ width }}>{item.section}</View>;
  };

  const handleSegmentIndex = (index: number) => {
    inputsFlatlListRef.current!.scrollToIndex({ index: index, animated: true });
    setSegmentIndex(index);
  };

  return (
    <GestureHandlerRootView>
      <StatusBar style="light" />
      <View style={{ flex: 1 }}>
        {isLoading || !recipe || !recipe.photoUrl ? (
          <View
            style={[
              { height: heightValue },
              styles.$imageBackgroundStyle,
              {
                backgroundColor: colors.greyscale200,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Ionicons
              name="image-outline"
              size={120}
              color={colors.greyscale400}
            />
          </View>
        ) : (
          <ImageBackground
            source={{ uri: recipe ? recipe.photoUrl : "" }}
            resizeMode="cover"
            style={[{ height: heightValue }, styles.$imageBackgroundStyle]}
          />
        )}
        <BottomSheet
          enableOverDrag={false}
          index={index}
          onChange={handleIndex}
          handleIndicatorStyle={styles.$bottomSheetHandleStyle}
          animateOnMount={false}
          backgroundStyle={styles.$bottomSheetBackgroundStyle}
          snapPoints={[height - heightValue + 20, "85%"]}
        >
          <BottomSheetScrollView
            contentContainerStyle={styles.$bottomSheetScrollViewStyle}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.$contentStyle}>
              <View
                style={{
                  paddingHorizontal: spacing.spacing24,
                  gap: spacing.spacing24,
                }}
              >
                {recipe ? (
                  <>
                    <Text style={[$sizeStyles.h3]}>{recipe!.title}</Text>
                    <NutritionalInfo
                      nutritionInfo={{
                        totalCalories,
                        totalCarbs,
                        totalFats,
                        totalProteins,
                      }}
                    />
                  </>
                ) : (
                  <Skeleton.Group show>
                    <Skeleton
                      colorMode="light"
                      height={25}
                      width="40%"
                    />
                    <MotiView style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <MotiView style={{ gap: spacing.spacing16 }}>
                        <MotiView
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: spacing.spacing16,
                          }}
                        >
                          <Skeleton
                            colorMode="light"
                            height={40}
                            width={40}
                          />
                          <Skeleton
                            colorMode="light"
                            height={25}
                            width={100}
                          />
                        </MotiView>
                        <MotiView
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: spacing.spacing16,
                          }}
                        >
                          <Skeleton
                            colorMode="light"
                            height={40}
                            width={40}
                          />
                          <Skeleton
                            colorMode="light"
                            height={25}
                            width={100}
                          />
                        </MotiView>
                      </MotiView>
                      <MotiView style={{ gap: spacing.spacing16 }}>
                        <MotiView
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: spacing.spacing16,
                          }}
                        >
                          <Skeleton
                            colorMode="light"
                            height={40}
                            width={40}
                          />
                          <Skeleton
                            colorMode="light"
                            height={25}
                            width={100}
                          />
                        </MotiView>
                        <MotiView
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: spacing.spacing16,
                          }}
                        >
                          <Skeleton
                            colorMode="light"
                            height={40}
                            width={40}
                          />
                          <Skeleton
                            colorMode="light"
                            height={25}
                            width={100}
                          />
                        </MotiView>
                      </MotiView>
                    </MotiView>
                  </Skeleton.Group>
                )}

                <RNSegmentedControl
                  borderRadius={16}
                  segments={SEGMENTS}
                  initialIndex={segmentIndex}
                  onChangeIndex={handleSegmentIndex}
                />
              </View>

              <FlatList
                scrollEnabled={false}
                ref={inputsFlatlListRef}
                data={sections}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
              />
            </View>
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default RecipeDetails;

const styles = StyleSheet.create({
  $containerStyle: {
    paddingBottom: 50,
  },

  $headerBtnStyle: {
    backgroundColor: "#fff",
    height: 40,
    width: 40,
  },

  $imageBackgroundStyle: {
    width: "100%",
    alignSelf: "center",
    position: "absolute",
    top: 0,
  },

  $bottomSheetHandleStyle: {
    width: 50,
    height: 5,
    borderRadius: spacing.spacing16,
  },

  $bottomSheetBackgroundStyle: {
    backgroundColor: "#fff",
    borderRadius: spacing.spacing24,
  },

  $bottomSheetScrollViewStyle: {
    paddingBottom: 50,
  },

  $contentStyle: {
    flex: 1,
    paddingTop: spacing.spacing16,
    gap: spacing.spacing24,
    backgroundColor: "white",
    overflow: "hidden",
  },
});
