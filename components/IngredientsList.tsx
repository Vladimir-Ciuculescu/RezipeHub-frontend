import { Text, Dimensions, StyleSheet, LayoutChangeEvent, DimensionValue } from "react-native";
import React, { useState } from "react";
import { View } from "react-native-ui-lib";
import { spacing } from "@/theme/spacing";
import { $sizeStyles } from "@/theme/typography";
import { colors } from "@/theme/colors";
import { IngredientItem } from "@/types/ingredient.types";
import { Skeleton } from "moti/skeleton";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import RNIcon from "./shared/RNIcon";

const { width } = Dimensions.get("screen");

const TRANSLATE_X_THRESHOLD = -width * 0.4;

interface IngredientListItemProps {
  ingredient: IngredientItem;
  swipeable: boolean;
  onLeftSwipe?: (id: number) => void;
}

const IngredientListItem: React.FC<IngredientListItemProps> = ({
  ingredient,
  swipeable,
  onLeftSwipe,
}) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const itemHeight = useSharedValue<undefined | DimensionValue>(80);
  const [containerWidth, setContainerWidth] = useState(0);

  const containerStyle = useAnimatedStyle(() => ({
    height: itemHeight.value,
  }));

  const animatedItemStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedIconStyle = useAnimatedStyle(() => {
    opacity.value =
      translateX.value < -width * 0.6
        ? withTiming(0, { duration: 200 })
        : interpolate(
            translateX.value,
            [-containerWidth / 2, -containerWidth / 7.5],
            [1, 0],
            Extrapolation.EXTEND,
          );

    return {
      opacity: opacity.value,
    };
  });

  const tap = Gesture.Pan()
    .onChange((event) => {
      if (event.translationX > 0) return;
      translateX.value = event.translationX;
    })
    .onFinalize((event) => {
      const shouldBeDismissed = event.translationX < TRANSLATE_X_THRESHOLD;
      if (shouldBeDismissed) {
        translateX.value = withTiming(-width, undefined, (isFinished) => {
          if (isFinished) {
            itemHeight.value = withTiming(0, undefined, () => {
              runOnJS(onLeftSwipe!)(ingredient.foodId as number);
            });
          }
        });
        opacity.value = withTiming(0);
      } else {
        translateX.value = withTiming(0);
      }
    });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setContainerWidth(width);

    if (itemHeight.value === "auto") {
      itemHeight.value = height;
    }
  };

  return swipeable ? (
    <Animated.View
      onLayout={handleLayout}
      style={[{ justifyContent: "center" }, containerStyle]}
    >
      <View
        style={{
          height: 30,
          width: 30,
          position: "absolute",
          right: "5%",
          zIndex: 0,
        }}
      >
        <Animated.View style={animatedIconStyle}>
          <RNIcon
            name="trash"
            color={colors.red500}
          />
        </Animated.View>
      </View>
      <GestureDetector gesture={tap}>
        <Animated.View
          style={[animatedItemStyle, styles.$innerContainerStyle]}
          key={`${ingredient.foodId}-${ingredient.title}`}
        >
          <Text style={[$sizeStyles.n, { fontFamily: "sofia700" }]}>{ingredient.title}</Text>
          <Text style={[$sizeStyles.n, { fontFamily: "sofia700" }]}>
            {ingredient.quantity} {ingredient.measure}
          </Text>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  ) : (
    <View
      style={styles.$innerContainerStyle}
      key={`${ingredient.foodId}-${ingredient.title}`}
    >
      <Text style={[$sizeStyles.n, { fontFamily: "sofia700" }]}>{ingredient.title}</Text>
      <Text style={[$sizeStyles.n, { fontFamily: "sofia700" }]}>
        {ingredient.quantity} {ingredient.measure}
      </Text>
    </View>
  );
};

interface IngredientsListProps {
  ingredients: IngredientItem[];
  swipeable: boolean;
  onLeftSwipe?: (id: number) => void;
  loading: boolean;
}

const IngredientsList: React.FC<IngredientsListProps> = ({
  loading,
  ingredients,
  swipeable,
  onLeftSwipe,
}) => {
  return (
    <View style={styles.$containerStyle}>
      {ingredients.length ? (
        <>
          <View
            row
            style={{ justifyContent: "space-between" }}
          >
            <Text style={[$sizeStyles.l]}>Ingredients</Text>
            <Text style={[$sizeStyles.n, { color: colors.greyscale350 }]}>
              {ingredients.length} items
            </Text>
          </View>
          {ingredients.map((ingredient) => (
            <IngredientListItem
              onLeftSwipe={onLeftSwipe}
              swipeable={swipeable}
              ingredient={ingredient}
              key={ingredient.foodId}
            />
          ))}
        </>
      ) : loading ? (
        <Skeleton.Group show>
          <View
            row
            style={{ justifyContent: "space-between" }}
          >
            <Text style={[$sizeStyles.l]}>Ingredients</Text>
          </View>

          {Array(5)
            .fill(null)
            .map((_, key) => {
              return (
                <Skeleton
                  key={key}
                  colorMode="light"
                  height={80}
                  width="100%"
                />
              );
            })}
        </Skeleton.Group>
      ) : null}
    </View>
  );
};

export default IngredientsList;

const styles = StyleSheet.create({
  $containerStyle: {
    width,
    padding: 10,
    gap: spacing.spacing12,
    paddingHorizontal: spacing.spacing16,
  },

  $innerContainerStyle: {
    height: 80,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.spacing24,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#171717",

    // Shadow for iOS
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    // Shadow for Android
    elevation: 5,
  },
});
