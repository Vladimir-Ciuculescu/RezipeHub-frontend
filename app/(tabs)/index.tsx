import { ACCESS_TOKEN, storage } from "@/storage";
import { useAuth, useUser } from "@clerk/clerk-expo";
import React, { useEffect } from "react";
import { Image } from "react-native";
import { Text, View } from "react-native-ui-lib";

export default function Tab() {
  const user = useUser();
  const { userId } = useAuth();

  useEffect(() => {}, [user.user]);

  const logOut = () => {
    storage.delete(ACCESS_TOKEN);
  };

  return (
    <View>
      {user && user.user && (
        <Image
          source={{ uri: user!.user!.imageUrl }}
          style={{ width: 40, height: 40 }}
        />
      )}
      <Text onPress={logOut}>Tabbbb [Home|Settings]</Text>
    </View>
  );
}
