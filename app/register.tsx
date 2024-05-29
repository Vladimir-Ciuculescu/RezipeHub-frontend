import { Text, View } from 'react-native-ui-lib';
import { Pressable, StyleSheet } from 'react-native';
import RNIcon from '@/components/shared/RNIcon';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { spacing } from '@/theme/spacing';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { $sizeStyles } from '@/theme/typography';
import RnInput from '@/components/shared/RNInput';
import RNButton from '@/components/shared/RNButton';
import { Feather } from '@expo/vector-icons';
import { Formik } from 'formik';
import { registerSchema } from '@/yup/register.schema';

export default function Register() {
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      headerLeft: () => (
        <Pressable onPress={goBack}>
          <RNIcon name="arrowLeft" />
        </Pressable>
      ),
      headerBackVisible: false,
      headerShadowVisible: false,
      headerTitle: () => <Text style={[$sizeStyles.h3]}>Create account</Text>,
    });
  }, [navigation]);

  const goBack = () => {
    navigation.goBack();
  };

  const initialValues = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={40}
      enableAutomaticScroll
      contentContainerStyle={styles.$containerStyle}
    >
      <StatusBar style="dark" />

      <Formik
        initialValues={initialValues}
        onSubmit={(values) => console.log(values)}
        validationSchema={registerSchema}
      >
        {({ values, touched, errors, handleSubmit, handleChange, handleBlur }) => (
          <>
            <RnInput
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
              touched={touched.username}
              error={errors.username}
              label="Username"
              placeholder="Username"
              wrapperStyle={{ width: '100%' }}
              leftIcon={<RNIcon name="profile" />}
            />

            <View
              row
              style={{ gap: spacing.spacing16 }}
            >
              <RnInput
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                value={values.firstName}
                touched={touched.firstName}
                error={errors.firstName}
                placeholder="First Name"
                flex
                label="First Name"
                leftIcon={<RNIcon name="profile" />}
              />
              <RnInput
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
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
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              touched={touched.email}
              error={errors.email}
              label="Email Address"
              placeholder="Enter email address"
              wrapperStyle={{ width: '100%' }}
              leftIcon={<RNIcon name="email" />}
            />
            <RnInput
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              touched={touched.password}
              error={errors.password}
              secureTextEntry={!passwordVisible}
              label="Password"
              placeholder="Enter password"
              wrapperStyle={{ width: '100%' }}
              leftIcon={<RNIcon name="lock" />}
              rightIcon={
                <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
                  <Feather
                    name={passwordVisible ? 'eye' : 'eye-off'}
                    size={20}
                    color="black"
                  />
                </Pressable>
              }
            />
            <RNButton
              onPress={() => handleSubmit()}
              label="Register"
              style={{ width: '100%' }}
            />
          </>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  $containerStyle: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.spacing24,
    paddingHorizontal: spacing.spacing24,
    paddingTop: spacing.spacing24,
  },
});
