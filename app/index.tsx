import { Onboarding_1, Onboarding_2, Onboarding_3 } from "@/assets/illustrations";
import RNButton from "@/components/shared/RNButton";
import { ACCESS_TOKEN, ONBOARDED, storage } from "@/storage";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { $sizeStyles } from "@/theme/typography";
import { Redirect, router, useRootNavigationState, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, View } from "react-native-ui-lib";

const { width, height } = Dimensions.get("screen");

interface OnboardingStepProps {
  step: Step;
}

function OnboardingStep(props: OnboardingStepProps) {
  const { step } = props;
  return (
    <View
      flex
      style={styles.$stepContainer}
      centerH
    >
      {step.image}
      <View style={styles.$stepInfoContainer}>
        <Text style={[styles.$stepTitle, $sizeStyles.h2]}>{step.title}</Text>
        <Text style={[styles.$stepDescription, $sizeStyles.l]}>{step.description}</Text>
      </View>
    </View>
  );
}

interface Step {
  id: number;
  title: string;
  description: string;
  image: React.JSX.Element;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Create and Share Your Recipes",
    description:
      "Add your recipes with ingredients, instructions, and nutrition info. Share them with the community",
    image: (
      <Onboarding_1
        height={height / 3}
        width={width}
      />
    ),
  },
  {
    id: 2,
    title: "Track Nutrition",
    description:
      "Get nutritional details for every recipe. Easily keep track of your diet and health goals",
    image: (
      <Onboarding_2
        height={height / 3}
        width={width}
      />
    ),
  },
  {
    id: 3,
    title: "Discover New Recipes",
    description: "Find and save recipes from other users. Enjoy a variety of new dishes to try.",
    image: (
      <Onboarding_3
        height={height / 3}
        width={width}
      />
    ),
  },
];

const Onboarding = () => {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<any>>(null);
  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const onChangeViewableItem = useCallback(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0].index);
  }, []);

  const goNext = async () => {
    if (currentIndex === 2) {
      goToHome();
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
      });
    }
  };

  const goToHome = () => {
    storage.set(ONBOARDED, true);
    router.navigate("/home");
  };

  const onScroll = () => {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      { useNativeDriver: false },
    );
  };

  const onboarded = storage.getBoolean(ONBOARDED);
  const user = storage.getString(ACCESS_TOKEN);

  if (onboarded) {
    if (user) {
      return <Redirect href="(tabs)" />;
    } else {
      return <Redirect href="home" />;
    }
  }

  return (
    <SafeAreaView
      edges={["left", "right", "top"]}
      style={styles.$safeContainerstyle}
    >
      <StatusBar style="dark" />
      <View
        flex
        style={styles.$containerStyle}
      >
        <View
          style={styles.$skipContainerStyle}
          row
        >
          <Button
            link
            onPress={goToHome}
            label="Skip"
            labelStyle={[styles.$skipBtnLabel, $sizeStyles.xl]}
          />
        </View>
        <FlatList
          contentContainerStyle={styles.$listContainer}
          scrollEnabled={false}
          ref={flatListRef}
          renderItem={({ item }) => <OnboardingStep step={item} />}
          pagingEnabled={true}
          bounces={false}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={steps}
          keyExtractor={(step: any) => step.id.toString()}
          onScroll={onScroll}
          scrollEventThrottle={1}
          onViewableItemsChanged={onChangeViewableItem}
          viewabilityConfig={viewConfigRef.current}
        />

        <RNButton
          label={currentIndex === 2 ? "Get started" : "Next"}
          onPress={goNext}
          labelStyle={styles.$saveBtnLabel}
          style={styles.$saveBtn}
        />
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  $safeContainerstyle: {
    flex: 1,
  },
  $containerStyle: {
    paddingBottom: spacing.spacing32,
    paddingTop: spacing.spacing32,
  },
  $skipContainerStyle: {
    justifyContent: "flex-end",
    paddingRight: spacing.spacing32,
  },

  $skipBtnLabel: { color: colors.greyscale500, fontFamily: "sofia800" },

  $listContainer: {
    height: height / 1.3,
  },

  $saveBtn: {
    marginHorizontal: spacing.spacing32,
  },

  $saveBtnLabel: {
    color: colors.neutral100,
  },

  $stepContainer: {
    justifyContent: "space-evenly",
    width,
  },
  $stepInfoContainer: {
    gap: spacing.spacing16,
    width: "100%",
    paddingHorizontal: spacing.spacing24,
  },

  $stepTitle: {
    color: colors.slate900,
    fontFamily: "sofia800",
    textAlign: "center",
  },

  $stepDescription: {
    color: colors.greyscale300,
    fontFamily: "sofia400",
    textAlign: "center",
  },
});
