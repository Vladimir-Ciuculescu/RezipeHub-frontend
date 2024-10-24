import React, { useEffect, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View } from "react-native-ui-lib";
import Feather from "@expo/vector-icons/Feather";
import { colors } from "@/theme/colors";
import RNButton from "@/components/shared/RNButton";
import RNIcon from "@/components/shared/RNIcon";
import { ACCESS_TOKEN, storage } from "@/storage";
import { spacing } from "@/theme/spacing";
import { $sizeStyles } from "@/theme/typography";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import RNShadowView from "@/components/shared/RNShadowView";
import { Skeleton } from "moti/skeleton";
import { useUserRecipes } from "@/hooks/recipes.hooks";
import PersonalRecipeItem from "@/components/PersonalRecipeItem";
import { useFavorites } from "@/hooks/favorites.hooks";
import FavoriteRecipeItem from "@/components/FavoriteRecipeItem";
import FastImage from "react-native-fast-image";
import useUserStore from "@/zustand/useUserStore";
import { AntDesign } from "@expo/vector-icons";
import {
  No_favorite_recipes_placeholder,
  No_personal_recipes_placeholder,
} from "@/assets/illustrations";

const { width: screenWidth, height } = Dimensions.get("window");
const numColumns = 2;
const gap = spacing.spacing16;
const paddingHorizontal = spacing.spacing24 * 2;
const itemSize = (screenWidth - paddingHorizontal - (numColumns - 1) * gap) / numColumns;

const Profile = () => {
  const { top } = useSafeAreaInsets();

  const scrollViewRef = useRef<ScrollView>(null);

  const router = useRouter();
  // const user = useUserData();
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

  const logOut = () => {
    storage.delete(ACCESS_TOKEN);
    setLoggedStatus(false);
    signOut();
    router.navigate("/home");
  };

  const goToEditProfile = () => {
    router.navigate("/edit_profile");
  };

  const goToAddRecipe = () => {
    router.navigate("add_recipe");
  };

  const paddingBottom = Platform.OS === "ios" ? 210 : 190;

  return (
    <ScrollView
      ref={scrollViewRef}
      style={{ paddingTop: top }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.$scrollViewContentStyle, { paddingBottom }]}
    >
      <View style={styles.$headerStyle}>
        <Text style={styles.$titleStyle}>Account</Text>
        <TouchableOpacity>
          <Feather
            name="settings"
            size={24}
            color={colors.slate900}
          />
        </TouchableOpacity>
      </View>

      <Pressable onPress={goToEditProfile}>
        <RNShadowView style={styles.$profileContainerStyle}>
          <View style={styles.$profileDetailsStyle}>
            {photoUrl ? (
              <View style={styles.$imageStyle}>
                <FastImage
                  source={{
                    uri: photoUrl,
                    priority: FastImage.priority.high,
                    cache: FastImage.cacheControl.web,
                  }}
                  style={{ flex: 1 }}
                />
              </View>
            ) : (
              <View style={styles.$placeholderstyle}>
                <Feather
                  name="user"
                  size={24}
                  color={colors.greyscale50}
                />
              </View>
            )}
            <View>
              <Text style={styles.$userNameStyle}>{firstName + " " + lastName}</Text>
              {bio && <Text style={styles.$userDescriptionStyle}>{bio}</Text>}
            </View>
          </View>
          <RNButton
            style={styles.$userDetailsBtnStyle}
            iconSource={() => (
              <RNIcon
                name="arrow_right"
                color={colors.greyscale50}
              />
            )}
          />
        </RNShadowView>
      </Pressable>

      <View>
        <View style={styles.$recipesSectionStyle}>
          <Text style={styles.$sectionTitleStyle}>My Recipes</Text>
          {recipes && recipes.length > 4 ? (
            <RNButton
              onPress={goToAllYourRecipes}
              link
              label="See All"
              labelStyle={styles.$seeAllBtnStyle}
            />
          ) : (
            <RNButton
              onPress={goToAddRecipe}
              iconSource={() => (
                <AntDesign
                  name="plus"
                  size={24}
                  color={colors.accent200}
                />
              )}
              link
              labelStyle={styles.$seeAllBtnStyle}
            />
          )}
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
                  height={198}
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
                gap: spacing.spacing16,
                paddingTop: spacing.spacing16,
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
                  height={198}
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

      <RNButton
        onPress={logOut}
        label="Log out"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  $safeAreaContainerStyle: {
    flex: 1,
  },
  $scrollViewContentStyle: {
    paddingTop: 12,
    paddingHorizontal: spacing.spacing24,
    gap: spacing.spacing16,
  },
  $headerStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: spacing.spacing64,
    alignItems: "center",
  },

  $titleStyle: {
    ...$sizeStyles.h3,
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
    ...$sizeStyles.s,
  },

  $profileContainerStyle: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.spacing16,
  },

  $imageStyle: {
    width: 48,
    height: 48,
    borderRadius: spacing.spacing32,
    display: "flex",
    overflow: "hidden",
  },

  $placeholderstyle: {
    width: 48,
    height: 48,
    borderRadius: spacing.spacing32,
    backgroundColor: colors.greyscale300,

    justifyContent: "center",
    alignItems: "center",
  },

  $profileDetailsStyle: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.spacing12,
  },
  $profileImageStyle: {
    width: 48,
    height: 48,
    borderRadius: spacing.spacing24,
    borderWidth: 2.5,
    borderColor: colors.accent200,
  },

  $sectionTitleStyle: {
    ...$sizeStyles.h3,
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
    marginBottom: spacing.spacing12,
    alignItems: "center",
    paddingHorizontal: 8,
  },

  $recipesContainerStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: spacing.spacing16,
  },
  $recipeItemStyle: {
    width: itemSize,
    height: 198,
    padding: spacing.spacing12,
  },
});

export default Profile;
