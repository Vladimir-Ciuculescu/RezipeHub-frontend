import { Text, Pressable, StyleSheet, Dimensions } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import RNShadowView from "./shared/RNShadowView";
import { spacing } from "@/theme/spacing";
import FastImage from "react-native-fast-image";
import { colors } from "@/theme/colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import RNIcon from "./shared/RNIcon";
import { View } from "react-native-ui-lib";
import { $sizeStyles } from "@/theme/typography";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/scale";

const { width: screenWidth } = Dimensions.get("window");
const numColumns = 2;
const gap = verticalScale(spacing.spacing16);
const paddingHorizontal = horizontalScale(spacing.spacing24 * 2);
const itemSize = (screenWidth - paddingHorizontal - (numColumns - 1) * gap) / numColumns;

interface FavoriteRecipeItemProps {
  item: {
    id: number;
    title: string;
    photoUrl: string;
    user: {
      id: number;
      firstName: string;
      lastName: string;
      photoUrl: string;
    };
  };
}

const FavoriteRecipeItem: React.FC<FavoriteRecipeItemProps> = ({ item }) => {
  const { id, title, user, photoUrl } = item;

  const router = useRouter();

  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const goToFavoriteRecipe = () => {
    router.navigate({ pathname: "/recipe_details", params: { id, owner: JSON.stringify(user) } });
  };

  return (
    <Pressable onPress={goToFavoriteRecipe}>
      <RNShadowView style={styles.$recipeItemStyle}>
        <View style={styles.$containerStyle}>
          {photoUrl ? (
            <View style={styles.$imageStyle}>
              <FastImage
                source={{
                  uri: photoUrl,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.web,
                }}
                onLoad={handleImageLoad}
                style={{ flex: 1 }}
              />
              <View style={styles.$favoriteIconContainerStyle}>
                <RNIcon name="heart" />
              </View>
            </View>
          ) : (
            <View style={styles.$placeholderstyle}>
              <View style={styles.$favoriteIconContainerStyle}>
                <RNIcon name="heart" />
              </View>
              <Ionicons
                name="image-outline"
                size={moderateScale(40)}
                color={colors.greyscale400}
              />
            </View>
          )}
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <Text
              numberOfLines={2}
              style={[$sizeStyles.s, { fontFamily: "sofia800" }]}
            >
              {title} with chilli con carne
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.spacing8 }}>
              {user.photoUrl ? (
                <FastImage
                  source={{ uri: user.photoUrl }}
                  style={styles.$userImageStyle}
                />
              ) : (
                <View style={styles.$userPlaceholderStyle}>
                  <Feather
                    name="user"
                    size={moderateScale(14)}
                    color={colors.greyscale50}
                  />
                </View>
              )}
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.$userNameStyle}
              >
                {`${user.lastName}`}
              </Text>
            </View>
          </View>
        </View>
      </RNShadowView>
    </Pressable>
  );
};

export default FavoriteRecipeItem;

const styles = StyleSheet.create({
  $containerStyle: {
    height: "100%",
    width: "100%",
    gap: spacing.spacing8,
  },

  $imageStyle: {
    width: "100%",
    height: "50%",
    borderRadius: spacing.spacing16,
    display: "flex",
    overflow: "hidden",
  },

  $favoriteIconContainerStyle: {
    height: horizontalScale(28),
    width: horizontalScale(28),
    backgroundColor: colors.greyscale50,
    position: "absolute",
    borderRadius: spacing.spacing8,
    justifyContent: "center",
    alignItems: "center",

    right: horizontalScale(spacing.spacing8),
    top: verticalScale(spacing.spacing8),
  },

  $placeholderstyle: {
    width: "100%",
    height: "50%",
    borderRadius: spacing.spacing16,
    backgroundColor: colors.greyscale200,
    justifyContent: "center",
    alignItems: "center",
  },

  $recipeItemStyle: {
    width: itemSize,
    height: moderateScale(240),
    padding: spacing.spacing12,
  },

  $userImageStyle: {
    width: horizontalScale(26),
    height: horizontalScale(26),
    borderRadius: spacing.spacing16,
    borderWidth: 2,
    borderColor: colors.accent200,
  },

  $userPlaceholderStyle: {
    width: horizontalScale(26),
    height: horizontalScale(26),
    borderRadius: spacing.spacing16,
    backgroundColor: colors.greyscale300,
    justifyContent: "center",
    alignItems: "center",
  },

  $userNameStyle: {
    ...$sizeStyles.xs,
    fontFamily: "sofia800",
    color: colors.greyscale300,
  },
});
