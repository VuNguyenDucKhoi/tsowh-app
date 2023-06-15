import React from "react";
import { Text, StyleSheet } from "react-native";

const label = props => (
  <Text {...props} style={[styles.textHeading, props.style]}>
    {props.children}
  </Text>
);

const styles = StyleSheet.create({
  textHeading: {
    fontSize: 18,
    fontWeight: "bold",
    paddingTop: 10,
    paddingBottom:10,
  }
});

export default label;
