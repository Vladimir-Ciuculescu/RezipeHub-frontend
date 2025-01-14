import { spacing } from "@/theme/spacing";
import React from "react";
import { View } from "react-native-ui-lib";
import NutritionalItem from "./NutritionalItem";
import RNIcon from "./shared/RNIcon";

interface NutritionalInfoProps {
  nutritionInfo: {
    totalCarbs: number;
    totalCalories: number;
    totalProteins: number;
    totalFats: number;
  };
}

const NutritionalInfo: React.FC<NutritionalInfoProps> = ({ nutritionInfo }) => {
  const { totalCalories, totalCarbs, totalFats, totalProteins } = nutritionInfo;

  return (
    <View
      row
      style={{ justifyContent: "space-between" }}
    >
      <View style={{ gap: spacing.spacing16 }}>
        <NutritionalItem
          type="carbs"
          quantity={totalCarbs}
          unitMeasure="g"
          icon={<RNIcon name="carbs" />}
        />
        <NutritionalItem
          type="calories"
          quantity={totalCalories}
          unitMeasure="K"
          icon={<RNIcon name="calories" />}
        />
      </View>
      <View style={{ gap: spacing.spacing16 }}>
        <NutritionalItem
          type="proteins"
          quantity={totalProteins}
          unitMeasure="g"
          icon={<RNIcon name="proteins" />}
        />

        <NutritionalItem
          type="fats"
          quantity={totalFats}
          unitMeasure="g"
          icon={<RNIcon name="fats" />}
        />
      </View>
    </View>
  );
};

export default NutritionalInfo;
