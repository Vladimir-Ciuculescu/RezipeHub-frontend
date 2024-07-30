import { Text, Dimensions, StyleSheet } from "react-native";
import React from "react";
import { View } from "react-native-ui-lib";
import { spacing } from "@/theme/spacing";
import { $sizeStyles } from "@/theme/typography";
import { colors } from "@/theme/colors";
import { IngredientItem } from "@/types/ingredient";

const { width } = Dimensions.get("screen");

interface IngredientsListProps {
  ingredients: IngredientItem[];
}

const IngredientsList: React.FC<IngredientsListProps> = ({ ingredients }) => {
  return (
    <View style={styles.$containerStyle}>
      <View
        row
        style={{ justifyContent: "space-between" }}
      >
        <Text style={[$sizeStyles.l]}>Ingredients</Text>
        <Text style={[$sizeStyles.n, { color: colors.greyscale350 }]}>
          {ingredients.length} items
        </Text>
      </View>
      {ingredients.map((ingredient) => (
        <View
          style={styles.$innerContainerStyle}
          key={`${ingredient.foodId}-${ingredient.title}`}
        >
          <Text style={[$sizeStyles.n, { fontFamily: "sofia700" }]}>{ingredient.title}</Text>
          <Text style={[$sizeStyles.n, { fontFamily: "sofia700" }]}>
            {ingredient.quantity} {ingredient.measure}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default IngredientsList;

const styles = StyleSheet.create({
  $containerStyle: {
    width,
    padding: 10,
    gap: spacing.spacing12,
    paddingHorizontal: spacing.spacing16,
  },

  $innerContainerStyle: {
    height: 80,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.spacing24,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#171717",
    // Shadow for iOS
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    // Shadow for Android
    elevation: 5,
  },
});
