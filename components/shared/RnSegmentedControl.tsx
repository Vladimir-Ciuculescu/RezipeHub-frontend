import { colors } from "@/theme/colors";
import { $sizeStyles } from "@/theme/typography";
import { StyleSheet } from "react-native";
import { SegmentedControl } from "react-native-ui-lib";

export interface SegmentItem {
  label: string;
}

interface SegmentedControlProps {
  segments: SegmentItem[];
  onChangeIndex: React.Dispatch<React.SetStateAction<number>>;
  initialIndex: number;
}

const RNSegmentedControl: React.FC<SegmentedControlProps> = ({
  segments,
  onChangeIndex,
  initialIndex,
}) => {
  return (
    <SegmentedControl
      initialIndex={initialIndex}
      segments={segments}
      activeColor={colors.greyscale50}
      borderRadius={16}
      onChangeIndex={onChangeIndex}
      throttleTime={5}
      backgroundColor={colors.greyscale150}
      activeBackgroundColor={colors.brandPrimary}
      inactiveColor={colors.brandPrimary}
      segmentsStyle={styles.$segmentStyle}
      segmentLabelStyle={styles.$segmentLabelstyle}
    />
  );
};

export default RNSegmentedControl;

const styles = StyleSheet.create({
  $segmentStyle: {
    height: 54,
  },

  $segmentLabelstyle: {
    ...$sizeStyles.n,
  },
});
