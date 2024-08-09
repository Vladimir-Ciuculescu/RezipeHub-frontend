// ShadowCard.js
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

interface RNShadowViewProps {
  children?: React.JSX.Element | React.JSX.Element[];
  style: ViewStyle;
}

const RNShadowView: React.FC<RNShadowViewProps> = ({ children, style }) => {
  return (
    <View
      style={[{ backgroundColor: style.backgroundColor || colors.greyscale50 }, styles.card, style]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    // Shadow properties
    shadowColor: "rgba(6, 51, 54, 0.1)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: spacing.spacing16,
    elevation: spacing.spacing4,
    borderRadius: 16,
  },
});

export default RNShadowView;
