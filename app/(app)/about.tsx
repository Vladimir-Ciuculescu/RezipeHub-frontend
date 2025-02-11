import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation, useRouter } from "expo-router";
import RNPressable from "@/components/shared/RNPressable";
import RNIcon from "@/components/shared/RNIcon";
import { moderateScale, verticalScale } from "@/utils/scale";
import { $sizeStyles } from "@/theme/typography";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

const About = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <RNPressable onPress={goBack}>
          <RNIcon
            name="arrow_left"
            height={moderateScale(20)}
            width={moderateScale(20)}
          />
        </RNPressable>
      ),
      headerTitle: () => <Text style={$sizeStyles.h2}>About</Text>,
    });
  }, [navigation]);

  return (
    <ScrollView
      style={styles.$containerStyle}
      contentContainerStyle={styles.$contentContainerStyle}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.stepContainer}>
        <Text style={styles.$headerStyle}>Welcome to RezipeHub! 👋 </Text>
        <Text style={styles.$descriptionStyle}>
          Whether you're searching for tonight's dinner inspiration or ready to share your grandpa's
          famous lasagna, this app aims to help you or others when they're out of ideas.
        </Text>
      </View>
      <View style={styles.stepContainer}>
        <Text style={styles.$titleStyle}>Finding Recipes</Text>
        <View>
          <Text style={styles.$descriptionStyle}>
            ・Scrolling through the home feed section to discover trending recipes
          </Text>
        </View>
        <Text style={styles.$descriptionStyle}>
          ・Search specific meals and filter them by name, category or cooking time
        </Text>
      </View>

      <View style={styles.stepContainer}>
        <Text style={styles.$titleStyle}>Saving to favorites</Text>
        <Text style={styles.$descriptionStyle}>
          ・Instantly save any favorite recipe to check it out later
        </Text>
        <Text style={styles.$descriptionStyle}>
          ・Access all your saved items from your profile
        </Text>
      </View>

      <View style={styles.stepContainer}>
        <Text style={styles.$titleStyle}>Create your own</Text>
        <Text style={styles.$descriptionStyle}>・ Specify ingredients with exact measurements</Text>
        <Text style={styles.$descriptionStyle}>・ Add clear, step-by-step instructions</Text>
        <Text style={styles.$descriptionStyle}>
          ・ Update cooking time, servings and photo at ease
        </Text>
      </View>
    </ScrollView>
  );
};

export default About;

const styles = StyleSheet.create({
  $containerStyle: {
    flex: 1,
    backgroundColor: colors.greyscale75,
    paddingHorizontal: spacing.spacing16,
    paddingTop: spacing.spacing48,
  },

  $contentContainerStyle: {
    gap: verticalScale(spacing.spacing16),
  },

  $headerStyle: {
    ...$sizeStyles.h2,
  },

  $titleStyle: {
    ...$sizeStyles.xl,
  },

  $descriptionStyle: {
    ...$sizeStyles.n,
    fontFamily: "sofia600",
  },

  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
