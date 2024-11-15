import { spacing } from "@/theme/spacing";
import { $sizeStyles } from "@/theme/typography";
import { Slider } from "@miblanchard/react-native-slider";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { View } from "react-native-ui-lib";

const SliderContainer = (props: {
  unit: string;
  label: string;
  children: React.ReactElement;
  sliderValue?: number[];
  trackMarks?: number[];
  vertical?: boolean;

  onSlidingComplete?: (min: number, max: number) => void; // New callback
}) => {
  const { sliderValue = [0], trackMarks, onSlidingComplete, unit, label } = props;
  const [value, setValue] = useState(sliderValue);
  let renderTrackMarkComponent: React.ReactNode;

  const isSingleValue = value.length === 1;
  const minValue = value[0];
  const maxValue = isSingleValue ? minValue : value[1];

  // Callback to pass min/max values outside the container when sliding is complete
  const handleSlidingComplete = (val: number[]) => {
    const min = val[0];
    const max = val.length > 1 ? val[1] : val[0];
    if (onSlidingComplete) {
      onSlidingComplete(min, max);
    }
  };

  const renderChildren = () => {
    return React.Children.map(props.children, (child: React.ReactElement) => {
      if (!!child && child.type === Slider) {
        return React.cloneElement(child, {
          onValueChange: setValue, // Only update state on value change
          onSlidingComplete: handleSlidingComplete, // Trigger onSlidingComplete
          renderTrackMarkComponent,
          trackMarks,
          value,
        });
      }

      return child;
    });
  };

  return (
    <View style={{ paddingHorizontal: spacing.spacing24, gap: spacing.spacing8 }}>
      <View
        row
        style={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.$bottomSheetSectionStyle}>{label}</Text>
        <Text style={styles.$bottomSheetSectionValueStyle}>
          {value.join(" - ")} {unit}
        </Text>
      </View>

      {renderChildren()}
    </View>
  );
};

export default SliderContainer;

const borderWidth = 4;

const styles = StyleSheet.create({
  activeMark: {
    borderColor: "red",
    borderWidth,
    left: -borderWidth / 2,
  },
  inactiveMark: {
    borderColor: "grey",
    borderWidth,
    left: -borderWidth / 2,
  },
  $bottomSheetSectionStyle: {
    ...$sizeStyles.l,
    fontFamily: "sofia800",
  },

  $bottomSheetSectionValueStyle: {
    ...$sizeStyles.l,
    fontFamily: "sofia400",
  },
});
