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
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { $sizeStyles } from "@/theme/typography";
import { View } from "react-native-ui-lib";
import RnInput from "@/components/shared/RNInput";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { spacing } from "@/theme/spacing";
import { colors } from "@/theme/colors";
import FastImage from "react-native-fast-image";
import RNButton from "@/components/shared/RNButton";
import { Formik } from "formik";
import { RecipeResponse } from "@/types/recipe.types";
import { recipeEditSchema } from "@/yup/recipe-edit.schema";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import RNSegmentedControl, { SegmentItem } from "@/components/shared/RnSegmentedControl";
import IngredientsList from "@/components/IngredientsList";
import StepsList from "@/components/StepsList";
import { IngredientItem, IngredientItemResponse } from "@/types/ingredient.types";
import { Step, StepItemResponse } from "@/types/step.types";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const { width } = Dimensions.get("screen");

const SEGMENTS: SegmentItem[] = [{ label: "Ingredients" }, { label: "Instructions" }];

interface SearchParams {
  [key: string]: string;
  recipe: string;
}

export default function RecipeEditModal() {
  const { recipe } = useLocalSearchParams<SearchParams>();

  const router = useRouter();

  const navigation = useNavigation();
  const { showActionSheetWithOptions } = useActionSheet();
  const [segmentIndex, setSegmentIndex] = useState(0);
  const inputsFlatlListRef = useRef<FlatList>(null);
  const parsedRecipe: RecipeResponse = JSON.parse(recipe!);

  const { title, servings, photoUrl } = parsedRecipe;

  const parsedIngredients: IngredientItem[] = parsedRecipe.ingredients.map(
    (ingredient: IngredientItemResponse) => ({
      foodId: ingredient.id,
      measure: ingredient.unit,
      quantity: ingredient.quantity,
      title: ingredient.name,
      calories: ingredient.calories,
      carbs: ingredient.carbs,
      proteins: ingredient.proteins,
      fats: ingredient.fats,
    }),
  );

  const parsedSteps: Step[] = parsedRecipe.steps.map((step: StepItemResponse) => ({
    id: step.id,
    step: step.step,
    number: step.step,
    description: step.text,
  }));

  const [ingredients, setIngredients] = useState(parsedIngredients);
  const [steps, setSteps] = useState(parsedSteps);

  const deleteIngredient = useCallback((id: number) => {
    setIngredients((oldValue) => oldValue.filter((ingredient) => ingredient.foodId !== id));
  }, []);

  const deleteStep = useCallback((id: number) => {
    setSteps((oldValue) => oldValue.filter((ingredient) => ingredient.id !== id));
  }, []);

  useEffect(() => {
    console.log(steps);
  }, [steps]);

  const sections = [
    {
      section: (
        <IngredientsList
          loading={false}
          onLeftSwipe={deleteIngredient}
          swipeable
          ingredients={ingredients}
        />
      ),
    },
    {
      section: (
        <StepsList
          onLeftSwipe={deleteStep}
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => {}}>
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
  }, [navigation]);

  const cancel = () => {
    router.back();
  };

  const initialValues = {
    title,
    servings: servings.toString(),
    photoUrl,
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
        extraScrollHeight={80}
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
          {({ values, touched, errors, handleSubmit, handleChange, handleBlur, setFieldValue }) => (
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
          )}
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
