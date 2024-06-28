import { Text, Pressable, StyleSheet, Alert } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { $sizeStyles } from "@/theme/typography";
import RNIcon from "@/components/shared/RNIcon";
import { Dash, View } from "react-native-ui-lib";
import RNButton from "@/components/shared/RNButton";
import { colors } from "@/theme/colors";
import { FontAwesome } from "@expo/vector-icons";
import { spacing } from "@/theme/spacing";

export default function Recipe() {
  const router = useRouter();
  const navigation = useNavigation();
  const cancel = () => {
    router.back();
  };

  const [ingredients, setIngredients] = useState<any[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={cancel}>
          <RNIcon name="arrow_left" />
        </Pressable>
      ),
      headerRight: () => (
        <Pressable onPress={goNext}>
          <RNIcon name="arrow_right" />
        </Pressable>
      ),

      headerTitle: () => <Text style={[$sizeStyles.h3]}>Add ingredients</Text>,
    });
  }, [navigation]);

  const goNext = () => {
    if (!ingredients.length) {
      showNoIngredientsMessage();
    }
  };

  const goToSearchIngredients = () => {
    router.navigate("recipe_modal_stack/recipe_search_ingredients");
  };

  const showNoIngredientsMessage = () => {
    Alert.alert("Cannot continue", "Please enter one or more ingredients", [{ text: "OK" }], {
      cancelable: false,
    });
  };

  return (
    <View style={styles.$containerStyl}>
      <View
        row
        style={{ gap: spacing.spacing16 }}
      >
        <RNButton
          onPress={goToSearchIngredients}
          label="Add ingredients"
          style={styles.$btnStyle}
          labelStyle={styles.$btnLabelStyle}
        />
        <RNButton
          disabled
          label="Edit ingredients"
          style={styles.$btnStyle}
          labelStyle={styles.$btnLabelStyle}
        />
      </View>
      <View
        row
        style={{ justifyContent: "center", alignItems: "center", gap: spacing.spacing12 }}
      >
        <Dash
          containerStyle={{ flex: 1 }}
          style={{ backgroundColor: colors.accent200 }}
        />
        <Text style={[$sizeStyles.h3]}>OR</Text>
        <Dash
          containerStyle={{ flex: 1 }}
          style={{ backgroundColor: colors.accent200 }}
        />
      </View>

      <View
        row
        style={{ gap: spacing.spacing16 }}
      >
        <RNButton
          label="Add instructions"
          style={styles.$btnStyle}
          labelStyle={styles.$btnLabelStyle}
        />
        <RNButton
          disabled
          label="Edit instructions"
          style={styles.$btnStyle}
          labelStyle={styles.$btnLabelStyle}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  $containerStyl: {
    flex: 1,
    gap: spacing.spacing24,
    paddingHorizontal: spacing.spacing24,
    paddingTop: spacing.spacing24,
  },

  $btnStyle: {
    backgroundColor: colors.accent200,
    width: "100%",
    flex: 1,
    borderColor: colors.accent200,
    borderWidth: 2,
    borderStyle: "solid",
  },

  $btnLabelStyle: {
    color: colors.greyscale50,
    ...$sizeStyles.n,
  },
});
