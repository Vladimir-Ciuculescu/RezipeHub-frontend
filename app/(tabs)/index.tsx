import { ACCESS_TOKEN, storage } from "@/storage";
import React from "react";
import { Text, View } from "react-native-ui-lib";

export default function Tab() {
  const logOut = () => {
    storage.delete(ACCESS_TOKEN);
  };

  return (
    <View>
      <Text onPress={logOut}>Tabbbb [Home|Settings]</Text>
    </View>
  );
}
