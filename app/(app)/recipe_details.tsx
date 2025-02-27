import { Text, Dimensions, StyleSheet, FlatList, ListRenderItem, Pressable } from "react-native";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
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
import { useRecipe, useUpdateViewMutation } from "@/hooks/recipes.hooks";
import { Skeleton } from "moti/skeleton";
import { MotiView } from "moti";
import { StatusBar } from "expo-status-bar";
import { IngredientItem, IngredientItemResponse } from "@/types/ingredient.types";
import { Step, StepItemResponse } from "@/types/step.types";
import useNutritionalTotals from "@/hooks/useNutritionalTotals";
import { Ionicons } from "@expo/vector-icons";
import * as DropdownMenu from "zeego/dropdown-menu";
import useRecipeStore from "@/zustand/useRecipeStore";
import { Image } from "expo-image";
import RNIcon from "@/components/shared/RNIcon";
import LottieView from "lottie-react-native";
import { useIsFavorite } from "@/hooks/favorites.hooks";
import FavoritesService from "@/api/services/favorites.service";
import Toast from "react-native-toast-message";
import { useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/scale";
import { checkSubscription } from "@/utils/checkSubscription";
import { useCurrentUser } from "@/context/UserContext";
import { toastConfig } from "@/components/Toast/ToastConfing";

const { height, width } = Dimensions.get("screen");

const SEGMENTS: SegmentItem[] = [{ label: "Ingredients" }, { label: "Instructions" }];

interface MenuItem {
  label: string;
  key: string;
  iosIcon: string;
  androidIcon: string;
  onSelect: () => void;
}

const RecipeDetails = () => {
  const ITEMS: MenuItem[] = [
    {
      label: "Edit",
      key: "edit",
      iosIcon: "pencil",
      androidIcon: "ic_menu_edit",
      onSelect: () => openEditModal(),
    },

    //TODO: Uncomment it when add delete functionality
    // {
    //   label: "Delete",
    //   key: "trash",
    //   iosIcon: "trash",
    //   androidIcon: "ic_menu_delete",
    //   onSelect: () => openDeleteAlert(),
    // },
  ];

  const { bottom } = useSafeAreaInsets();

  const [index, setIndex] = useState(0);

  const [segmentIndex, setSegmentIndex] = useState(0);
  const addInfoAction = useRecipeStore.use.addInfoAction();
  const setIngredientsAction = useRecipeStore.use.setIngredientsAction();
  const setStepsAction = useRecipeStore.use.addStepsAction();

  const { mutateAsync: updateViewCountMutation } = useUpdateViewMutation();

  const queryClient = useQueryClient();

  const navigation = useNavigation();

  const router = useRouter();

  const heartRef = useRef<LottieView>(null);

  const inputsFlatlListRef = useRef<FlatList>(null);

  const [isFavorite, setIsFavotite] = useState(false);

  const { user, favoritesCount, setFavoritesCount } = useCurrentUser();

  const { id, userId, firstName, lastName, recipePhotoUrl, userPhotoUrl } = useLocalSearchParams<{
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    recipePhotoUrl: string;
    userPhotoUrl: string;
  }>();

  const belongsToCurrentUser = parseInt(userId!) === user.id;

  const { data: recipe, isLoading } = useRecipe(parseInt(id!));

  const recipeId = recipe ? recipe.id : null;

  //This api call will not execute unless the recipe id does not exist or  the recipe does not belong to the current logged i user
  const { data: isInFavorites, isFetching } = useIsFavorite(
    { recipeId: parseInt(id!), userId: user.id },
    !!recipeId && !belongsToCurrentUser,
  );

  const updateViewCount = async (recipeId: number) => {
    await updateViewCountMutation(recipeId);
  };

  useFocusEffect(
    useCallback(() => {
      if (!isFetching) {
        updateViewCount(parseInt(id!));
      }

      if (!belongsToCurrentUser && !isFetching) {
        if (isInFavorites) {
          heartRef.current?.play(140, 144);
          setIsFavotite(true);
        } else {
          heartRef.current?.reset();
        }
      }
    }, [id, isInFavorites, isFetching, belongsToCurrentUser]),
  );

  const toggleFavorite = async () => {
    // const favorites = await FavoritesService.getFavorties({
    //   limit: 5,
    //   page: 0,
    //   userId: user.id,
    // });

    //If the recipe is not added to favorites and user has already 3 in list, display paywall
    if (!isFavorite && favoritesCount === 3) {
      const hasSubscription = await checkSubscription();

      if (!hasSubscription) {
        return;
      }
    }

    if (!isFavorite) {
      heartRef.current?.play(30, 40);
    } else {
      heartRef.current?.play(50, 40);
    }

    const payload = { recipeId: parseInt(id!), userId: user.id };

    await FavoritesService.toggleFavoriteRecipe(payload);

    queryClient.invalidateQueries({ queryKey: ["favorites"] });

    if (isFavorite) {
      heartRef.current?.reset();
      setFavoritesCount(favoritesCount - 1);
    } else {
      heartRef.current?.play(40, 144);
      setFavoritesCount(favoritesCount + 1);
    }

    setIsFavotite((oldValue) => !oldValue);

    Toast.show({
      type: "success",
      bottomOffset: -bottom,
      position: "bottom",
      visibilityTime: 1500,
      swipeable: false,
      props: {
        title: isFavorite ? "Recipe removed from favorites !" : "Recipe added to favorites !",
        position: "bottom",

        icon: (
          <AntDesign
            name="check"
            size={24}
            color={colors.greyscale50}
          />
        ),
      },
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <RNButton
          onPress={goBack}
          style={styles.$headerBtnStyle}
          iconSource={() => (
            <AntDesign
              name="close"
              size={moderateScale(24)}
              color="black"
            />
          )}
        />
      ),
      headerTitle: "",
      headerRight: () =>
        belongsToCurrentUser ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <RNButton
                style={styles.$headerBtnStyle}
                iconSource={() => (
                  <Feather
                    name="menu"
                    size={moderateScale(24)}
                    color="black"
                  />
                )}
              />
            </DropdownMenu.Trigger>
            {/* @ts-ignore */}
            <DropdownMenu.Content>
              {ITEMS.map((item) => (
                <DropdownMenu.Item
                  onSelect={item.onSelect}
                  key={item.key}
                >
                  <DropdownMenu.ItemTitle>{item.label}</DropdownMenu.ItemTitle>
                  <DropdownMenu.ItemIcon
                    ios={{ name: item.iosIcon }}
                    androidIconName={item.androidIcon}
                  />
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        ) : (
          <Pressable
            onPress={toggleFavorite}
            style={[
              styles.$headerBtnStyle,
              { borderRadius: spacing.spacing8, justifyContent: "center", alignItems: "center" },
            ]}
          >
            <LottieView
              loop={false}
              ref={heartRef}
              autoPlay={false}
              // style={{
              //   height: 50,
              //   width: 50,
              // }}
              style={{ height: horizontalScale(50), width: horizontalScale(50) }}
              source={require("../../assets/gifs/heart.json")}
            />
          </Pressable>
        ),
    });
  }, [navigation, recipe, isFavorite]);

  const handleIndex = (index: number) => {
    setIndex(index);
  };

  const heightValue = height / 2;

  const goBack = () => {
    router.back();
  };

  const openEditModal = () => {
    const payload = {
      id: recipe?.id,
      title: recipe!.title,
      servings: recipe!.servings,
      photo: recipe!.photoUrl || "",
      preparationTime: recipe!.preparationTime,
      type: recipe!.type,
    };

    const parsedIngredients: IngredientItem[] = recipe!.ingredients.map(
      (ingredient: IngredientItemResponse) => ({
        nutritionalInfoId: ingredient.nutritionalInfoId,
        id: ingredient.id,
        foodId: ingredient.foodId,
        measure: ingredient.unit,
        allMeasures: ingredient.allUnits,
        quantity: ingredient.quantity,
        title: ingredient.name,
        calories: ingredient.calories,
        carbs: ingredient.carbs,
        proteins: ingredient.proteins,
        fats: ingredient.fats,
      }),
    );

    const parsedSteps: Step[] = recipe!.steps.map((step: StepItemResponse) => ({
      id: step.id,
      step: step.step,
      number: step.step,
      description: step.text,
    }));

    addInfoAction(payload);
    setIngredientsAction(parsedIngredients);
    setStepsAction(parsedSteps);

    router.push("/edit_recipe/recipe_edit_summary");
  };

  const openDeleteAlert = () => {};

  const ingredients: IngredientItem[] = recipe
    ? recipe.ingredients.map((ingredient: IngredientItemResponse) => ({
        foodId: ingredient.foodId,
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
          mode="view"
          editable={false}
          loading={isLoading}
          ingredients={ingredients}
        />
      ),
    },
    {
      section: (
        <StepsList
          mode="view"
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
    <>
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
              size={moderateScale(120)}
              color={colors.greyscale400}
            />
          </View>
        ) : (
          <Image
            contentFit="cover"
            transition={300}
            source={{ uri: recipePhotoUrl }}
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
                    <View
                      row
                      style={{
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        ellipsizeMode="tail"
                        style={[$sizeStyles.h3, { maxWidth: "80%" }]}
                      >
                        {recipe!.title}
                      </Text>

                      <View
                        row
                        style={{ gap: spacing.spacing8, alignItems: "center" }}
                      >
                        <RNIcon
                          name="clock"
                          color={colors.greyscale350}
                          height={horizontalScale(20)}
                          width={horizontalScale(20)}
                        />
                        <Text
                          style={{
                            ...$sizeStyles.s,
                            fontFamily: "sofia400",
                            color: colors.greyscale350,
                          }}
                        >
                          {recipe.preparationTime} Min
                        </Text>
                      </View>
                    </View>
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
                      height={moderateScale(25)}
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
                            height={moderateScale(40)}
                            width={horizontalScale(40)}
                          />
                          <Skeleton
                            colorMode="light"
                            height={moderateScale(25)}
                            width={horizontalScale(100)}
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
                            height={horizontalScale(40)}
                            width={horizontalScale(40)}
                          />
                          <Skeleton
                            colorMode="light"
                            height={moderateScale(25)}
                            width={horizontalScale(100)}
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
                            height={horizontalScale(40)}
                            width={horizontalScale(40)}
                          />
                          <Skeleton
                            colorMode="light"
                            height={moderateScale(25)}
                            width={horizontalScale(100)}
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
                            height={horizontalScale(40)}
                            width={horizontalScale(40)}
                          />
                          <Skeleton
                            colorMode="light"
                            height={moderateScale(25)}
                            width={horizontalScale(100)}
                          />
                        </MotiView>
                      </MotiView>
                    </MotiView>
                  </Skeleton.Group>
                )}

                {/* Revisit this  */}
                {!belongsToCurrentUser && firstName && (
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      display: "flex",
                      gap: spacing.spacing16,
                    }}
                  >
                    <View
                      style={{
                        height: 1.5,
                        width: "100%",
                        backgroundColor: colors.greyscale300,
                        justifyContent: "center",
                      }}
                    />

                    <View style={{ gap: spacing.spacing12 }}>
                      <Text style={{ ...$sizeStyles.h3 }}>Creator</Text>

                      <View
                        row
                        style={{ alignItems: "center", gap: spacing.spacing16 }}
                      >
                        {userPhotoUrl ? (
                          <Image
                            source={{ uri: userPhotoUrl }}
                            style={{
                              height: horizontalScale(48),
                              width: horizontalScale(48),
                              borderRadius: spacing.spacing24,
                              borderWidth: 4,
                              borderColor: colors.accent200,
                            }}
                            transition={300}
                            contentFit="fill"
                          />
                        ) : (
                          <View
                            style={{
                              height: horizontalScale(48),
                              width: horizontalScale(48),
                              borderRadius: spacing.spacing24,

                              backgroundColor: colors.greyscale300,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Feather
                              name="user"
                              size={moderateScale(20)}
                              color={colors.greyscale50}
                            />
                          </View>
                        )}
                        <Text style={{ ...$sizeStyles.l }}>{`${firstName} ${lastName}`}</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        height: 1.5,
                        width: "100%",
                        backgroundColor: colors.greyscale300,

                        justifyContent: "center",
                      }}
                    />
                  </View>
                )}

                <RNSegmentedControl
                  borderRadius={16}
                  segments={SEGMENTS}
                  initialIndex={segmentIndex}
                  onChangeIndex={handleSegmentIndex}
                  segmentsStyle={{ height: verticalScale(54) }}
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
      <Toast config={toastConfig} />
    </>
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
    backgroundColor: colors.greyscale75,
    borderRadius: spacing.spacing24,
  },

  $bottomSheetScrollViewStyle: {
    paddingBottom: 50,
    // backgroundColor: "red",
  },

  $contentStyle: {
    flex: 1,
    paddingTop: spacing.spacing16,
    gap: spacing.spacing24,
    backgroundColor: colors.greyscale75,
    overflow: "hidden",
  },
});
