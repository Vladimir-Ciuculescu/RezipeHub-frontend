import { Text, Pressable, ScrollView, StyleSheet, Keyboard, Platform } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { colors } from "@/theme/colors";
import RNIcon from "@/components/shared/RNIcon";
import { $sizeStyles } from "@/theme/typography";
import { AntDesign } from "@expo/vector-icons";
import { spacing } from "@/theme/spacing";
import RNPickerSelect from "react-native-picker-select";
import RnInput from "@/components/shared/RNInput";
import {
  Measure,
  NutrientDetail,
  NutrientResponse,
  NutrientsRequestPayload,
} from "@/types/ingredient.types";
import RNSegmentedControl from "@/components/shared/RnSegmentedControl";
import FoodService from "@/api/services/food.service";
import { View } from "react-native-ui-lib";
import { formatFloatingValue } from "@/utils/formatFloatingValue";
import useRecipeStore from "@/zustand/useRecipeStore";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/scale";
import RNPressable from "@/components/shared/RNPressable";

interface SearchParams {
  [key: string]: string;
  ingredient: string;
}

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

const segments = [{ label: "Measures" }, { label: "Percentage" }];

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

const RecipeConfirmEditIngredient = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const editIngredientAction = useRecipeStore.use.editIngredientAction();

  const { ingredient } = useLocalSearchParams<SearchParams>();
  const parsedIngredient = JSON.parse(ingredient!);
  const [nutrientsInfo, setNutrientsInfo] = useState<NutrientResponse>();
  const [saveEnabled, setSaveEnabled] = useState(true);

  const [pickerDismissed, setPickerDismissed] = useState(true);
  const [measure, setMeasure] = useState<string>(parsedIngredient.measure);
  const [measures, setMeasures] = useState<Measure[]>([]);
  const [quantity, setQuantity] = useState(parsedIngredient.quantity.toString().replace(",", "."));
  const [segmentIndex, setSegmentIndex] = useState(0);

  useEffect(() => {
    const getIngredientMeasures = async () => {
      try {
        const result = await FoodService.searchFood(parsedIngredient.foodId as string);
        const measureItems = result.hints[0].measures.map((measure: Measure) => ({
          uri: measure.uri,
          label: measure.label,
          value: measure.label,
        }));

        //@ts-ignore
        const currentMeasure = measureItems.find((unit) => unit.label === measure);

        getNutritionData(
          parsedIngredient.foodId as string,
          currentMeasure!.uri,
          parsedIngredient.quantity,
        );

        setMeasures(measureItems);
      } catch (error) {
        console.log(error);
      }
    };

    getIngredientMeasures();
  }, []);

  useEffect(() => {
    const defaultMeasurementObject = {
      foodId: parsedIngredient.foodId,
      measureUri: "http://www.edamam.com/ontologies/edamam.owl#Measure_gram",
      quantity: 0,
    };

    if (pickerDismissed || Platform.OS === "android") {
      const currentMeasure = measures.find((item) => item.value === measure);

      let payload: { foodId: string; measureUri: string; quantity: number } = {
        foodId: "",
        measureUri: "",
        quantity: 0,
      };

      if (currentMeasure) {
        payload = {
          foodId: parsedIngredient.foodId,
          measureUri: currentMeasure.uri!,
          quantity: parseFloat(quantity),
        };
      } else {
        payload = defaultMeasurementObject;
      }

      getNutritionData(payload.foodId, payload.measureUri, payload.quantity);
    }
  }, [pickerDismissed, measure]);

  Keyboard.addListener("keyboardWillShow", () => {
    setSaveEnabled(false);
  });
  Keyboard.addListener("keyboardWillHide", () => {
    setSaveEnabled(true);
  });

  const gotBack = () => {
    router.back();
  };

  useLayoutEffect(() => {
    const saveDisabled = !saveEnabled || !pickerDismissed;

    navigation.setOptions({
      headerLeft: () => (
        <RNPressable onPress={gotBack}>
          <RNIcon
            height={moderateScale(20)}
            width={moderateScale(20)}
            name="arrow_left"
            color={colors.brandPrimary}
          />
        </RNPressable>
      ),

      headerTitle: () => <Text style={[$sizeStyles.h3]}>Edit ingredient</Text>,
      headerRight: () => (
        <Pressable
          disabled={saveDisabled}
          onPress={handleSave}
        >
          <AntDesign
            style={saveDisabled && { opacity: 0.4 }}
            name="check"
            size={moderateScale(24)}
            color={colors.accent300}
          />
        </Pressable>
      ),
    });
  }, [navigation, quantity, measure, nutrientsInfo, saveEnabled, pickerDismissed]);

  const getNutritionData = async (foodId: string, uri: string, quantity: number) => {
    let payload: NutrientsRequestPayload | undefined;

    try {
      payload = {
        foodId,
        measureURI: uri,
        quantity,
      };
      const data = await FoodService.getNutritionData(payload);
      setNutrientsInfo(data);
    } catch (error) {
      console.log(error);
    }
  };

  const submitQuantity = async () => {
    const numericQuantity = parseFloat(quantity.replace(",", "."));

    const currentMeasure = measures.find((unit) => unit.label === measure);
    getNutritionData(parsedIngredient.foodId as string, currentMeasure!.uri!, numericQuantity);
  };

  const handleSave = () => {
    const numericQuantity = parseFloat(quantity.replace(",", "."));

    const payload = {
      ...parsedIngredient,
      quantity: numericQuantity,
      measure,
      calories: nutrientsInfo?.totalNutrients.ENERC_KCAL!.quantity!,
      carbs: nutrientsInfo?.totalNutrients.CHOCDF!.quantity,
      proteins: nutrientsInfo?.totalNutrients.PROCNT!.quantity,
      fats: nutrientsInfo?.totalNutrients.FAT?.quantity,
    };

    editIngredientAction(payload);

    router.back();
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.$contentContainerstyle}
      style={styles.$containerStyle}
    >
      <View style={{ gap: spacing.spacing24 }}>
        <Text style={$sizeStyles.h1}>{parsedIngredient.title}</Text>

        <View style={styles.$baseWrapperStyle}>
          <Text style={[$sizeStyles.n, styles.$labelStyle]}>Unit measure</Text>

          <RNPickerSelect
            placeholder={{}}
            doneText="Search"
            onOpen={() => setPickerDismissed(false)}
            onClose={() => setPickerDismissed(true)}
            value={measure}
            onValueChange={setMeasure}
            onDonePress={() => setPickerDismissed(true)}
            //@ts-ignore

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
          keyboardType="decimal-pad"
          returnKeyType="done"
          onChangeText={(value: any) => setQuantity(value)}
          autoCapitalize="none"
          value={quantity}
          label="Quantity"
          placeholder="Enter quantity"
          blurOnSubmit={quantity !== ""}
        />
        <View style={styles.$baseWrapperStyle}>
          <Text style={[$sizeStyles.h3, styles.$labelStyle]}>Nutritional information</Text>

          <RNSegmentedControl
            borderRadius={16}
            initialIndex={segmentIndex}
            segments={segments}
            onChangeIndex={setSegmentIndex}
            segmentsStyle={{ height: verticalScale(54) }}
          />

          {nutrientsInfo &&
            Object.entries(
              segmentIndex === 0 ? nutrientsInfo.totalNutrients : nutrientsInfo.totalDaily,
            ).map((nutrient, index, array) => {
              return (
                <React.Fragment key={`${nutrient[0]}-${nutrient[1].quantity}-${nutrient[1].unit}`}>
                  <NutrientItem nutrient={nutrient} />
                  {index < array.length - 1 && <View style={styles.separator} />}
                </React.Fragment>
              );
            })}
        </View>
      </View>
    </ScrollView>
  );
};

export default RecipeConfirmEditIngredient;

const styles = StyleSheet.create({
  $containerStyle: {
    paddingHorizontal: spacing.spacing24,
    paddingTop: spacing.spacing24,
  },

  $contentContainerstyle: {
    flexGrow: 1,
    paddingBottom: moderateScale(100),
  },

  $pickerContainerStyle: {
    borderRadius: 16,
    borderStyle: "solid",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderColor: colors.greyscale150,
    borderWidth: 2.5,
    height: 54,
  },

  $baseWrapperStyle: {
    gap: spacing.spacing12,
  },

  $inputAndroidStyle: {
    height: moderateScale(54),
    borderColor: colors.greyscale200,
    borderWidth: 2,
    fontFamily: "sofia800",
    paddingHorizontal: horizontalScale(spacing.spacing16),
    borderRadius: 16,
    color: colors.slate900,
  },

  $inputIOSStyle: {
    height: moderateScale(54),
    borderColor: colors.greyscale200,
    color: colors.slate900,
    borderWidth: 2,
    fontFamily: "sofia800",
    paddingHorizontal: horizontalScale(spacing.spacing16),
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
