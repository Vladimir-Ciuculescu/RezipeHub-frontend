import React, { forwardRef, useCallback, useEffect, useRef } from "react";
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
import { AntDesign } from "@expo/vector-icons";
import RNIcon from "./shared/RNIcon";
import { useFocusEffect } from "expo-router";

const HEIGHT = 80;

interface SwipeableListItemProps {
  isEditing: boolean;
  onDelete: () => void;
  children: React.ReactNode;
  rowStyle: any;
  editButtonStyle: any;
  resizable?: boolean;
  onReset?: () => void;
}

const SwipeableListItem: React.FC<SwipeableListItemProps> = (props) => {
  const { resizable, isEditing, onDelete, children, rowStyle, editButtonStyle } = props;

  const heightValue = useSharedValue<number | string>(resizable ? "auto" : HEIGHT);

  const containerRef = useRef<any>(null);
  const swipeableRef = useRef<Swipeable>(null);

  const containerStyle = useAnimatedStyle(() => ({
    minHeight: resizable ? HEIGHT : undefined,
    height: typeof heightValue.value === "number" ? heightValue.value : "auto",
    //height: resizable ? undefined : 80,
    transform: [{ translateX: withTiming(isEditing ? 0 : -20) }],
  }));

  useEffect(() => {
    if (containerRef.current && resizable) {
      containerRef.current.measure((_: any, __: any, ___: any, height: number) => {
        heightValue.value = height;
      });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (swipeableRef.current) {
        swipeableRef.current.close();
      }
    }, [isEditing]),
  );

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
      ref={swipeableRef}
      friction={2}
      enableTrackpadTwoFingerGesture
      leftThreshold={30}
      rightThreshold={40}
      dragOffsetFromRightEdge={isEditing ? Number.MAX_VALUE : 0}
      renderRightActions={renderRightActions}
    >
      <Reanimated.View
        ref={containerRef}
        style={[rowStyle, containerStyle]}
      >
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

// export default SwipeableListItem

export default SwipeableListItem;

const styles = StyleSheet.create({
  $rightActionStyle: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
