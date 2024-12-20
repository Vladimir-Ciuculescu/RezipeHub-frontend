import { Text, StyleSheet, Pressable, Alert } from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import RNIcon from "@/components/shared/RNIcon";
import { AntDesign } from "@expo/vector-icons";
import { $sizeStyles } from "@/theme/typography";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { spacing } from "@/theme/spacing";
import { StatusBar } from "expo-status-bar";
import RnInput from "@/components/shared/RNInput";
import RNButton from "@/components/shared/RNButton";
import { colors } from "@/theme/colors";
import { View } from "react-native-ui-lib";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useActionSheet } from "@expo/react-native-action-sheet";
import useRecipeStore from "@/zustand/useRecipeStore";
import FastImage from "react-native-fast-image";
import RNPickerSelect from "react-native-picker-select";
import { RecipeType } from "@/types/enums";
import { RECIPE_TYPES } from "@/constants";
import RNPressable from "@/components/shared/RNPressable";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/scale";
import { Formik, FormikProps, FormikValues } from "formik";
import { recipeAddSchema } from "@/yup/recipe-add.schema";

function RecipeTitle() {
  const { showActionSheetWithOptions } = useActionSheet();

  const addInfoAction = useRecipeStore.use.addInfoAction();
  const reset = useRecipeStore.use.reset();

  // const [title, setTitle] = useState("");
  // const [servings, setServings] = useState("");
  // const [photo, setPhoto] = useState("");
  // const [preparationTime, setPreparationTime] = useState("");
  // const [type, setType] = useState<RecipeType | "">("");

  const formikRef = useRef<FormikProps<any>>(null);

  const router = useRouter();
  const navigation = useNavigation();

  const cancel = () => {
    reset();
    router.back();
  };

  const initialValues = {
    title: "",
    servings: "",
    photoUrl: "",
    type: "",
    preparationTime: "",
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <RNPressable onPress={cancel}>
          <AntDesign
            name="close"
            size={moderateScale(24)}
            color="black"
          />
        </RNPressable>
      ),
      headerRight: () => (
        <RNPressable
          onPress={() => {
            if (formikRef.current) {
              formikRef.current.submitForm();
            }
          }}
        >
          <RNIcon
            name="arrow_right"
            height={moderateScale(20)}
            width={moderateScale(20)}
          />
        </RNPressable>
      ),
      headerTitle: () => <Text style={[$sizeStyles.h3]}>Add Recipe</Text>,
    });
  }, [navigation, formikRef]);

  const openGallery = async (setFieldValue: (label: string, value: string) => void) => {
    const response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (response.canceled) {
      return;
    }

    const [image] = response.assets!;

    setFieldValue("photoUrl", image.uri);
  };

  const removePhoto = (setFieldValue: (label: string, value: string) => void) => {
    setFieldValue("photoUrl", "");
  };

  const goNext = (values: FormikValues) => {
    const { title, servings, photoUrl, type, preparationTime } = values;

    const payload = {
      title,
      servings: parseInt(servings),
      photo: photoUrl,
      type,
      preparationTime: parseInt(preparationTime),
    };

    addInfoAction(payload);

    router.navigate("add_recipe/recipe_items");
  };

  const openSheet = (setFieldValue: (label: string, value: string) => void) => {
    const options = ["Choose anoher photo", "Remove photo", "Cancel"];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      //@ts-ignore
      (selectedIndex: number) => {
        switch (selectedIndex) {
          case 0:
            openGallery(setFieldValue);
            break;

          case 1:
            removePhoto(setFieldValue);
            break;
        }
      },
    );
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={40}
      enableAutomaticScroll
      contentContainerStyle={styles.$containerStyle}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />
      {/* //TODO: Add formik form here (force user to put valid servings and preparation time) */}
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={recipeAddSchema}
        onSubmit={goNext}
      >
        {({ values, touched, errors, handleChange, setFieldValue }) => {
          return (
            <>
              <RnInput
                value={values.title}
                onChangeText={handleChange("title")}
                label="Title"
                placeholder="Title"
                returnKeyType="done"
                wrapperStyle={{ width: "100%" }}
                touched={touched.title as boolean}
                error={errors.title as string}
              />
              <RnInput
                value={values.servings}
                onChangeText={handleChange("servings")}
                // value={servings}
                // onChangeText={setServings}
                keyboardType="numeric"
                returnKeyType="done"
                label="Servings"
                placeholder="Servings"
                wrapperStyle={{ width: "100%" }}
                touched={touched.servings as boolean}
                error={errors.servings as string}
              />
              {!values.photoUrl ? (
                <RNButton
                  // onPress={openGallery}
                  onPress={() => openGallery(setFieldValue)}
                  label="Add photo"
                  style={styles.$addPhotoBtnStye}
                  labelStyle={[{ color: colors.greyscale50 }, $sizeStyles.l]}
                  iconSource={() => (
                    <FontAwesome
                      name="photo"
                      size={moderateScale(22)}
                      color={colors.greyscale50}
                    />
                  )}
                />
              ) : (
                <View style={{ width: "100%", height: moderateScale(183) }}>
                  <Pressable
                    // onPress={openSheet}
                    onPress={() => openSheet(setFieldValue)}
                    style={styles.$removePhotoBtnStyle}
                  >
                    <AntDesign
                      name="close"
                      size={moderateScale(24)}
                      color={colors.greyscale50}
                    />
                  </Pressable>

                  <FastImage
                    style={styles.$imageStyle}
                    source={{
                      // uri: photo,
                      uri: values.photoUrl,
                      priority: FastImage.priority.normal,
                    }}
                  />
                </View>
              )}
              <View style={{ width: "100%", gap: verticalScale(spacing.spacing12) }}>
                <Text style={[$sizeStyles.n, styles.$labelStyle]}>Category</Text>

                <RNPickerSelect
                  doneText="Done"
                  placeholder={{ value: "", label: "Select a Type" }}
                  value={values.type}
                  onValueChange={handleChange("type")}
                  items={RECIPE_TYPES}
                  style={{
                    chevronUp: { display: "none" },
                    chevronDown: { display: "none" },
                    inputIOS: styles.$inputIOSStyle,
                    inputAndroid: styles.$inputAndroidStyle,

                    iconContainer: styles.$iconContainerStyle,
                  }}
                  useNativeAndroidPickerStyle={false}
                  Icon={() => {
                    return <RNIcon name="chef" />;
                  }}
                />
                {touched.type && errors.type && (
                  <Text
                    style={[
                      $sizeStyles.xs,
                      {
                        paddingLeft: spacing.spacing8,
                        color: colors.red500,
                        fontFamily: "sofia400",
                      },
                    ]}
                  >
                    {errors.type as string}
                  </Text>
                )}
              </View>
              <RnInput
                value={values.preparationTime}
                onChangeText={handleChange("preparationTime")}
                keyboardType="numeric"
                returnKeyType="done"
                label="Preparation time (minutes)"
                placeholder="10"
                wrapperStyle={{ width: "100%" }}
                leftIcon={<RNIcon name="clock" />}
                rightIcon={<Text style={{ ...$sizeStyles.s }}>min</Text>}
                touched={touched.preparationTime as boolean}
                error={errors.preparationTime as string}
              />
            </>
          );
        }}
      </Formik>
      {/* <RnInput
        value={title}
        onChangeText={setTitle}
        label="Title"
        placeholder="Title"
        returnKeyType="done"
        wrapperStyle={{ width: "100%" }}
      />
      <RnInput
        value={servings}
        onChangeText={setServings}
        keyboardType="numeric"
        returnKeyType="done"
        label="Servings"
        placeholder="Servings"
        wrapperStyle={{ width: "100%" }}
      />
      {!photo ? (
        <RNButton
          onPress={openGallery}
          label="Add photo"
          style={styles.$addPhotoBtnStye}
          labelStyle={[{ color: colors.greyscale50 }, $sizeStyles.l]}
          iconSource={() => (
            <FontAwesome
              name="photo"
              size={moderateScale(22)}
              color={colors.greyscale50}
            />
          )}
        />
      ) : (
        <View style={{ width: "100%", height: moderateScale(183) }}>
          <Pressable
            onPress={openSheet}
            style={styles.$removePhotoBtnStyle}
          >
            <AntDesign
              name="close"
              size={moderateScale(24)}
              color={colors.greyscale50}
            />
          </Pressable>

          <FastImage
            style={styles.$imageStyle}
            source={{
              uri: photo,
              priority: FastImage.priority.normal,
            }}
          />
        </View>
      )}
      <View style={{ width: "100%", gap: verticalScale(spacing.spacing12) }}>
        <Text style={[$sizeStyles.n, styles.$labelStyle]}>Type</Text>

        <RNPickerSelect
          doneText="Done"
          placeholder={{ value: "", label: "Select a Type" }}
          value={type}
          onValueChange={setType}
          items={RECIPE_TYPES}
          style={{
            chevronUp: { display: "none" },
            chevronDown: { display: "none" },
            inputIOS: styles.$inputIOSStyle,
            inputAndroid: styles.$inputAndroidStyle,

            iconContainer: styles.$iconContainerStyle,
          }}
          useNativeAndroidPickerStyle={false}
          Icon={() => {
            return <RNIcon name="chef" />;
          }}
        />
      </View>
      <RnInput
        value={preparationTime}
        onChangeText={setPreparationTime}
        keyboardType="numeric"
        returnKeyType="done"
        label="Preparation time (minutes)"
        placeholder="10"
        wrapperStyle={{ width: "100%" }}
        leftIcon={<RNIcon name="clock" />}
        rightIcon={<Text style={{ ...$sizeStyles.s }}>min</Text>}
      /> */}
    </KeyboardAwareScrollView>
  );
}

