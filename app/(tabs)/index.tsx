import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native-ui-lib";
import dayjs from "dayjs";
import { Platform, ScrollView, StyleSheet, Text } from "react-native";
import { spacing } from "@/theme/spacing";
import { $sizeStyles } from "@/theme/typography";
import useUserData from "@/hooks/useUserData";
import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLatestRecipes, useMostPopularRecipes } from "@/hooks/recipes.hooks";
import LatestRecipeItem from "@/components/LatestRecipeItem";
import { Skeleton } from "moti/skeleton";
import { colors } from "@/theme/colors";
import CategoryItem from "@/components/CategoryItem";
import MostPopularRecipeItem from "@/components/MostPopularRecipeItem";

const categories = [
  {
    path: require("../../assets/images/categories/pizza.png"),
    title: "Pizza",
  },
  {
    path: require("../../assets/images/categories/hamburger.png"),
    title: "Hamburger",
  },
  {
    path: require("../../assets/images/categories/ramen.png"),
    title: "Asiatic",
  },
  {
    path: require("../../assets/images/categories/burito.png"),
    title: "Burrito",
  },
  {
    path: require("../../assets/images/categories/noodles.png"),
    title: "Noodles",
  },
  {
    path: require("../../assets/images/categories/pasta.png"),
    title: "Pasta",
  },
  {
    path: require("../../assets/images/categories/barbecue.png"),
    title: "Barbecue",
  },
  {
    path: require("../../assets/images/categories/fish.png"),
    title: "Fish",
  },
  {
    path: require("../../assets/images/categories/salad.png"),
    title: "Salad",
  },
  {
    path: require("../../assets/images/categories/appetizer.png"),
    title: "Appetizer",
  },
  {
    path: require("../../assets/images/categories/kebab.png"),
    title: "Kebab",
  },
  {
    path: require("../../assets/images/categories/sushi.png"),
    title: "Sushi",
  },
  {
    path: require("../../assets/images/categories/brunch.png"),
    title: "Brunch",
  },
  {
    path: require("../../assets/images/categories/sandwich.png"),
    title: "Sandwich",
  },
  {
    path: require("../../assets/images/categories/coffee.png"),
    title: "Coffee",
  },
  {
    path: require("../../assets/images/categories/taco.png"),
    title: "Taco",
  },
  {
    path: require("../../assets/images/categories/broccoli.png"),
    title: "Vegetarian",
  },
  {
    path: require("../../assets/images/categories/vegan.png"),
    title: "Vegan",
  },
  {
    path: require("../../assets/images/categories/other.png"),
    title: "Other",
  },
];

const Home = () => {
  const user = useUserData();

  const { id, firstName, lastName } = user;

  const { data: latestRecipes, isLoading: areLatestRecipesLoading } = useLatestRecipes({
    page: 0,
    limit: 10,
    userId: id,
  });

  const { data: mostPopularRecipes, isLoading: areMostPopularRecipesLoading } =
    useMostPopularRecipes({ page: 0, limit: 10, userId: id });

  const getGreetingData = () => {
    const currentHour = dayjs().hour();

    if (currentHour >= 5 && currentHour < 12) {
      return {
        message: "Good morning",
        icon: (
          <Feather
            name="sun"
            size={24}
            color="black"
          />
        ),
      };
    } else if (currentHour >= 12 && currentHour < 18) {
      return {
        message: "Good afternoon",
        icon: (
          <Ionicons
            name="partly-sunny-outline"
            size={24}
            color="black"
          />
        ),
      };
    } else if (currentHour >= 18 && currentHour < 22) {
      return {
        message: "Good evening",
        icon: (
          <MaterialCommunityIcons
            name="weather-sunset"
            size={24}
            color="black"
          />
        ),
      };
    } else {
      return {
        message: "Good night",
        icon: (
          <FontAwesome
            name="moon-o"
            size={24}
            color="black"
          />
        ),
      };
    }
  };

  const { icon, message } = getGreetingData();

  const { top } = useSafeAreaInsets();

  const paddingBottom = Platform.OS === "ios" ? 210 : 190;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, paddingTop: top }}
      contentContainerStyle={{ gap: spacing.spacing24, paddingBottom: paddingBottom }}
    >
      <View style={styles.$welcomeContainerstyle}>
        <View
          row
          style={{ gap: spacing.spacing8 }}
        >
          {icon}
          <Text style={styles.$messageStyle}>{message}</Text>
        </View>
        <Text style={styles.$userNameStyle}>{`${firstName} ${lastName}`}</Text>
      </View>

      <View style={{ gap: spacing.spacing16 }}>
        <View
          row
          style={{
            width: "100%",
            justifyContent: "space-between",
            paddingHorizontal: spacing.spacing24,
          }}
        >
          <Text style={styles.$sectionTitleStyle}>Latest</Text>
          <Text style={styles.$seeAllBtnStyle}>See All</Text>
        </View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{
            gap: spacing.spacing24,
            paddingHorizontal: spacing.spacing24,
          }}
        >
          {areLatestRecipesLoading
            ? Array(4)
                .fill(null)
                .map((_: number, key: number) => (
                  <Skeleton
                    key={key}
                    colorMode="light"
                    width={200}
                    height={198}
                  />
                ))
            : latestRecipes.map((item: any, key: number) => (
                <LatestRecipeItem
                  key={key}
                  item={item}
                />
              ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={{ gap: spacing.spacing24, paddingHorizontal: spacing.spacing24 }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {categories.map((category, key) => {
          return (
            <CategoryItem
              key={key}
              category={category}
            />
          );
        })}
      </ScrollView>
      <View style={{ gap: spacing.spacing16 }}>
        <View
          row
          style={{
            width: "100%",
            justifyContent: "space-between",
            paddingHorizontal: spacing.spacing24,
          }}
        >
          <Text style={styles.$sectionTitleStyle}>Most Popular</Text>
          <Text style={styles.$seeAllBtnStyle}>See All</Text>
        </View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={{
            gap: spacing.spacing24,
            paddingHorizontal: spacing.spacing24,
          }}
        >
          {areMostPopularRecipesLoading
            ? Array(4)
                .fill(null)
                .map((_: number, key: number) => (
                  <Skeleton
                    key={key}
                    colorMode="light"
                    width={200}
                    height={198}
                  />
                ))
            : mostPopularRecipes.map((item: any, key: number) => (
                <MostPopularRecipeItem
                  item={item}
                  key={key}
                />
              ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  $containerStyle: {
    flex: 1,
  },

  $welcomeContainerstyle: {
    width: "100%",
    paddingHorizontal: spacing.spacing24,
    paddingTop: spacing.spacing16,
    gap: spacing.spacing8,
  },

  $messageStyle: {
    ...$sizeStyles.l,
  },

  $userNameStyle: {
    ...$sizeStyles.h1,
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
});
