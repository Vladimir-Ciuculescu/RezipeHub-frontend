import { Text, Pressable, Alert, StyleSheet } from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import RNIcon from "@/components/shared/RNIcon";
import { $sizeStyles } from "@/theme/typography";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { spacing } from "@/theme/spacing";
import { colors } from "@/theme/colors";
import { View } from "react-native-ui-lib";
import RnInput from "@/components/shared/RNInput";
import { Formik } from "formik";
import { updateProfileSchema } from "@/yup/update-profile.schema";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import RNButton from "@/components/shared/RNButton";
import { useEditProfileMutation } from "@/hooks/users.hooks";
import { Image } from "expo-image";
import { UpdateProfileRequest } from "@/types/user.types";
import { handleError } from "@/api/handleError";
import { ACCESS_TOKEN, storage } from "@/storage";
import { jwtDecode } from "jwt-decode";
import RNPressable from "@/components/shared/RNPressable";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/scale";
import { useCurrentUser } from "@/context/UserContext";

const EditProfile = () => {
  const navigation = useNavigation();
  const { showActionSheetWithOptions } = useActionSheet();

  const { user, setUser } = useCurrentUser();

  const { mutateAsync: editProfileMutation, isPending } = useEditProfileMutation();

  const goBack = () => {
    navigation.goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <RNPressable onPress={goBack}>
          <RNIcon name="arrow_left" />
        </RNPressable>
      ),
      headerTitle: () => <Text style={[$sizeStyles.h3]}>Edit Profile</Text>,
    });
  }, [navigation]);

  const initialValues = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    bio: user.bio || "",
    photoUrl: user.photoUrl,
  };

  const handleUpdate = async (values: UpdateProfileRequest) => {
    const { firstName, lastName, bio, email, photoUrl } = values;

    const formData = new FormData();

    if (photoUrl) {
      formData.append("file", {
        uri: values.photoUrl,
        type: "image/jpeg",
        name: `users-${user.id}-profile`,
      } as any);
    }
    formData.append("id", user.id.toString());
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("bio", bio);

    try {
      const newAccessToken = await editProfileMutation(formData);

      const userData = jwtDecode(newAccessToken) as any;

      storage.set(ACCESS_TOKEN, newAccessToken);
      setUser(userData);

      Alert.alert("Success", "Profile was updated !", [
        {
          text: "Ok",
          onPress: () => goBack(),
        },
      ]);
    } catch (error) {
      console.log(error);
      throw handleError(error);
    }
  };

  const openGallery = async (setFieldValue: (label: string, value: string) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const [image] = result.assets;

      setFieldValue("photoUrl", image.uri);
    }
  };

  const openCamera = async () => {
    Alert.alert("Feature under development !");
  };

  const chooseProfilePicture = (
    photoUrl: string | null,
    setFieldValue: (label: string, value: string) => void,
  ) => {
    let cancelButtonIndex;
    let destructiveButtonIndex = 2;

    let options;

    if (photoUrl) {
      options = ["Choose from gallery", "Open camera", "Remove photo", "Cancel"];
      cancelButtonIndex = 3;
      destructiveButtonIndex = 2;
    } else {
      options = ["Choose from gallery", "Open camera", "Cancel"];
      cancelButtonIndex = 2;
      destructiveButtonIndex = 2;
    }

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      //@ts-ignore
      (selectedIndex: number) => {
        switch (selectedIndex) {
          case 0:
            openGallery(setFieldValue);
            break;
          case 1:
            openCamera();
            break;
          case 2:
            setFieldValue("photoUrl", "");
            break;
        }
      },
    );
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={40}
      enableAutomaticScroll
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: verticalScale(spacing.spacing24),
        paddingHorizontal: verticalScale(spacing.spacing24),
      }}
    >
      <Formik
        //@ts-ignore
        initialValues={initialValues}
        onSubmit={handleUpdate}
        validationSchema={updateProfileSchema}
      >
        {({
          values,
          touched,
          errors,
          handleSubmit,
          dirty,
          handleChange,
          handleBlur,
          setFieldValue,
        }) => (
          <View style={{ gap: verticalScale(spacing.spacing32) }}>
            <View style={{ gap: verticalScale(spacing.spacing32) }}>
              <View style={{ width: "100%", alignItems: "center" }}>
                <View style={styles.$imageContainerStyle}>
                  {values.photoUrl ? (
                    <Image
                      source={{ uri: values.photoUrl }}
                      style={styles.$imageStyle}
                      cachePolicy="none"
                      transition={300}
                      contentFit="fill"
                    />
                  ) : (
                    <RNIcon
                      name="profile"
                      height={60}
                      width={60}
                    />
                  )}
                  <Pressable
                    onPress={() => chooseProfilePicture(values.photoUrl, setFieldValue)}
                    style={styles.$editBtnStyle}
                  >
                    <AntDesign
                      name="plus"
                      size={moderateScale(18)}
                      color={colors.greyscale50}
                    />
                  </Pressable>
                </View>
              </View>

              <View
                row
                style={{ gap: spacing.spacing16 }}
              >
                <RnInput
                  label="First Name"
                  placeholder="First name"
                  flex
                  value={values.firstName}
                  onChangeText={handleChange("firstName")}
                  onBlur={handleBlur("firstName")}
                  touched={touched.firstName}
                  error={errors.firstName}
                  leftIcon={<RNIcon name="profile" />}
                />
                <RnInput
                  label="Last Name"
                  placeholder="Last name"
                  flex
                  value={values.lastName}
                  onChangeText={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  touched={touched.lastName}
                  error={errors.lastName}
                  leftIcon={<RNIcon name="profile" />}
                />
              </View>

              <RnInput
                label="Email"
                placeholder="Enter email address "
                flex
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                touched={touched.email}
                error={errors.email}
                leftIcon={<RNIcon name="email" />}
              />
              <RnInput
                placeholder="Say something about yourself"
                multiline
                label="Bio"
                flex
                value={values.bio}
                onChangeText={handleChange("bio")}
                onBlur={handleBlur("bio")}
                touched={touched.bio}
                error={errors.bio}
                containerStyle={{ minHeight: verticalScale(108) }}
              />
            </View>
            <RNButton
              disabled={!dirty || isPending}
              loading={isPending}
              onPress={() => handleSubmit()}
              label="Update Profile"
              style={styles.$updateBtnStyle}
              labelStyle={[{ color: colors.greyscale50 }, $sizeStyles.l]}
            />
          </View>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  $updateBtnStyle: {
    backgroundColor: colors.accent200,
    width: "100%",
    borderColor: colors.accent200,
    borderWidth: 2,
    borderStyle: "solid",
    height: 54,
  },

  $imageContainerStyle: {
    height: 120,
    width: 120,
    borderRadius: spacing.spacing64,
    borderWidth: 2,
    borderColor: colors.accent200,
    justifyContent: "center",
    alignItems: "center",
  },

  $imageStyle: {
    height: horizontalScale(120),
    width: horizontalScale(120),
    borderWidth: 3,
    borderColor: colors.accent200,
    borderRadius: spacing.spacing64,
  },

  $editBtnStyle: {
    height: horizontalScale(32),
    width: horizontalScale(32),
    backgroundColor: colors.greyscale300,
    borderRadius: spacing.spacing64,
    position: "absolute",
    bottom: 2,
    right: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
