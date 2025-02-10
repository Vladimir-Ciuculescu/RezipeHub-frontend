import { Text, View } from "react-native-ui-lib";
import { Alert, Pressable, StyleSheet } from "react-native";
import RNIcon from "@/components/shared/RNIcon";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { spacing } from "@/theme/spacing";
import { StatusBar } from "expo-status-bar";
import { router, useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { $sizeStyles } from "@/theme/typography";
import RnInput from "@/components/shared/RNInput";
import RNButton from "@/components/shared/RNButton";
import { Feather } from "@expo/vector-icons";
import { Formik, FormikErrors, FormikHelpers } from "formik";
import { registerSchema } from "@/yup/register.schema";
import AuthService from "@/api/services/auth.service";
import { RegisterUserRequest } from "@/types/user.types";
import { horizontalScale, verticalScale } from "@/utils/scale";

const Register = () => {
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={goBack}
          disabled={isLoading}
        >
          <RNIcon name="arrow_left" />
        </Pressable>
      ),

      headerTitle: () => <Text style={[$sizeStyles.h3]}>Create account</Text>,
    });
  }, [navigation, isLoading]);

  const goBack = () => {
    navigation.goBack();
  };

  const initialValues = {
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
  };

  const handleRegister = async (
    payload: RegisterUserRequest,
    { setErrors }: FormikHelpers<any>,
  ) => {
    setIsLoading(true);
    try {
      const user = await AuthService.registerUser(payload);

      showRegisterConfirmation(user.id, user.email);
    } catch (error) {
      setErrors(error as FormikErrors<any>);
    }

    setIsLoading(false);
  };

  const showRegisterConfirmation = (userId: number, email: string) => {
    Alert.alert(
      "Account Created",
      "Your account has been successfully created!",
      [{ text: "OK", onPress: () => goToOtpVerification(userId, email) }],
      { cancelable: false, userInterfaceStyle: "light" },
    );
  };

  const goToOtpVerification = (userId: number, email: string) => {
    router.push({ pathname: "/otp_verification", params: { userId, email } });
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={40}
      enableAutomaticScroll
      contentContainerStyle={styles.$containerStyle}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />

      <Formik
        initialValues={initialValues}
        onSubmit={handleRegister}
        validationSchema={registerSchema}
      >
        {({ values, touched, errors, handleSubmit, handleChange, handleBlur }) => (
          <>
            <RnInput
              onChangeText={handleChange("username")}
              onBlur={handleBlur("username")}
              value={values.username}
              touched={touched.username}
              error={errors.username}
              label="Username"
              placeholder="Username"
              wrapperStyle={{ width: "100%" }}
              leftIcon={<RNIcon name="profile" />}
            />

            <View
              row
              style={{ gap: spacing.spacing16 }}
            >
              <RnInput
                onChangeText={handleChange("firstName")}
                onBlur={handleBlur("firstName")}
                value={values.firstName}
                touched={touched.firstName}
                error={errors.firstName}
                placeholder="First Name"
                flex
                label="First Name"
                leftIcon={<RNIcon name="profile" />}
              />
              <RnInput
                onChangeText={handleChange("lastName")}
                onBlur={handleBlur("lastName")}
                value={values.lastName}
                touched={touched.lastName}
                error={errors.lastName}
                placeholder="Last Name"
                flex
                label="Last Name"
                leftIcon={<RNIcon name="profile" />}
              />
            </View>
            <RnInput
              onChangeText={handleChange("email")}
              autoCapitalize="none"
              onBlur={handleBlur("email")}
              value={values.email}
              touched={touched.email}
              error={errors.email}
              label="Email Address"
              placeholder="Enter email address"
              wrapperStyle={{ width: "100%" }}
              leftIcon={<RNIcon name="email" />}
            />
            <RnInput
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              touched={touched.password}
              error={errors.password}
              secureTextEntry={!passwordVisible}
              label="Password"
              placeholder="Enter password"
              wrapperStyle={{ width: "100%" }}
              leftIcon={<RNIcon name="lock" />}
              rightIcon={
                <Pressable onPress={() => setPasswordVisible((oldValue) => !oldValue)}>
                  <Feather
                    name={passwordVisible ? "eye" : "eye-off"}
                    size={20}
                    color="black"
                  />
                </Pressable>
              }
            />
            <RnInput
              onChangeText={handleChange("repeatPassword")}
              onBlur={handleBlur("repeatPassword")}
              value={values.repeatPassword}
              touched={touched.repeatPassword}
              error={errors.repeatPassword}
              secureTextEntry={!repeatPasswordVisible}
              label="Repeat Password"
              placeholder="Re-type password"
              wrapperStyle={{ width: "100%" }}
              leftIcon={<RNIcon name="lock" />}
              rightIcon={
                <Pressable onPress={() => setRepeatPasswordVisible((oldValue) => !oldValue)}>
                  <Feather
                    name={repeatPasswordVisible ? "eye" : "eye-off"}
                    size={20}
                    color="black"
                  />
                </Pressable>
              }
            />
            <RNButton
              loading={isLoading}
              disabled={isLoading}
              onPress={() => handleSubmit()}
              label="Register"
              style={{ width: "100%" }}
            />
          </>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  $containerStyle: {
    alignItems: "center",
    flexGrow: 1,
    gap: verticalScale(spacing.spacing24),
    paddingHorizontal: horizontalScale(spacing.spacing24),
    paddingTop: verticalScale(spacing.spacing24),
  },
});
