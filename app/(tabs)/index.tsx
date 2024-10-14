import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native-ui-lib";
import dayjs from "dayjs";
import { ScrollView, StyleSheet, Text } from "react-native";
import { spacing } from "@/theme/spacing";
import { $sizeStyles } from "@/theme/typography";
import useUserData from "@/hooks/useUserData";
import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLatestRecipes } from "@/hooks/recipes.hooks";
import LatestRecipeItem from "@/components/LatestRecipeItem";
import { Skeleton } from "moti/skeleton";
import { colors } from "@/theme/colors";

const Home = () => {
  const user = useUserData();

  const { id, firstName, lastName } = user;

  const { data, isLoading } = useLatestRecipes({ page: 0, limit: 10, userId: id });

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

  return (
    <SafeAreaView style={styles.$containerStyle}>
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
          {isLoading
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
            : data.map((item: any, key: number) => (
                <LatestRecipeItem
                  key={key}
                  item={item}
                />
              ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  $containerStyle: {
    flex: 1,
    gap: spacing.spacing24,
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
