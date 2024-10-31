import RNIcon from "@/components/shared/RNIcon";
import RnInput from "@/components/shared/RNInput";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { $sizeStyles } from "@/theme/typography";
import { Step } from "@/types/step.types";
import useRecipeStore from "@/zustand/useRecipeStore";
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { Alert, Pressable, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { View } from "react-native-ui-lib";

interface SearchParams {
  [key: string]: string;
  step: string;
}

const RecipeEditEditStep = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { step } = useLocalSearchParams<SearchParams>();
  const editStepAction = useRecipeStore.use.editStepAction();

  const parsedStep: Step = JSON.parse(step!);

  const [stepInput, setStepInput] = useState(parsedStep.description);

  const goBack = () => {
    router.back();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={goBack}>
          <RNIcon name="arrow_left" />
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
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default RecipeEditEditStep;
