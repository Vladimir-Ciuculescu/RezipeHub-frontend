import { View, Text } from "react-native";
import React from "react";
import Animated, { FadeInLeft } from "react-native-reanimated";

interface RNFadeInViewProps {
  children: React.ReactNode;
}

const RNFadeInView: React.FC<RNFadeInViewProps> = ({ children }) => {
  return (
    <Animated.View
      style={{ flex: 1 }}
      entering={FadeInLeft.duration(200)}
    >
      {children}
    </Animated.View>
  );
};

export default RNFadeInView;
