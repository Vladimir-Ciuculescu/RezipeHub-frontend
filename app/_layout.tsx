import { Text, View, ViewStyle, Dimensions } from "react-native";
import Logo from "../assets/svg/Logo.svg";

const { width, height } = Dimensions.get("screen");

import {
  useFonts,
  SofiaSans_100Thin,
  SofiaSans_200ExtraLight,
  SofiaSans_300Light,
  SofiaSans_400Regular,
  SofiaSans_500Medium,
  SofiaSans_600SemiBold,
  SofiaSans_700Bold,
  SofiaSans_800ExtraBold,
  SofiaSans_900Black,
  SofiaSans_100Thin_Italic,
  SofiaSans_200ExtraLight_Italic,
  SofiaSans_300Light_Italic,
  SofiaSans_400Regular_Italic,
  SofiaSans_500Medium_Italic,
  SofiaSans_600SemiBold_Italic,
  SofiaSans_700Bold_Italic,
  SofiaSans_800ExtraBold_Italic,
  SofiaSans_900Black_Italic,
} from "@expo-google-fonts/sofia-sans";
import { colors } from "@/theme/colors";

export default function RootLayout() {
  let [fontsLoaded] = useFonts({
    SofiaSans_100Thin,
    SofiaSans_200ExtraLight,
    SofiaSans_300Light,
    SofiaSans_400Regular,
    SofiaSans_500Medium,
    SofiaSans_600SemiBold,
    SofiaSans_700Bold,
    SofiaSans_800ExtraBold,
    SofiaSans_900Black,
    SofiaSans_100Thin_Italic,
    SofiaSans_200ExtraLight_Italic,
    SofiaSans_300Light_Italic,
    SofiaSans_400Regular_Italic,
    SofiaSans_500Medium_Italic,
    SofiaSans_600SemiBold_Italic,
    SofiaSans_700Bold_Italic,
    SofiaSans_800ExtraBold_Italic,
    SofiaSans_900Black_Italic,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={$containerStyle}>
      <View style={$baseContainerStyle}></View>
    </View>
  );
}

const $containerStyle: ViewStyle = {
  flex: 1,
  backgroundColor: "#70B9BE",
  justifyContent: "flex-end",
  alignItems: "center",
};

const $baseContainerStyle: ViewStyle = {
  flexShrink: 0,
  height: height / 3.5,
  width: width,
  backgroundColor: colors.greyscale100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
};
