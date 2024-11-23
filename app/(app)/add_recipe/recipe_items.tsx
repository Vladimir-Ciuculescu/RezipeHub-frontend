import React, { useLayoutEffect } from "react";
import { StyleSheet, Text, Pressable, Alert, ScrollView } from "react-native";
import Animated from "react-native-reanimated";
import { spacing } from "@/theme/spacing";
import { colors } from "@/theme/colors";
import { View } from "react-native-ui-lib";
import { useNavigation, useRouter } from "expo-router";
import RNIcon from "@/components/shared/RNIcon";
import { $sizeStyles } from "@/theme/typography";
import RNButton from "@/components/shared/RNButton";
import useRecipeStore from "@/zustand/useRecipeStore";
import { formatFloatingValue } from "@/utils/formatFloatingValue";
import { AntDesign } from "@expo/vector-icons";
import { IngredientItem } from "@/types/ingredient.types";
import { Step } from "@/types/step.types";
import SwipeableListItem from "@/components/SwipeableItem";
import RNPressable from "@/components/shared/RNPressable";

interface IngredientRowProps {
  ingredient: IngredientItem;
}

interface StepRowProps {
  item: Step;
  index: number;
}

const RecipeItems = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const ingredients = useRecipeStore.use.ingredients();
  const steps = useRecipeStore.use.steps();

  const removeIngredientAction = useRecipeStore.use.removeIngredientAction();
  const removeStepAction = useRecipeStore.use.removeStepAction();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <RNPressable onPress={cancel}>
          <RNIcon name="arrow_left" />
        </RNPressable>
      ),
      headerRight: () => (
        <RNPressable onPress={goNext}>
          <RNIcon name="arrow_right" />
        </RNPressable>
      ),
      headerTitle: () => <Text style={[$sizeStyles.h3]}>Add ingredients</Text>,
    });
  }, [navigation, ingredients, steps]);

  const cancel = () => {
    router.back();
  };

  const goNext = () => {
    if (!ingredients.length) {
      showNoIngredientsMessage();
      return;
    }

    if (!steps.length) {
      showNoStepsMessage();
      return;
    }

    router.navigate("add_recipe/recipe_submit");
  };

  const goToSearchIngredients = () => {
    router.navigate("add_recipe/recipe_search_ingredients");
  };

  const gotToAddSteps = () => {
    router.navigate("add_recipe/recipe_add_steps");
  };

  const onEditIngredient = (ingredient: IngredientItem) => {
    const payload = { ...ingredient, quantitiy: parseInt(ingredient.quantity as string) };

    router.navigate({
      pathname: "add_recipe/recipe_confirm_edit_ingredient",
      params: { ingredient: JSON.stringify(payload) },
    });
  };

  const onEditStep = (step: Step) => {
    router.navigate({
      pathname: "add_recipe/recipe_confirm_edit_step",
      params: { step: JSON.stringify(step) },
    });
  };

  const showNoIngredientsMessage = () => {
    Alert.alert("Cannot continue", "Please enter one or more ingredients", [{ text: "OK" }], {
      cancelable: false,
      userInterfaceStyle: "light",
    });
  };

  const showNoStepsMessage = () => {
    Alert.alert("Cannot continue", "Please enter one or more step", [{ text: "OK" }], {
      cancelable: false,
      userInterfaceStyle: "light",
    });
  };

  const IngredientRow: React.FC<IngredientRowProps> = ({ ingredient }) => {
    const { title, quantity, measure, calories } = ingredient;

    return (
      <View style={styles.$ingredientRowContainerStyle}>
        <View>
          <Text style={styles.$ingredientLabelStyle}>{title}</Text>
          <Text style={styles.$ingredientInfoStyle}>
            {quantity} {measure}, {formatFloatingValue(calories as number)} calories
          </Text>
        </View>
        <Animated.View>
          <AntDesign
            name="right"
            color={colors.accent200}
            size={24}
          />
        </Animated.View>
      </View>
    );
  };

  const StepRow: React.FC<StepRowProps> = ({ item, index }) => {
    return (
      <View style={styles.$stepRowContainerStyle}>
        <View
          row
          style={styles.$stepContainerStyle}
        >
          <View style={styles.$stepInfoStyle}>
            <Text style={{ ...$sizeStyles.xl, color: colors.accent200 }}>{index + 1}</Text>
          </View>
          <Text style={styles.$stepDescriptionStyle}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.$scrollViewContentContaierStyle}
      style={styles.$scrollVieContainerStyle}
    >
      <View style={styles.$buttonsContainerstyle}>
        <View>
          {ingredients.map((item, key: number) => (
            <SwipeableListItem
              actions={["edit", "delete"]}
              onEdit={() => onEditIngredient(item)}
              key={`${item.foodId}-${key}`}
              onDelete={() => removeIngredientAction(item)}
            >
              <IngredientRow ingredient={item} />
            </SwipeableListItem>
          ))}
        </View>
        <View
          row
          style={styles.$buttonsRowContainerStyle}
        >
          <RNButton
            onPress={goToSearchIngredients}
            label="Add ingredients"
            style={styles.$btnStyle}
            labelStyle={styles.$btnLabelStyle}
          />
        </View>
        <View>
          {steps.map((item, key: number) => (
            <SwipeableListItem
              actions={["edit", "delete"]}
              key={`${item.id}-${key}`}
              onEdit={() => onEditStep(item)}
              onDelete={() => removeStepAction(item)}
            >
              <StepRow
                item={item}
                index={key}
              />
            </SwipeableListItem>
          ))}
        </View>

        <View
          row
          style={styles.$buttonsRowContainerStyle}
        >
          <RNButton
            onPress={gotToAddSteps}
            label="Add steps"
            style={styles.$btnStyle}
            labelStyle={styles.$btnLabelStyle}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default RecipeItems;

const styles = StyleSheet.create({
  $ingredientRowContainerStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  $stepRowContainerStyle: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  $stepDescriptionStyle: {
    ...$sizeStyles.n,
    color: colors.greyscale400,
    fontFamily: "sofia800",
  },

  $scrollVieContainerStyle: {
    paddingTop: spacing.spacing16,
  },

  $scrollViewContentContaierStyle: {
    paddingBottom: 50,
  },
  $buttonsContainerstyle: {
    gap: spacing.spacing24,
  },
  $buttonsRowContainerStyle: {
    gap: spacing.spacing16,
    paddingHorizontal: spacing.spacing24,
  },
  $ingredientRowStyle: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  $ingredientInfoContainerStyle: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  $ingredientLabelStyle: {
    ...$sizeStyles.l,
    fontFamily: "sofia800",
  },
  $ingredientInfoStyle: {
    ...$sizeStyles.n,
    fontFamily: "sofia800",
    color: colors.greyscale300,
  },
  $rectButtonStyle: {
    flex: 1,
    height: 80,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: "white",
  },

  $rectStepStyle: {
    flex: 1,
    minHeight: 80,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "white",
  },

  $stepContainerStyle: {
    gap: spacing.spacing16,
    alignItems: "flex-start",
    width: "100%",
    paddingRight: spacing.spacing64,
  },

  $stepInfoStyle: {
    height: 28,
    width: 28,
    borderRadius: spacing.spacing8,
    backgroundColor: colors.greyscale150,
    alignItems: "center",
  },

  $btnStyle: {
    backgroundColor: colors.accent200,
    width: "100%",
    flex: 1,
    borderColor: colors.accent200,
    borderWidth: 2,
    borderStyle: "solid",
  },
  $btnLabelStyle: {
    color: colors.greyscale50,
    ...$sizeStyles.n,
    fontFamily: "sofia800",
  },
});
