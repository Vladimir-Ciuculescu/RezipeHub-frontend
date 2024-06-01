import RNButton from '@/components/shared/RNButton';
import RNIcon from '@/components/shared/RNIcon';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { $sizeStyles } from '@/theme/typography';
import { useNavigation } from 'expo-router';
import React, { useState, useRef, memo, useLayoutEffect } from 'react';
import { TouchableOpacity, StyleSheet, Pressable, FlatList } from 'react-native';
import { TextField, TextFieldRef, Text, View } from 'react-native-ui-lib';

interface OtpInputProps {
  index: number;
  char: string;
  onInputChange: (index: number, value: string) => void;
  onFocusInput: (index: number) => void;
  refCallback: (ref: any) => any;
}

const OtpInput = memo((props: OtpInputProps) => {
  const { index, char, onInputChange, onFocusInput, refCallback } = props;

  const [focused, setFocused] = useState(false);

  const handleFocus = (index: number) => {
    setFocused(true);
    onFocusInput(index);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  return (
    <TextField
      ref={refCallback}
      value={char}
      style={[{ textAlign: 'center' }, $sizeStyles.h1]}
      cursorColor={colors.brandPrimary}
      containerStyle={[
        {
          width: 64,
          height: 64,
          borderRadius: 16,
          justifyContent: 'center',
          backgroundColor: colors.greyscale150,
          borderWidth: 2,
          borderStyle: 'solid',
        },
        focused ? { borderColor: colors.brandPrimary } : { borderColor: 'transparent' },
      ]}
      maxLength={1}
      keyboardType="numeric"
      onChangeText={(value) => onInputChange(index, value)}
      onFocus={() => handleFocus(index)}
      onBlur={handleBlur}
      showSoftInputOnFocus={false}
    />
  );
});

export default function OtpVerification() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={goBack}>
          <RNIcon name="arrowLeft" />
        </Pressable>
      ),

      headerTitle: () => <Text style={[$sizeStyles.h3]}>Enter OTP Code</Text>,
    });
  }, [navigation]);

  const goBack = () => {
    navigation.goBack();
  };

  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef<(TextFieldRef | null)[]>([]);

  const handleInputChange = (index: number, value: string) => {
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 3) {
        inputs.current[index + 1]!.focus();
      }
    }
  };

  const handleFocus = (index: number) => {
    const newOtp = [...otp];
    newOtp[index] = '';
    setOtp(newOtp);
  };

  const handleBackButtonPress = () => {
    const firstEmptyIndex = otp.findIndex((char) => char === '');
    if (firstEmptyIndex === -1 || firstEmptyIndex === 0) {
      const newOtp = [...otp];
      newOtp[3] = '';
      setOtp(newOtp);
      inputs.current[3]!.focus();
    } else {
      const newOtp = [...otp];
      newOtp[firstEmptyIndex - 1] = '';
      setOtp(newOtp);
      inputs.current[firstEmptyIndex - 1]!.focus();
    }
  };

  const handleDialPress = (value: string) => {
    const firstEmptyIndex = otp.findIndex((char) => char === '');
    if (firstEmptyIndex !== -1) {
      handleInputChange(firstEmptyIndex, value);
    }
  };

  const DIAL_PAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <View style={[{ flex: 1, paddingTop: spacing.spacing24, alignItems: 'center' }]}>
      <View style={{ gap: spacing.spacing64 }}>
        <Text style={[$sizeStyles.n]}>
          We Already have sent you verification e-mail to john****@gmail.com, please check it
        </Text>
        <View
          row
          style={{ justifyContent: 'space-between' }}
        >
          {otp.map((char, index) => (
            <OtpInput
              key={index}
              index={index}
              char={char}
              onInputChange={handleInputChange}
              onFocusInput={handleFocus}
              refCallback={(ref) => (inputs.current[index] = ref)}
            />
          ))}
        </View>
        <View style={{ gap: spacing.spacing16 }}>
          <RNButton label="Confirm" />
          <RNButton
            label="Resend"
            link
          />
          <FlatList
            scrollEnabled={false}
            data={DIAL_PAD}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => (item === 'del' ? handleBackButtonPress() : handleDialPress(item))}
                style={{ flex: 1, height: 80, justifyContent: 'center', alignItems: 'center' }}
              >
                {item === 'del' ? (
                  <RNIcon name="delete" />
                ) : (
                  <Text style={[$sizeStyles.h2]}> {item}</Text>
                )}
              </TouchableOpacity>
            )}
            numColumns={3}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
