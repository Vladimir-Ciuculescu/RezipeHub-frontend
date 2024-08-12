import React, { useLayoutEffect } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, Dimensions, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native-ui-lib";
import Feather from "@expo/vector-icons/Feather";
import { colors } from "@/theme/colors";
import RNButton from "@/components/shared/RNButton";
import RNIcon from "@/components/shared/RNIcon";
import useUserData from "@/hooks/useUserData";
import { ACCESS_TOKEN, storage } from "@/storage";
import { spacing } from "@/theme/spacing";
import { $sizeStyles } from "@/theme/typography";
import { useAuth } from "@clerk/clerk-expo";
import { useNavigation, useRouter } from "expo-router";
import RNShadowView from "@/components/shared/RNShadowView";

import { Skeleton } from "moti/skeleton";
import FastImage from "react-native-fast-image";
import { useUserRecipes } from "@/hooks/recipes.hooks";
import { AntDesign } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");
const numColumns = 2;
const gap = spacing.spacing16;
const paddingHorizontal = spacing.spacing24 * 2;
const itemSize = (screenWidth - paddingHorizontal - (numColumns - 1) * gap) / numColumns;

interface RecipeItemProps {
  item: {
    id: number;
    title: string;
    photoUrl?: string;
    servings: number;
  };
}

const RecipeItem: React.FC<RecipeItemProps> = ({ item }) => {
  const router = useRouter();

  const goToRecipe = () => {
    router.navigate({ pathname: "/recipe_details", params: { id: item.id } });
  };

  return (
    <Pressable onPress={goToRecipe}>
      <RNShadowView style={styles.$recipeItemStyle}>
        <View
          style={{
            height: "100%",
            width: "100%",

            gap: spacing.spacing8,
          }}
        >
          <FastImage
            style={{
              width: "100%",

              height: "50%",
              borderRadius: spacing.spacing16,
            }}
            source={{
              uri: item.photoUrl,
              priority: FastImage.priority.normal,
            }}
          />
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <Text style={[$sizeStyles.n, { fontFamily: "sofia800" }]}>{item.title}</Text>
            {/* My recipes section do not require items to have image and user */}
            {/* <View
            row
            style={{ gap: spacing.spacing8 }}
          >
            Replace with fast image
            <Image
              source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
              style={{ width: 20, height: 20, borderRadius: spacing.spacing24 }}
            />
            <Text style={[$sizeStyles.s, { fontFamily: "sofia400", color: colors.greyscale300 }]}>
              {item.user}
            </Text>
          </View> */}
          </View>
        </View>
      </RNShadowView>
    </Pressable>
  );
};

const Profile = () => {
  const router = useRouter();
  const user = useUserData();
  const { signOut } = useAuth();

  const { data: recipes, isLoading } = useUserRecipes({ limit: 10, page: 0, userId: user!.id });

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <RNButton
          onPress={goBack}
          iconSource={() => (
            <AntDesign
              name="close"
              size={24}
              color="black"
            />
          )}
        />
      ),
      headerTitle: "",
      headerRight: () => (
        <RNButton
          iconSource={() => (
            <Feather
              name="heart"
              size={24}
              color="black"
            />
          )}
        />
      ),
    });
  }, [navigation]);

  const goToAllYourRecipes = () => {
    router.navigate({
      pathname: "/all_personal_recipes",
      params: { recipes: JSON.stringify(recipes) },
    });
  };

  const logOut = () => {
    storage.delete(ACCESS_TOKEN);
    signOut();
    router.dismissAll();
  };

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.$safeAreaContainerStyle}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.$scrollViewContentStyle}
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

        <RNShadowView style={styles.$profileContainerStyle}>
          <View style={styles.$profileDetailsStyle}>
            <FastImage
              style={styles.$profileImageStyle}
              source={{
                uri: "https://reactnative.dev/img/tiny_logo.png",
                priority: FastImage.priority.normal,
              }}
            />
            <View>
              <Text style={styles.$userNameStyle}>{user?.firstName + " " + user?.lastName}</Text>
              <Text style={styles.$userDescriptionStyle}>Recipe Developer</Text>
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

        <View>
          <View style={styles.$recipesSectionStyle}>
            <Text style={styles.$sectionTitleStyle}>My Recipes</Text>
            {recipes && recipes.length > 4 && (
              <RNButton
                onPress={goToAllYourRecipes}
                link
                label="See All"
                labelStyle={styles.$seeAllBtnStyle}
              />
            )}
          </View>

          <View style={styles.$recipesContainerStyle}>
            {isLoading
              ? Array(4)
                  .fill(null)
                  .map((_: number, key: number) => (
                    <Skeleton
                      key={key}
                      colorMode="light"
                      width={itemSize}
                      height={198}
                    />
                  ))
              : recipes &&
                recipes.slice(0, 4).map((item: any, key: number) => (
                  <RecipeItem
                    key={key}
                    item={item}
                  />
                ))}
          </View>
        </View>

        <RNButton
          onPress={logOut}
          label="Log out"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  $safeAreaContainerStyle: {
    flex: 1,
  },
  $scrollViewContentStyle: {
    paddingVertical: spacing.spacing12,
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
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.spacing16,
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
    ...$sizeStyles.xl,
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
