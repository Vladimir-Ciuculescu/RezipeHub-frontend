import RNButton from "@/components/shared/RNButton";
import useUserData from "@/hooks/useUserData";
import { ACCESS_TOKEN, storage } from "@/storage";
import { colors } from "@/theme/colors";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Text, View } from "react-native-ui-lib";

export default function Home() {
  const router = useRouter();

  const user = useUserData();
  const { signOut } = useAuth();

  const logOut = () => {
    storage.delete(ACCESS_TOKEN);
    signOut();
    router.dismissAll();
  };

  return (
    <View style={{ backgroundColor: colors.greyscale150, flex: 1 }}>
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
