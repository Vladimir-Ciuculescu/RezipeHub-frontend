import {
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  ListRenderItem,
  Dimensions,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { $sizeStyles } from "@/theme/typography";
import { View } from "react-native-ui-lib";
import RnInput from "@/components/shared/RNInput";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { spacing } from "@/theme/spacing";
import { colors } from "@/theme/colors";
import { Image } from "expo-image";
import RNButton from "@/components/shared/RNButton";
import { Formik, FormikProps, FormikValues } from "formik";
import { recipeEditSchema } from "@/yup/recipe-edit.schema";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import RNSegmentedControl, { SegmentItem } from "@/components/shared/RnSegmentedControl";
import IngredientsList from "@/components/IngredientsList";
import StepsList from "@/components/StepsList";
import { IngredientItem } from "@/types/ingredient.types";
import { Step } from "@/types/step.types";
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import useRecipeStore from "@/zustand/useRecipeStore";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import {
  useDeleteRecipeImageMutation,
  useEditRecipeMutation,
  useUploadToS3Mutation,
} from "@/hooks/recipes.hooks";
import { AddPhotoRequest } from "@/types/s3.types";
import { EditRecipeRequest, PaginatedRecipeItem } from "@/types/recipe.types";
import Toast from "react-native-toast-message";
import toastConfig from "@/components/Toast/ToastConfing";
import RNIcon from "@/components/shared/RNIcon";
import RNPickerSelect from "react-native-picker-select";
import { RECIPE_TYPES } from "@/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RNPressable from "@/components/shared/RNPressable";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/scale";
import { useCurrentUser } from "@/context/UserContext";

const { width } = Dimensions.get("screen");

const SEGMENTS: SegmentItem[] = [{ label: "Ingredients" }, { label: "Instructions" }];
export const getImageUrlWithCacheBuster = (url: string) => {
  const timestamp = new Date().getTime();
  return `${url}?t=${timestamp}`;
};

const RecipeEditSummary = () => {
  const { bottom } = useSafeAreaInsets();

  const router = useRouter();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();

  const recipedId = useRecipeStore.use.id!();
  const title = useRecipeStore.use.title();
  const servings = useRecipeStore.use.servings();
  const photo = useRecipeStore.use.photo();
  const type = useRecipeStore.use.type();
  const preparationTime = useRecipeStore.use.preparationTime();
  const ingredients = useRecipeStore.use.ingredients();
  const steps = useRecipeStore.use.steps();

  const removeStepAction = useRecipeStore.use.removeStepAction();
  const removeIngredientAction = useRecipeStore.use.removeIngredientAction();
  const { showActionSheetWithOptions } = useActionSheet();
  const [segmentIndex, setSegmentIndex] = useState(0);
  const inputsFlatlListRef = useRef<FlatList>(null);

  //List of ids that needs to be deleted from DB if ingredients are deleted from FE
  const [ingredientIds, setingredientIds] = useState<number[]>([]);
  const [stepsIds, setStepsIds] = useState<number[]>([]);

  const { mutateAsync: editRecipeMutation, isPending: editRecipePending } = useEditRecipeMutation();
  const { mutateAsync: uploadToS3Mutation, isPending: uploadToS3Pending } = useUploadToS3Mutation();
  const { mutateAsync: deleteRecipeImageMutation, isPending: deleteRecipeImagePending } =
    useDeleteRecipeImageMutation();

  const isLoading = editRecipePending || uploadToS3Pending || deleteRecipeImagePending;

  const formikRef = useRef<FormikProps<any>>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <RNPressable
          onPress={cancel}
          disabled={isLoading}
        >
          <AntDesign
            name="close"
            size={24}
            color="black"
          />
        </RNPressable>
      ),
      headerTitle: () => <Text style={[$sizeStyles.h3]}>Edit recipe</Text>,
      headerRight: () =>
        isLoading ? (
          <ActivityIndicator color={colors.accent200} />
        ) : (
          <RNPressable
            onPress={() => {
              if (formikRef.current) {
                formikRef.current.submitForm();
              }
            }}
          >
            <Text style={[{ ...$sizeStyles.l }, { color: colors.accent200 }]}>Save</Text>
          </RNPressable>
        ),
    });
  }, [navigation, isLoading, formikRef]);

  const onDeleteIngredient = useCallback((ingredient: IngredientItem) => {
    removeIngredientAction(ingredient);
    setingredientIds((oldValue) => [...oldValue, ingredient.id!]);
  }, []);

  const onDeleteStep = useCallback((step: Step) => {
    setStepsIds((oldValue) => [...oldValue, step.id!]);
    removeStepAction(step);
  }, []);

  const onEditIngreidient = (ingredient: IngredientItem) => {
    router.navigate({
      pathname: "/edit_recipe/recipe_edit_ingredient",
      params: { ingredient: JSON.stringify(ingredient) },
    });
  };

  const onEditStep = (step: Step) => {
    router.navigate({
      pathname: "/edit_recipe/recipe_edit_edit_step",
      params: { step: JSON.stringify(step) },
    });
  };

  const sections = [
    {
      section: (
        <IngredientsList
          mode="edit"
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
          mode="edit"
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
    type,
    preparationTime: preparationTime.toString(),
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

  const handleSave = async (values: FormikValues) => {
    if (!ingredients.length || !steps.length) {
      Toast.show({
        type: "error",

        props: {
          title: "Missing Information",
          msg: "Each recipe must have at least one ingredient and one step",
          icon: (
            <RNIcon
              name="cook"
              color={colors.greyscale50}
            />
          ),
        },
      });

      return;
    }

    const { title, servings, photoUrl, type, preparationTime } = values;

    try {
      let photo = "";

      if (photoUrl) {
        const uploadToS3Payload: AddPhotoRequest = {
          userId: user.id,
          id: recipedId!,
          photoUrl,
        };
        const url = await uploadToS3Mutation(uploadToS3Payload);
        photo = url;
      } else {
        const removeRecipeImageFromS3Payload = {
          userId: user.id,
          recipeId: recipedId!,
        };

        await deleteRecipeImageMutation(removeRecipeImageFromS3Payload);
      }

      const recipe = {
        id: recipedId!,
        title,
        servings: parseInt(servings),
        photoUrl: photo,
        type,
        preparationTime: parseInt(preparationTime),
        ingredients,
        steps,
      };

      let payload: EditRecipeRequest = { recipe };

      //If ingredients were deleted from FE, append to payload the list of ids that needs to be deleted
      if (ingredientIds.length) {
        payload.ingredientsIds = ingredientIds;
      }

      //If steps were deleted from FE, append to payload the list of ids that needs to be deleted
      if (stepsIds.length) {
        payload.stepsIds = stepsIds;
      }

      const data = await editRecipeMutation(payload);

      //Update the recipe details screen with the new data
      queryClient.setQueryData(["recipe"], (oldData: any) => {
        const responseIngredients = data.ingredients;

        const syncedIngredients = payload.recipe.ingredients?.map((ingredient) => {
          // Find the corresponding item in responseIngredients by foodId
          const matchingResponseIngredient = responseIngredients.find(
            //TODO : Remove any and use appropriate interface
            (responseIngredient: any) => responseIngredient.foodId === ingredient.foodId,
          );

          // Return a new object with the id from responseIngredients if a match is found
          return {
            ...ingredient,
            id: matchingResponseIngredient ? matchingResponseIngredient.id : undefined, // Set `id` if matched
            allUnits: ingredient.allMeasures,
            name: ingredient.title,
            unit: ingredient.measure,
          };
        });

        const updatedRecipe = {
          ...oldData.recipe,
          title: payload.recipe.title,
          servings: payload.recipe.servings,
          photoUrl: payload.recipe.photoUrl
            ? getImageUrlWithCacheBuster(payload.recipe.photoUrl)
            : "",

          preparationTime: payload.recipe.preparationTime,

          ingredients: syncedIngredients,
          steps: payload.recipe.steps?.map((step) => ({
            id: step.id,
            step: step.step,
            text: step.description,
          })),
        };

        return { ...oldData, ...updatedRecipe };
      });

      queryClient.invalidateQueries({ queryKey: ["recipes-per-user"] });

      queryClient.setQueryData(
        ["all-personal-recipes"],
        (oldData: InfiniteData<PaginatedRecipeItem[]>) => {
          if (!oldData) {
            return oldData;
          }

          const totalCalories = payload.recipe.ingredients!.reduce(
            (sum, ingredient) => sum + ((ingredient["calories"] as number) || 0),
            0,
          );

          return {
            ...oldData,
            pages: oldData.pages.map((page) => {
              return page.map((recipe: PaginatedRecipeItem) => {
                return recipe.id === payload.recipe.id
                  ? {
                      ...recipe,

                      photoUrl: payload.recipe.photoUrl
                        ? getImageUrlWithCacheBuster(payload.recipe.photoUrl)
                        : "",
                      title: payload.recipe.title,
                      preparationTime: payload.recipe.preparationTime,
                      totalCalories,
                    }
                  : recipe;
              });
            }),
          };
        },
      );

      Alert.alert("Success", "Recipe updated !", [
        {
          text: "OK",
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error("Could not edit recipe !:", error);
    }
  };

  return (
    <>
      <KeyboardAwareScrollView
        extraScrollHeight={160}
        enableAutomaticScroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.$containerStyle}
      >
        {Platform.OS === "android" && <StatusBar style="dark" />}

        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          onSubmit={handleSave}
          validationSchema={recipeEditSchema}
        >
          {({ values, touched, errors, handleChange, setFieldValue }) => {
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
                    returnKeyType="done"
                    placeholder="Title"
                    wrapperStyle={{ width: "100%" }}
                    touched={touched.title as boolean}
                    error={errors.title as string}
                  />
                  <RnInput
                    value={values.servings}
                    onChangeText={handleChange("servings")}
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
                    <View style={{ width: "100%", height: moderateScale(183) }}>
                      <Pressable
                        onPress={() => openSheet(setFieldValue)}
                        style={styles.$removePhotoBtnStyle}
                      >
                        <AntDesign
                          name="close"
                          size={moderateScale(24)}
                          color={colors.greyscale50}
                        />
                      </Pressable>

                      <Image
                        style={styles.$imageStyle}
                        source={{
                          uri: values.photoUrl,
                        }}
                      />
                    </View>
                  )}
                  <View style={{ width: "100%", gap: spacing.spacing12 }}>
                    <Text style={[$sizeStyles.n, styles.$labelStyle]}>Type</Text>

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
                  </View>
                  <RnInput
                    value={values.preparationTime}
                    onChangeText={handleChange("preparationTime")}
                    keyboardType="numeric"
                    label="Preparation time (minutes)"
                    placeholder="15"
                    returnKeyType="done"
                    wrapperStyle={{ width: "100%" }}
                    leftIcon={<RNIcon name="clock" />}
                    rightIcon={<Text style={{ ...$sizeStyles.s }}>min</Text>}
                    touched={touched.preparationTime as boolean}
                    error={errors.preparationTime as string}
                  />
                  <RNSegmentedControl
                    borderRadius={16}
                    segments={SEGMENTS}
                    initialIndex={segmentIndex}
                    onChangeIndex={handleSegmentIndex}
                    segmentsStyle={{ height: verticalScale(54) }}
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
      <Toast
        config={toastConfig}
        position="bottom"
        bottomOffset={-bottom}
      />
    </>
  );
};

export default RecipeEditSummary;

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

    right: horizontalScale(10),
    top: verticalScale(10),
    width: horizontalScale(40),
    height: verticalScale(40),
    backgroundColor: colors.accent400,
    borderRadius: 12,
    zIndex: 999,
    justifyContent: "center",
    alignItems: "center",
  },

  $inputAndroidStyle: {
    height: moderateScale(54),
    borderColor: colors.greyscale200,
    borderWidth: 2,
    fontFamily: "sofia800",
    paddingHorizontal: horizontalScale(16),
    borderRadius: 16,
    color: colors.slate900,
  },

  $inputIOSStyle: {
    height: moderateScale(54),

    borderColor: colors.greyscale200,
    color: colors.slate900,
    borderWidth: 2,
    fontFamily: "sofia800",
    paddingHorizontal: horizontalScale(16),
    borderRadius: 16,
  },
  $iconContainerStyle: {
    top: verticalScale(14),
    right: spacing.spacing16,
  },
  $imageStyle: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },

  $labelStyle: { fontFamily: "sofia800", color: colors.greyscale500 },
});
