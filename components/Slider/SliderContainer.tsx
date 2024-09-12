import { Slider } from "@miblanchard/react-native-slider";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const SliderContainer = (props: {
  caption: string;
  children: React.ReactElement;
  sliderValue?: number[]; // Explicitly using number[]
  trackMarks?: number[];
  vertical?: boolean;
  onValueChange?: (min: number, max: number) => void; // Callback to pass min/max values
}) => {
  const { caption, sliderValue = [0], trackMarks, onValueChange } = props;
  const [value, setValue] = useState(sliderValue);
  let renderTrackMarkComponent: React.ReactNode;

  // Determine if the slider has a single value or multiple
  const isSingleValue = value.length === 1;
  const minValue = value[0];
  const maxValue = isSingleValue ? minValue : value[1];

  // Callback to pass min/max values outside the container
  useEffect(() => {
    if (onValueChange) {
      onValueChange(minValue, maxValue);
    }
  }, [minValue, maxValue, onValueChange]);

  if (trackMarks?.length && isSingleValue) {
    //@ts-ignore
    renderTrackMarkComponent = (index: number) => {
      const currentMarkValue = trackMarks[index];
      const currentSliderValue = value[0] || 0;
      const style = currentMarkValue > currentSliderValue ? styles.activeMark : styles.inactiveMark;
      return <View style={style} />;
    };
  }

  const renderChildren = () => {
    return React.Children.map(props.children, (child: React.ReactElement) => {
      if (!!child && child.type === Slider) {
        return React.cloneElement(child, {
          onValueChange: (val: number[]) => {
            setValue(val);
            if (onValueChange) {
              const min = val[0];
              const max = val.length > 1 ? val[1] : val[0];
              onValueChange(min, max);
            }
          },
          renderTrackMarkComponent,
          trackMarks,
          value,
        });
      }

      return child;
    });
  };

  return renderChildren();
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
});
