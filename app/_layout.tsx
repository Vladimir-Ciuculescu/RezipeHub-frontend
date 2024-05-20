import { useFonts } from '@expo-google-fonts/sofia-sans';
import { fontsToLoad } from '@/theme/typography';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

export default function RootLayout() {
  let [fontsLoaded] = useFonts(fontsToLoad);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ contentStyle: styles.$stackContainerStyle }}>
      <Stack.Screen
        options={{ headerShown: false }}
        name="index"
      />
      <Stack.Screen name="login" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  $stackContainerStyle: { backgroundColor: colors.neutral100 },
});
