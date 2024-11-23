import React from "react";
import { Pressable, PressableProps } from "react-native";

interface RNPressableProps extends PressableProps {}
const RNPressable: React.FC<RNPressableProps> = (props) => {
  const { children } = props;

  return (
    <Pressable
      {...props}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      {children}
    </Pressable>
  );
};

export default RNPressable;
