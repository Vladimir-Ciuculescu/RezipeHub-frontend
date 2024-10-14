import TokenService from "@/api/services/token.service";
import RNButton from "@/components/shared/RNButton";
import RNIcon from "@/components/shared/RNIcon";
import RnInput from "@/components/shared/RNInput";
import { spacing } from "@/theme/spacing";
import { $sizeStyles } from "@/theme/typography";
import { SendResetPasswordTokenRequesst } from "@/types/token.types";
import { forgotPasswordSchema } from "@/yup/forgot-password.schema";
import { useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Formik, FormikHelpers } from "formik";
import { useLayoutEffect, useState } from "react";
import { Alert, Pressable, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Text, View } from "react-native-ui-lib";
import { router } from "expo-router";

export default function ForgotPassword() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={goBack}>
          <RNIcon name="arrow_left" />
        </Pressable>
      ),

      headerTitle: () => <Text style={[$sizeStyles.h3]}>Forgot Password</Text>,
    });
  }, [navigation]);

  const initialValues = {
    email: "",
  };

  const goBack = () => {
    navigation.goBack();
  };

  const goToResetPassword = (email: string) => {
    router.navigate({ pathname: "reset_password", params: { email } });
  };

  const handleSubmit = async (
    values: SendResetPasswordTokenRequesst,
    { resetForm }: FormikHelpers<any>,
  ) => {
    setLoading(true);

    const { email } = values;
    try {
      await TokenService.sendResetPasswordToken(email);
      showConfirmationMessage(email);
      resetForm();
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const showConfirmationMessage = (email: string) => {
    Alert.alert(
      "Email sent",
      "Please check your inbox.",
      [{ text: "OK", onPress: () => goToResetPassword(email) }],
      { cancelable: false, userInterfaceStyle: "light" },
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
      <View style={{ width: "100%", gap: spacing.spacing32 }}>
        <Text style={styles.$labelStyle}>
          Enter your email and we will send you a link to reset your password.
        </Text>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={forgotPasswordSchema}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <>
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
              <RNButton
                loading={loading}
                onPress={() => handleSubmit()}
                label="Send Email"
                style={{ width: "100%" }}
              />
            </>
          )}
        </Formik>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  $keyboardContainerStyle: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacing.spacing24,
    paddingTop: spacing.spacing24,
    paddingBottom: spacing.spacing32,
  },

  $labelStyle: {
    ...$sizeStyles.n,
    fontFamily: "sofia800",
  },
});
