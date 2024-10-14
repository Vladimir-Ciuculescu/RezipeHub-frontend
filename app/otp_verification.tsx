import TokenService from "@/api/services/token.service";
import RNButton from "@/components/shared/RNButton";
import RNIcon from "@/components/shared/RNIcon";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { $sizeStyles } from "@/theme/typography";
import { hideEmail } from "@/utils/hideEmail";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, memo, useLayoutEffect } from "react";
import { TouchableOpacity, StyleSheet, Pressable, FlatList, Alert, ScrollView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextField, TextFieldRef, Text, View } from "react-native-ui-lib";

interface OtpInputProps {
  index: number;
  char: string;
  onInputChange: (index: number, value: string) => void;
  onFocusInput: (index: number) => void;
  refCallback: (ref: any) => any;
}

interface SearchParams {
  [key: string]: string;
  userId: string;
  email: string;
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
      style={[{ textAlign: "center" }, $sizeStyles.h1]}
      cursorColor={colors.brandPrimary}
      containerStyle={[
        styles.$otpInput,
        focused ? { borderColor: colors.brandPrimary } : { borderColor: "transparent" },
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
  const { userId, email } = useLocalSearchParams<SearchParams>();

  const [loading, setLoading] = useState({ confirm: false, resend: false });
  const [otp, setOtp] = useState(["", "", "", ""]);

  const inputs = useRef<(TextFieldRef | null)[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={goBack}>
          <RNIcon name="arrow_left" />
        </Pressable>
      ),

      headerTitle: () => <Text style={[$sizeStyles.h3]}>Enter OTP Code</Text>,
    });
  }, [navigation]);

  const goBack = () => {
    navigation.goBack();
  };

  const handleLoading = (key: string, state: boolean) => {
    setLoading((prevLoading) => ({ ...prevLoading, [key]: state }));
  };

  const handleInputChange = (index: number, value: string) => {
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < otp.length - 1) {
        inputs.current[index + 1]!.focus();
      }
    }
  };

  const handleFocus = (index: number) => {
    const newOtp = [...otp];
    newOtp[index] = "";
    setOtp(newOtp);
  };

  const handleBackButtonPress = () => {
    const firstEmptyIndex = otp.findIndex((char) => char === "");
    if (firstEmptyIndex === -1 || firstEmptyIndex === 0) {
      const newOtp = [...otp];
      newOtp[otp.length - 1] = "";
      setOtp(newOtp);
      inputs.current[otp.length - 1]!.focus();
    } else {
      const newOtp = [...otp];
      newOtp[firstEmptyIndex - 1] = "";
      setOtp(newOtp);
      inputs.current[firstEmptyIndex - 1]!.focus();
    }
  };

  const handleDialPress = (value: string) => {
    const firstEmptyIndex = otp.findIndex((char) => char === "");
    if (firstEmptyIndex !== -1) {
      handleInputChange(firstEmptyIndex, value);
    }
  };

  const clearInputs = () => {
    setOtp(["", "", "", ""]);
    inputs.current[0]?.focus();
  };

  const confirmOtp = async () => {
    handleLoading("confirm", true);

    try {
      const token = otp.join("");
      const payload = { userId: parseInt(userId!), token };
      await TokenService.validateToken(payload);
      showConfirmationMessage();
    } catch (error: any) {
      showError(error.error);
      clearInputs();
    }

    handleLoading("confirm", false);
  };

  const resendOtp = async () => {
    handleLoading("resend", true);

    const id = parseInt(userId!);

    const payload = { userId: id, email: email as string };

    await TokenService.resendToken(payload);

    handleLoading("resend", false);

    showResendConfirmationMessage();
  };

  const showResendConfirmationMessage = () => {
    Alert.alert(
      "OTP Resent",
      "A new OTP has been sent to your email address. Please check your inbox.",
      [{ text: "OK" }],
      { cancelable: false, userInterfaceStyle: "light" },
    );
  };

  const showConfirmationMessage = () => {
    Alert.alert(
      "Validation Successful",
      "Your token has been successfully validated. Welcome!",
      [{ text: "OK", onPress: goToLogin }],
      { cancelable: false, userInterfaceStyle: "light" },
    );
  };

  const showError = (error: string) => {
    Alert.alert("Invalid Token", error, [{ text: "OK" }], {
      cancelable: false,
      userInterfaceStyle: "light",
    });
  };

  const goToLogin = () => {
    router.replace("login");
  };

  const DIAL_PAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

  const hiddenEmail = hideEmail(email as string);

  const isConfirmBtnDisabled = otp.join("").length < otp.length;

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        alignItems: "center",
        flexGrow: 1,
        gap: spacing.spacing24,
        paddingHorizontal: spacing.spacing24,
        paddingTop: spacing.spacing24,
        paddingBottom: 30,
      }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />
      <View style={{ gap: spacing.spacing64 }}>
        <Text style={styles.$labelStyle}>
          We Already have sent you verification e-mail to {hiddenEmail}, please check it
        </Text>
        <View
          row
          style={{ justifyContent: "space-between" }}
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
          <RNButton
            disabled={isConfirmBtnDisabled}
            onPress={confirmOtp}
            label="Confirm"
          />
          <RNButton
            loading={loading.resend}
            onPress={resendOtp}
            label="Resend"
            link
          />

          <FlatList
            scrollEnabled={false}
            data={DIAL_PAD}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => (item === "del" ? handleBackButtonPress() : handleDialPress(item))}
                style={{ flex: 1, height: 80, justifyContent: "center", alignItems: "center" }}
              >
                {item === "del" ? (
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
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  $otpInput: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    backgroundColor: colors.greyscale150,
    borderWidth: 2,
    borderStyle: "solid",
  },
  $labelStyle: {
    ...$sizeStyles.n,
    fontFamily: "sofia800",
  },
});