export default RecipeTitle;

const styles = StyleSheet.create({
  $containerStyle: {
    alignItems: "center",
    paddingBottom: 100,
    flexGrow: 1,
    gap: spacing.spacing24,
    paddingHorizontal: spacing.spacing24,
    paddingTop: spacing.spacing24,
  },

  $addPhotoBtnStye: {
    backgroundColor: colors.accent200,
    width: "100%",
    borderColor: colors.accent200,
    borderWidth: 2,
    borderStyle: "solid",
  },

  $removePhotoBtnStyle: {
    position: "absolute",
    // right: 10,
    // top: 10,
    // width: 40,
    // height: 40,
    right: horizontalScale(10),
    top: horizontalScale(10),
    width: horizontalScale(40),
    height: horizontalScale(40),
    backgroundColor: colors.accent400,
    borderRadius: spacing.spacing12,
    zIndex: 999,
    justifyContent: "center",
    alignItems: "center",
  },

  $imageStyle: {
    width: "100%",
    height: "100%",
    borderRadius: spacing.spacing16,
  },

  $labelStyle: { fontFamily: "sofia800", color: colors.greyscale500 },

  $inputAndroidStyle: {
    // height: 54,
    height: moderateScale(54),
    borderColor: colors.greyscale200,
    borderWidth: 2,
    fontFamily: "sofia800",
    // paddingHorizontal: 16,
    paddingHorizontal: horizontalScale(16),

    borderRadius: 16,
    color: colors.slate900,
  },

  $inputIOSStyle: {
    // height: 54,
    height: moderateScale(54),

    borderColor: colors.greyscale200,
    color: colors.slate900,
    borderWidth: 2,
    fontFamily: "sofia800",
    // paddingHorizontal: 16,
    paddingHorizontal: horizontalScale(16),
    borderRadius: 16,
  },
  $iconContainerStyle: {
    // top: 14,
    top: moderateScale(14),
    right: spacing.spacing16,
  },
});
