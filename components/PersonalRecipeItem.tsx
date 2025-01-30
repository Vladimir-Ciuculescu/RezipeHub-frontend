import { Text, Pressable, StyleSheet, Dimensions } from "react-native";
import React, { useState } from "react";
import { RecipeType } from "@/types/enums";
import { Link, useRouter } from "expo-router";
import RNShadowView from "./shared/RNShadowView";
import { spacing } from "@/theme/spacing";
import { Image } from "expo-image";
import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { formatFloatingValue } from "@/utils/formatFloatingValue";
import RNIcon from "./shared/RNIcon";
import { View } from "react-native-ui-lib";
import { $sizeStyles } from "@/theme/typography";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/scale";
import { useCurrentUser } from "@/context/UserContext";

const { width: screenWidth } = Dimensions.get("window");
const numColumns = 2;
// const gap = spacing.spacing16;
const gap = verticalScale(spacing.spacing16);
const paddingHorizontal = horizontalScale(spacing.spacing24 * 2);
const itemSize = (screenWidth - paddingHorizontal - (numColumns - 1) * gap) / numColumns;

interface PersonalRecipeItemProps {
  item: {
    id: number;
    title: string;
    photoUrl?: string;
    servings: number;
    type: RecipeType;
    totalCalories: number;
    preparationTime: number;
  };
}

const PersonalRecipeItem: React.FC<PersonalRecipeItemProps> = ({ item }) => {
  const { user } = useCurrentUser();

  const { id, title, photoUrl, totalCalories, preparationTime } = item;

  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <Link
      asChild
      href={{
        pathname: "/recipe_details",
        params: {
          id: id,
          firstName: user.firstName,
          lastName: user.lastName,
          recipePhotoUrl: photoUrl,
          userPhotoUrl: user.photoUrl,
          userId: user.id,
        },
      }}
    >
      <Pressable>
        <RNShadowView style={styles.$recipeItemStyle}>
          <View style={styles.$containerStyle}>
            {photoUrl ? (
              <Image
                source={{
                  uri: photoUrl,
                }}
                transition={300}
                contentFit="fill"
                onLoad={handleImageLoad}
                style={styles.$imageStyle}
              />
            ) : (
              <View style={styles.$placeholderstyle}>
                <Ionicons
                  name="image-outline"
                  size={moderateScale(40)}
                  color={colors.greyscale400}
                />
              </View>
            )}
            <Text
              numberOfLines={2}
              style={[$sizeStyles.s, { fontFamily: "sofia800" }]}
            >
              {title}
            </Text>
            <View style={styles.$infoStyle}>
              <View
                row
                style={{
                  alignItems: "center",
                }}
              >
                <RNIcon
                  name="fire"
                  style={{ color: colors.greyscale300 }}
                  height={moderateScale(16)}
                />
                <Text
                  style={[
                    { ...$sizeStyles.xs, fontFamily: "sofia800", color: colors.greyscale300 },
                  ]}
                >
                  {formatFloatingValue(totalCalories)} Kcal
                </Text>
              </View>
              <View
                row
                style={{
                  alignItems: "center",
                }}
              >
                <RNIcon
                  name="clock"
                  style={{ color: colors.greyscale300 }}
                  height={moderateScale(16)}
                />
                <Text
                  style={[
                    { ...$sizeStyles.xs, fontFamily: "sofia800", color: colors.greyscale300 },
                  ]}
                >
                  {preparationTime} min
                </Text>
              </View>
            </View>
          </View>
        </RNShadowView>
      </Pressable>
    </Link>
  );
};

export default PersonalRecipeItem;

const styles = StyleSheet.create({
  $containerStyle: {
    height: "100%",
    width: "100%",
    gap: verticalScale(spacing.spacing8),
  },

  $imageStyle: {
    width: "100%",
    height: "50%",
    borderRadius: spacing.spacing16,
    display: "flex",
  },

  $placeholderstyle: {
    width: "100%",
    height: "50%",
    borderRadius: spacing.spacing16,
    backgroundColor: colors.greyscale200,
    justifyContent: "center",
    alignItems: "center",
  },

  $infoStyle: {
    flex: 1,
    justifyContent: "flex-end",
    gap: verticalScale(spacing.spacing4),
  },

  $recipeItemStyle: {
    width: itemSize,
    height: moderateScale(250),
    padding: moderateScale(spacing.spacing12),
  },
});
