import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  FlatList,
  Keyboard,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Alert,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import RNIcon from "@/components/shared/RNIcon";
import { colors } from "@/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { $sizeStyles } from "@/theme/typography";
import { spacing } from "@/theme/spacing";
import { MotiView } from "moti";
import RnInput from "@/components/shared/RNInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RNButton from "@/components/shared/RNButton";
import useRecipeStore from "@/zustand/useRecipeStore";
import RNPressable from "@/components/shared/RNPressable";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/scale";

const { width: screenWidth } = Dimensions.get("window");

const RecipeAddSteps = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const stepsFromStore = useRecipeStore.use.steps();

  const [steps, setSteps] = useState([{ description: "" }]);
  const [activeIndex, setActiveIndex] = useState(0);

  const paginationFlatListRef = useRef<FlatList>(null);
  const inputsFlatlListRef = useRef<FlatList>(null);

  const addStepsAction = useRecipeStore.use.addStepsAction();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <RNPressable onPress={gotBack}>
          <RNIcon
            name="arrow_left"
            color={colors.brandPrimary}
            height={moderateScale(20)}
            width={moderateScale(20)}
          />
        </RNPressable>
      ),
      headerTitle: () => <Text style={[$sizeStyles.h3]}>Add steps</Text>,
      headerRight: () => (
        <RNPressable onPress={confirmSteps}>
          <AntDesign
            name="check"
            size={moderateScale(24)}
            color={colors.accent200}
          />
        </RNPressable>
      ),
    });
  }, [navigation, steps]);

  useEffect(() => {
    if (stepsFromStore.length) {
      setSteps(stepsFromStore);
    }
  }, []);

  useEffect(() => {
    paginationFlatListRef.current?.scrollToIndex({
      index: activeIndex,
      animated: true,
      viewPosition: 0.5,
    });
    inputsFlatlListRef.current?.scrollToIndex({ index: activeIndex, animated: true });
  }, [activeIndex]);

  const confirmSteps = () => {
    if (!steps[steps.length - 1].description) {
      Alert.alert("A step cannot be empty !");
      return;
    }

    const newSteps = steps.map((step, index) => ({ ...step, number: index + 1, id: index + 1 }));
    addStepsAction(newSteps);
    router.dismiss(1);
  };

  const gotBack = () => {
    router.back();
  };

  const addStep = () => {
    if (!steps[steps.length - 1].description) {
      Alert.alert("A step cannot be empty !");
      return;
    }

    setActiveIndex(steps.length); // Set active index to the new step

    const newStep = { description: "" };
    setSteps((prevSteps) => [...prevSteps, newStep]);

    setTimeout(() => {
      inputsFlatlListRef.current?.scrollToEnd({ animated: true });
    }, 100); // Adding a slight delay to ensure the list has updated
  };

  const deleteStep = () => {
    if (steps.length === 1) {
      Alert.alert("You must have at least one step.");
      return;
    }

    setSteps((prevSteps) => {
      const updatedSteps = prevSteps.filter((_, index) => index !== activeIndex);
      // Adjust active index if necessary
      const newIndex = activeIndex > 0 ? activeIndex - 1 : 0;
      setActiveIndex(newIndex);
      return updatedSteps;
    });
  };

  const handlePagePress = (index: number) => {
    setActiveIndex(index);
  };

  const handleTextChange = (text: string, index: number) => {
    setSteps((prevSteps) => {
      const newItems = [...prevSteps];
      newItems[index].description = text;
      return newItems;
    });
  };

  const handleKeyPress = ({ nativeEvent }: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (nativeEvent.key === "Enter" || nativeEvent.key === "Done") {
      Keyboard.dismiss();
    }
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={40}
      enableAutomaticScroll
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flex: 1,
        justifyContent: "space-between",
        // paddingTop: spacing.spacing24,
        // paddingBottom: spacing.spacing32,
        paddingTop: verticalScale(spacing.spacing24),
        paddingBottom: verticalScale(spacing.spacing32),
      }}
    >
      <View style={{ gap: spacing.spacing32 }}>
        <FlatList
          ref={paginationFlatListRef}
          data={steps}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.$paginationContainerStyle}
          keyExtractor={(item, index) => index.toString()}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 200));
            wait.then(() => {
              paginationFlatListRef.current?.scrollToIndex({ index: info.index, animated: true });
            });
          }}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => handlePagePress(index)}
              style={styles.$paginationItemStyle}
            >
              <MotiView
                animate={{
                  backgroundColor: activeIndex === index ? colors.accent200 : "transparent",
                  opacity: activeIndex === index ? 1 : 0.6,
                }}
                transition={{ duration: 200 }}
                style={styles.$paginationViewStyle}
              >
                <Text
                  style={[
                    styles.$paginationItemTextStyle,
                    activeIndex === index
                      ? styles.$activePaginationTextStyle
                      : styles.$inactivePaginationTextstyle,
                  ]}
                >
                  {index + 1}
                </Text>
              </MotiView>
            </Pressable>
          )}
        />
        <FlatList
          scrollEnabled={false}
          ref={inputsFlatlListRef}
          data={steps}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.$stepsContainerStyle}
          keyExtractor={(item, index) => index.toString()}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 200));
            wait.then(() => {
              inputsFlatlListRef.current?.scrollToIndex({ index: info.index, animated: true });
            });
          }}
          renderItem={({ item, index }) => (
            <View
              key={index}
              style={styles.$stepViewStyle}
            >
              <Text style={styles.$ingredientHeaderStyle}>Step {index + 1}</Text>
              <RnInput
                keyboardType="default"
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={Keyboard.dismiss}
                onKeyPress={handleKeyPress}
                value={item.description}
                multiline
                onChangeText={(value: string) => handleTextChange(value, index)}
              />
            </View>
          )}
        />
      </View>
      <View style={styles.$buttonsContainerstyle}>
        <RNButton
          onPress={addStep}
          label="Add step"
          style={{ flex: 1 }}
        />
        <RNButton
          onPress={deleteStep}
          label="Delete step"
          style={{ flex: 1 }}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default RecipeAddSteps;

const styles = StyleSheet.create({
  $stepViewStyle: {
    gap: spacing.spacing16,
    width: screenWidth,
    justifyContent: "center",
    paddingHorizontal: spacing.spacing24,
  },
  $paginationContainerStyle: {
    //height: 50,
    height: moderateScale(50),
    alignItems: "center",
  },
  $stepsContainerStyle: {
    alignItems: "flex-start",
  },
  $ingredientHeaderStyle: {
    ...$sizeStyles.h3,
    fontFamily: "sofia800",
    color: colors.greyscale500,
  },
  $paginationItemStyle: {
    marginHorizontal: spacing.spacing8,
  },
  $paginationViewStyle: {
    width: horizontalScale(40),
    height: horizontalScale(40),
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  $paginationItemTextStyle: {
    ...$sizeStyles.n,
    fontFamily: "sofia800",
  },
  $activePaginationTextStyle: {
    color: "#fff",
  },
  $inactivePaginationTextstyle: {
    color: colors.accent200,
  },
  $buttonsContainerstyle: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.spacing16,
    // paddingHorizontal: spacing.spacing16,
    paddingHorizontal: horizontalScale(spacing.spacing16),
  },
});
