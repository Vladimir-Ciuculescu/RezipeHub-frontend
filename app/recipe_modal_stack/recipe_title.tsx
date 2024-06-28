import { Text, StyleSheet, Pressable, Alert, Image } from "react-native";
import React, { useLayoutEffect, useRef } from "react";
import { useNavigation, useRouter } from "expo-router";
import RNIcon from "@/components/shared/RNIcon";
import { AntDesign } from "@expo/vector-icons";
import { $sizeStyles } from "@/theme/typography";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { spacing } from "@/theme/spacing";
import { StatusBar } from "expo-status-bar";
import { Formik, FormikProps } from "formik";
import RnInput from "@/components/shared/RNInput";
import RNButton from "@/components/shared/RNButton";
import { colors } from "@/theme/colors";
import { View } from "react-native-ui-lib";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useActionSheet } from "@expo/react-native-action-sheet";

function RecipeTitle() {
  const { showActionSheetWithOptions } = useActionSheet();

  const router = useRouter();
  const navigation = useNavigation();
  const formikRef = useRef<
    FormikProps<{
      title: string | undefined;
      servings: string | undefined;
      photo: string | undefined;
    }>
  >(null);

  const cancel = () => {
    router.back();
  };

  const initialValues = {
    title: "",
    servings: undefined,
    photo: "",
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={cancel}>
          <AntDesign
            name="close"
            size={24}
            color="black"
          />
        </Pressable>
      ),
      headerRight: () => (
        <Pressable onPress={goNext}>
          <RNIcon name="arrow_right" />
        </Pressable>
      ),

      headerTitle: () => <Text style={[$sizeStyles.h3]}>Add Recipe</Text>,
    });
  }, [navigation]);

  const openGallery = async () => {
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

    if (formikRef.current) {
      const { setFieldValue } = formikRef.current;

      setFieldValue("photo", image.uri);
    }
  };

  const removePhoto = () => {
    if (formikRef.current) {
      const { setFieldValue } = formikRef.current;
      setFieldValue("photo", "");
    }
  };

  const goNext = () => {
    if (formikRef.current) {
      const { values } = formikRef.current;

      if (!values.title) {
        showEmptyTitleMessage();
        return;
      }

      if (!values.servings) {
        showEmptyServingsMessage();
        return;
      }

      router.navigate("recipe_modal_stack/recipe_items");
    }
  };

  const showEmptyTitleMessage = () => {
    Alert.alert("Cannot continue", "Please enter a title for the recipe", [{ text: "OK" }], {
      cancelable: false,
    });
  };

  const showEmptyServingsMessage = () => {
    Alert.alert(
      "Cannot continue",
      "Please enter the number of servings for the recipe",
      [{ text: "OK" }],
      { cancelable: false },
    );
  };

  const openSheet = () => {
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
            openGallery();
            break;

          case 1:
            removePhoto();
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
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        onSubmit={() => {}}
      >
        {({ values, touched, errors, handleChange, handleBlur }) => (
          <>
            <RnInput
              onChangeText={handleChange("title")}
              onBlur={handleBlur("title")}
              value={values.title}
              touched={touched.title}
              error={errors.title}
              label="Title"
              placeholder="Title"
              wrapperStyle={{ width: "100%" }}
            />
            <RnInput
              keyboardType="numeric"
              onChangeText={handleChange("servings")}
              onBlur={handleBlur("servings")}
              value={values.servings}
              touched={touched.servings}
              error={errors.servings}
              label="Servings"
              placeholder="Servings"
              wrapperStyle={{ width: "100%" }}
            />
            {!values.photo ? (
              <RNButton
                onPress={openGallery}
                label="Add photo"
                style={styles.$addPhotoBtnStye}
                labelStyle={[{ color: colors.greyscale50 }, $sizeStyles.l]}
                iconSource={() => (
                  <FontAwesome
                    name="photo"
                    size={20}
                    color={colors.greyscale50}
                  />
                )}
              />
            ) : (
              <View style={{ width: "100%", height: 183 }}>
                <Pressable
                  onPress={openSheet}
                  style={styles.$removePhotoBtnStyle}
                >
                  <AntDesign
                    name="close"
                    size={24}
                    color={colors.greyscale50}
                  />
                </Pressable>
                <Image
                  source={{ uri: values.photo }}
                  style={styles.$imageStyle}
                />
              </View>
            )}
          </>
        )}
      </Formik>
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
    right: 10,
    top: 10,
    width: 40,
    height: 40,
    backgroundColor: colors.accent400,
    borderRadius: 12,
    zIndex: 999,
    justifyContent: "center",
    alignItems: "center",
  },

  $imageStyle: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
});
