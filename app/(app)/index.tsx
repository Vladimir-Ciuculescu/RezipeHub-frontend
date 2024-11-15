import LottieView from "lottie-react-native";
import { Dimensions, View } from "react-native";

const { width } = Dimensions.get("screen");

const StartPage = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <LottieView
        autoPlay
        style={{ height: 100, width }}
        source={require("../../assets/gifs/Animation - 1730897212963.json")}
      />
    </View>
  );
};

export default StartPage;
