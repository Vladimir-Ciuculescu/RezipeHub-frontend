import toastConfig from "@/components/Toast/ToastConfing";
import LottieView from "lottie-react-native";
import { Dimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("screen");

const StartPage = () => {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <LottieView
        autoPlay
        style={{ height: height / 2, width }}
        source={require("../../assets/gifs/Soup.json")}
      />
      <Toast
        config={toastConfig}
        position="bottom"
        bottomOffset={-bottom}
      />
    </View>
  );
};

export default StartPage;
