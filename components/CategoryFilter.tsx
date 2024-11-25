import { StyleSheet } from "react-native";
import { memo } from "react";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { colors } from "@/theme/colors";
import { $sizeStyles } from "@/theme/typography";
import RNIcon from "./shared/RNIcon";

interface CategoryFilterProps {
  label: string;
  checked: boolean;
  onPress: () => void;
}

const TimingConfig = {
  duration: 150,
};

const CategoryFilter: React.FC<CategoryFilterProps> = memo(({ label, checked, onPress }) => {
  const rContainerStyle = useAnimatedStyle(
    () => ({
      backgroundColor: withTiming(checked ? colors.accent200 : colors.greyscale150, TimingConfig),
      borderColor: withTiming(checked ? colors.accent200 : colors.greyscale150, TimingConfig),
      paddingLeft: 20,
      paddingRight: !checked ? 20 : 14,
    }),
    [checked],
  );

  const rTextStyle = useAnimatedStyle(
    () => ({
      color: withTiming(checked ? colors.greyscale50 : colors.accent200, TimingConfig),
    }),
    [checked],
  );

  return (
    <Animated.View
      layout={LinearTransition.springify().mass(0.8)}
      style={[styles.$containerStyle, rContainerStyle]}
      onTouchEnd={onPress}
    >
      <Animated.Text style={[styles.$labelStyle, rTextStyle]}>{label}</Animated.Text>
      {checked && (
        <Animated.View
          entering={FadeIn.duration(350)}
          exiting={FadeOut}
          style={styles.$checkedContainerStyle}
        >
          <RNIcon
            name="check"
            color={colors.greyscale100}
          />
        </Animated.View>
      )}
    </Animated.View>
  );
});

export default CategoryFilter;

const styles = StyleSheet.create({
  $containerStyle: {
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  $labelStyle: {
    fontFamily: "sofia400",
    color: "#fff",
    ...$sizeStyles.s,
  },
  $checkedContainerStyle: {
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
    height: 20,
    width: 20,
  },
});
