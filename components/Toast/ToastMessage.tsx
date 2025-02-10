import React from "react";
import { StyleSheet, View, Animated } from "react-native";

import { Text } from "react-native-ui-lib";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { $sizeStyles } from "@/theme/typography";

interface Props {
  title: string;
  msg: string;
  icon: React.ReactNode;
  type: "error" | "success";
}

const RNToast = ({ title, msg, icon, type }: Props) => {
  let backgroundColor;

  switch (type) {
    case "error":
      backgroundColor = colors.red500;
      break;
    case "success":
      backgroundColor = colors.accent200;
      break;
  }

  return (
    <Animated.View style={[styles.modal]}>
      <View style={[styles.subContainer, { backgroundColor }]}>
        {icon}

        <View>
          <Text style={{ ...$sizeStyles.l, color: colors.greyscale50 }}>{title}</Text>
          {msg && <Text style={{ ...$sizeStyles.n, color: colors.greyscale150 }}>{msg}</Text>}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  subContainer: {
    flexDirection: "row",
    gap: spacing.spacing16,

    width: "100%",

    height: "100%",

    // paddingLeft: spacing.spacing16,
    // paddingRight: spacing.spacing48,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: spacing.spacing24,
    justifyContent: "center",
    alignSelf: "center",
  },

  modal: {
    alignSelf: "center",
    position: "absolute",
    bottom: -10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    //TODO: Keep this for news
    //width: "80%",
  },
});

export default RNToast;
