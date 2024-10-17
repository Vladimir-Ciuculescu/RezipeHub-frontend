// ShadowCard.js
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import React from "react";
import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";

interface RNShadowViewProps {
  children?: React.JSX.Element | React.JSX.Element[];
  style?: StyleProp<ViewStyle>;
}

const RNShadowView: React.FC<RNShadowViewProps> = ({ children, style }) => {
  const backgroundColor = ((style as ViewStyle)?.backgroundColor || colors.greyscale50) as string;

  return <View style={[{ backgroundColor }, styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",

    // Shadow properties
    // shadowColor: "rgba(6, 51, 54, 0.1)",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 1,
    // shadowRadius: spacing.spacing16,
    // elevation: spacing.spacing4,

    //V2
    // shadowColor: colors.greyscale200,
    // shadowOffset: {
    //   width: 2,
    //   height: 2,
    // },
    // shadowRadius: 16,
    // elevation: 16,
    // shadowOpacity: 1,
    // borderRadius: 16,

    //V3
    shadowColor: colors.greyscale200,
    shadowOffset: {
      width: 0, // Adjust width for a centered shadow
      height: 4, // Increase height for a more pronounced shadow
    },
    shadowRadius: 10, // Adjust for softer shadow
    elevation: 4, // Match with shadow properties
    shadowOpacity: 0.3, // Reduce opacity for a lighter shadow
    borderRadius: 16,
  },
});

export default RNShadowView;
