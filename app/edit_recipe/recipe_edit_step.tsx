import RNButton from "@/components/shared/RNButton";
import RNIcon from "@/components/shared/RNIcon";
import RnInput from "@/components/shared/RNInput";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { $sizeStyles } from "@/theme/typography";
import { Step } from "@/types/step.types";
import { editStepSchema } from "@/yup/edit-step.schema";
import useRecipeStore from "@/zustand/useRecipeStore";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Formik } from "formik";
import { useLayoutEffect } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { View } from "react-native-ui-lib";

interface SearchParams {
  [key: string]: string;
  step: string;
}

interface FormikData {
  step: string;
}

export default function RecipeEditStep() {
  const navigation = useNavigation();
  const router = useRouter();
  const { step } = useLocalSearchParams<SearchParams>();
  const editStepAction = useRecipeStore.use.editStepAction();

  const parsedStep: Step = JSON.parse(step!);

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

      headerTitle: () => <Text style={[$sizeStyles.h3]}>Edit step</Text>,
    });
  }, [navigation]);

  const handleSave = (value: FormikData) => {
    const payload: Step = { ...parsedStep, description: value.step };

    editStepAction(payload);

    router.back();
  };

  const initialValues: FormikData = {
    step: parsedStep.description,
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={120}
      enableAutomaticScroll
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={editStepSchema}
        onSubmit={handleSave}
      >
        {({ values, handleChange, touched, errors, handleSubmit }) => (
          <View
            style={{
              paddingHorizontal: spacing.spacing24,
              gap: spacing.spacing24,
              width: "100%",
            }}
          >
            <RnInput
              touched={touched.step}
              error={errors.step}
              value={values.step}
              onChangeText={handleChange("step")}
              multiline
            />
            <RNButton
              onPress={() => handleSubmit()}
              label="Save"
              style={styles.$btnStyle}
              labelStyle={styles.$btnLabelStyle}
            />
          </View>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  );
}
const styles = StyleSheet.create({
  $btnStyle: {
    backgroundColor: colors.accent200,
    borderColor: colors.accent200,
    borderWidth: 2,
    borderStyle: "solid",
  },
  $btnLabelStyle: {
    color: colors.greyscale50,
    ...$sizeStyles.n,
    fontFamily: "sofia800",
  },
  $stepInfoStyle: {
    height: 28,
    width: 28,
    borderRadius: spacing.spacing8,
    backgroundColor: colors.greyscale150,
    alignItems: "center",
    justifyContent: "center",
  },
});
