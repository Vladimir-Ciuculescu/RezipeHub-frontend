import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { $sizeStyles } from "@/theme/typography";
import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native-ui-lib";

interface NutritionalItemProps {
  icon: React.JSX.Element;
  quantity: number;
  unitMeasure: string;
  type: string;
}

const NutritionalItem: React.FC<NutritionalItemProps> = ({ icon, quantity, unitMeasure, type }) => {
  return (
    <View
      row
      style={styles.$nutritionalItemContainerStyle}
    >
      <View style={styles.$nutritionalItemIconStyle}>{icon}</View>
      <Text style={styles.$nutrientTextStyle}>
        {quantity}
        {unitMeasure} {type}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  $nutritionalItemContainerStyle: { alignItems: "center", gap: spacing.spacing8 },

  $nutritionalItemIconStyle: {
    width: 40,
    height: 40,
    borderRadius: spacing.spacing8,
    backgroundColor: colors.greyscale150,
    alignItems: "center",
    justifyContent: "center",
  },

  $nutrientTextStyle: {
    ...$sizeStyles.l,
    fontFamily: "sofia400",
  },
});

export default NutritionalItem;
