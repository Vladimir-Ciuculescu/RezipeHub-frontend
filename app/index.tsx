import { Logo } from '@/assets/svg';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { $sizeStyles, fonts } from '@/theme/typography';
import { StackNavigationProps } from '@/types/navigation';
import { NavigationProp } from '@react-navigation/native';
import { Link, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-ui-lib';

export default function Onboarding() {
	return (
		<SafeAreaView
			edges={['left', 'right', 'top']}
			style={{ flex: 1 }}>
			<View
				style={{
					display: 'flex',
					flexDirection: 'column',
					flex: 1,
				}}>
				<View
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'flex-end',
						paddingRight: spacing.spacing24,
						paddingTop: spacing.spacing16,
					}}>
					<Text
						style={[
							{
								color: colors.greyscale500,
								fontFamily: fonts.sofia800,
							},
							$sizeStyles.xl,
						]}>
						Skip
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}
