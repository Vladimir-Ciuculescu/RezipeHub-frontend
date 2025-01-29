import { Home_food } from "@/assets/illustrations";
import RNButton from "@/components/shared/RNButton";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { $sizeStyles } from "@/theme/typography";
import { horizontalScale, verticalScale } from "@/utils/scale";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native-ui-lib";

const Home = () => {
  const goToLogin = () => {
    router.navigate("/login");
  };

  const goToRegister = () => {
    router.navigate("/register");
  };

  return (
    <View style={styles.$containerstyle}>
      <StatusBar style="light" />

      <Home_food />
      <View style={styles.$textContainerStyle}>
        <Text style={[styles.$headerStyle]}>Help your path to health goals with happiness</Text>
        <View style={styles.$buttonsContainer}>
          <RNButton
            onPress={goToLogin}
            label="Login"
          />
          <RNButton
            labelStyle={styles.$registerTextStyle}
            onPress={goToRegister}
            label="Create new account"
            link
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  $containerstyle: {
    backgroundColor: colors.accent200,
    justifyContent: "center",
    alignItems: "center",
    gap: verticalScale(spacing.spacing64),
    flex: 1,
  },

  $textContainerStyle: {
    gap: verticalScale(spacing.spacing24),
    paddingHorizontal: horizontalScale(spacing.spacing24),
    width: "100%",
  },

  $headerStyle: {
    color: colors.neutral100,
    ...$sizeStyles.h3,
    textAlign: "center",
  },

  $buttonsContainer: {
    gap: verticalScale(spacing.spacing16),
  },

  $registerTextStyle: {
    color: colors.neutral100,
  },
});

export default Home;
