import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useLayoutEffect } from "react";
import { horizontalScale, moderateScale, verticalScale } from "@/utils/scale";
import RNIcon from "@/components/shared/RNIcon";
import RNPressable from "@/components/shared/RNPressable";
import { $sizeStyles } from "@/theme/typography";
import { useNavigation, useRouter } from "expo-router";
import RNShadowView from "@/components/shared/RNShadowView";
import { spacing } from "@/theme/spacing";
import { Image } from "expo-image";
import { colors } from "@/theme/colors";
import { AntDesign, Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";

interface ContactItemProps {
  contact: {
    icon: React.ReactNode;
    label: string;
    onPress: () => {};
  };
}

const ContactItem: React.FC<ContactItemProps> = ({ contact }) => {
  const { icon, label, onPress } = contact;

  return (
    <TouchableOpacity onPress={onPress}>
      <RNShadowView>
        <View style={styles.$socialCardContainerStyle}>
          <View style={styles.$socialCardLabelContainerStyle}>
            <View>{icon}</View>
            <Text style={styles.$socialLabelStyle}>{label}</Text>
          </View>
          <Feather
            name="external-link"
            size={24}
            color={colors.accent200}
          />
        </View>
      </RNShadowView>
    </TouchableOpacity>
  );
};

const Contact = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <RNPressable onPress={goBack}>
          <RNIcon
            name="arrow_left"
            height={moderateScale(20)}
            width={moderateScale(20)}
          />
        </RNPressable>
      ),
      headerTitle: () => <Text style={{ ...$sizeStyles.h2 }}>Contact</Text>,
    });
  }, [navigation]);

  const openInstagramAccount = async () => {
    const appUrl = `instagram://user?username=d3vdude`;
    const webUrl = "https://www.instagram.com/d3vdude";

    try {
      const canOpenApp = await Linking.canOpenURL(appUrl);

      if (canOpenApp) {
        await Linking.openURL(appUrl);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not open the Instagram profile. Please try again.");
    }
  };

  const openLinkedInProfile = async () => {
    const appUrl = `linkedin://in/ciuculescu-v-2017b41b9/`;
    const webUrl = `https://www.linkedin.com/in/ciuculescu-v-2017b41b9/`;

    try {
      const canOpenApp = await Linking.canOpenURL(appUrl);
      if (canOpenApp) {
        await Linking.openURL(appUrl);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not open the LinkedIn profile. Please try again.");
    }
  };

  const openMailApp = async (email: string, subject = "", body = "") => {
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      // Check if the device can handle the mailto link
      const canOpenMail = await Linking.canOpenURL(mailtoUrl);
      if (canOpenMail) {
        await Linking.openURL(mailtoUrl); // Open in the default mail app
      } else {
        Alert.alert("Error", "No mail app is installed or available to handle this action.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not open the email client. Please try again.");
    }
  };

  const ITEMS = [
    {
      icon: (
        <AntDesign
          name="instagram"
          size={24}
          color="black"
        />
      ),
      label: "Instagram",
      onPress: openInstagramAccount,
    },
    {
      icon: (
        <AntDesign
          name="linkedin-square"
          size={24}
          color="black"
        />
      ),
      label: "LinkedIn",
      onPress: openLinkedInProfile,
    },
    {
      icon: (
        <AntDesign
          name="mail"
          size={24}
          color="black"
        />
      ),
      label: "Mail",
      onPress: () => openMailApp("vladimir.ciuculescu@gmail.com", "", ""),
    },
  ];

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingHorizontal: spacing.spacing16,
        paddingTop: spacing.spacing32,
        paddingBottom: spacing.spacing48,
      }}
    >
      <View style={{ gap: spacing.spacing48 }}>
        <RNShadowView>
          <View
            style={{
              width: "100%",
              flexDirection: "column",
              padding: 16,
              gap: 16,
            }}
          >
            <Image
              style={{ width: "100%", height: 300, borderRadius: 16 }}
              source={{ uri: "https://avatars.githubusercontent.com/u/97725392?v=4" }}
            />
            <Text
              style={{
                flex: 1,

                ...$sizeStyles.n,
                fontFamily: "sofia400",
              }}
            >
              Hi there, I am Vladimir, the creator of this app. Hope you enjoy it and please don't
              hesitate to leave your feedback. Here's how you can reach me
            </Text>
          </View>
        </RNShadowView>

        <View style={{ gap: spacing.spacing16 }}>
          {ITEMS.map((item, key) => (
            <ContactItem
              contact={item}
              key={key}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Contact;

const styles = StyleSheet.create({
  $socialCardContainerStyle: {
    height: verticalScale(64),
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: horizontalScale(16),
  },

  $socialCardLabelContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(spacing.spacing8),
  },

  $socialLabelStyle: {
    ...$sizeStyles.n,
    fontFamily: "sofia800",
  },
});
