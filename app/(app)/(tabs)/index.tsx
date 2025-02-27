import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View } from "react-native-ui-lib";
import dayjs from "dayjs";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { spacing } from "@/theme/spacing";
import { $sizeStyles } from "@/theme/typography";
import {
  AntDesign,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useLatestRecipes, useMostPopularRecipes } from "@/hooks/recipes.hooks";
import LatestRecipeItem from "@/components/LatestRecipeItem";
import { Skeleton } from "moti/skeleton";
import { colors } from "@/theme/colors";
import CategoryItem from "@/components/CategoryItem";
import MostPopularRecipeItem from "@/components/MostPopularRecipeItem";
import React, { useEffect, useRef, useState } from "react";
import { router, useSegments } from "expo-router";
import RNFadeInView from "@/components/shared/RNFadeInView";
import RNFadeInTransition from "@/components/shared/RNFadeinTransition";
import { useCurrentUser } from "@/context/UserContext";
import { ACCESS_TOKEN, storage } from "@/storage";
import Toast from "react-native-toast-message";
import toastConfig from "@/components/Toast/ToastConfing";
import { horizontalScale, moderateScale } from "@/utils/scale";
import { No_news_feed_placeholder } from "@/assets/illustrations";

const { width, height } = Dimensions.get("screen");

const categories = [
  {
    path: require("../../../assets/images/categories/pizza.png"),
    title: "Pizza",
  },
  {
    path: require("../../../assets/images/categories/hamburger.png"),
    title: "Hamburger",
  },
  {
    path: require("../../../assets/images/categories/asiatic.png"),
    title: "Asiatic",
  },
  {
    path: require("../../../assets/images/categories/burrito.png"),
    title: "Burrito",
  },
  {
    path: require("../../../assets/images/categories/noodles.png"),
    title: "Noodles",
  },
  {
    path: require("../../../assets/images/categories/pasta.png"),
    title: "Pasta",
  },
  {
    path: require("../../../assets/images/categories/barbecue.png"),
    title: "Barbecue",
  },
  {
    path: require("../../../assets/images/categories/fish.png"),
    title: "Fish",
  },
  {
    path: require("../../../assets/images/categories/salad.png"),
    title: "Salad",
  },
  {
    path: require("../../../assets/images/categories/appetizer.png"),
    title: "Appetizer",
  },
  {
    path: require("../../../assets/images/categories/kebab.png"),
    title: "Kebab",
  },
  {
    path: require("../../../assets/images/categories/sushi.png"),
    title: "Sushi",
  },
  {
    path: require("../../../assets/images/categories/brunch.png"),
    title: "Brunch",
  },
  {
    path: require("../../../assets/images/categories/sandwich.png"),
    title: "Sandwich",
  },
  {
    path: require("../../../assets/images/categories/coffee.png"),
    title: "Coffee",
  },
  {
    path: require("../../../assets/images/categories/taco.png"),
    title: "Taco",
  },
  {
    path: require("../../../assets/images/categories/vegetarian.png"),
    title: "Vegetarian",
  },
  {
    path: require("../../../assets/images/categories/vegan.png"),
    title: "Vegan",
  },
  {
    path: require("../../../assets/images/categories/other.png"),
    title: "Other",
  },
];

