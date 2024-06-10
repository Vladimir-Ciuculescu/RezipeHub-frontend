import RNButton from "@/components/shared/RNButton";
import { useLayoutEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-ui-lib";
import { Link, router, useNavigation, useRouter } from "expo-router";
import RNIcon from "@/components/shared/RNIcon";
import { $sizeStyles } from "@/theme/typography";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { spacing } from "@/theme/spacing";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import { loginSchema } from "@/yup/login.schema";
import RnInput from "@/components/shared/RNInput";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import AuthService from "@/api/services/auth.service";
import { LoginUserRequest, User } from "@/types/user.types";
import { ACCESS_TOKEN, IS_LOGGED_IN, REFRESH_TOKEN, USER, storage } from "@/storage";

export default function Login() {
  const navigation = useNavigation();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const goToHome = () => {
    router.navigate("home");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={goToHome}>
          <RNIcon name="arrowLeft" />
        </Pressable>
      ),

      headerTitle: () => <Text style={[$sizeStyles.h3]}>Login</Text>,
    });
  }, [navigation]);

  const initialValues = {
    email: "",
    password: "",
  };

  const goToApp = () => {
    router.navigate("(tabs)");
  };

  const storeUser = (accessToken: string) => {
    storage.set(ACCESS_TOKEN, accessToken);
  };

  const handleLogin = async (values: LoginUserRequest) => {
    setIsLoading(true);
    try {
      const data = await AuthService.loginUser(values);
      storeUser(data.access_token);
      goToApp();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.error,
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false },
      );
    }

    setIsLoading(false);
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={40}
      enableAutomaticScroll
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.$keyboardContainerStyle}
    >
      <StatusBar style="dark" />
      <View style={{ width: "100%", gap: spacing.spacing24 }}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleLogin}
          validationSchema={loginSchema}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <>
              <RnInput
                onChangeText={handleChange("email")}
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
                label="Password"
                placeholder="Enter password"
                wrapperStyle={{ width: "100%" }}
                secureTextEntry={!passwordVisible}
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
              <RNButton
                onPress={() => handleSubmit()}
                loading={isLoading}
                // onPress={goToLogin}
                label="Login"
                style={{ width: "100%" }}
              />

              <RNButton
                link
                label="Forgot password ?"
                style={{ width: "100%" }}
              />
            </>
          )}
        </Formik>
      </View>
      <View style={styles.$socialProvidersContainerStyle}>
        <Text style={styles.$labelStyle}>or continue with</Text>
        <RNButton
          iconSource={() => (
            <AntDesign
              name="google"
              size={20}
              color={colors.neutral100}
            />
          )}
          label="Login with Google"
          style={{ width: "100%", backgroundColor: colors.redGoogle }}
        />
        <RNButton
          iconSource={() => (
            <FontAwesome5
              name="facebook"
              size={20}
              color={colors.neutral100}
            />
          )}
          // onPress={() => handleSubmit()}
          label="Login with Facebook"
          style={{ width: "100%", backgroundColor: colors.blueFacebook }}
        />
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

  $containerStyle: { width: "100%", gap: spacing.spacing24 },

  $socialProvidersContainerStyle: {
    gap: spacing.spacing16,
    alignItems: "center",
  },

  $labelStyle: { ...$sizeStyles.n, color: colors.greyscale300 },
});
