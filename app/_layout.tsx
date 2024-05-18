import { Text, View, ViewStyle, Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('screen');

import { colors } from '@/theme/colors';
import { useFonts } from '@expo-google-fonts/sofia-sans';
import { fonts, fontsToLoad } from '@/theme/typography';
import { PageControl } from 'react-native-ui-lib';
import Onboardling_1 from '../assets/svg/Onboarding_1.svg';
import { Stack } from 'expo-router';

export default function RootLayout() {
	let [fontsLoaded] = useFonts(fontsToLoad);

	if (!fontsLoaded) {
		return null;
	}

	return (
		<Stack>
			<Stack.Screen
				options={{ headerShown: false, contentStyle: { backgroundColor: '#FFF' } }}
				name="index"
			/>
			<Stack.Screen name="login" />
		</Stack>
	);
}

const $containerStyle: ViewStyle = {
	flex: 1,
	backgroundColor: colors.greyscale100,
	justifyContent: 'center',
	alignItems: 'center',
};
