import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { StyleSheet, Text, Pressable, Alert, ScrollView } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { GestureHandlerRootView, RectButton, Swipeable } from "react-native-gesture-handler";
import { spacing } from "@/theme/spacing";
import { colors } from "@/theme/colors";
import { View } from "react-native-ui-lib";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import RNIcon from "@/components/shared/RNIcon";
import { $sizeStyles } from "@/theme/typography";
import RNButton from "@/components/shared/RNButton";
import useRecipeStore from "@/zustand/useRecipeStore";
import { formatFloatingValue } from "@/utils/formatFloatingValue";
import SwipeableItem from "@/components/SwipeableItem";
import { AntDesign } from "@expo/vector-icons";
import { IngredientItem } from "@/types/ingredient.types";
import { Step } from "@/types/step.types";

interface IngredientRowProps {
  ingredient: IngredientItem;
}

interface StepRowProps {
  item: Step;
  index: number;
}

export default function RecipeItems() {
  const router = useRouter();
  const navigation = useNavigation();

  //Shared values for ingredient row animated style
  const ingredientPaddingLeft = useSharedValue(0);
  const ingredientOpacity = useSharedValue(0);
  const ingredientArrowOpacity = useSharedValue(1);

  //Shared values for step animated style
  const stepPaddingLeft = useSharedValue(0);
  const stepOpacity = useSharedValue(0);

  const [editIngredients, setEditIngredients] = useState(false);
  const [editSteps, setEditSteps] = useState(false);

  const ingredients = useRecipeStore.use.ingredients();
  const steps = useRecipeStore.use.steps();
  const removeIngredientAction = useRecipeStore.use.removeIngredientAction();
  const removeStepAction = useRecipeStore.use.removeStepAction();

  const ingredientEditButtonStyle = useAnimatedStyle(() => ({
    paddingLeft: withTiming(ingredientPaddingLeft.value),
    opacity: withTiming(ingredientOpacity.value),
  }));

  const stepEditButtonStyle = useAnimatedStyle(() => ({
    paddingLeft: withTiming(stepPaddingLeft.value),
    opacity: withTiming(stepOpacity.value),
  }));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={cancel}>
          <RNIcon name="arrow_left" />
        </Pressable>
      ),
      headerRight: () => (
        <Pressable onPress={goNext}>
          <RNIcon name="arrow_right" />
        </Pressable>
      ),
      headerTitle: () => <Text style={[$sizeStyles.h3]}>Add ingredients</Text>,
    });
  }, [navigation, ingredients, steps]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        switchIngredientsEdit(true);
        switchStepsEdit(true);
      };
    }, []),
  );

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

    router.navigate("recipe_modal_stack/recipe_submit");
  };

  const goToSearchIngredients = () => {
    router.navigate("recipe_modal_stack/recipe_search_ingredients");
  };

  const gotToAddSteps = () => {
    router.navigate("recipe_modal_stack/recipe_add_steps");
  };

  const showNoIngredientsMessage = () => {
    Alert.alert("Cannot continue", "Please enter one or more ingredients", [{ text: "OK" }], {
      cancelable: false,
    });
  };

  const showNoStepsMessage = () => {
    Alert.alert("Cannot continue", "Please enter one or more step", [{ text: "OK" }], {
      cancelable: false,
    });
  };

  const switchIngredientsEdit = (value: boolean) => {
    ingredientPaddingLeft.value = !value ? 16 : 0;
    ingredientOpacity.value = !value ? 1 : 0;
    ingredientArrowOpacity.value = !value ? 0 : 1;
    setEditIngredients(!value);
  };

  const switchStepsEdit = (value: boolean) => {
    stepPaddingLeft.value = !value ? spacing.spacing16 : 10;
    stepOpacity.value = !value ? 1 : 0;
    setEditSteps(!value);
  };

  const IngredientRow: React.FC<IngredientRowProps> = ({ ingredient }) => {
    const { title, quantity, measure, calories } = ingredient;

    return (
      <RectButton
        rippleColor="transparent"
        activeOpacity={0}
        style={styles.$rectButtonStyle}
      >
        <View>
          <Text style={styles.$ingredientLabelStyle}>{title}</Text>
          <Text style={styles.$ingredientInfoStyle}>
            {quantity} {measure}, {formatFloatingValue(calories)} calories
          </Text>
        </View>
        <Animated.View
          style={useAnimatedStyle(() => ({ opacity: withTiming(ingredientArrowOpacity.value) }))}
        >
          <AntDesign
            name="right"
            color={colors.accent200}
            size={24}
          />
        </Animated.View>
      </RectButton>
    );
  };

  const StepRow: React.FC<StepRowProps> = ({ item, index }) => {
    return (
      <RectButton
        rippleColor="transparent"
        activeOpacity={0}
        style={styles.$rectStepStyle}
      >
        <View
          row
          style={styles.$stepContainerStyle}
        >
          <View style={styles.$stepInfoStyle}>
            <Text style={{ ...$sizeStyles.xl, color: colors.accent200 }}>{index + 1}</Text>
          </View>
          <Text
            style={{
              ...$sizeStyles.n,
              color: colors.greyscale400,
              fontFamily: "sofia800",
            }}
          >
            {item.description}
          </Text>
        </View>
      </RectButton>
    );
  };

  const isEditIngredientsDisabled = ingredients.length;

  const isEditStepsDisabled = steps.length;

  return (
    <GestureHandlerRootView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.$scrollViewContentContaierStyle}
        style={styles.$scrollVieContainerStyle}
      >
        <View style={styles.$buttonsContainerstyle}>
          <View>
            {ingredients.map((item) => (
              <SwipeableItem
                key={item.foodId}
                isEditing={editIngredients}
                onDelete={() => removeIngredientAction(item.foodId)}
                rowStyle={styles.$ingredientRowStyle}
                editButtonStyle={ingredientEditButtonStyle}
              >
                <IngredientRow ingredient={item} />
              </SwipeableItem>
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
            <RNButton
              disabled={!isEditIngredientsDisabled}
              onPress={() => switchIngredientsEdit(editIngredients)}
              label="Edit ingredients"
              style={styles.$btnStyle}
              labelStyle={styles.$btnLabelStyle}
            />
          </View>
          <View>
            {steps.map((item, index) => (
              <SwipeableItem
                key={item.number}
                isEditing={editSteps}
                onDelete={() => removeStepAction(item.number)}
                rowStyle={styles.$ingredientRowStyle}
                editButtonStyle={stepEditButtonStyle}
              >
                <StepRow
                  item={item}
                  index={index}
                />
              </SwipeableItem>
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
            <RNButton
              disabled={!isEditStepsDisabled}
              onPress={() => switchStepsEdit(editSteps)}
              label="Edit steps"
              style={styles.$btnStyle}
              labelStyle={styles.$btnLabelStyle}
            />
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: 20,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "white",
  },

  $stepContainerStyle: {
    gap: spacing.spacing16,
    alignItems: "center",
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
