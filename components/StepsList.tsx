import {
  Text,
  Dimensions,
  StyleSheet,
  TextInput,
  DimensionValue,
  LayoutChangeEvent,
} from "react-native";
import React, { useState } from "react";
import { View } from "react-native-ui-lib";
import { spacing } from "@/theme/spacing";
import { $sizeStyles } from "@/theme/typography";
import { colors } from "@/theme/colors";
import { Step } from "@/types/step.types";
import { Skeleton } from "moti/skeleton";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import RNIcon from "./shared/RNIcon";

const { width } = Dimensions.get("screen");

const TRANSLATE_X_THRESHOLD = -width * 0.4;

interface StepListItemProps {
  step: Step;
  swipeable: boolean;
  onLeftSwipe?: (id: number) => void;
  number: number;
}

const StepListItem: React.FC<StepListItemProps> = ({ step, swipeable, onLeftSwipe, number }) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const itemHeight = useSharedValue<undefined | DimensionValue>(80);
  const [containerWidth, setContainerWidth] = useState(0);
  const [value, setValue] = useState(step.description);

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
              runOnJS(onLeftSwipe!)(step.id as number);
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
      style={[containerStyle, { justifyContent: "center" }]}
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
        <Animated.View style={[animatedItemStyle, styles.$innerContainerStyle]}>
          <View style={styles.$stepInfoStyle}>
            <Text style={{ ...$sizeStyles.xl, color: colors.accent200 }}>{number + 1}</Text>
          </View>

          <TextInput
            multiline
            style={[styles.stepText, styles.transparentInput, { fontFamily: "sofia700" }]}
            value={value}
            onChangeText={setValue}
          />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  ) : (
    <View style={styles.$innerContainerStyle}>
      <View style={styles.$stepInfoStyle}>
        <Text style={{ ...$sizeStyles.xl, color: colors.accent200 }}>{number + 1}</Text>
      </View>
      <Text style={[$sizeStyles.n, styles.stepText, { fontFamily: "sofia700" }]}>
        {step.description}
      </Text>
    </View>
  );
};

interface StepsListProps {
  steps: Step[];
  swipeable: boolean;
  onLeftSwipe?: (id: number) => void;
  loading: boolean;
}

const StepsList: React.FC<StepsListProps> = ({ steps, swipeable, loading, onLeftSwipe }) => {
  return (
    <View style={styles.$containerStyle}>
      {steps.length ? (
        <>
          <View
            row
            style={{ justifyContent: "space-between" }}
          >
            <Text style={[$sizeStyles.l]}>Steps</Text>
            <Text style={[$sizeStyles.n, { color: colors.greyscale350 }]}>
              {steps.length} items
            </Text>
          </View>
          {steps.map((step, index) => (
            <StepListItem
              onLeftSwipe={onLeftSwipe}
              swipeable={swipeable}
              step={step}
              key={swipeable ? step.id : index}
              number={index}
            />
          ))}
        </>
      ) : loading ? (
        <Skeleton.Group show>
          <View
            row
            style={{ justifyContent: "space-between" }}
          >
            <Text style={[$sizeStyles.l]}>Steps</Text>
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

export default StepsList;

const styles = StyleSheet.create({
  $containerStyle: {
    width,
    padding: 10,
    gap: spacing.spacing12,
    paddingHorizontal: spacing.spacing16,
  },

  $innerContainerStyle: {
    minHeight: 80,
    display: "flex",
    gap: spacing.spacing16,
    flexDirection: "row",
    alignItems: "flex-start",
    padding: spacing.spacing16,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#171717",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    elevation: 5,
  },
  $stepInfoStyle: {
    height: 28,
    width: 28,
    borderRadius: spacing.spacing8,
    backgroundColor: colors.greyscale150,
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    flex: 1,
    flexWrap: "wrap",
  },
  transparentInput: {
    backgroundColor: "transparent",
    borderWidth: 0, // No borders
    color: "black", // Ensures the text is still visible
  },
});
