import { colors } from "@/theme/colors";
import React from "react";
import { View, StyleSheet, ViewStyle, StyleProp, Platform } from "react-native";

interface RNShadowViewProps {
  children?: React.JSX.Element | React.JSX.Element[];
  style?: StyleProp<ViewStyle>;
}

const RNShadowView: React.FC<RNShadowViewProps> = ({ children, style }) => {
  const backgroundColor = ((style as ViewStyle)?.backgroundColor || colors.greyscale50) as string;

  const shadowStyles = {
    // Common properties
    borderRadius: 16,
    backgroundColor: "white",

    // Platform-specific shadows
    ...Platform.select({
      ios: {
        shadowColor: colors.greyscale200,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowRadius: 8,
        shadowOpacity: 0.25,
      },
      android: {
        elevation: 6,
        shadowColor: colors.greyscale200,
      },
    }),
  };

  return <View style={[{ backgroundColor }, styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",

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
