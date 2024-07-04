import AuthService from "@/api/services/auth.service";
import RNButton from "@/components/shared/RNButton";
import RNIcon from "@/components/shared/RNIcon";
import RnInput from "@/components/shared/RNInput";
import { spacing } from "@/theme/spacing";
import { $sizeStyles } from "@/theme/typography";
import { resetPasswordSchema } from "@/yup/reset-password.schema";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Formik, FormikValues } from "formik";
import { useLayoutEffect, useState } from "react";
import { Alert, Pressable, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Text, View } from "react-native-ui-lib";

interface SearchParams {
  [key: string]: string;
  email: string;
}

export default function ResetPassword() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { email } = useLocalSearchParams<SearchParams>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={goBack}>
          <RNIcon name="arrow_left" />
        </Pressable>
      ),

      headerTitle: () => <Text style={[$sizeStyles.h3]}>Create New Password</Text>,
    });
  }, [navigation]);

  const initialValues = {
    token: "",
    password: "",
    repeatPassword: "",
  };

  const goBack = () => {
    navigation.goBack();
  };

  const handleSubmit = async (values: FormikValues) => {
    setLoading(true);

    const payload = {
      email: email!,
      token: values.token,
      password: values.password,
    };

    try {
      await AuthService.resetPassword(payload);
      showConfirmationMessage();
    } catch (error) {
      showErrorMessage();
      console.log(error);
    }
    setLoading(false);
  };

  const goToLogin = () => {
    router.dismiss(2);
  };

  const showErrorMessage = () => {
    Alert.alert("Error", "Token invalid or expired", [{ text: "OK" }], { cancelable: false });
  };

  const showConfirmationMessage = () => {
    Alert.alert(
      "Success",
      "Password was succesfully changed ",
      [{ text: "OK", onPress: () => goToLogin() }],
      {
        cancelable: false,
      },
    );
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={40}
      enableAutomaticScroll
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.$keyboardContainerStyle}
    >
      <StatusBar style="dark" />

      <Text style={styles.$labelStyle}>
        Please enter the token sent to your email and set your new password.
      </Text>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={resetPasswordSchema}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <>
            <RnInput
              onChangeText={handleChange("token")}
              keyboardType="numeric"
              onBlur={handleBlur("token")}
              value={values.token}
              touched={touched.token}
              error={errors.token}
              label="Token"
              placeholder="Token"
              wrapperStyle={{ width: "100%" }}
            />
            <RnInput
              secureTextEntry
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              touched={touched.password}
              error={errors.password}
              label="Password"
              placeholder="Enter password"
              wrapperStyle={{ width: "100%" }}
              leftIcon={<RNIcon name="lock" />}
            />
            <RnInput
              secureTextEntry
              onChangeText={handleChange("repeatPassword")}
              onBlur={handleBlur("repeatPassword")}
              value={values.repeatPassword}
              touched={touched.repeatPassword}
              error={errors.repeatPassword}
              label="Repeat Password"
              placeholder="Re-type password"
              wrapperStyle={{ width: "100%" }}
              leftIcon={<RNIcon name="lock" />}
            />
            <RNButton
              loading={loading}
              onPress={() => handleSubmit()}
              label="Reset password"
              style={{ width: "100%" }}
            />
          </>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  $keyboardContainerStyle: {
    alignItems: "center",
    paddingBottom: 100,
    flexGrow: 1,
    gap: spacing.spacing24,
    paddingHorizontal: spacing.spacing24,
    paddingTop: spacing.spacing24,
  },

  $labelStyle: {
    ...$sizeStyles.n,
    fontFamily: "sofia800",
  },
});
