import {
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  ListRenderItem,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { $sizeStyles } from "@/theme/typography";
import { View } from "react-native-ui-lib";
import RnInput from "@/components/shared/RNInput";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { spacing } from "@/theme/spacing";
import { colors } from "@/theme/colors";
import FastImage from "react-native-fast-image";
import RNButton from "@/components/shared/RNButton";
import { Formik } from "formik";
import { recipeEditSchema } from "@/yup/recipe-edit.schema";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import RNSegmentedControl, { SegmentItem } from "@/components/shared/RnSegmentedControl";
import IngredientsList from "@/components/IngredientsList";
import StepsList from "@/components/StepsList";
import { IngredientItem } from "@/types/ingredient.types";
import { Step } from "@/types/step.types";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import useRecipeStore from "@/zustand/useRecipeStore";

const { width } = Dimensions.get("screen");

const SEGMENTS: SegmentItem[] = [{ label: "Ingredients" }, { label: "Instructions" }];

export default function RecipeEditSummary() {
  const router = useRouter();

  const title = useRecipeStore.use.title();
  const servings = useRecipeStore.use.servings();
  const photo = useRecipeStore.use.photo();
  const ingredients = useRecipeStore.use.ingredients();
  const steps = useRecipeStore.use.steps();
  const removeStepAction = useRecipeStore.use.removeStepAction();
  const removeIngredientAction = useRecipeStore.use.removeIngredientAction();

  const navigation = useNavigation();
  const { showActionSheetWithOptions } = useActionSheet();
  const [segmentIndex, setSegmentIndex] = useState(0);
  const inputsFlatlListRef = useRef<FlatList>(null);

  const onDeleteIngredient = useCallback((ingredient: IngredientItem) => {
    removeIngredientAction(ingredient);
  }, []);

  const onDeleteStep = useCallback((step: Step) => {
    removeStepAction(step);
  }, []);

  const onEditIngreidient = (ingredient: IngredientItem) => {
    router.navigate({
      pathname: "edit_recipe/recipe_edit_ingredient",
      params: { ingredient: JSON.stringify(ingredient) },
    });
  };

  const onEditStep = (step: Step) => {
    router.navigate({
      pathname: "edit_recipe/recipe_edit_step",
      params: { step: JSON.stringify(step) },
    });
  };

  const sections = [
    {
      section: (
        <IngredientsList
          editable
          loading={false}
          onDelete={onDeleteIngredient}
          onEdit={onEditIngreidient}
          ingredients={ingredients}
        />
      ),
    },
    {
      section: (
        <StepsList
          onDelete={onDeleteStep}
          onEdit={onEditStep}
          swipeable
          loading={false}
          steps={steps}
        />
      ),
    },
  ];

  const renderItem: ListRenderItem<any> = ({ item }) => {
    return <View style={{ width: width }}>{item.section}</View>;
  };

  const cancel = () => {
    router.back();
  };

  const initialValues = {
    title,
    servings: servings.toString(),
    photoUrl: photo,
  };

  const handleSegmentIndex = (index: number) => {
    inputsFlatlListRef.current!.scrollToIndex({ index: index, animated: true });
    setSegmentIndex(index);
  };

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
    <GestureHandlerRootView>
      <KeyboardAwareScrollView
        extraScrollHeight={160}
        enableAutomaticScroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.$containerStyle}
      >
        {Platform.OS === "android" && <StatusBar style="dark" />}

        <Formik
          initialValues={initialValues}
          onSubmit={() => {}}
          validationSchema={recipeEditSchema}
        >
          {({
            values,
            setValues,
            touched,
            errors,
            handleSubmit,
            handleChange,
            handleBlur,
            setFieldValue,
            dirty,
            isValid,
          }) => {
            useLayoutEffect(() => {
              navigation.setOptions({
                headerLeft: () => (
                  <TouchableOpacity
                    disabled={!dirty || !isValid}
                    style={!dirty || !isValid ? { opacity: 0.3 } : { opacity: 1 }}
                    onPress={() => {}}
                  >
                    <Text style={{ ...$sizeStyles.l }}>Save</Text>
                  </TouchableOpacity>
                ),
                headerRight: () => (
                  <RNButton
                    onPress={cancel}
                    link
                    iconSource={() => (
                      <AntDesign
                        name="close"
                        size={24}
                        color="black"
                      />
                    )}
                  />
                ),
                headerTitle: () => <Text style={[$sizeStyles.h3]}>Edit recipe</Text>,
              });
            }, [navigation, dirty, isValid]);

            return (
              <View style={{ width: "100%", gap: spacing.spacing32 }}>
                <View
                  style={{
                    width: "100%",
                    gap: spacing.spacing32,
                    paddingHorizontal: spacing.spacing24,
                  }}
                >
                  <RnInput
                    value={values.title}
                    onChangeText={handleChange("title")}
                    label="Title"
                    placeholder="Title"
                    wrapperStyle={{ width: "100%" }}
                  />
                  <RnInput
                    value={values.servings}
                    onChangeText={handleChange("servings")}
                    keyboardType="numeric"
                    label="Servings"
                    placeholder="Servings"
                    wrapperStyle={{ width: "100%" }}
                  />

                  {!values.photoUrl ? (
                    <RNButton
                      onPress={() => openGallery(setFieldValue)}
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
                        onPress={() => openSheet(setFieldValue)}
                        style={styles.$removePhotoBtnStyle}
                      >
                        <AntDesign
                          name="close"
                          size={24}
                          color={colors.greyscale50}
                        />
                      </Pressable>

                      <FastImage
                        style={styles.$imageStyle}
                        source={{
                          uri: values.photoUrl,
                          priority: FastImage.priority.normal,
                        }}
                      />
                    </View>
                  )}
                  <RNSegmentedControl
                    borderRadius={16}
                    segments={SEGMENTS}
                    initialIndex={segmentIndex}
                    onChangeIndex={handleSegmentIndex}
                  />
                </View>
                <FlatList
                  scrollEnabled={false}
                  ref={inputsFlatlListRef}
                  data={sections}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={renderItem}
                />
              </View>
            );
          }}
        </Formik>
      </KeyboardAwareScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  $containerStyle: {
    alignItems: "center",
    paddingBottom: 100,
    flexGrow: 1,
    gap: spacing.spacing24,
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
