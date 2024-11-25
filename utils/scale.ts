import { Dimensions, PixelRatio, Platform } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const baseWidth = 414;
const baseHeight = 896;
const scale = SCREEN_WIDTH / 320;

// Scale functions
export const horizontalScale = (size: number) => {
  const scaleRatio = SCREEN_WIDTH / baseWidth;
  return PixelRatio.roundToNearestPixel(size * scaleRatio);
};

export const verticalScale = (size: number) => {
  const scaleRatio = SCREEN_HEIGHT / baseHeight;
  return PixelRatio.roundToNearestPixel(size * scaleRatio);
};

export const moderateScale = (size: number, factor = 0.5) => {
  return PixelRatio.roundToNearestPixel(size + (horizontalScale(size) - size) * factor);
};

export const normalize = (size: number) => {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};
