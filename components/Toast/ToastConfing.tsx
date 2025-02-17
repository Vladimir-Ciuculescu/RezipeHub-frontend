import { spacing } from "@/theme/spacing";
import ToastMessage from "./ToastMessage";
import { View, Text, Animated, StyleSheet, TouchableOpacity, Pressable, Alert } from "react-native";
import { colors } from "@/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { $sizeStyles } from "@/theme/typography";

export interface ToastConfigPros {
  title: string;
  msg: string;
  icon: React.ReactNode;
  position: "bottom" | "top";
  onPress: () => void;
}

export const toastConfig = {
  error: ({ props }: { props: ToastConfigPros }) => {
    const { title, msg, icon } = props;

    return (
      <Animated.View style={[styles.errorModal]}>
        <View style={[styles.errorSubContainer, { backgroundColor: colors.red500 }]}>
          {icon}
          <View>
            <Text style={{ ...$sizeStyles.l, color: colors.greyscale50 }}>{title}</Text>
            {msg && <Text style={{ ...$sizeStyles.n, color: colors.greyscale150 }}>{msg}</Text>}
          </View>
        </View>
      </Animated.View>
    );
  },
  success: ({ props }: { props: ToastConfigPros }) => {
    const { title, msg, icon, position, onPress } = props;

    return position === "bottom" ? (
      <Animated.View style={[styles.modal]}>
        <View style={[styles.subContainer, { backgroundColor: colors.accent200 }]}>
          {icon}

          <View>
            <Text style={{ ...$sizeStyles.l, color: colors.greyscale50 }}>{title}</Text>
            {msg && <Text style={{ ...$sizeStyles.n, color: colors.greyscale150 }}>{msg}</Text>}
          </View>
        </View>
      </Animated.View>
    ) : (
      <Pressable
        onPress={onPress}
        style={[styles.topModal]}
      >
        <View style={[styles.topSubContainer, { backgroundColor: colors.accent200 }]}>
          {icon}

          <View>
            <Text style={{ ...$sizeStyles.l, color: colors.greyscale50 }}>{title}</Text>
            {msg && <Text style={{ ...$sizeStyles.n, color: colors.greyscale150 }}>{msg}</Text>}
          </View>
        </View>
      </Pressable>
    );
  },
};

export default toastConfig;

const styles = StyleSheet.create({
  //* Error toast

  errorSubContainer: {
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

  errorModal: {
    alignSelf: "center",
    position: "absolute",
    bottom: -10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    //TODO: Keep this for news
    //width: "80%",
  },
  //////

  subContainer: {
    flexDirection: "row",
    gap: spacing.spacing16,

    width: "100%",

    height: "100%",

    paddingLeft: spacing.spacing32,
    paddingRight: spacing.spacing48,
    //paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: spacing.spacing24,
    // justifyContent: "center",
    justifyContent: "flex-start",
    alignSelf: "center",
  },

  modal: {
    alignSelf: "center",
    position: "absolute",
    bottom: -10,
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-between",
    //TODO: Keep this for news
    //width: "80%",
    width: "100%",
  },

  ////////
  topSubContainer: {
    flexDirection: "row",
    gap: spacing.spacing16,

    // width: "100%",

    // height: "100%",
    height: 40,

    paddingLeft: spacing.spacing32,
    paddingRight: spacing.spacing48,
    //paddingHorizontal: 20,
    // paddingTop: 16,
    // paddingBottom: spacing.spacing24,
    // justifyContent: "center",
    // justifyContent: "flex-start",
    justifyContent: "center",
    // alignSelf: "center",
    alignItems: "center",
    borderRadius: spacing.spacing24,
  },

  topModal: {
    // alignSelf: "center",
    position: "absolute",
    // bottom: -10,
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-between",
    //TODO: Keep this for news
    // width: "60%", //width: "100%",
    // width: "auto",
  },
});
