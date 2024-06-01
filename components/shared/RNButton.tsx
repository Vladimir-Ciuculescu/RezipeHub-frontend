import { colors } from '@/theme/colors';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { Button, ButtonProps } from 'react-native-ui-lib';

interface RNButtonProps extends TouchableOpacityProps {
  link?: boolean;
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
}

export default function RNButton(props: RNButtonProps) {
  const { link, label, labelStyle, style, loading, ...rest } = props;

  const buttonProps: ButtonProps = { ...rest };

  if (loading) {
    buttonProps.iconSource = () => <ActivityIndicator />;
  } else {
    buttonProps.label = label;
  }

  return (
    <Button
      {...buttonProps}
      disabled={loading}
      link={link || false}
      labelStyle={[styles.$baselabelStyle, link ? styles.$linkLabelStyle : {}, labelStyle]}
      style={[
        styles.$baseViewStyle,
        !link && styles.$containedViewStyle,
        loading && styles.$loading,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  $baseViewStyle: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    height: 50,
  },

  $containedViewStyle: {
    backgroundColor: colors.brandPrimary,
  },

  $loading: {
    opacity: 0.7,
  },

  $baselabelStyle: {
    fontSize: 16,
    fontFamily: 'sofia800',
    fontStyle: 'normal',
  },

  $linkLabelStyle: {
    color: colors.brandPrimary,
  },
});
