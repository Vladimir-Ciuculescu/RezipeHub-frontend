import { colors } from '@/theme/colors';
import { StyleProp, StyleSheet, TextStyle, TouchableOpacityProps, ViewStyle } from 'react-native';
import { Button } from 'react-native-ui-lib';

interface RNButtonProps extends TouchableOpacityProps {
  link?: boolean;
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

export default function RNButton(props: RNButtonProps) {
  const { link, label, labelStyle, style, ...rest } = props;

  return (
    <Button
      {...rest}
      link={link || false}
      label={label}
      labelStyle={[styles.$baselabelStyle, labelStyle]}
      style={[styles.$baseViewStyle, style]}
    />
  );
}

const styles = StyleSheet.create({
  $baseViewStyle: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: colors.brandPrimary,
  },

  $baselabelStyle: {
    fontSize: 16,
    fontFamily: 'sofia800',
    fontStyle: 'normal',
  },
});
