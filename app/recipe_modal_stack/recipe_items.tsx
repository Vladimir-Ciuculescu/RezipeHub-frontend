import React, { useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
  Alert,
  ScrollView,
  ViewStyle,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { GestureHandlerRootView, RectButton } from "react-native-gesture-handler";
import { spacing } from "@/theme/spacing";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { View } from "react-native-ui-lib";
import SwipeableItem from "@/components/SwipeableItem";
import { useNavigation, useRouter } from "expo-router";
import RNIcon from "@/components/shared/RNIcon";
import { $sizeStyles } from "@/theme/typography";
import RNButton from "@/components/shared/RNButton";
import { IngredientItem } from "@/types/ingredient";
import useRecipeStore from "@/zustand/store";
import { formatFloatingValue } from "@/utils/formatFloatingValue";

export default function RecipeItems() {
  const router = useRouter();
  const navigation = useNavigation();
  const containerValue = useSharedValue(-20);
  const paddingLeftValue = useSharedValue(0);
  const opacityValue = useSharedValue(0);
  const opacity2value = useSharedValue(1);

  const [edit, setEdit] = useState(false);

  const items = useRecipeStore.use.ingredients();
  const removeIngredientAction = useRecipeStore.use.removeIngredientAction();

  const editButtonStyle = useAnimatedStyle(() => ({
    paddingLeft: withTiming(paddingLeftValue.value),
    opacity: withTiming(opacityValue.value),
  }));

  const arrowIconStyle = useAnimatedStyle(() => ({
    opacity: withTiming(opacity2value.value),
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
  }, [navigation]);

  const cancel = () => {
    router.back();
  };

  const goNext = () => {
    if (!items.length) {
      showNoIngredientsMessage();
    }
  };

  const goToSearchIngredients = () => {
    router.navigate("recipe_modal_stack/recipe_search_ingredients");
  };

  const showNoIngredientsMessage = () => {
    Alert.alert("Cannot continue", "Please enter one or more ingredients", [{ text: "OK" }], {
      cancelable: false,
    });
  };

  const switchEdit = () => {
    containerValue.value = !edit ? 0 : -20;
    paddingLeftValue.value = !edit ? spacing.spacing16 : 0;
    opacityValue.value = !edit ? 1 : 0;
    opacity2value.value = !edit ? 0 : 1;

    setEdit(!edit);
  };

  interface IngredientRowProps {
    item: IngredientItem;
    style: ViewStyle;
    deleteItem: () => void;
  }

  const IngredientRow: React.FC<IngredientRowProps> = ({ item, style, deleteItem }) => {
    const { title, quantity, measure, calories } = item;

    const AnimatedArrowIcon = Animated.createAnimatedComponent(AntDesign);
    const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

    return (
      <Animated.View style={[styles.$ingredientRowStyle, style]}>
        <AnimatedTouchableOpacity
          style={editButtonStyle}
          onPress={deleteItem}
        >
          <AntDesign
            name="minuscircle"
            size={22}
            color={colors.red600}
          />
        </AnimatedTouchableOpacity>

        <View row>
          <RectButton
            activeOpacity={0}
            style={styles.$rectButtonStyle}
          >
            <View
              row
              flex
              style={styles.$ingredientInfoContainerStyle}
            >
              <View>
                <Text style={styles.$ingredientLabelStyle}>{title}</Text>
                <Text style={styles.$ingredientInfoStyle}>
                  {quantity} {measure}, {formatFloatingValue(calories)} calories
                </Text>
              </View>

              <AnimatedArrowIcon
                style={arrowIconStyle}
                name="right"
                color={colors.accent200}
                size={24}
              />
            </View>
          </RectButton>
        </View>
      </Animated.View>
    );
  };

  interface SwipeableRowProps {
    item: IngredientItem;
  }

  const SwipeableRow: React.FC<SwipeableRowProps> = ({ item }) => {
    const heightValue = useSharedValue(80);

    const containerStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: withTiming(containerValue.value) }],
      height: heightValue.value,
    }));

    const deleteItem = () => {
      heightValue.value = withTiming(0, { duration: 300 }, (isFinished) => {
        if (isFinished) {
          runOnJS(removeIngredientAction)(item.foodId);
        }
      });
    };

    return (
      <SwipeableItem
        isEditing={edit}
        deleteItem={deleteItem}
      >
        <IngredientRow
          deleteItem={deleteItem}
          style={containerStyle}
          item={item}
        />
      </SwipeableItem>
    );
  };

  return (
    <GestureHandlerRootView>
      <ScrollView
        style={styles.$scrollVieContainerStyle}
        contentContainerStyle={styles.$scrollViewContentContainerStyle}
      >
        {items && items.length
          ? items.map((item: IngredientItem, key: number) => (
              <SwipeableRow
                item={item}
                key={key}
              />
            ))
          : null}

        <View style={styles.$buttonsContainerstyle}>
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
              onPress={switchEdit}
              label="Edit ingredients"
              style={styles.$btnStyle}
              labelStyle={styles.$btnLabelStyle}
            />
          </View>

          <View
            row
            style={styles.$buttonsRowContainerStyle}
          >
            <RNButton
              label="Add instructions"
              style={styles.$btnStyle}
              labelStyle={styles.$btnLabelStyle}
            />
            <RNButton
              disabled
              label="Edit instructions"
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

  $rightActionStyle: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },

  $scrollViewContentContainerStyle: {
    gap: spacing.spacing16,
  },

  $buttonsContainerstyle: {
    gap: spacing.spacing24,
    paddingHorizontal: spacing.spacing24,
  },

  $buttonsRowContainerStyle: {
    gap: spacing.spacing16,
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
    justifyContent: "space-between",
    flexDirection: "column",
    backgroundColor: "white",
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
