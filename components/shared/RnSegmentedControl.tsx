import { colors } from "@/theme/colors";
import { $sizeStyles } from "@/theme/typography";
import { verticalScale } from "@/utils/scale";
import { StyleSheet } from "react-native";
import { SegmentedControl, SegmentedControlProps } from "react-native-ui-lib";

export interface SegmentItem {
  label: string;
}

interface SegmentedControlInterface extends SegmentedControlProps {
  segments: SegmentItem[];
  onChangeIndex: (e: number) => void;
  initialIndex: number;
  segmentLabelStyle?: SegmentedControlProps["segmentLabelStyle"];
  segmentsStyle?: SegmentedControlProps["segmentsStyle"];
  borderRadius?: SegmentedControlProps["borderRadius"];
  backgroundColor?: SegmentedControlProps["backgroundColor"];
}

const RNSegmentedControl: React.FC<SegmentedControlInterface> = ({
  segments,
  onChangeIndex,
  initialIndex,
  segmentLabelStyle,
  segmentsStyle,
  borderRadius,
  backgroundColor,
}) => {
  return (
    <SegmentedControl
      initialIndex={initialIndex}
      segments={segments}
      activeColor={colors.greyscale50}
      borderRadius={borderRadius}
      onChangeIndex={onChangeIndex}
      throttleTime={5}
      backgroundColor={backgroundColor || colors.greyscale150}
      activeBackgroundColor={colors.brandPrimary}
      inactiveColor={colors.brandPrimary}
      segmentsStyle={[styles.$segmentStyle, segmentsStyle]}
      segmentLabelStyle={[styles.$segmentLabelstyle, segmentLabelStyle]}
    />
  );
};

export default RNSegmentedControl;

const styles = StyleSheet.create({
  $segmentStyle: {
    //TODO : Pay attention to the recipe details where you use it. There it shouldbe 54px or higher
    height: verticalScale(44),
  },

  $segmentLabelstyle: {
    ...$sizeStyles.n,
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
  },
});
