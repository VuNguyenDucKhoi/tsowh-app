import React from "react";
import { TextInput, StyleSheet } from "react-native";
import { Colors } from '../constants/config'
import { verticalScale } from '../constants/config';

const defaultInput = props => (
  <TextInput
    underlineColorAndroid="transparent"
    {...props}
    placeholderTextColor="#4f4f4f"
    style={[styles.input, props.style,]}
  />
);

const styles = StyleSheet.create({
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 23,
    paddingVertical: verticalScale(5),
    paddingHorizontal: verticalScale(15),
    marginTop: verticalScale(6),
    marginBottom: verticalScale(6),
    
  },
 
});

export default defaultInput;
