import { Text, Dimensions, StyleSheet, Pressable } from "react-native";
import React from "react";
import { View } from "react-native-ui-lib";
import { spacing } from "@/theme/spacing";
import { $sizeStyles } from "@/theme/typography";
import { colors } from "@/theme/colors";
import { IngredientItem } from "@/types/ingredient.types";
import { Skeleton } from "moti/skeleton";
import Animated from "react-native-reanimated";
import SwipeableListItem from "./SwipeableItem";
import { formatFloatingValue } from "@/utils/formatFloatingValue";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("screen");

interface IngredientListItemProps {
  ingredient: IngredientItem;
  editable: boolean;
  onEdit: (ingredient: IngredientItem) => void;
  onDelete?: (ingredient: IngredientItem) => void;
}

const IngredientListItem: React.FC<IngredientListItemProps> = ({
  ingredient,
  editable,
  onDelete,
  onEdit,
}) => {
  return editable ? (
    <SwipeableListItem
      onEdit={() => onEdit!(ingredient)}
      actions={["delete", "edit"]}
      onDelete={() => onDelete!(ingredient)}
    >
      <View style={styles.$ingredientContainerStyle}>
        <View>
          <Text style={styles.$ingredientLabelStyle}>{ingredient.title}</Text>
          <Text style={styles.$ingredientInfoStyle}>
            {ingredient.quantity} {ingredient.measure},{" "}
            {formatFloatingValue(ingredient.calories as number)} calories
          </Text>
        </View>
        <Animated.View>
          <AntDesign
            name="right"
            color={colors.accent200}
            size={24}
          />
        </Animated.View>
      </View>
    </SwipeableListItem>
  ) : (
    <View
      style={styles.$innerContainerStyle}
      key={`${ingredient.foodId}-${ingredient.title}`}
    >
      <Text style={[$sizeStyles.n, { fontFamily: "sofia700" }]}>{ingredient.title}</Text>
      <Text style={[$sizeStyles.n, { fontFamily: "sofia700" }]}>
        {ingredient.quantity} {ingredient.measure}
      </Text>
    </View>
  );
};

interface IngredientsListProps {
  ingredients: IngredientItem[];
  editable: boolean;
  onDelete?: (ingredient: IngredientItem) => void;
  onEdit?: (ingreidient: IngredientItem) => void;
  loading: boolean;
  mode: "edit" | "view";
}

const IngredientsList: React.FC<IngredientsListProps> = ({
  loading,
  ingredients,
  editable,
  onDelete,
  onEdit,
  mode,
}) => {
  const isNotEditable = !editable;

  const router = useRouter();

  const goToSearchIngredient = () => {
    router.navigate("edit_recipe/recipe_edit_search_ingredients");
  };

  return (
    <View style={[styles.$containerStyle, isNotEditable && styles.$notEditableContainerStyle]}>
      <View
        row
        style={styles.$ingredientsContainerStyle}
      >
        <Text style={[$sizeStyles.l]}>
          Ingredients{"  "}
          {mode !== "view" && (
            <Text style={{ ...$sizeStyles.l, color: colors.greyscale300 }}>
              ({ingredients.length})
            </Text>
          )}
        </Text>

        {mode === "view" ? (
          <Text style={[$sizeStyles.n, { color: colors.greyscale350 }]}>
            {ingredients.length} items
          </Text>
        ) : (
          <Pressable onPress={goToSearchIngredient}>
            <AntDesign
              name="plus"
              size={24}
              color={colors.accent200}
            />
          </Pressable>
        )}
      </View>

      {ingredients.length ? (
        <React.Fragment>
          {ingredients.map((ingredient, key) => (
            <IngredientListItem
              onDelete={onDelete}
              //@ts-ignore
              onEdit={onEdit}
              editable={editable}
              ingredient={ingredient}
              key={`${ingredient.foodId}-${key}`}
            />
          ))}
        </React.Fragment>
      ) : loading ? (
        <Skeleton.Group show>
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

export default IngredientsList;

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

  $stepContainerStyle: {
    gap: spacing.spacing16,
    alignItems: "flex-start",
    width: "100%",
    paddingRight: spacing.spacing64,
  },
  $stepInfoStyle: {
    height: 28,
    width: 28,
    borderRadius: spacing.spacing8,
    backgroundColor: colors.greyscale150,
    alignItems: "center",
  },

  $ingredientLabelStyle: {
    ...$sizeStyles.l,
    fontFamily: "sofia800",
  },
  $ingredientInfoStyle: {
    ...$sizeStyles.n,
    fontFamily: "sofia800",
    color: colors.greyscale300,
  },

  $ingredientsContainerStyle: {
    justifyContent: "space-between",
    paddingHorizontal: spacing.spacing16,
    marginBottom: spacing.spacing16,
  },

  $ingredientContainerStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
