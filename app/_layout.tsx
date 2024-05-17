import { Text, View } from "react-native";

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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        style={{
          fontFamily: "SofiaSans_800ExtraBold",
          fontSize: 28,
        }}
      >
        All recipe you needed
      </Text>
      <Text
        style={{
          fontFamily: "SofiaSans_400Regular",

          fontSize: 18,
          color: "#97A2B0",
          fontStyle: "normal",
          fontWeight: 200,
        }}
      >
        All recipe you need
      </Text>
    </View>
  );
}
