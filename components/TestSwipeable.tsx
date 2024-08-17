import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";

const TITLES = ["awdwa", "awda", "awdwad", "awdaw"];

export default function TestSwipeable() {
  return (
    <View style={styles.container}>
      <Text>TestSwipeable</Text>
      <ScrollView style={{ flex: 1, width: "100%" }}>
        {TITLES.map((title) => (
          <View style={{ width: "100%", alignItems: "center" }}>
            <View
              style={{
                width: "90%",
                height: 70,
                backgroundColor: "white",
                marginVertical: 10,
                borderRadius: 16,
                shadowColor: "#171717",
                // Shadow for iOS
                shadowOpacity: 0.1,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowRadius: 8,
                // Shadow for Android
                elevation: 5,
              }}
            >
              <Text>{title}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
