import { colors } from '@/theme/colors';
import { Text, TextField, View } from 'react-native-ui-lib';
import { StyleProp, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { useState } from 'react';
import { $sizeStyles } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

interface RNInputProps extends TextInputProps {
  leftIcon?: React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
  rightIcon?: React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
  containerStyle?: StyleProp<ViewStyle>;
  label?: string;
  placeholder?: TextInputProps['placeholder'];
  wrapperStyle?: StyleProp<ViewStyle>;
  flex?: boolean;
  touched?: boolean;
  error?: string;
}

export default function RnInput(props: RNInputProps) {
  {
    const {
      leftIcon,
      rightIcon,
      containerStyle,
      label,
      placeholder,
      wrapperStyle,
      flex,
      touched,
      error,
      ...rest
    } = props;

    const [isFocused, setIsFocused] = useState(false);

    return (
      <View
        flex={flex}
        style={[wrapperStyle, styles.$baseWrapperStyle]}
      >
        {label && <Text style={[$sizeStyles.n, styles.$labelStyle]}>{label}</Text>}
        {/* 
        // @ts-ignore */}
        <TextField
          {...rest}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          containerStyle={[
            styles.$baseContainerstyle,
            isFocused ? styles.$focusedStyle : styles.$unfocusedStyle,
            containerStyle,
          ]}
          style={[
            leftIcon && !rightIcon && styles.$hasLeftIconStyle,
            !leftIcon && rightIcon && styles.$hasRightIconStyle,
            rightIcon && leftIcon && styles.$hasBothconsStyle,
            styles.$baseStyle,
          ]}
          leadingAccessory={leftIcon}
          trailingAccessory={<View style={styles.$trailingAccessoryContainer}>{rightIcon}</View>}
        />
        {touched && error && (
          <Text style={[$sizeStyles.s, { paddingLeft: spacing.spacing8, color: colors.red500 }]}>
            {error}
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  $baseWrapperStyle: {
    gap: spacing.spacing12,
  },

  $baseContainerstyle: {
    borderRadius: 16,
    borderStyle: 'solid',
    height: 54,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderColor: 'blue',
    borderWidth: 2.5,
  },

  $baseStyle: { height: 54, flex: 1 },

  $labelStyle: { fontFamily: 'sofia800', color: colors.greyscale500 },

  $focusedStyle: {
    borderWidth: 2.5,
    borderColor: colors.accent400,
  },
  $unfocusedStyle: {
    borderWidth: 2,
    borderColor: colors.greyscale150,
  },

  $trailingAccessoryContainer: {
    position: 'absolute',
    right: 0,
  },

  $hasLeftIconStyle: {
    marginLeft: 10,
    marginRight: 10,
  },
  $hasRightIconStyle: {
    marginLeft: 10,
    marginRight: 10,
  },
  $hasBothconsStyle: {
    marginLeft: 10,
    marginRight: 40,
  },
});
