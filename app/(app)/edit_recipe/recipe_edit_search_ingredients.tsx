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
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
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
import { FlashList } from "@shopify/flash-list";
import RNFadeInTransition from "@/components/shared/RNFadeinTransition";
import { useIsFocused } from "@react-navigation/native";

const { width, height } = Dimensions.get("screen");

const RecipeEditSearchIngredients = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const isFocused = useIsFocused();
  const [text, setText] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const memoizedResults = useMemo(() => results, [results]);

  const clearSearch = () => {
    setText("");
  };

  const goBack = () => {
    router.back();
  };

  const fetchResults = async () => {
    setIsLoading(true);

    setResults([]);
    const data = await FoodService.searchFood(text);

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
              returnKeyType="search"
              onSubmitEditing={() => {
                Keyboard.dismiss();
                fetchResults();
              }}
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
          ) : !memoizedResults.length ? (
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
            <FlashList
              estimatedItemSize={80}
              showsVerticalScrollIndicator={false}
              data={memoizedResults}
              keyExtractor={(_, index) => "key" + index}
              contentContainerStyle={styles.$flatListContainerStyle}
              ItemSeparatorComponent={() => <View style={{ height: spacing.spacing16 }} />}
              renderItem={({ item, index }) => (
                <RNFadeInTransition
                  direction="top"
                  animate={isFocused}
                  key={`notification-event-${index}`}
                  index={2 + (index + 0.25)}
                >
                  <IngredientAccordion
                    flow="update"
                    key={index}
                    ingredient={item}
                  />
                </RNFadeInTransition>
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
    gap: verticalScale(spacing.spacing12),
    height: "100%",
    width: "100%",
  },

  $seachInputStyle: {
    width: "100%",
  },

  $flatListContainerStyle: {
    paddingTop: verticalScale(spacing.spacing12),
    paddingBottom: verticalScale(120),
    // gap: verticalScale(spacing.spacing16),
    paddingHorizontal: horizontalScale(spacing.spacing16),
  },
});
