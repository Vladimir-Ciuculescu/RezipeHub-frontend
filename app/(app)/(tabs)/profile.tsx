import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, Dimensions, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View } from "react-native-ui-lib";
import Feather from "@expo/vector-icons/Feather";
import { colors } from "@/theme/colors";
import RNButton from "@/components/shared/RNButton";
import RNIcon from "@/components/shared/RNIcon";
import { ACCESS_TOKEN, IS_LOGGED_IN, storage } from "@/storage";
import { spacing } from "@/theme/spacing";
import { $sizeStyles } from "@/theme/typography";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter, useSegments } from "expo-router";
import RNShadowView from "@/components/shared/RNShadowView";
import { Skeleton } from "moti/skeleton";
import { useUserRecipes } from "@/hooks/recipes.hooks";
import PersonalRecipeItem from "@/components/PersonalRecipeItem";
import { useFavorites } from "@/hooks/favorites.hooks";
import FavoriteRecipeItem from "@/components/FavoriteRecipeItem";
import { Image } from "expo-image";
import useUserStore from "@/zustand/useUserStore";
import { AntDesign } from "@expo/vector-icons";
import {
  No_favorite_recipes_placeholder,
  No_personal_recipes_placeholder,
} from "@/assets/illustrations";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/scale";
import RNFadeInView from "@/components/shared/RNFadeInView";
import RNFadeInTransition from "@/components/shared/RNFadeinTransition";
import { useIsFocused } from "@react-navigation/native";

const { width: screenWidth, height } = Dimensions.get("window");
const numColumns = 2;
const gap = spacing.spacing16;
const paddingHorizontal = spacing.spacing24 * 2;
const itemSize = (screenWidth - paddingHorizontal - (numColumns - 1) * gap) / numColumns;

