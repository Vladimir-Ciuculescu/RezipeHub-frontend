import { StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
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

const CategoryFilter: React.FC<CategoryFilterProps> = ({ label, checked, onPress }) => {
  const rContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(checked ? colors.accent200 : colors.greyscale150, TimingConfig),
      borderColor: withTiming(checked ? colors.accent200 : colors.greyscale150, TimingConfig),
      paddingLeft: 20,
      paddingRight: !checked ? 20 : 14,
    };
  }, [checked]);

  const rTextStyle = useAnimatedStyle(() => {
    return {
      color: withTiming(checked ? colors.greyscale50 : colors.accent200, TimingConfig),
    };
  }, [checked]);

  return (
    <Animated.View
      layout={LinearTransition.springify().mass(0.8)}
      style={[styles.container, rContainerStyle]}
      onTouchEnd={onPress}
    >
      <Animated.Text style={[styles.label, rTextStyle]}>{label}</Animated.Text>
      {checked && (
        <Animated.View
          entering={FadeIn.duration(350)}
          exiting={FadeOut}
          style={{
            marginLeft: 8,
            justifyContent: "center",
            alignItems: "center",
            height: 20,
            width: 20,
          }}
        >
          <RNIcon
            name="check"
            color={colors.greyscale100}
          />
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default CategoryFilter;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: "sofia400",
    color: "#fff",
    ...$sizeStyles.s,
  },
});
