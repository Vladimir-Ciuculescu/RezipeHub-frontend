import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from "react-native";
import React, { FC, useEffect, useRef } from "react";
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";
import { spacing } from "@/theme/spacing";
import { useRouter } from "expo-router";
import { IngredientResponse, Nutrient } from "@/types/ingredient.types";
import { $sizeStyles } from "@/theme/typography";
import { colors } from "@/theme/colors";
import { formatFloatingValue } from "@/utils/formatFloatingValue";

const COLLAPSED_HEIGHT = 50;

const baseSpringConfig = {
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
  reduceMotion: ReduceMotion.System,
};

const getSpringConfig = (isExpanding: boolean) => ({
  ...baseSpringConfig,
  damping: isExpanding ? 17 : 25,
  stiffness: isExpanding ? 100 : 120,
});

const nutrientLabels: { key: keyof Nutrient; label: string }[] = [
  { key: "ENERC_KCAL", label: "Calories" },
  { key: "PROCNT", label: "Proteins" },
  { key: "CHOCDF", label: "Carbohydrates" },
  { key: "FIBTG", label: "Fibers" },
  { key: "FAT", label: "Fats" },
];

interface IngredientAccordionProps {
  ingredient: IngredientResponse;
}
const IngredientAccordion: FC<IngredientAccordionProps> = ({ ingredient }) => {
  const router = useRouter();

  const fullHeight = useRef(0);
  const progress = useSharedValue(0);
  const iconRotation = useSharedValue<string>("0deg");
  const height = useSharedValue<number | undefined>(undefined);
  const accordionAnimatedStyle = useAnimatedStyle(() => {
    return { height: height.value };
  });

  const handleAccordionPress = () => {
    const isExpanding = progress.value === 0;
    progress.value = withSpring(isExpanding ? 1 : 0, getSpringConfig(isExpanding));
    height.value = withSpring(
      isExpanding ? fullHeight.current : COLLAPSED_HEIGHT,
      getSpringConfig(isExpanding),
    );
    iconRotation.value = withSpring(`${isExpanding ? 45 : 0}deg`, { damping: 15 });
  };

  const handleOnLayout = (event: LayoutChangeEvent) => {
    if (!fullHeight.current) {
      fullHeight.current = Math.ceil(event.nativeEvent.layout.height);
      height.value = COLLAPSED_HEIGHT;
    }
  };

  const gotToConfirmIngredient = () => {
    router.navigate({
      pathname: "add_recipe/recipe_confirm_ingredient",
      params: { ingredient: JSON.stringify(ingredient) },
    });
  };

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  return (
    <View style={styles.$containerStyle}>
      <AnimatedPressable
        onPress={gotToConfirmIngredient}
        onLayout={handleOnLayout}
        style={[styles.$pressableContainerStyle, accordionAnimatedStyle]}
      >
        <Animated.View style={{ gap: spacing.spacing16 }}>
          <View style={styles.header}>
            <View style={styles.$titleContainerstyle}>
              <AnimatedPressable
                style={{ transform: [{ rotate: iconRotation }] }}
                onPress={handleAccordionPress}
              >
                <AntDesign
                  name="plus"
                  size={24}
                  color="black"
                />
              </AnimatedPressable>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.title}
              >
                {ingredient.food.label}
              </Text>
            </View>
            <AntDesign
              name="right"
              size={24}
              color="black"
            />
          </View>

          {nutrientLabels.map(({ key, label }) => {
            const value = ingredient.food.nutrients[key];
            return value || value === 0 ? (
              <Text
                key={key}
                style={styles.$nutrientInfoStyle}
              >
                {label}:{" "}
                <Text style={styles.$nutrientValueStyle}>{formatFloatingValue(value)}</Text>
              </Text>
            ) : null;
          })}
        </Animated.View>
      </AnimatedPressable>
    </View>
  );
};

export default IngredientAccordion;

const styles = StyleSheet.create({
  $containerStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.spacing12,
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

  $titleContainerstyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.spacing12,
    flex: 1,
  },

  $pressableContainerStyle: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 6,
    paddingVertical: 12,

    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    ...$sizeStyles.l,
    flex: 1,
  },
  $nutrientInfoStyle: {
    ...$sizeStyles.n,
    color: colors.greyscale300,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  $nutrientValueStyle: {
    ...$sizeStyles.l,
  },
});
