import React from "react";
import { StyleSheet } from "react-native";
import { Colors } from '../constants/config'
import { Button } from 'react-native-elements'
import { scale, moderateScale } from '../constants/config';

const defaultButton = props => (
  <Button
    {...props}
    fontSize={moderateScale(16)}
    buttonStyle={[styles.button, props.buttonStyle]}
  />
);

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    backgroundColor: Colors.primaryColor,
    borderRadius: scale(18),
    padding: scale(10)
  },
});

export default defaultButton;
