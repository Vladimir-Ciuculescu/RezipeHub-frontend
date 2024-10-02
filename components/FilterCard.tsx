import { View, Text, Pressable } from "react-native";
import React from "react";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { AntDesign } from "@expo/vector-icons";
import { $sizeStyles } from "@/theme/typography";

interface FilterCardProps {
  label: string;
  onRemove: () => void;
}

const FilterCard: React.FC<FilterCardProps> = ({ label, onRemove }) => {
  return (
    <View
      style={{
        height: 41,
        backgroundColor: colors.accent200,
        borderRadius: spacing.spacing12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacing.spacing8,
        gap: spacing.spacing8,
      }}
    >
      <Text style={{ ...$sizeStyles.s, fontFamily: "sofia600", color: colors.greyscale50 }}>
        {label}
      </Text>
      <Pressable onPress={onRemove}>
        <AntDesign
          name="close"
          size={16}
          color={colors.greyscale50}
        />
      </Pressable>
    </View>
  );
};

export default FilterCard;
