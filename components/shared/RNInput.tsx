import { colors } from "@/theme/colors";
import { Text, TextField, View } from "react-native-ui-lib";
import { StyleProp, StyleSheet, TextInputProps, ViewStyle } from "react-native";
import { useState } from "react";
import { $sizeStyles } from "@/theme/typography";
import { spacing } from "@/theme/spacing";

interface RNInputProps extends TextInputProps {
  leftIcon?: React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
  rightIcon?: React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined;
  containerStyle?: StyleProp<ViewStyle>;
  label?: string;
  placeholder?: TextInputProps["placeholder"];
  wrapperStyle?: StyleProp<ViewStyle>;
  flex?: boolean;
  touched?: boolean;
  error?: string;
  value: string | undefined;
  multiline?: TextInputProps["multiline"];
  onFocus?: TextInputProps["onFocus"];
  onBlur?: TextInputProps["onFocus"];
}

const RnInput: React.FC<RNInputProps> = (props) => {
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
      value,
      multiline,
      onFocus,
      onBlur,

      ...rest
    } = props;

    const [isFocused, setIsFocused] = useState(false);

    return (
      <View
        flex={flex}
        style={[wrapperStyle, styles.$baseWrapperStyle]}
      >
        {label && <Text style={[$sizeStyles.n, styles.$labelStyle]}>{label}</Text>}
        {/*  @ts-ignore */}
        <TextField
          selectTextOnFocus={false}
          keyboardAppearance="light"
          {...rest}
          placeholderTextColor={colors.greyscale300}
          multiline={multiline}
          selectionColor={colors.accent300}
          value={value}
          placeholder={placeholder}
          onFocus={(e) => {
            if (onFocus) {
              onFocus(e);
            }
            setIsFocused(true);
          }}
          onBlur={(e) => {
            if (onBlur) {
              onBlur(e);
            }
            setIsFocused(false);
          }}
          containerStyle={[
            styles.$baseContainerstyle,
            multiline ? styles.$multilineStyle : styles.$singlelineStyle,
            isFocused ? styles.$focusedStyle : styles.$unfocusedStyle,
            containerStyle,
            // { minHeight: 200 },
            // { justifyContent: "flex-start" },
          ]}
          style={[
            leftIcon && !rightIcon && styles.$hasLeftIconStyle,
            !leftIcon && rightIcon && styles.$hasRightIconStyle,
            rightIcon && leftIcon && styles.$hasBothconsStyle,
            // !leftIcon && !rightIcon && styles.$flexStyle,
            styles.$baseStyle,
            { fontFamily: "sofia800" },
          ]}
          labelStyle={{ fontFamily: "sofia800", color: "red" }}
          leadingAccessory={leftIcon}
          trailingAccessory={<View style={styles.$trailingAccessoryContainer}>{rightIcon}</View>}
        />
        {touched && error && (
          <Text
            style={[
              $sizeStyles.xs,
              { paddingLeft: spacing.spacing8, color: colors.red500, fontFamily: "sofia400" },
            ]}
          >
            {error}
          </Text>
        )}
      </View>
    );
  }
};

export default RnInput;

const styles = StyleSheet.create({
  $baseWrapperStyle: {
    gap: spacing.spacing12,
  },

  $baseContainerstyle: {
    borderRadius: spacing.spacing16,
    borderStyle: "solid",
    minHeight: 54,
    justifyContent: "center",
    borderColor: "blue",
    borderWidth: 2.5,
  },

  $singlelineStyle: {
    paddingHorizontal: spacing.spacing16,
  },

  $multilineStyle: {
    paddingHorizontal: spacing.spacing16,
    paddingVertical: spacing.spacing16,
    justifyContent: "flex-start",
  },

  $baseStyle: {
    ...$sizeStyles.n,
  },

  $labelStyle: { fontFamily: "sofia800", color: colors.greyscale500 },

  $focusedStyle: {
    borderWidth: 2.5,
    borderColor: colors.accent200,
  },
  $unfocusedStyle: {
    borderWidth: 2,
    borderColor: colors.greyscale200,
  },

  $trailingAccessoryContainer: {
    position: "absolute",
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
