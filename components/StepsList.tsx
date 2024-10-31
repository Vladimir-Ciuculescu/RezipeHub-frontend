import { Text, Dimensions, StyleSheet } from "react-native";
import React from "react";
import { View } from "react-native-ui-lib";
import { spacing } from "@/theme/spacing";
import { $sizeStyles } from "@/theme/typography";
import { colors } from "@/theme/colors";
import { Step } from "@/types/step.types";
import { Skeleton } from "moti/skeleton";

import SwipeableListItem from "./SwipeableItem";

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
  onDelete?: (step: Step) => void;
  onEdit?: (step: Step) => void;
  loading: boolean;
}

const StepsList: React.FC<StepsListProps> = ({ steps, swipeable, loading, onDelete, onEdit }) => {
  const isNotEditable = !swipeable;

  return (
    <View style={[styles.$containerStyle, isNotEditable && styles.$notEditableContainerStyle]}>
      {steps.length ? (
        <>
          <View
            row
            style={styles.$stepContainer}
          >
            <Text style={[$sizeStyles.l]}>Steps</Text>
            <Text style={[$sizeStyles.n, { color: colors.greyscale350 }]}>
              {steps.length} items
            </Text>
          </View>

          <React.Fragment>
            {steps.map((step, index) => {
              return (
                <StepListItem
                  onDelete={onDelete}
                  onEdit={onEdit}
                  swipeable={swipeable}
                  step={step}
                  key={swipeable ? step.id : index}
                  number={index}
                />
              );
            })}
          </React.Fragment>
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
  },

  $notEditableContainerStyle: {
    padding: 10,
    paddingHorizontal: spacing.spacing16,
    gap: spacing.spacing12,
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
});
