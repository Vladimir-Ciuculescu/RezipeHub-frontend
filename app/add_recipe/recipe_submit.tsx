import {
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import RNIcon from "@/components/shared/RNIcon";
import { $sizeStyles } from "@/theme/typography";
import { colors } from "@/theme/colors";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import useRecipeStore from "@/zustand/useRecipeStore";
import { spacing } from "@/theme/spacing";
import { View } from "react-native-ui-lib";
import RNSegmentedControl, { SegmentItem } from "@/components/shared/RnSegmentedControl";
import IngredientsList from "@/components/IngredientsList";
import StepsList from "@/components/StepsList";
import useUserData from "@/hooks/useUserData";
import Entypo from "@expo/vector-icons/Entypo";
import FastImage from "react-native-fast-image";
import { useQueryClient } from "@tanstack/react-query";
import NutritionalInfo from "@/components/NutritionalInfo";
import useNutritionalTotals from "@/hooks/useNutritionalTotals";
import {
  useAddRecipeMutation,
  useEditRecipePhotoMutation,
  useUploadToS3Mutation,
} from "@/hooks/recipes.hooks";

const { height, width } = Dimensions.get("screen");

const HEADER_HEIGHT = height / 4;
const SEGMENTS: SegmentItem[] = [{ label: "Ingredients" }, { label: "Instructions" }];

const RecipeSubmit = () => {
  const queryClient = useQueryClient();

  const navigation = useNavigation();
  const router = useRouter();
  const [segmentIndex, setSegmentIndex] = useState(0);
  const inputsFlatlListRef = useRef<FlatList>(null);
  const user = useUserData();

  const title = useRecipeStore.use.title();
  const servings = useRecipeStore.use.servings();
  const photo = useRecipeStore.use.photo();
  const preparationTime = useRecipeStore.use.preparationTime();
  const type = useRecipeStore.use.type();
  const ingredients = useRecipeStore.use.ingredients();
  const steps = useRecipeStore.use.steps();
  const reset = useRecipeStore.use.reset();

  const { mutateAsync: addRecipeMutation, isPending: addRecipePending } = useAddRecipeMutation();
  const { mutateAsync: uploadToS3Mutation, isPending: uploadToS3Pending } = useUploadToS3Mutation();
  const { mutateAsync: editRecipePhotoMutation, isPending: editRecipePhotoPending } =
    useEditRecipePhotoMutation();

  const { totalCalories, totalCarbs, totalFats, totalProteins } = useNutritionalTotals(ingredients);

  const isLoading = addRecipePending || uploadToS3Pending || editRecipePhotoPending;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={goBack}
          disabled={isLoading}
          style={isLoading ? styles.$disabledBackBtnStyle : styles.$enabledBackBtnStyle}
        >
          <RNIcon name="arrow_left" />
        </Pressable>
      ),
      headerRight: () =>
        isLoading ? (
          <ActivityIndicator color={colors.accent200} />
        ) : (
          <TouchableOpacity onPress={handleAddRecipe}>
            <RNIcon
              name="bowl"
              color={colors.accent200}
            />
          </TouchableOpacity>
        ),
      headerTitle: () => <Text style={[$sizeStyles.h3]}>Confirm recipe</Text>,
    });
  }, [navigation, user, isLoading]);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  const handleAddRecipe = async () => {
    try {
      const ingredientsPayload = ingredients.map((ingredient) => {
        //@ts-ignore
        const measures = ingredient.measures?.filter((measure) => measure.label);

        return {
          name: ingredient.title,
          unit: ingredient.measure,
          quantity: parseInt(ingredient.quantity as string),
          calories: ingredient.calories!,
          carbs: ingredient.carbs!,
          proteins: ingredient.proteins!,
          fats: ingredient.fats!,

          foodId: ingredient.foodId,
          measures,
        };
      });

      const stepsPayload = steps.map((step) => ({
        text: step.description,
        step: step.number,
      }));

      const payload: any = {
        userId: user!.id,
        title,
        servings,
        ingredients: ingredientsPayload,
        steps: stepsPayload,
        type,
        preparationTime,
      };

      if (photo) {
        payload.photoUrl = photo;
      }

      const recipe = await addRecipeMutation(payload);

      if (photo) {
        const s3Payload = { id: recipe.id, userId: user.id, photoUrl: payload.photoUrl };
        const url = await uploadToS3Mutation(s3Payload);

        await editRecipePhotoMutation({ id: recipe.id, photoUrl: url });

        const newRecipe = {
          id: recipe.id,

          title: recipe.title,
          servings: recipe.servings,
          photoUrl: url,
          preparationTime: recipe.preparationTime,
          totalCalories,
        };

        // queryClient.setQueryData(["recipes-per-user"], (oldData: any) => {
        //   return oldData ? [newRecipe, ...oldData] : [newRecipe];
        // });
        queryClient.invalidateQueries({ queryKey: ["recipes-per-user"] });
      } else {
        const newRecipe = {
          id: recipe.id,
          title: recipe.title,
          servings: recipe.servings,
          preparationTime: recipe.preparationTime,
          totalCalories,
        };

        // queryClient.setQueryData(["recipes-per-user"], (oldData: any) => {
        //   return oldData ? [newRecipe, ...oldData] : [newRecipe];
        // });
        queryClient.invalidateQueries({ queryKey: ["recipes-per-user"] });
      }

      Alert.alert("Success", "Recipe added !", [
        {
          text: "Ok",
          onPress: () => {
            reset();
            router.dismissAll();
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error("Could not add recipe !:", error);
    }
  };

  const goBack = () => {
    router.back();
  };

  const sections = [
    {
      section: (
        <IngredientsList
          mode="view"
          loading={false}
          editable={false}
          ingredients={ingredients}
        />
      ),
    },
    {
      section: (
        <StepsList
          loading={false}
          swipeable={false}
          steps={steps}
        />
      ),
    },
  ];

  const handleSegmentIndex = (index: number) => {
    inputsFlatlListRef.current!.scrollToIndex({ index: index, animated: true });
    setSegmentIndex(index);
  };

  const renderItem: ListRenderItem<any> = ({ item }) => {
    return <View style={{ width }}>{item.section}</View>;
  };

  return (
    <Animated.ScrollView
      contentContainerStyle={styles.$containerStyle}
      showsVerticalScrollIndicator={false}
      ref={scrollRef}
      scrollEventThrottle={16}
    >
      <View style={styles.$headerContainerStyle}>
        <Animated.View style={[styles.$headerStyle, headerAnimatedStyle]}>
          {photo ? (
            <FastImage
              style={styles.$imageContainerstyle}
              source={{
                uri: photo,
                priority: FastImage.priority.normal,
              }}
            />
          ) : (
            <Entypo
              name="camera"
              size={40}
              color={colors.greyscale150}
            />
          )}
        </Animated.View>
      </View>
      <View style={styles.$contentStyle}>
        <View
          style={{
            paddingHorizontal: spacing.spacing24,
            gap: spacing.spacing24,
          }}
        >
          <View
            row
            style={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={[$sizeStyles.h3]}>{title}</Text>

            <View
              row
              style={{ gap: spacing.spacing8, alignItems: "center" }}
            >
              <RNIcon
                name="clock"
                color={colors.greyscale350}
              />
              <Text
                style={{ ...$sizeStyles.n, fontFamily: "sofia400", color: colors.greyscale350 }}
              >
                {preparationTime} Min
              </Text>
            </View>
          </View>

          <NutritionalInfo
            nutritionInfo={{ totalCalories, totalCarbs, totalFats, totalProteins }}
          />

          <RNSegmentedControl
            segments={SEGMENTS}
            initialIndex={segmentIndex}
            borderRadius={16}
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
    </Animated.ScrollView>
  );
};

export default RecipeSubmit;

const styles = StyleSheet.create({
  $containerStyle: {
    paddingBottom: 50,
  },
  $headerContainerStyle: {
    height: HEADER_HEIGHT,
    position: "relative",
  },
  $headerStyle: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.greyscale300,
  },

  scrollView: {
    flex: 1,
  },

  $disabledBackBtnStyle: {
    opacity: 0.5,
  },

  $enabledBackBtnStyle: {
    opacity: 1,
  },

  scrollContent: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: 20,
    color: "#333333",
  },

  $contentStyle: {
    flex: 1,
    paddingTop: spacing.spacing16,
    gap: spacing.spacing24,
    backgroundColor: "white",
    overflow: "hidden",
  },
  $titleContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  $stepContainerStyle: {
    gap: 8,
    marginBottom: 8,
  },

  $imageContainerstyle: {
    width: "100%",
    height: "100%",
  },
});
