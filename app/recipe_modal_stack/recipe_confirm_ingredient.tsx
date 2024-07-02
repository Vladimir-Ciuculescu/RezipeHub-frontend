import { Text, Pressable, StyleSheet, ScrollView } from "react-native";
import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import FoodService from "@/api/services/food.service";
import RNIcon from "@/components/shared/RNIcon";
import { $sizeStyles } from "@/theme/typography";
import {
  IngredientResponse,
  NutrientDetail,
  NutrientResponse,
  NutrientsRequestPayload,
} from "@/types/ingredient";
import { AntDesign } from "@expo/vector-icons";
import { spacing } from "@/theme/spacing";
import { Picker, View } from "react-native-ui-lib";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { colors } from "@/theme/colors";
import RnInput from "@/components/shared/RNInput";
import { formatFloatingValue } from "@/utils/formatFloatingValue";

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

const getMeasureAbbreviation = (measure: string) => {
  const measureMap: any = {
    Serving: "serving",
    Ounce: "oz",
    Spray: "spr",
    Gram: "g",
    Grain: "gr",
    Pound: "lb",
    Kilogram: "kg",
    Strip: "strip",
    Pinch: "pinch",
    Liter: "L",
    Slice: "slice",
    Handful: "handful",
    Whole: "whole",
    "Fluid ounce": "fl oz",
    Gallon: "gal",
    Pint: "pt",
    Quart: "qt",
    Milliliter: "mL",
    Drop: "drop",
    Cup: "cup",
    Tablespoon: "tbsp",
    Teaspoon: "tsp",
  };

  return measureMap[measure] || null;
};

interface NutrientItemProps {
  nutrient: [string, NutrientDetail];
}

export default function RecipeConfirmIngredient() {
  const { ingredient } = useLocalSearchParams<any>();
  const navigation = useNavigation();
  const router = useRouter();
  const [nutrientsInfo, setNutrientsInfo] = useState<NutrientResponse>();
  const [unitMeasure, setUnitMeasure] = useState("Gram");
  //By default, the screen will display nutrition info per 100 grams
  const [quantity, setQuantity] = useState("100");

  const parsedIngredient: IngredientResponse = JSON.parse(ingredient);

  const defaultMeasurementObject = {
    foodId: parsedIngredient.food.foodId,
    measureURI: "http://www.edamam.com/ontologies/edamam.owl#Measure_gram",
    quantity: 100,
  };

  const measures = parsedIngredient.measures
    .filter((measure) => measure.label)
    .map((measure) => ({
      label: `1 ${measure.label}`,
      value: measure.label,
      uri: measure.uri,
    }));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={gotBack}>
          <RNIcon
            name="arrow_left"
            color={colors.brandPrimary}
          />
        </Pressable>
      ),

      headerTitle: () => <Text style={[$sizeStyles.h3]}>Confirm ingredient</Text>,
      headerRight: () => (
        <Pressable onPress={() => {}}>
          <AntDesign
            name="check"
            size={24}
            color={colors.brandPrimary}
          />
        </Pressable>
      ),
    });
  }, [navigation]);

  useEffect(() => {
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
  }, [unitMeasure]);

  const getNutritionData = async (foodId: string, uri: string, quantity: number) => {
    let payload: NutrientsRequestPayload | undefined;

    payload = { foodId, measureURI: uri, quantity };

    const data = await FoodService.getNutritionData(payload);
    setNutrientsInfo(data);
  };

  const gotBack = () => {
    router.back();
  };

  const NutrientItem: FC<NutrientItemProps> = ({ nutrient }) => {
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

  const handleUnitMeasure = (value: any) => {
    setUnitMeasure(value);
  };

  const submitQuantity = async () => {
    const measure = measures.find((item) => item.value === unitMeasure);

    getNutritionData(parsedIngredient.food.foodId, measure!.uri, parseInt(quantity));
  };

  return (
    <GestureHandlerRootView>
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
            <Picker
              containerStyle={styles.$pickerContainerStyle}
              value={unitMeasure}
              onChange={handleUnitMeasure}
              placeholder="Serving Size"
              useWheelPicker
              trailingAccessory={
                <AntDesign
                  name="down"
                  size={20}
                  color="black"
                />
              }
              items={measures}
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

            {nutrientsInfo &&
              nutrientsInfo.totalNutrients &&
              Object.entries(nutrientsInfo.totalNutrients).map((nutrient, index, array) => {
                return (
                  <>
                    <NutrientItem
                      key={nutrient[0]}
                      nutrient={nutrient}
                    />
                    {index < array.length - 1 && <View style={styles.separator} />}
                  </>
                );
              })}
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

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
  },

  $baseWrapperStyle: {
    gap: spacing.spacing12,
  },

  $labelStyle: { fontFamily: "sofia800", color: colors.greyscale500 },
  separator: {
    height: 3,
    backgroundColor: colors.accent200,
  },

  $nutrientLabelStyle: {
    ...$sizeStyles.l,
    color: colors.greyscale300,
  },

  $nutrientValueStyle: {
    ...$sizeStyles.l,
    color: colors.greyscale400,
  },
});
