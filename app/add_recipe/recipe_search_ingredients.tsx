import { Pressable, StyleSheet, Keyboard, FlatList } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { $sizeStyles } from "@/theme/typography";
import RNIcon from "@/components/shared/RNIcon";
import { spacing } from "@/theme/spacing";
import RnInput from "@/components/shared/RNInput";
import { Text, View } from "react-native-ui-lib";
import { AntDesign } from "@expo/vector-icons";
import FoodService from "@/api/services/food.service";
import { colors } from "@/theme/colors";
import IngredientAccordion from "@/components/IngredientAccordion";

const RecipeSearchIngredients = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [text, setText] = useState("");
  const [results, setResults] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={gotBack}>
          <RNIcon name="arrow_left" />
        </Pressable>
      ),

      headerTitle: () => <Text style={[$sizeStyles.h3]}>Search ingredients</Text>,
    });
  }, [navigation]);

  const gotBack = () => {
    router.back();
  };

  const clearSearch = () => {
    setText("");
  };

  const fetchResults = async () => {
    setResults([]);
    const data = await FoodService.searchFood(text);

    setResults(data.hints);
  };

  const handleSearch = async () => {
    Keyboard.dismiss();
    fetchResults();
  };

  return (
    <View style={styles.$containerstyle}>
      <View style={styles.$innerContainerStyle}>
        <RnInput
          wrapperStyle={styles.$seachInputStyle}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          placeholder="Search"
          blurOnSubmit={false}
          value={text}
          onChangeText={setText}
          leftIcon={<RNIcon name="search" />}
          rightIcon={
            text ? (
              <Pressable onPress={clearSearch}>
                <AntDesign
                  name="close"
                  size={24}
                  color="black"
                />
              </Pressable>
            ) : undefined
          }
        />

        <FlatList
          showsVerticalScrollIndicator={false}
          data={results}
          keyExtractor={(item, index) => "key" + index}
          contentContainerStyle={styles.$flatListContainerStyle}
          renderItem={({ item, index }) => (
            <IngredientAccordion
              flow="create"
              key={index}
              ingredient={item}
            />
          )}
        />
      </View>
    </View>
  );
};

export default RecipeSearchIngredients;

const styles = StyleSheet.create({
  $containerstyle: {
    flex: 1,
    paddingTop: spacing.spacing24,
    backgroundColor: colors.greyscale50,
  },

  $innerContainerStyle: {
    gap: spacing.spacing12,
  },

  $seachInputStyle: {
    paddingHorizontal: 24,
  },

  $flatListContainerStyle: {
    paddingTop: spacing.spacing12,
    paddingBottom: 100,
    gap: spacing.spacing16,
    paddingHorizontal: spacing.spacing16,
  },
});
