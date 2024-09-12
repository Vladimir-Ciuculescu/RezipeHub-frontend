import React from "react";
import SliderContainer from "./SliderContainer";
import { Slider } from "@miblanchard/react-native-slider";
import { colors } from "@/theme/colors";

interface RNSliderProps {
  lowerValue: number;
  minValue: number;
  onChangeMinValue: (value: number) => void;
  greaterValue: number;
  maxValue: number;
  onChangeMaxValue: (value: number) => void;
}

const RNSlider: React.FC<RNSliderProps> = ({
  lowerValue,
  minValue,
  greaterValue,
  maxValue,
  onChangeMinValue,
  onChangeMaxValue,
}) => {
  return (
    <SliderContainer
      caption="<Slider/> 2 thumbs, min, max, and custom tint"
      sliderValue={[lowerValue, greaterValue]}
      onValueChange={(min, max) => {
        onChangeMinValue(min);
        onChangeMaxValue(max);
      }}
    >
      <Slider
        animateTransitions
        maximumTrackTintColor={colors.greyscale150}
        minimumValue={minValue}
        maximumValue={maxValue}
        minimumTrackTintColor={colors.accent200}
        thumbStyle={{ borderWidth: 2, height: 20, width: 20, borderColor: colors.greyscale150 }}
        step={1}
        thumbTintColor={colors.accent200}
        trackStyle={{ height: 10, borderRadius: 16 }}
      />
    </SliderContainer>
  );
};

export default RNSlider;
