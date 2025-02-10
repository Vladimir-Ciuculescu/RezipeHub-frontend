import { Redirect } from "expo-router";
import LottieView from "lottie-react-native";
import { Dimensions, View } from "react-native";

const { width, height } = Dimensions.get("screen");

const StartPage = () => {
  // return <Redirect href="/login" />;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <LottieView
        autoPlay
        style={{ height: height / 2, width }}
        // source={require("../../assets/gifs/Animation - 1730897212963.json")}
        source={require("../../assets/gifs/Soup.json")}
      />
    </View>
  );
};

export default StartPage;
