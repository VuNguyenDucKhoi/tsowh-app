import React from "react";
import { Text, StyleSheet, Platform, View, Dimensions } from "react-native";
import { scale, Colors } from "../constants/config";

const topBarTitle = (props) => (
  <View
    style={
      Platform.OS === "android"
        ? styles.headerTitleAndroid
        : styles.headerTitleIOS
    }
  >
    <Text style={styles.textTitle}>{props.functionName}</Text>
  </View>
);

const styles = StyleSheet.create({
  headerTitleAndroid: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: scale(-70),
    width: Dimensions.get("window").width,
  },
  headerTitleIOS: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width,
  },
  textTitle: {
    fontWeight: "bold",
    color: Colors.logoColor,
    fontSize: 23,
  },
});

export default topBarTitle;
