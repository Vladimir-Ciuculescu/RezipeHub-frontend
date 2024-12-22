import { ViewStyle } from "react-native";

export interface FadeInTransitionProps {
  index?: number;
  children: React.ReactNode;
  animate: boolean;
  containerStyle?: ViewStyle;
  direction: "top" | "left" | "top-left" | "top-right" | "top-scale";
}
