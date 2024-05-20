import { useFonts } from '@expo-google-fonts/sofia-sans';
import { fontsToLoad } from '@/theme/typography';
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
