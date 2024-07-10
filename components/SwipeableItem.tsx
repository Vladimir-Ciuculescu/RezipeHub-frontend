import React from "react";
import { Animated, StyleSheet } from "react-native";
import Reanimated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { View } from "react-native-ui-lib";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { AntDesign } from "@expo/vector-icons";
import RNIcon from "./shared/RNIcon";

interface SwipeableListItemProps {
  isEditing: boolean;
  onDelete: () => void;
  children: React.ReactNode;
  rowStyle: any;
  editButtonStyle: any;
}

interface SwipeableItemProps {
  children: React.ReactNode;
  deleteItem: () => void;
  isEditing: boolean;
}

const SwipeableListItem: React.FC<SwipeableListItemProps> = ({
  isEditing,
  onDelete,
  children,
  rowStyle,
  editButtonStyle,
}) => {
  const heightValue = useSharedValue(80);
  const containerStyle = useAnimatedStyle(() => ({
    height: heightValue.value,
    transform: [{ translateX: withTiming(isEditing ? 0 : -20) }],
  }));

  const renderRightActionItem = (
    color: string,
    x: number,
    progress: Animated.AnimatedInterpolation<number>,
  ) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          rippleColor="transparent"
          onPress={deleteItem}
          style={[styles.$rightActionStyle, { backgroundColor: color }]}
        >
          <RNIcon
            name="trash"
            color={colors.greyscale50}
          />
        </RectButton>
      </Animated.View>
    );
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>) => {
    return (
      <View
        style={{
          width: 90,
          flexDirection: "row",
        }}
      >
        {renderRightActionItem(colors.red500, 64, progress)}
      </View>
    );
  };

  const deleteItem = () => {
    heightValue.value = withTiming(0, { duration: 300 }, (isFinished) => {
      if (isFinished) {
        runOnJS(onDelete)();
      }
    });
  };

  return (
    <Swipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      leftThreshold={30}
      rightThreshold={40}
      dragOffsetFromRightEdge={isEditing ? Number.MAX_VALUE : 0}
      renderRightActions={renderRightActions}
    >
      <Reanimated.View style={[rowStyle, containerStyle]}>
        <Reanimated.View style={editButtonStyle}>
          <RectButton onPress={deleteItem}>
            <AntDesign
              name="minuscircle"
              size={22}
              color={colors.red600}
            />
          </RectButton>
        </Reanimated.View>
        <View row>{children}</View>
      </Reanimated.View>
    </Swipeable>
  );
};

export default SwipeableListItem;

const styles = StyleSheet.create({
  $rightActionStyle: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
