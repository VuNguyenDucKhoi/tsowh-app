import React from "react";
import { Text, StyleSheet } from "react-native";
import { Colors } from '../constants/config';

const headingText = props => (
  <Text {...props} style={[styles.textHeading, props.style]}>
    {props.children}
  </Text>
);

const styles = StyleSheet.create({
  textHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primaryColor,
    paddingTop: 10,
    paddingBottom:40,
  }
});

export default headingText;
