import RNButton from "@/components/shared/RNButton";
import useUserData from "@/hooks/useUserData";
import { ACCESS_TOKEN, storage } from "@/storage";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native-ui-lib";

export default function Profile() {
  const router = useRouter();

  const user = useUserData();
  const { signOut } = useAuth();

  const logOut = () => {
    storage.delete(ACCESS_TOKEN);
    signOut();
    router.dismissAll();
  };

  return (
    <View style={{ flex: 1 }}>
      {user && (
        <>
          <Text>{user.firstName}</Text>
          <Text>{user.lastName}</Text>
          <Text>{user.email}</Text>
        </>
      )}

      <RNButton
        label="Logout"
        onPress={logOut}
      />
    </View>
  );
}