const Profile = () => {
  const { top } = useSafeAreaInsets();

  const isFocused = useIsFocused();

  const scrollViewRef = useRef<ScrollView>(null);

  const [firstFocus, setFirstFocus] = useState(false);
  const segments = useSegments();

  const router = useRouter();
  const { id, firstName, lastName, photoUrl, bio } = useUserStore.use.user();
  const setLoggedStatus = useUserStore.use.setLoggedStatus();
  const loggedStatus = useUserStore.use.isLoggedIn();

  const { signOut } = useAuth();

  const { data: recipes, isLoading: areRecipesLoading } = useUserRecipes({
    limit: 5,
    page: 0,
    userId: id,
  });
  const { data: favorites, isLoading: areFavoritesLoading } = useFavorites({
    limit: 5,
    page: 0,
    userId: id,
  });

  useEffect(() => {
    // Ensure the function runs only on initial focus when arriving at this screen
    if (segments.includes("(tabs)") && !firstFocus) {
      setFirstFocus(true);
    }
  }, [segments]);

  useEffect(() => {
    if (scrollViewRef.current && loggedStatus) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [loggedStatus]);

  const goToAllYourRecipes = () => {
    router.navigate("/all_personal_recipes");
  };

  const goToAllFavoritesRecipes = () => {
    router.navigate("/all_favorite_recipes");
  };

  const logOut = async () => {
    await signOut();

    storage.delete(ACCESS_TOKEN);
    storage.delete(IS_LOGGED_IN);
    setLoggedStatus(false);
    router.replace("home");
  };

  const goToEditProfile = () => {
    router.navigate("/edit_profile");
  };

  const goToAddRecipe = () => {
    router.navigate("add_recipe");
  };

  const paddingBottom = Platform.OS === "ios" ? 210 : 190;

  return (
    <RNFadeInView>
      <ScrollView
        ref={scrollViewRef}
        style={{ paddingTop: top }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.$scrollViewContentStyle, { paddingBottom }]}
      >
        <RNFadeInTransition
          index={0}
          animate={firstFocus}
          direction="left"
        >
          <View style={styles.$headerStyle}>
            <Text style={styles.$titleStyle}>Account</Text>
            <TouchableOpacity>
              <Feather
                name="settings"
                size={moderateScale(24)}
                color={colors.slate900}
              />
            </TouchableOpacity>
          </View>

          <RNShadowView style={styles.$profileContainerStyle}>
            <View style={styles.$profileDetailsStyle}>
              {photoUrl ? (
                <View style={styles.$imageStyle}>
                  <Image
                    source={{
                      uri: photoUrl,
                    }}
                    style={{ flex: 1 }}
                  />
                </View>
              ) : (
                <View style={styles.$placeholderstyle}>
                  <Feather
                    name="user"
                    size={moderateScale(24)}
                    color={colors.greyscale50}
                  />
                </View>
              )}
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text style={styles.$userNameStyle}>{firstName + " " + lastName}</Text>
                {bio && (
                  <View>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.$userDescriptionStyle}
                    >
                      {bio}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <RNButton
              onPress={goToEditProfile}
              style={styles.$userDetailsBtnStyle}
              iconSource={() => (
                <RNIcon
                  name="arrow_right"
                  color={colors.greyscale50}
                />
              )}
            />
          </RNShadowView>
        </RNFadeInTransition>

        <RNFadeInTransition
          index={1}
          // animate={isFocused}
          animate={firstFocus}
          direction="top"
        >
          <View>
            <View style={styles.$recipesSectionStyle}>
              <Text style={styles.$sectionTitleStyle}>My Recipes</Text>

              {recipes && recipes.length === 0 ? (
                <RNButton
                  onPress={goToAddRecipe}
                  iconSource={() => (
                    <AntDesign
                      name="plus"
                      size={moderateScale(24)}
                      color={colors.accent200}
                    />
                  )}
                  link
                  labelStyle={styles.$seeAllBtnStyle}
                />
              ) : recipes && recipes.length > 4 ? (
                <RNButton
                  onPress={goToAllYourRecipes}
                  link
                  label="See All"
                  labelStyle={styles.$seeAllBtnStyle}
                />
              ) : null}
            </View>

            <View style={styles.$recipesContainerStyle}>
              {areRecipesLoading ? (
                Array(4)
                  .fill(null)
                  .map((_: number, key: number) => (
                    <Skeleton
                      key={key}
                      colorMode="light"
                      width={itemSize}
                      height={verticalScale(198)}
                    />
                  ))
              ) : recipes && recipes.length ? (
                recipes.slice(0, 4).map((item: any, key: number) => (
                  <PersonalRecipeItem
                    key={key}
                    item={item}
                  />
                ))
              ) : (
                <View
                  style={{
                    width: "100%",
                    gap: verticalScale(spacing.spacing16),
                    paddingTop: verticalScale(spacing.spacing16),
                  }}
                >
                  <View style={{ width: "100%", height: height / 5 }}>
                    <No_personal_recipes_placeholder
                      width="100%"
                      height="100%"
                    />
                  </View>
                  <Text style={{ color: colors.slate900, ...$sizeStyles.xl, textAlign: "center" }}>
                    Add your first recipe
                  </Text>
                </View>
              )}
            </View>
          </View>
        </RNFadeInTransition>
        <RNFadeInTransition
          index={2}
          // animate={isFocused}
          animate={firstFocus}
          direction="top"
        >
          <View>
            <View style={styles.$recipesSectionStyle}>
              <Text style={styles.$sectionTitleStyle}>My Favorites</Text>
              {favorites && favorites.length > 4 && (
                <RNButton
                  onPress={goToAllFavoritesRecipes}
                  link
                  label="See All"
                  labelStyle={styles.$seeAllBtnStyle}
                />
              )}
            </View>

            <View style={styles.$recipesContainerStyle}>
              {areFavoritesLoading ? (
                Array(4)
                  .fill(null)
                  .map((_: number, key: number) => (
                    <Skeleton
                      key={key}
                      colorMode="light"
                      width={itemSize}
                      height={verticalScale(198)}
                    />
                  ))
              ) : favorites && favorites.length ? (
                favorites.slice(0, 4).map((item: any, key: number) => (
                  <FavoriteRecipeItem
                    key={key}
                    item={item}
                  />
                ))
              ) : (
                <View
                  style={{
                    width: "100%",
                    gap: spacing.spacing16,
                    paddingTop: spacing.spacing16,
                  }}
                >
                  <View style={{ width: "100%", height: height / 5 }}>
                    <No_favorite_recipes_placeholder
                      width="100%"
                      height="100%"
                    />
                  </View>
                  <Text style={{ color: colors.slate900, ...$sizeStyles.xl, textAlign: "center" }}>
                    You haven’t added any favorites yet
                  </Text>
                </View>
              )}
            </View>
          </View>
        </RNFadeInTransition>

        <RNButton
          onPress={logOut}
          label="Log out"
        />
      </ScrollView>
    </RNFadeInView>
  );
};

const styles = StyleSheet.create({
  $safeAreaContainerStyle: {
    flex: 1,
  },
  $scrollViewContentStyle: {
    paddingTop: horizontalScale(spacing.spacing12),
    paddingHorizontal: horizontalScale(spacing.spacing24),
    gap: spacing.spacing16,
  },
  $headerStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: verticalScale(spacing.spacing64),
    alignItems: "center",
  },

  $titleStyle: {
    ...$sizeStyles.h2,
    color: colors.greyscale500,
  },

  $userNameStyle: {
    color: colors.greyscale500,
    ...$sizeStyles.l,
  },

  $userDetailsBtnStyle: {
    backgroundColor: colors.brandPrimary,
  },

  $userDescriptionStyle: {
    color: colors.greyscale400,
    ...$sizeStyles.xs,
  },

  $profileContainerStyle: {
    width: "100%",
    height: verticalScale(90),
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(spacing.spacing16),
  },

  $imageStyle: {
    width: horizontalScale(48),
    height: horizontalScale(48),
    borderRadius: spacing.spacing32,
    display: "flex",
    overflow: "hidden",
  },

  $placeholderstyle: {
    width: horizontalScale(48),
    height: horizontalScale(48),
    borderRadius: spacing.spacing32,
    backgroundColor: colors.greyscale300,
    justifyContent: "center",
    alignItems: "center",
  },

  $profileDetailsStyle: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(spacing.spacing8),
    flex: 1,
  },

  $sectionTitleStyle: {
    ...$sizeStyles.l,
    color: colors.greyscale500,
  },

  $seeAllBtnStyle: {
    ...$sizeStyles.n,
    fontFamily: "sofia800",
    color: colors.accent200,
  },

  $recipesSectionStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(spacing.spacing12),
    alignItems: "center",
    paddingHorizontal: horizontalScale(spacing.spacing8),
  },

  $recipesContainerStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    // gap: verticalScale(spacing.spacing16),
    //gap: spacing.spacing16,
    gap: verticalScale(12),
  },
});

export default Profile;
