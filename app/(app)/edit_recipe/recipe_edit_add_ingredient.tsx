import { Text, Pressable, StyleSheet, Platform, ScrollView } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { $sizeStyles } from "@/theme/typography";
import { colors } from "@/theme/colors";
import RNIcon from "@/components/shared/RNIcon";
import { spacing } from "@/theme/spacing";
import RNPickerSelect from "react-native-picker-select";
import {
  IngredientResponse,
  NutrientDetail,
  NutrientResponse,
  NutrientsRequestPayload,
} from "@/types/ingredient.types";
import useRecipeStore from "@/zustand/useRecipeStore";
import FoodService from "@/api/services/food.service";
import RnInput from "@/components/shared/RNInput";
import RNSegmentedControl from "@/components/shared/RnSegmentedControl";
import { formatFloatingValue } from "@/utils/formatFloatingValue";
import { View } from "react-native-ui-lib";
import Toast from "react-native-toast-message";
import toastConfig from "@/components/Toast/ToastConfing";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Skeleton } from "moti/skeleton";
import RNPressable from "@/components/shared/RNPressable";

interface NutrientItemProps {
  nutrient: [string, NutrientDetail];
}

const nutrientsLabelMapping: any = {
  ENERC_KCAL: "Calories",
  FAT: "Fats",
  FASAT: "Total saturated fats",
  FAMS: "Monosaturated fats",
  FAPU: "Polyunsaturated fats",
  CHOCDF: "Carbohydrates",
  "CHOCDF.net": "Net Carbohydrates",
  NA: "Sodium",
  CA: "Calcium",
  MG: "Magnesium",
  K: "Potasium",
  FE: "Iron",
  ZN: "Zinc",
  P: "Phosporus",
  VITC: "Vitamin C",
  VITD: "Vitamin D",
};

const NutrientItem: React.FC<NutrientItemProps> = ({ nutrient }) => {
  const label = nutrient[0];
  const quantity = nutrient[1].quantity;
  const unitMeasure = nutrient[1].unit;

  const nutrientLabel = nutrientsLabelMapping[label] || nutrient[1].label;
  return (
    <View
      row
      style={{ justifyContent: "space-between" }}
    >
      <Text style={styles.$nutrientLabelStyle}>{nutrientLabel}</Text>
      <Text style={styles.$nutrientValueStyle}>
        {formatFloatingValue(quantity)} {unitMeasure}
      </Text>
    </View>
  );
};

