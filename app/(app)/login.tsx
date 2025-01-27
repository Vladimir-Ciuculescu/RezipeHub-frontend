import RNButton from "@/components/shared/RNButton";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-ui-lib";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import RNIcon from "@/components/shared/RNIcon";
import { $sizeStyles } from "@/theme/typography";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { spacing } from "@/theme/spacing";
import { StatusBar } from "expo-status-bar";
import { Formik, FormikProps } from "formik";
import { loginSchema } from "@/yup/login.schema";
import RnInput from "@/components/shared/RNInput";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import AuthService from "@/api/services/auth.service";
import {
  CurrentUser,
  LoginUserRequest,
  LoginUserResponse,
  SocialLoginUserRequest,
} from "@/types/user.types";
import { ACCESS_TOKEN, IS_LOGGED_IN, REFRESH_TOKEN, storage } from "@/storage";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { useAuth, useOAuth, useUser } from "@clerk/clerk-expo";
import { SocialProvider } from "@/types/enums";
import useUserStore from "@/zustand/useUserStore";
import { jwtDecode } from "jwt-decode";
import { useQueryClient } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import TokenService from "@/api/services/token.service";
import { horizontalScale, verticalScale } from "@/utils/scale";
import { useNotification } from "@/context/NotificationContext";
import * as Device from "expo-device";
import Purchases from "react-native-purchases";

WebBrowser.maybeCompleteAuthSession();

enum Strategy {
  Google = "oauth_google",
  Facebook = "oauth_facebook",
}

const Login = () => {
  useWarmUpBrowser();

  const { expoPushToken } = useNotification();
  const queryClient = useQueryClient();
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<SocialProvider | null>(null);
  const router = useRouter();

  const formikRef = useRef<FormikProps<any>>(null);

  const setUser = useUserStore.use.setUser();
  const setLoggedStatus = useUserStore.use.setLoggedStatus();

  const { startOAuthFlow: googleFlow } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: facebookFlow } = useOAuth({ strategy: "oauth_facebook" });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={goToHome}>
          <RNIcon name="arrow_left" />
        </Pressable>
      ),

      headerTitle: () => <Text style={[$sizeStyles.h3]}>Login</Text>,
    });
  }, [navigation]);

  useEffect(() => {
    if (isSignedIn && loggedIn) {
      const { id, primaryEmailAddress, firstName, lastName } = user!;
      const payload: SocialLoginUserRequest = {
        provider: provider!,
        providerUserId: id,
        email: primaryEmailAddress!.emailAddress,
        firstName: firstName!,
        lastName: lastName!,
        deviceToken: Device.isDevice ? expoPushToken! : "",
        platform: Platform.OS,
      };

      handleSocialLogin(payload);
    }
  }, [isSignedIn, loggedIn]);

  useFocusEffect(
    useCallback(() => {
      if (formikRef.current) {
        formikRef.current.resetForm();
      }
    }, []),
  );

  const goToHome = () => {
    router.navigate("home");
  };

  const goToForgotPassword = () => {
    router.navigate("forgot_password");
  };

  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleFlow,
      [Strategy.Facebook]: facebookFlow,
    }[strategy];

    if (strategy === Strategy.Facebook) {
      setProvider(SocialProvider.FACEBOOK);
    }

    if (strategy === Strategy.Google) {
      setProvider(SocialProvider.GOOGLE);
    }

    try {
      const redirectUrl = Linking.createURL("/");

      const { createdSessionId, setActive } = await selectedAuth({ redirectUrl });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        setLoggedIn(true);
      }
    } catch (error) {
      console.log("Oauth error:", error);
      signOut();
    }
  };

  const initialValues = {
    email: "",
    password: "",
  };

  const goToApp = async (user: LoginUserResponse) => {
    if (user.isVerified) {
      router.navigate("(tabs)");
    } else {
      const payload = { userId: user.id, email: user.email as string };
      await TokenService.resendToken(payload);
      router.navigate({
        pathname: "otp_verification",
        params: { userId: user.id, email: user.email },
      });
    }
  };

  const storeUser = async (accessToken: string, refreshToken: string) => {
    const userData = jwtDecode(accessToken!) as CurrentUser;

    await Purchases.logIn(userData.id.toString());

    storage.set(ACCESS_TOKEN, accessToken);
    storage.set(REFRESH_TOKEN, refreshToken);
    setUser(userData);
    setLoggedStatus(true);
    queryClient.invalidateQueries({ queryKey: ["recipes-per-user", "favorites"] });
  };

  const handleSocialLogin = async (payload: SocialLoginUserRequest) => {
    try {
      const data = await AuthService.socialLoginUser(payload);

      storeUser(data.access_token, data.refresh_token);

      storage.set(IS_LOGGED_IN, true);

      goToApp(data.user);
    } catch (error: any) {
      console.log(error);
      Alert.alert(
        "Error",
        error.error,
        [
          {
            text: "OK",
          },
        ],
        { cancelable: false, userInterfaceStyle: "light" },
      );
    }
  };

  const handleLogin = async (payload: Omit<LoginUserRequest, "platform" | "deviceToken">) => {
    setIsLoading(true);
    try {
      const data = await AuthService.loginUser({
        ...payload,
        deviceToken: Device.isDevice ? expoPushToken! : "",
        platform: Platform.OS,
      });

      storeUser(data.access_token, data.refresh_token);
      storage.set(IS_LOGGED_IN, true);

      goToApp(data.user);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.error,
        [
          {
            text: "OK",
          },
        ],
        { cancelable: false, userInterfaceStyle: "light" },
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
      scrollEventThrottle={16}
    >
      <StatusBar style="dark" />
      <View style={{ width: "100%", gap: spacing.spacing24 }}>
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          onSubmit={handleLogin}
          validationSchema={loginSchema}
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
                label="Login"
                style={{ width: "100%" }}
              />

              <RNButton
                onPress={goToForgotPassword}
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
          onPress={() => onSelectAuth(Strategy.Google)}
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
          onPress={() => onSelectAuth(Strategy.Facebook)}
          iconSource={() => (
            <FontAwesome5
              name="facebook"
              size={20}
              color={colors.neutral100}
            />
          )}
          label="Login with Facebook"
          style={{ width: "100%", backgroundColor: colors.blueFacebook }}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  $keyboardContainerStyle: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(spacing.spacing24),
    paddingTop: verticalScale(spacing.spacing24),
    paddingBottom: verticalScale(spacing.spacing32),
  },

  $socialProvidersContainerStyle: {
    gap: verticalScale(spacing.spacing16),
    alignItems: "center",
  },

  $labelStyle: { ...$sizeStyles.n, fontFamily: "sofia600", color: colors.greyscale300 },
});
