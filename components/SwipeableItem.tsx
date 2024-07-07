import { Animated, StyleSheet } from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { View } from "react-native-ui-lib";
import RNIcon from "./shared/RNIcon";
import { colors } from "@/theme/colors";

interface SwipeableItemProps {
  children: React.ReactNode;
  deleteItem: () => void;
  isEditing: boolean;
}

const SwipeableItem: React.FC<SwipeableItemProps> = ({ children, deleteItem, isEditing }) => {
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

  return (
    <Swipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      leftThreshold={30}
      rightThreshold={40}
      dragOffsetFromRightEdge={isEditing ? Number.MAX_VALUE : 0}
      renderRightActions={renderRightActions}
    >
      {children}
    </Swipeable>
  );
};

export default SwipeableItem;

const styles = StyleSheet.create({
  $rightActionStyle: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
