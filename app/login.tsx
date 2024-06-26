import RNButton from "@/components/shared/RNButton";
import { useEffect, useLayoutEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-ui-lib";
import { useNavigation, useRouter } from "expo-router";
import RNIcon from "@/components/shared/RNIcon";
import { $sizeStyles } from "@/theme/typography";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { spacing } from "@/theme/spacing";
import { StatusBar } from "expo-status-bar";
import { Formik, FormikHelpers } from "formik";
import { loginSchema } from "@/yup/login.schema";
import RnInput from "@/components/shared/RNInput";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import AuthService from "@/api/services/auth.service";
import { LoginUserRequest, SocialLoginUserRequest, User } from "@/types/user.types";
import { ACCESS_TOKEN, storage } from "@/storage";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { useAuth, useOAuth, useUser } from "@clerk/clerk-expo";
import { SocialProvider } from "@/types/enums";

WebBrowser.maybeCompleteAuthSession();

enum Strategy {
  Google = "oauth_google",
  Facebook = "oauth_facebook",
}

export default function Login() {
  useWarmUpBrowser();

  const { signOut, isSignedIn, userId, isLoaded, sessionId } = useAuth();

  const { user } = useUser();
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<SocialProvider | null>(null);
  const router = useRouter();

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
      console.log(userId, isLoaded, sessionId);
      const { id, primaryEmailAddress, firstName, lastName } = user!;
      const payload: SocialLoginUserRequest = {
        provider: provider!,
        providerUserId: id,
        email: primaryEmailAddress!.emailAddress,
        firstName: firstName!,
        lastName: lastName!,
      };

      handleSocialLogin(payload);
    }
  }, [isSignedIn, loggedIn]);

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
      const { createdSessionId, setActive } = await selectedAuth();

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        setLoggedIn(true);
      }
    } catch (error) {
      console.log("Oauth error:", error);
    }
  };

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

  const handleSocialLogin = async (payload: SocialLoginUserRequest) => {
    try {
      const data = await AuthService.socialLoginUser(payload);
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
  };

  const handleLogin = async (payload: LoginUserRequest) => {
    setIsLoading(true);
    try {
      const data = await AuthService.loginUser(payload);
      storeUser(data.access_token);
      goToApp();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.error,
        [
          {
            text: "OK",
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
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm }) => (
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
