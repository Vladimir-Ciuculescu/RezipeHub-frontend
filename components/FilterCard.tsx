import { View, Text, Pressable } from "react-native";
import React from "react";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { AntDesign } from "@expo/vector-icons";
import { $sizeStyles } from "@/theme/typography";
import { horizontalScale, moderateScale } from "@/utils/scale";
import RNPressable from "./shared/RNPressable";

interface FilterCardProps {
  label: string;
  onRemove: () => void;
}

const FilterCard: React.FC<FilterCardProps> = ({ label, onRemove }) => {
  return (
    <View
      style={{
        height: moderateScale(40),
        backgroundColor: colors.accent200,
        borderRadius: spacing.spacing12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: horizontalScale(spacing.spacing8),
        paddingHorizontal: horizontalScale(spacing.spacing8),
      }}
    >
      <Text style={{ ...$sizeStyles.s, fontFamily: "sofia600", color: colors.greyscale50 }}>
        {label}
      </Text>
      <RNPressable onPress={onRemove}>
        <AntDesign
          name="close"
          size={moderateScale(16)}
          color={colors.greyscale50}
        />
      </RNPressable>
    </View>
  );
};

export default FilterCard;
