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

const { width: screenWidth } = Dimensions.get("window");

export default function RecipeAddSteps() {
  const navigation = useNavigation();
  const router = useRouter();

  const [steps, setSteps] = useState([{ description: "" }]);
  const [activeIndex, setActiveIndex] = useState(0);

  const paginationFlatListRef = useRef<FlatList>(null);
  const inputsFlatlListRef = useRef<FlatList>(null);

  const addStepsAction = useRecipeStore.use.addStepsAction();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={gotBack}>
          <RNIcon
            name="arrow_left"
            color={colors.brandPrimary}
          />
        </Pressable>
      ),

      headerTitle: () => <Text style={[$sizeStyles.h3]}>Add steps</Text>,
      headerRight: () => (
        <Pressable onPress={confirmSteps}>
          <AntDesign
            name="check"
            size={24}
            color={colors.accent200}
          />
        </Pressable>
      ),
    });
  }, [navigation, steps]);

  useEffect(() => {
    paginationFlatListRef.current!.scrollToIndex({
      index: activeIndex,
      animated: true,
      viewPosition: 0.5,
    });
    inputsFlatlListRef.current!.scrollToIndex({ index: activeIndex, animated: true });
  }, [activeIndex]);

  const confirmSteps = () => {
    const newSteps = steps.map((step, index) => ({ ...step, number: index + 1 }));
    addStepsAction(newSteps);

    router.dismiss(1);
  };

  const gotBack = () => {
    router.back();
  };

  const addStep = () => {
    const newIndex = steps.length;
    setSteps([...steps, { description: "" }]);
    setActiveIndex(newIndex);
  };

  const deleteStep = () => {
    setSteps(() => steps.filter((_, index) => index !== activeIndex));
    setActiveIndex(activeIndex - 1);
  };

  const handlePagePress = (index: number) => {
    setActiveIndex(index);
  };

  const handleTextChange = (text: string, index: number) => {
    const newItems = [...steps];
    newItems[index].description = text;
    setSteps(newItems);
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
        paddingTop: spacing.spacing24,
        paddingBottom: spacing.spacing32,
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
                      ? styles.activePaginationText
                      : styles.inactivePaginationText,
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
          // pagingEnabled
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
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                }}
                onKeyPress={handleKeyPress}
                value={item.text}
                multiline
                onChangeText={(value: string) => handleTextChange(value, index)}
              />
            </View>
          )}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.spacing16,
          paddingHorizontal: spacing.spacing16,
        }}
      >
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
}

const styles = StyleSheet.create({
  $stepViewStyle: {
    gap: spacing.spacing16,
    width: screenWidth,
    justifyContent: "center",
    paddingHorizontal: spacing.spacing24,
  },

  $paginationContainerStyle: {
    height: 50,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  $paginationItemTextStyle: {
    ...$sizeStyles.n,
    fontFamily: "sofia800",
  },

  activePaginationText: {
    color: "#fff",
  },
  inactivePaginationText: {
    color: colors.accent200,
  },
});
