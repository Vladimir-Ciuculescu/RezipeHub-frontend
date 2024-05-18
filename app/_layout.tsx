import { Text, View, ViewStyle, Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('screen');

import { colors } from '@/theme/colors';
import { useFonts } from '@expo-google-fonts/sofia-sans';
import { fonts, fontsToLoad } from '@/theme/typography';

export default function RootLayout() {
	let [fontsLoaded] = useFonts(fontsToLoad);

	if (!fontsLoaded) {
		return null;
	}

	return (
		<View style={$containerStyle}>
			<View style={$baseContainerStyle}>
				<Text
					selectable
					disabled
					style={{ fontFamily: fonts.sofia100, fontSize: 30 }}>
					adw
				</Text>
			</View>
		</View>
	);
}

const $containerStyle: ViewStyle = {
	flex: 1,
	backgroundColor: '#70B9BE',
	justifyContent: 'flex-end',
	alignItems: 'center',
};

const $baseContainerStyle: ViewStyle = {
	flexShrink: 0,
	height: height / 3.5,
	width: width,
	backgroundColor: colors.greyscale100,
	borderTopLeftRadius: 16,
	borderTopRightRadius: 16,
};
