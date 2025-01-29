import { Text, Dimensions, StyleSheet, Pressable } from "react-native";
import React from "react";
import { View } from "react-native-ui-lib";
import { spacing } from "@/theme/spacing";
import { $sizeStyles } from "@/theme/typography";
import { colors } from "@/theme/colors";
import { Step } from "@/types/step.types";
import { Skeleton } from "moti/skeleton";

import SwipeableListItem from "./SwipeableItem";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import RNPressable from "./shared/RNPressable";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/scale";
import RNShadowView from "./shared/RNShadowView";

const { width } = Dimensions.get("screen");

interface StepListItemProps {
  step: Step;
  swipeable: boolean;
  onDelete?: (step: Step) => void;
  onEdit?: (step: Step) => void;
  number: number;
}

const StepListItem: React.FC<StepListItemProps> = ({
  step,
  swipeable,
  onDelete,
  onEdit,
  number,
}) => {
  return swipeable ? (
    <SwipeableListItem
      actions={["edit", "delete"]}
      onEdit={() => onEdit!(step)}
      onDelete={() => onDelete!(step)}
    >
      <View style={styles.$swipeableStepContainerStyle}>
        <View
          row
          style={styles.$stepContainerStyle}
        >
          <View style={styles.$stepInfoStyle}>
            <Text style={{ ...$sizeStyles.xl, color: colors.accent200 }}>{number + 1}</Text>
          </View>
          <Text
            style={{
              ...$sizeStyles.n,
              color: colors.greyscale400,
              fontFamily: "sofia800",
            }}
          >
            {step.description}
          </Text>
        </View>
      </View>
    </SwipeableListItem>
  ) : (
    <RNShadowView style={styles.$innerContainerStyle}>
      <View style={styles.$stepInfoStyle}>
        <Text style={{ ...$sizeStyles.l, color: colors.accent200 }}>{number + 1}</Text>
      </View>
      <Text style={[$sizeStyles.n, styles.stepText, { fontFamily: "sofia700" }]}>
        {step.description}
      </Text>
    </RNShadowView>
  );
};

interface StepsListProps {
  steps: Step[];
  swipeable: boolean;
  onDelete?: (step: Step) => void;
  onEdit?: (step: Step) => void;
  loading: boolean;
  mode: "view" | "edit";
}

const StepsList: React.FC<StepsListProps> = ({
  steps,
  swipeable,
  loading,
  onDelete,
  onEdit,
  mode,
}) => {
  const isNotEditable = !swipeable;

  const router = useRouter();

  const goToAddSteps = () => {
    router.navigate("/edit_recipe/recipe_edit_add_steps");
  };

  return (
    <View style={[styles.$containerStyle, isNotEditable && styles.$notEditableContainerStyle]}>
      <View
        row
        style={styles.$stepContainer}
      >
        <Text style={[$sizeStyles.l]}>
          Steps{"  "}
          {mode !== "view" && (
            <Text style={{ ...$sizeStyles.l, color: colors.greyscale300 }}>({steps.length})</Text>
          )}
        </Text>
        {mode === "view" ? (
          <Text style={[$sizeStyles.n, { color: colors.greyscale350 }]}>{steps.length} items</Text>
        ) : (
          <RNPressable onPress={() => goToAddSteps()}>
            <AntDesign
              name="plus"
              size={horizontalScale(24)}
              color={colors.accent200}
            />
          </RNPressable>
        )}
      </View>

      {steps.length ? (
        <React.Fragment>
          {steps.map((step, index) => (
            <StepListItem
              onDelete={onDelete}
              onEdit={onEdit}
              swipeable={swipeable}
              step={step}
              key={
                swipeable && step.id
                  ? `${step.id}-${step.description}`
                  : `${index}-${step.description}`
              }
              number={index}
            />
          ))}
        </React.Fragment>
      ) : loading ? (
        <Skeleton.Group show>
          {Array(5)
            .fill(null)
            .map((_, key) => (
              <Skeleton
                key={key}
                colorMode="light"
                height={moderateScale(80)}
                width="100%"
              />
            ))}
        </Skeleton.Group>
      ) : null}
    </View>
  );
};

export default StepsList;

const styles = StyleSheet.create({
  $containerStyle: {
    width,
  },

  $notEditableContainerStyle: {
    padding: verticalScale(12),

    paddingHorizontal: spacing.spacing16,
    gap: spacing.spacing12,
  },

  $innerContainerStyle: {
    minHeight: moderateScale(80),
    display: "flex",
    gap: spacing.spacing16,
    flexDirection: "row",
    alignItems: "flex-start",
    padding: spacing.spacing16,
    backgroundColor: "white",
    borderRadius: 16,
  },
  $stepInfoStyle: {
    height: horizontalScale(28),
    width: horizontalScale(28),
    borderRadius: spacing.spacing8,
    backgroundColor: colors.greyscale150,
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    flex: 1,
  },
  $stepContainerStyle: {
    gap: spacing.spacing16,
    alignItems: "flex-start",
    width: "100%",
    paddingRight: spacing.spacing64,
  },

  $swipeableStepContainerStyle: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  $stepContainer: {
    justifyContent: "space-between",
    paddingHorizontal: spacing.spacing16,
    marginBottom: spacing.spacing16,
  },
  noStepsText: {
    paddingHorizontal: spacing.spacing16,
    color: colors.greyscale350,
    fontStyle: "italic",
  },
});