const Home = () => {
  const { user } = useCurrentUser();

  const loggedStatus = storage.getString(ACCESS_TOKEN);

  const { top } = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [firstFocus, setFirstFocus] = useState(false);
  const segments = useSegments();

  useEffect(() => {
    if (scrollViewRef.current && loggedStatus) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [loggedStatus]);

  useEffect(() => {
    // Ensure the function runs only on initial focus when arriving at this screen
    if (segments.includes("(tabs)") && !firstFocus) {
      setFirstFocus(true);
    }
  }, [segments]);

  const { data: latestRecipes, isLoading: areLatestRecipesLoading } = useLatestRecipes({
    page: 0,
    limit: 10,
    userId: user ? user.id : null,
  });

  const [latestItems, setLatestItems] = useState([]);
  const [newItemsAvailable, setNewItemsAvailable] = useState(false);
  const [newData, setnewData] = useState(null);

  const { data: mostPopularRecipes, isLoading: areMostPopularRecipesLoading } =
    useMostPopularRecipes({
      page: 0,
      limit: 10,

      userId: user ? user.id : null,
    });

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

  const paddingBottom = Platform.OS === "ios" ? 210 : 190;

  const goToAllLatestRecipes = () => {
    //TODO: Add in future
    // Toast.show({
    //   type: "success",
    //   topOffset: top * 3,
    //   position: "top",
    //   swipeable: false,
    //   autoHide: false,

    //   props: {
    //     position: "top",
    //     title: "New recipes available",
    //     icon: (
    //       <Ionicons
    //         name="refresh"
    //         size={24}
    //         color={colors.greyscale50}
    //       />
    //     ),
    //     onPress: () => {
    //       Alert.alert("Alert Title", "My Alert Msg", [
    //         {
    //           text: "Cancel",
    //           onPress: () => console.log("Cancel Pressed"),
    //           style: "cancel",
    //         },
    //         { text: "OK", onPress: () => console.log("OK Pressed") },
    //       ]);
    //     },
    //   },
    // });
    router.push("/all_latest_recipes");
  };

  const goToAllMostPopularRecipes = () => {
    router.push("/all_most_popular_recipes");
  };

  const isNewsFeed =
    latestRecipes &&
    latestRecipes.length > 0 &&
    mostPopularRecipes &&
    mostPopularRecipes.length > 0;

  return (
    <RNFadeInView>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, paddingTop: top }}
        contentContainerStyle={{ gap: spacing.spacing24, paddingBottom: paddingBottom }}
      >
        <RNFadeInTransition
          index={0}
          animate={firstFocus}
          direction="top"
        >
          <View style={styles.$welcomeContainerstyle}>
            <View
              row
              style={{ gap: spacing.spacing8 }}
            >
              {icon}
              <Text style={styles.$messageStyle}>{message}</Text>
            </View>
            <Text style={styles.$userNameStyle}>{`${user?.firstName} ${user?.lastName}`}</Text>
          </View>
        </RNFadeInTransition>

        {areLatestRecipesLoading || areMostPopularRecipesLoading ? (
          // Show skeletons while loading
          <React.Fragment>
            <RNFadeInTransition
              index={1}
              animate={firstFocus}
              direction="left"
            >
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
                  <Pressable onPress={goToAllLatestRecipes}>
                    <Text style={styles.$seeAllBtnStyle}>See All</Text>
                  </Pressable>
                </View>
                <ScrollView
                  snapToInterval={horizontalScale(200) + 24}
                  decelerationRate="fast"
                  disableIntervalMomentum={true}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  contentContainerStyle={{
                    gap: spacing.spacing24,
                    paddingHorizontal: horizontalScale(spacing.spacing24),
                  }}
                >
                  {Array(4)
                    .fill(null)
                    .map((_: number, key: number) => (
                      <Skeleton
                        key={key}
                        colorMode="light"
                        width={horizontalScale(200)}
                        height={moderateScale(240)}
                      />
                    ))}
                </ScrollView>
              </View>
            </RNFadeInTransition>
            <RNFadeInTransition
              index={2}
              animate={firstFocus}
              direction="top"
            >
              <ScrollView
                contentContainerStyle={{
                  gap: spacing.spacing24,
                  paddingHorizontal: spacing.spacing24,
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {Array(4)
                  .fill(null)
                  .map((_: number, key: number) => (
                    <Skeleton
                      key={key}
                      colorMode="light"
                      width={horizontalScale(200)}
                      height={moderateScale(240)}
                    />
                  ))}
              </ScrollView>
            </RNFadeInTransition>
          </React.Fragment>
        ) : isNewsFeed ? (
          <React.Fragment>
            <RNFadeInTransition
              index={1}
              animate={firstFocus}
              direction="left"
            >
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
                  <Pressable onPress={goToAllLatestRecipes}>
                    <Text style={styles.$seeAllBtnStyle}>See All</Text>
                  </Pressable>
                </View>
                <ScrollView
                  snapToInterval={horizontalScale(200) + 24}
                  decelerationRate="fast"
                  disableIntervalMomentum={true}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  contentContainerStyle={{
                    gap: spacing.spacing24,
                    paddingHorizontal: horizontalScale(spacing.spacing24),
                  }}
                >
                  {latestRecipes.map((item: any, key: number) => (
                    <LatestRecipeItem
                      key={key}
                      item={item}
                    />
                  ))}
                </ScrollView>
              </View>
            </RNFadeInTransition>
            <RNFadeInTransition
              index={2}
              animate={firstFocus}
              direction="top"
            >
              <ScrollView
                contentContainerStyle={{
                  gap: spacing.spacing24,
                  paddingHorizontal: spacing.spacing24,
                }}
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
            </RNFadeInTransition>
            <RNFadeInTransition
              index={3}
              animate={firstFocus}
              direction="left"
            >
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
                  <Pressable onPress={goToAllMostPopularRecipes}>
                    <Text style={styles.$seeAllBtnStyle}>See All</Text>
                  </Pressable>
                </View>
                <ScrollView
                  snapToInterval={horizontalScale(200) + 24}
                  decelerationRate="fast"
                  disableIntervalMomentum={true}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  contentContainerStyle={{
                    gap: spacing.spacing24,
                    paddingHorizontal: horizontalScale(spacing.spacing24),
                  }}
                >
                  {mostPopularRecipes.map((item: any, key: number) => (
                    <MostPopularRecipeItem
                      item={item}
                      key={key}
                    />
                  ))}
                </ScrollView>
              </View>
            </RNFadeInTransition>
          </React.Fragment>
        ) : (
          <RNFadeInTransition
            index={4}
            animate={firstFocus}
            direction="left"
          >
            <View
              style={{
                alignItems: "center",
                paddingTop: spacing.spacing64,
                gap: 20,
              }}
            >
              <No_news_feed_placeholder
                height={height / 3}
                width={width - horizontalScale(40)}
              />
              <Text style={{ color: colors.slate900, ...$sizeStyles.h3 }}>
                No recipes found at the moment. Check back soon!
              </Text>
            </View>
          </RNFadeInTransition>
        )}
      </ScrollView>
      <Toast config={toastConfig} />
    </RNFadeInView>
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
    ...$sizeStyles.xl,
  },

  $userNameStyle: {
    ...$sizeStyles.h1,
  },

  $sectionTitleStyle: {
    ...$sizeStyles.h3,
    color: colors.greyscale500,
  },
  $seeAllBtnStyle: {
    ...$sizeStyles.l,
    fontFamily: "sofia800",
    color: colors.accent200,
  },
});
