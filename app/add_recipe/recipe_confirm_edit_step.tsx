import { View, Text, Pressable, Alert } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import RNIcon from "@/components/shared/RNIcon";
import { colors } from "@/theme/colors";
import { $sizeStyles } from "@/theme/typography";
import { AntDesign } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { spacing } from "@/theme/spacing";
import RnInput from "@/components/shared/RNInput";
import { Step } from "@/types/step.types";
import useRecipeStore from "@/zustand/useRecipeStore";

const RecipeConfirmEditStep = () => {
  const navigation = useNavigation();
  const router = useRouter();

  interface SearchParams {
    [key: string]: string;
    step: string;
  }

  const { step } = useLocalSearchParams<SearchParams>();

  const parsedStep = JSON.parse(step!);

  const [stepInput, setStepInput] = useState(parsedStep.description);

  const editStepAction = useRecipeStore.use.editStepAction();

  const goBack = () => {
    router.back();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={goBack}>
          <RNIcon
            name="arrow_left"
            color={colors.brandPrimary}
          />
        </Pressable>
      ),

      headerTitle: () => <Text style={[$sizeStyles.h3]}>Edit Step</Text>,
      headerRight: () => (
        <Pressable onPress={handleSave}>
          <AntDesign
            name="check"
            size={24}
            color={colors.accent300}
          />
        </Pressable>
      ),
    });
  }, [navigation, stepInput]);

  const handleSave = () => {
    if (!stepInput) {
      Alert.alert("Step cannot be empty !");
      return;
    }

    const payload: Step = { ...parsedStep, description: stepInput };

    editStepAction(payload);

    router.back();
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={120}
      enableAutomaticScroll
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flex: 1,
        alignItems: "center",
        paddingTop: spacing.spacing24,
      }}
    >
      <View
        style={{
          paddingHorizontal: spacing.spacing24,
          gap: spacing.spacing24,
          width: "100%",
        }}
      >
        <RnInput
          value={stepInput}
          onChangeText={setStepInput}
          multiline
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default RecipeConfirmEditStep;
