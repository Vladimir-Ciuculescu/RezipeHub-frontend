import { Text, Pressable, TouchableOpacity, Alert, StyleSheet } from "react-native";
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

export default function edit_profile() {
  const navigation = useNavigation();
  const { showActionSheetWithOptions } = useActionSheet();

  const goBack = () => {
    navigation.goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={goBack}>
          <RNIcon name="arrow_left" />
        </Pressable>
      ),
      headerTitle: () => <Text style={[$sizeStyles.h3]}>Edit Profile</Text>,
    });
  }, [navigation]);

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
  };

  const handleUpdate = async () => {};

  const openGallery = async () => {
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  };

  const openCamera = async () => {
    Alert.alert("Feature under development !");
  };

  const chooseProfilePicture = () => {
    const options = ["Choose from gallery", "Open Camera", "Cancel"];
    // const destructiveButtonIndex = 0;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      //@ts-ignore
      (selectedIndex: number) => {
        switch (selectedIndex) {
          case 0:
            openGallery();
            break;
          case 1:
            openCamera();
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
        paddingTop: spacing.spacing24,
        paddingHorizontal: spacing.spacing24,
      }}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleUpdate}
        validationSchema={updateProfileSchema}
      >
        {({ values, touched, errors, handleSubmit, handleChange, handleBlur }) => (
          <View style={{ gap: spacing.spacing32 }}>
            <View style={{ gap: spacing.spacing32 }}>
              <View style={{ width: "100%", alignItems: "center" }}>
                <View
                  style={{
                    height: 120,
                    width: 120,
                    borderRadius: spacing.spacing64,
                    borderWidth: 2,
                    borderColor: colors.accent200,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <RNIcon
                    name="profile"
                    height={60}
                    width={60}
                  />
                  <TouchableOpacity
                    onPress={chooseProfilePicture}
                    style={{
                      height: 30,
                      width: 30,
                      backgroundColor: colors.greyscale300,
                      borderRadius: spacing.spacing64,
                      position: "absolute",
                      bottom: 2,
                      right: 2,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <AntDesign
                      name="plus"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
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
                containerStyle={{ minHeight: 108 }}
              />
            </View>
            <RNButton
              onPress={openGallery}
              label="Update Profile"
              style={styles.$updateBtnStyle}
              labelStyle={[{ color: colors.greyscale50 }, $sizeStyles.l]}
            />
          </View>
        )}
      </Formik>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  $updateBtnStyle: {
    backgroundColor: colors.accent200,
    width: "100%",
    borderColor: colors.accent200,
    borderWidth: 2,
    borderStyle: "solid",
  },
});
