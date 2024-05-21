import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Stack, useRootNavigationState, useRouter } from 'expo-router';
import { colors } from '@/theme/colors';
import { useFonts } from 'expo-font';
import { fontsToLoad } from '@/theme/typography';
import { ONBOARDED, storage } from '@/storage';

const Layout = () => {
  const rootNavigationState = useRootNavigationState();
  const navigatorReady = rootNavigationState?.key != null;

  const router = useRouter();

  let [fontsLoaded] = useFonts(fontsToLoad);

  useEffect(() => {
    if (navigatorReady) {
      const user = storage.getBoolean(ONBOARDED);

      if (user) {
        router.replace('login');
      }
    }
  }, [navigatorReady]);

  if (!fontsLoaded) return null;

  return (
    <Stack
      initialRouteName="register"
      screenOptions={{ contentStyle: styles.$stackContainerStyle }}
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name="index"
      />
      <Stack.Screen name="login" />
    </Stack>
  );
};

export default Layout;

const styles = StyleSheet.create({
  $stackContainerStyle: { backgroundColor: colors.neutral100 },
});
