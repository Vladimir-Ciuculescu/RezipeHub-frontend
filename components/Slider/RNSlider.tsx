import React from "react";
import SliderContainer from "./SliderContainer";
import { Slider } from "@miblanchard/react-native-slider";
import { colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

interface RNSliderProps {
  lowerValue: number;
  minValue: number;
  onChangeMinValue: (value: number) => void;
  greaterValue: number;
  maxValue: number;
  onChangeMaxValue: (value: number) => void;
  unit: string;
  label: string;
}

const RNSlider: React.FC<RNSliderProps> = ({
  unit,
  label,
  lowerValue,
  minValue,
  greaterValue,
  maxValue,
  onChangeMinValue,
  onChangeMaxValue,
}) => {
  return (
    <SliderContainer
      unit={unit}
      label={label}
      sliderValue={[lowerValue, greaterValue]}
      onSlidingComplete={(min, max) => {
        onChangeMinValue(min);
        onChangeMaxValue(max);
      }}
    >
      <Slider
        animateTransitions={true}
        maximumTrackTintColor={colors.greyscale150}
        minimumValue={minValue}
        maximumValue={maxValue}
        minimumTrackTintColor={colors.accent200}
        thumbStyle={styles.$thumbStyle}
        step={1}
        thumbTintColor={colors.accent200}
        trackStyle={styles.$trackStyle}
      />
    </SliderContainer>
  );
};

export default RNSlider;

const styles = StyleSheet.create({
  $thumbStyle: {
    borderWidth: 2,
    height: 20,
    width: 20,
    borderColor: colors.greyscale150,
  },

  $trackStyle: {
    height: 10,
    borderRadius: 16,
  },
});
