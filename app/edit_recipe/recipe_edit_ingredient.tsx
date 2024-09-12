import { Text, Pressable, ScrollView, StyleSheet, Platform, Keyboard } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import RNIcon from "@/components/shared/RNIcon";
import { $sizeStyles } from "@/theme/typography";
import { spacing } from "@/theme/spacing";
import {
  IngredientItem,
  NutrientDetail,
  NutrientResponse,
  NutrientsRequestPayload,
} from "@/types/ingredient.types";
import { colors } from "@/theme/colors";
import RNPickerSelect from "react-native-picker-select";
import FoodService from "@/api/services/food.service";
import RnInput from "@/components/shared/RNInput";
import RNSegmentedControl from "@/components/shared/RnSegmentedControl";
import { formatFloatingValue } from "@/utils/formatFloatingValue";
import { View } from "react-native-ui-lib";
import { AntDesign } from "@expo/vector-icons";
import useRecipeStore from "@/zustand/useRecipeStore";

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

export default function RecipeEditIngredient() {
  const navigation = useNavigation();
  const router = useRouter();
  const [segmentIndex, setSegmentIndex] = useState(0);

  const [nutrientsInfo, setNutrientsInfo] = useState<NutrientResponse>();
  const { ingredient } = useLocalSearchParams<SearchParams>();

  const [pickerDismissed, setPickerDismissed] = useState(true);
  const [saveEnabled, setSaveEnabled] = useState(true);
  const parsedIngredient: IngredientItem = JSON.parse(ingredient!);
  const [measure, setMeasure] = useState<string>(parsedIngredient.measure);
  const [quantity, setQuantity] = useState(parsedIngredient.quantity.toString());
  const editIngredientAction = useRecipeStore.use.editIngredientAction();

  Keyboard.addListener("keyboardWillShow", () => {
    setSaveEnabled(false);
  });
  Keyboard.addListener("keyboardWillHide", () => {
    setSaveEnabled(true);
  });

  const measures = parsedIngredient.allMeasures!.map((measure) => ({
    uri: measure.uri,
    label: measure.label,
    value: measure.label,
  }));

  useLayoutEffect(() => {
    const saveDisabled = !saveEnabled || !pickerDismissed;

    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={goBack}>
          <RNIcon name="arrow_left" />
        </Pressable>
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
            size={24}
            color={colors.accent300}
          />
        </Pressable>
      ),
    });
  }, [navigation, quantity, measure, nutrientsInfo, saveEnabled, pickerDismissed]);

  useEffect(() => {
    if (pickerDismissed || Platform.OS === "android") {
      const currentMeasure = parsedIngredient.allMeasures!.find((unit) => unit.label === measure);

      getNutritionData(
        parsedIngredient.foodId as string,
        currentMeasure!.uri,
        parsedIngredient.quantity as string,
      );
    }
  }, [measure, pickerDismissed]);

  const goBack = () => {
    router.back();
  };

  const getNutritionData = async (foodId: string, uri: string, quantity: string) => {
    let payload: NutrientsRequestPayload | undefined;

    try {
      payload = {
        foodId,
        measureURI: uri,
        quantity: parseInt(quantity),
      };
      const data = await FoodService.getNutritionData(payload);
      setNutrientsInfo(data);
    } catch (error) {
      console.log(error);
    }
  };

  const submitQuantity = async () => {
    const currentMeasure = parsedIngredient.allMeasures!.find((unit) => unit.label === measure);

    getNutritionData(parsedIngredient.foodId as string, currentMeasure!.uri, quantity);
  };

  const handleSave = () => {
    const payload = {
      ...parsedIngredient,
      quantity: parseInt(quantity),
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
            doneText="Done"
            onOpen={() => setPickerDismissed(false)}
            onClose={() => setPickerDismissed(true)}
            value={measure}
            onValueChange={setMeasure}
            onDonePress={() => setPickerDismissed(true)}
            items={measures}
            style={{
              chevronUp: { display: "none" },
              chevronDown: { display: "none" },
              inputIOS: styles.$inputAndroidStyle,
              inputAndroid: styles.$inputIOSStyle,
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

          {nutrientsInfo &&
            Object.entries(
              segmentIndex === 0 ? nutrientsInfo.totalNutrients : nutrientsInfo.totalDaily,
            ).map((nutrient, index, array) => {
              return (
                <React.Fragment key={`${nutrient[0]}-${nutrient[1].quantity}-${nutrient[1].unit}`}>
                  <NutrientItem nutrient={nutrient} />
                  {index < array.length - 1 && <View style={styles.$separatorStyle} />}
                </React.Fragment>
              );
            })}
        </View>
      </View>
    </ScrollView>
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
  $baseWrapperStyle: {
    gap: spacing.spacing12,
  },
  $labelStyle: { fontFamily: "sofia800", color: colors.greyscale500 },
  $inputAndroidStyle: {
    height: 54,
    borderColor: colors.greyscale150,
    borderWidth: 2,
    fontFamily: "sofia800",
    paddingHorizontal: 16,
    borderRadius: 16,
    color: colors.slate900,
  },

  $inputIOSStyle: {
    height: 54,
    borderColor: colors.greyscale150,
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

  $separatorStyle: {
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
});
