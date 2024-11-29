import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  Keyboard,
  ActivityIndicator,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import RNIcon from "@/components/shared/RNIcon";
import { $sizeStyles } from "@/theme/typography";
import { spacing } from "@/theme/spacing";
import { colors } from "@/theme/colors";
import IngredientAccordion from "@/components/IngredientAccordion";
import RnInput from "@/components/shared/RNInput";
import FoodService from "@/api/services/food.service";
import { AntDesign } from "@expo/vector-icons";
import RNShadowView from "@/components/shared/RNShadowView";
import { Skeleton } from "moti/skeleton";
import { No_results, Search_placeholder } from "@/assets/illustrations";
import RNPressable from "@/components/shared/RNPressable";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/scale";

const { width, height } = Dimensions.get("screen");

const RecipeEditSearchIngredients = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [text, setText] = useState("");
  const [debouncedText, setDebouncedText] = useState(text);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <RNPressable onPress={goBack}>
          <RNIcon
            height={moderateScale(20)}
            width={moderateScale(20)}
            name="arrow_left"
          />
        </RNPressable>
      ),

      headerTitle: () => <Text style={[$sizeStyles.h3]}>Search ingredient</Text>,
    });
  }, [navigation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(text);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [text]);

  useEffect(() => {
    if (debouncedText !== "") {
      setHasSearched(true);
      fetchResults();
    } else if (hasSearched) {
      // Only clear results if user has performed at least one search
      setResults([]);
    }
  }, [debouncedText]);

  const clearSearch = () => {
    setText("");
  };

  const goBack = () => {
    router.back();
  };

  const fetchResults = async () => {
    setIsLoading(true);

    setResults([]);
    const data = await FoodService.searchFood(debouncedText);

    setResults(data.hints);
    setIsLoading(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.$containerstyle}>
        <View style={styles.$innerContainerStyle}>
          <RNShadowView style={{ marginHorizontal: spacing.spacing16 }}>
            <RnInput
              wrapperStyle={styles.$seachInputStyle}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
              containerStyle={{ borderColor: "transparent" }}
              placeholder="Search"
              blurOnSubmit={false}
              value={text}
              onChangeText={setText}
              leftIcon={
                isLoading ? (
                  <ActivityIndicator
                    size={moderateScale(24)}
                    color={colors.accent200}
                  />
                ) : (
                  <RNIcon
                    color={colors.accent200}
                    name="search"
                  />
                )
              }
              rightIcon={
                text ? (
                  <Pressable onPress={clearSearch}>
                    <AntDesign
                      name="close"
                      size={moderateScale(24)}
                      color={colors.accent200}
                    />
                  </Pressable>
                ) : undefined
              }
            />
          </RNShadowView>

          {isLoading ? (
            <View
              style={{
                gap: spacing.spacing16,
                paddingHorizontal: spacing.spacing16,
                paddingTop: spacing.spacing12,
              }}
            >
              <Skeleton.Group show>
                {Array(10)
                  .fill(null)
                  .map((_, index) => (
                    <Skeleton
                      key={index}
                      colorMode="light"
                      height={moderateScale(50)}
                      width="100%"
                    />
                  ))}
              </Skeleton.Group>
            </View>
          ) : !hasSearched || text.trim() === "" ? (
            <View
              style={{
                alignItems: "center",
                paddingTop: verticalScale(spacing.spacing64),
                gap: spacing.spacing48,
              }}
            >
              <Search_placeholder
                height={height / 3}
                width={width}
              />
              <Text style={{ color: colors.slate900, ...$sizeStyles.h3, textAlign: "center" }}>
                Search for ingredients to add{"\n"}to your recipe
              </Text>
            </View>
          ) : results.length === 0 ? (
            <View
              style={{
                alignItems: "center",
                paddingTop: verticalScale(spacing.spacing64),
                gap: spacing.spacing48,
              }}
            >
              <No_results
                height={height / 3}
                width={width}
              />
              <Text style={{ color: colors.slate900, ...$sizeStyles.h3, textAlign: "center" }}>
                Oops, no ingredients found...{"\n"}Try another search term
              </Text>
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={results}
              keyExtractor={(item, index) => "key" + index}
              contentContainerStyle={styles.$flatListContainerStyle}
              renderItem={({ item, index }) => (
                <IngredientAccordion
                  flow="update"
                  key={index}
                  ingredient={item}
                />
              )}
            />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RecipeEditSearchIngredients;

const styles = StyleSheet.create({
  $containerstyle: {
    flex: 1,
    paddingTop: verticalScale(spacing.spacing24),
  },

  $innerContainerStyle: {
    gap: spacing.spacing12,
  },

  $seachInputStyle: {
    width: "100%",
  },

  $flatListContainerStyle: {
    paddingTop: verticalScale(spacing.spacing12),
    paddingBottom: verticalScale(120),
    gap: verticalScale(spacing.spacing16),
    paddingHorizontal: horizontalScale(spacing.spacing16),
  },
});
