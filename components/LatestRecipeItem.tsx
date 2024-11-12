import { Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import RNShadowView from "./shared/RNShadowView";
import FastImage from "react-native-fast-image";
import { spacing } from "@/theme/spacing";
import RNIcon from "./shared/RNIcon";
import { Feather, Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { View } from "react-native-ui-lib";
import { $sizeStyles } from "@/theme/typography";
import { LatestRecipeResponse } from "@/types/recipe.types";
import { useRouter } from "expo-router";

interface LatestRecipeItemProps {
  item: LatestRecipeResponse;
}

const LatestRecipeItem: React.FC<LatestRecipeItemProps> = ({ item }) => {
  const { id, photoUrl, user, isInFavorites } = item;

  // const queryClient = useQueryClient();

  // const [isFavorite, setIsFavorite] = useState(isInFavorites);

  // const heartRef = useRef<LottieView>(null);

  // const userData = useUserData();

  const router = useRouter();

  const goToRecipe = () => {
    router.navigate({
      pathname: "/recipe_details",
      params: { id, userId: user.id, owner: JSON.stringify(user) },
    });
  };

  return (
    <Pressable onPress={goToRecipe}>
      <RNShadowView style={styles.$containerStyle}>
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
            <Ionicons
              name="image-outline"
              size={35}
              color={colors.greyscale400}
            />
          </View>
        )}

        <View
          style={{
            paddingTop: spacing.spacing8,
            flex: 1,
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{ ...$sizeStyles.n, fontFamily: "sofia800" }}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <View
            row
            style={{ justifyContent: "space-between" }}
          >
            <View
              row
              style={{ alignItems: "center", gap: spacing.spacing4 }}
            >
              {user.photoUrl ? (
                <FastImage
                  source={{ uri: user.photoUrl }}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: spacing.spacing16,
                    borderWidth: 2,
                    borderColor: colors.accent200,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: spacing.spacing16,

                    backgroundColor: colors.greyscale300,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Feather
                    name="user"
                    size={15}
                    color={colors.greyscale50}
                  />
                </View>
              )}
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  {
                    ...$sizeStyles.n,
                    fontFamily: "sofia400",
                    color: colors.greyscale300,
                    paddingRight: 30,
                  },
                ]}
              >
                {`${item.user.lastName}`}
              </Text>
            </View>
            <View
              row
              style={{ alignItems: "center", gap: spacing.spacing4 }}
            >
              <RNIcon
                name="clock"
                height={20}
                width={20}
                style={{ color: colors.greyscale300 }}
              />
              <Text style={{ ...$sizeStyles.s, color: colors.greyscale300 }}>
                {item.preparationTime} Min
              </Text>
            </View>
          </View>
        </View>
      </RNShadowView>
    </Pressable>
  );
};

export default LatestRecipeItem;

const styles = StyleSheet.create({
  $containerStyle: {
    height: 240,
    width: 200,
    justifyContent: "space-between",
    padding: spacing.spacing16,
  },

  $imageStyle: {
    width: "100%",
    height: "60%",
    borderRadius: spacing.spacing16,
    display: "flex",
    overflow: "hidden",
  },

  $placeholderstyle: {
    width: "100%",
    height: "50%",
    borderRadius: spacing.spacing16,
    backgroundColor: colors.greyscale200,
    justifyContent: "center",
    alignItems: "center",
  },
});