const RecipeEditAddIngredient = () => {
  const { bottom } = useSafeAreaInsets();

  const navigation = useNavigation();
  const router = useRouter();
  const [nutrientsInfo, setNutrientsInfo] = useState<NutrientResponse>();
  const [unitMeasure, setUnitMeasure] = useState("Gram");
  const [pickerDismissed, setPickerDismissed] = useState(true);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [quantity, setQuantity] = useState("100");
  const addIngredientAction = useRecipeStore.use.addIngredientAction();
  const ingredientsFromStore = useRecipeStore.use.ingredients();
  const { ingredient } = useLocalSearchParams<any>();

  const parsedIngredient: IngredientResponse = JSON.parse(ingredient);

  const measures = parsedIngredient.measures
    .filter((measure) => measure.label)
    .map((measure) => ({
      label: `${measure.label}`,
      value: measure.label,
      uri: measure.uri,
    }));

  useLayoutEffect(() => {
    // const saveDisabled = !saveEnabled || !pickerDismissed;

    const gotBack = () => {
      router.back();
    };

    navigation.setOptions({
      headerLeft: () => (
        <RNPressable onPress={gotBack}>
          <RNIcon
            name="arrow_left"
            color={colors.brandPrimary}
          />
        </RNPressable>
      ),

      headerTitle: () => <Text style={[$sizeStyles.h3]}>Add Ingredients</Text>,
      headerRight: () => (
        <RNPressable onPress={addIngredient}>
          <AntDesign
            name="check"
            size={24}
            color={colors.accent300}
          />
        </RNPressable>
      ),
    });
  }, [navigation, nutrientsInfo]);

  const defaultMeasurementObject = {
    foodId: parsedIngredient.food.foodId,
    measureURI: "http://www.edamam.com/ontologies/edamam.owl#Measure_gram",
    quantity: 100,
  };

  useEffect(() => {
    if (pickerDismissed || Platform.OS === "android") {
      const measure = measures.find((item) => item.value === unitMeasure);

      let payload: any = {};

      if (measure) {
        payload = {
          foodId: parsedIngredient.food.foodId,
          measureUri: measure!.uri,
          quantity: parseInt(quantity),
        };
      } else {
        payload = defaultMeasurementObject;
      }

      getNutritionData(payload.foodId, payload.measureUri, payload.quantity);
    }
  }, [pickerDismissed, unitMeasure]);

  const addIngredient = () => {
    const existentIngredient = ingredientsFromStore.find(
      (ingredient) => ingredient.foodId === parsedIngredient.food.foodId,
    );

    if (existentIngredient) {
      Toast.show({
        type: "error",
        props: {
          title: "Not allowed !",
          msg: "You have already added this ingredient !",
          icon: (
            <RNIcon
              name="cook"
              color={colors.greyscale50}
            />
          ),
        },
      });
    } else {
      const currentMeasure = parsedIngredient.measures.find((item) => item.label === unitMeasure);

      const measures = parsedIngredient.measures.map((measure) => ({
        uri: measure.uri,
        label: measure.label,
        weight: measure.weight,
      }));

      const payload = {
        foodId: parsedIngredient.food.foodId,
        title: parsedIngredient.food.label,
        measure: unitMeasure,
        // quantity: quantity,
        uri: currentMeasure!.uri,
        quantity: parseInt(quantity),
        calories: nutrientsInfo?.totalNutrients.ENERC_KCAL!.quantity!,
        carbs: nutrientsInfo?.totalNutrients.CHOCDF!.quantity,
        proteins: nutrientsInfo?.totalNutrients.PROCNT!.quantity,
        fats: nutrientsInfo?.totalNutrients.FAT?.quantity,
        measures,
      };

      addIngredientAction(payload);
      router.dismiss(2);
    }
  };

  const getNutritionData = async (foodId: string, uri: string, quantity: number) => {
    let payload: NutrientsRequestPayload | undefined;

    try {
      payload = { foodId, measureURI: uri, quantity };
      const data = await FoodService.getNutritionData(payload);
      setNutrientsInfo(data);
    } catch (error) {
      console.log(error);
    }
  };

  const gotBack = () => {
    router.back();
  };

  const submitQuantity = async () => {
    const measure = measures.find((item) => item.value === unitMeasure);

    getNutritionData(parsedIngredient.food.foodId, measure!.uri!, parseInt(quantity));
  };

  const segments = [{ label: "Measures" }, { label: "Percentage" }];

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.$contentContainerstyle}
        style={styles.$containerStyle}
      >
        <View style={{ gap: spacing.spacing24 }}>
          <Text style={$sizeStyles.h1}>{parsedIngredient.food.label}</Text>

          <View style={styles.$baseWrapperStyle}>
            <Text style={[$sizeStyles.n, styles.$labelStyle]}>Unit measure</Text>

            <RNPickerSelect
              placeholder={{}}
              doneText="Search"
              onOpen={() => setPickerDismissed(false)}
              onClose={() => setPickerDismissed(true)}
              value={unitMeasure}
              onValueChange={setUnitMeasure}
              onDonePress={() => setPickerDismissed(true)}
              items={measures}
              style={{
                chevronUp: { display: "none" },
                chevronDown: { display: "none" },
                inputIOS: styles.$inputIOSStyle,
                inputAndroid: styles.$inputAndroidStyle,

                iconContainer: styles.$iconContainerStyle,
              }}
              useNativeAndroidPickerStyle={false}
              Icon={() => {
                return <RNIcon name="cook" />;
              }}
            />
          </View>
          <RnInput
            onSubmitEditing={submitQuantity}
            keyboardType="numeric"
            returnKeyType="done"
            onChangeText={(value: any) => setQuantity(value)}
            autoCapitalize="none"
            value={quantity}
            label="Quantity"
            placeholder="Enter quantity"
          />
          <View style={styles.$baseWrapperStyle}>
            <Text style={[$sizeStyles.h3, styles.$labelStyle]}>Nutritional information</Text>

            <RNSegmentedControl
              borderRadius={16}
              initialIndex={segmentIndex}
              segments={segments}
              onChangeIndex={setSegmentIndex}
            />

            {nutrientsInfo ? (
              Object.entries(
                segmentIndex === 0 ? nutrientsInfo.totalNutrients : nutrientsInfo.totalDaily,
              ).map((nutrient, index, array) => {
                return (
                  <React.Fragment
                    key={`${nutrient[0]}-${nutrient[1].quantity}-${nutrient[1].unit}`}
                  >
                    <NutrientItem nutrient={nutrient} />
                    {index < array.length - 1 && <View style={styles.separator} />}
                  </React.Fragment>
                );
              })
            ) : (
              <View
                style={{
                  gap: spacing.spacing16,
                  paddingTop: spacing.spacing12,
                }}
              >
                <Skeleton.Group show>
                  {Array(15)
                    .fill(null)
                    .map((_, index) => (
                      <Skeleton
                        key={index}
                        colorMode="light"
                        height={30}
                        width="100%"
                      />
                    ))}
                </Skeleton.Group>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <Toast
        config={toastConfig}
        visibilityTime={3000}
        position="bottom"
        bottomOffset={-bottom}
      />
    </>
  );
};

export default RecipeEditAddIngredient;

const styles = StyleSheet.create({
  $containerStyle: {
    paddingHorizontal: spacing.spacing24,
    paddingTop: spacing.spacing24,
  },

  $contentContainerstyle: {
    flexGrow: 1,
    paddingBottom: 60,
  },

  $pickerContainerStyle: {
    borderRadius: 16,
    borderStyle: "solid",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderColor: colors.greyscale150,
    borderWidth: 2.5,
    height: 54,
    color: "red",
  },

  $baseWrapperStyle: {
    gap: spacing.spacing12,
  },

  $inputAndroidStyle: {
    height: 54,
    borderColor: colors.greyscale200,
    borderWidth: 2,
    fontFamily: "sofia800",
    paddingHorizontal: 16,
    borderRadius: 16,
    color: colors.slate900,
  },

  $inputIOSStyle: {
    height: 54,
    borderColor: colors.greyscale200,
    color: colors.slate900,
    borderWidth: 2,
    fontFamily: "sofia800",
    paddingHorizontal: 16,
    borderRadius: 16,
  },

  $iconContainerStyle: {
    top: 14,
    right: spacing.spacing16,
  },

  $labelStyle: { fontFamily: "sofia800", color: colors.greyscale500 },
  separator: {
    height: 3,
    backgroundColor: colors.accent200,
  },

  $nutrientLabelStyle: {
    ...$sizeStyles.n,
    fontFamily: "sofia800",
    color: colors.greyscale300,
  },

  $nutrientValueStyle: {
    ...$sizeStyles.n,
    color: colors.greyscale400,
    fontFamily: "sofia800",
  },

  $segmentStyle: {
    height: 54,
  },

  $segmentLabelstyle: {
    ...$sizeStyles.n,
  },
});
