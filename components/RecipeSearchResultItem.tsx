import { Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import RNButton from "./shared/RNButton";
import RNIcon from "./shared/RNIcon";
import { colors } from "@/theme/colors";
import RNShadowView from "./shared/RNShadowView";
import FastImage from "react-native-fast-image";
import { Feather, Ionicons } from "@expo/vector-icons";
import { $sizeStyles } from "@/theme/typography";
import { spacing } from "@/theme/spacing";
import { View } from "react-native-ui-lib";
import { RecipeSearchResponse } from "@/types/recipe.types";
import { useRouter } from "expo-router";

interface RecipeSearchResultItemProps {
  recipe: RecipeSearchResponse;
}

const RecipeSearchResultItem: React.FC<RecipeSearchResultItemProps> = ({ recipe }) => {
  const { user, id } = recipe;

  const router = useRouter();

  const goToRecipeDetails = () => {
    router.navigate({
      pathname: "/recipe_details",
      params: { id, userId: user.id, owner: JSON.stringify(user) },
    });
  };

  return (
    <Pressable
      onPress={goToRecipeDetails}
      key={recipe.id}
    >
      <RNShadowView style={styles.$rowContainerStyle}>
        <View style={[styles.$innerContainerStyle, styles.$innerRowContainerStyle]}>
          <View style={styles.$innerRowInfoStyle}>
            <View style={styles.$contentRowStyle}>
              {recipe.photoUrl ? (
                <FastImage
                  source={{ uri: recipe.photoUrl, cache: FastImage.cacheControl.web }}
                  style={styles.$rowImageStyle}
                />
              ) : (
                <View
                  style={[
                    styles.$rowImageStyle,
                    {
                      backgroundColor: colors.greyscale200,
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  ]}
                >
                  <Ionicons
                    name="image-outline"
                    size={35}
                    color={colors.greyscale400}
                  />
                </View>
              )}
              <View
                style={{
                  flex: 1,
                  paddingVertical: spacing.spacing4,
                }}
              >
                <Text
                  numberOfLines={2}
                  style={styles.$rowTextStyle}
                >
                  {recipe.title}
                </Text>

                <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.spacing8 }}>
                  {user.photoUrl ? (
                    <FastImage
                      source={{
                        uri: user.photoUrl,
                      }}
                      style={{
                        width: spacing.spacing24,
                        height: spacing.spacing24,
                        borderRadius: spacing.spacing32,
                      }}
                    />
                  ) : (
                    <View
                      style={{
                        width: spacing.spacing24,
                        height: spacing.spacing24,
                        borderRadius: spacing.spacing32,
                        backgroundColor: colors.greyscale200,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Feather
                        name="user"
                        color={colors.greyscale350}
                        size={16}
                      />
                    </View>
                  )}
                  <Text
                    style={{ ...$sizeStyles.s, fontFamily: "sofia400", color: colors.greyscale300 }}
                  >{`${user.firstName} ${user.lastName}`}</Text>
                </View>
              </View>
            </View>
            <RNButton
              style={styles.$userDetailsBtnStyle}
              iconSource={() => (
                <RNIcon
                  name="arrow_right"
                  color={colors.greyscale50}
                  height={14}
                  width={14}
                />
              )}
            />
          </View>
        </View>
      </RNShadowView>
    </Pressable>
  );
};

export default RecipeSearchResultItem;

const styles = StyleSheet.create({
  $rowContainerStyle: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: spacing.spacing16,
    backgroundColor: colors.greyscale50,
  },
  $innerContainerStyle: {
    borderRadius: spacing.spacing16,
    width: "100%",
  },

  $innerRowContainerStyle: {
    height: 100,
    paddingLeft: spacing.spacing8,
    paddingRight: spacing.spacing16,
    paddingVertical: spacing.spacing8,
  },

  $innerRowInfoStyle: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },

  $contentRowStyle: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.spacing12,
    flexShrink: 1,
    height: "100%",
    width: "100%",
  },
  $rowImageStyle: {
    height: "100%",
    width: 100,
    borderRadius: spacing.spacing16,
  },
  $rowTextStyle: {
    flex: 1,
    flexWrap: "wrap",
    fontFamily: "sofia800",
    color: colors.greyscale500,
    paddingRight: spacing.spacing4,
  },
  $userDetailsBtnStyle: {
    backgroundColor: colors.brandPrimary,
    height: 24,
    width: 24,
    borderRadius: spacing.spacing8,
  },
});
