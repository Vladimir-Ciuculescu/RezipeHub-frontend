import { Text, Dimensions, StyleSheet } from "react-native";
import React from "react";
import { View } from "react-native-ui-lib";
import { spacing } from "@/theme/spacing";
import { $sizeStyles } from "@/theme/typography";
import { colors } from "@/theme/colors";
import { Step } from "@/types/step";

const { width } = Dimensions.get("screen");

interface StepsListProps {
  steps: Step[];
}

const StepsList: React.FC<StepsListProps> = ({ steps }) => {
  return (
    <View
      style={{ width, padding: 10, gap: spacing.spacing12, paddingHorizontal: spacing.spacing16 }}
    >
      <View
        row
        style={{ justifyContent: "space-between" }}
      >
        <Text style={[$sizeStyles.l]}>Steps</Text>
        <Text style={[$sizeStyles.n, { color: colors.greyscale350 }]}>{steps.length} items</Text>
      </View>
      {steps.map((step, index) => (
        <View
          key={index}
          style={styles.container}
        >
          <View style={styles.$stepInfoStyle}>
            <Text style={{ ...$sizeStyles.xl, color: colors.accent200 }}>{index + 1}</Text>
          </View>
          <Text style={[$sizeStyles.n, styles.stepText, { fontFamily: "sofia700" }]}>
            {step.description}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default StepsList;

const styles = StyleSheet.create({
  container: {
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
});
