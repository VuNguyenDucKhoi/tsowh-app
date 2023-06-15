import React from "react";
import {
  TouchableNativeFeedback, Text, View,
  StyleSheet, Platform, TouchableHighlight,
} from "react-native";
import { Colors } from '../constants/config';

const buttonWithBackground = props => {
  const content = (
    <View
      style={[
        styles.button,
        { backgroundColor: props.color },
        props.disabled ? styles.disabled : styles.enabled
      ]}
    >
      <Text style={[styles.textButton, props.disabled ? styles.disabledText : styles.enabledText]}>
        {props.children}
      </Text>
    </View>
  );

  if (props.disabled) {
    return content;
  }

  if (Platform.OS === "android") {
    return (
      <TouchableNativeFeedback onPress={props.onPress}>
        {content}
      </TouchableNativeFeedback>
    );
  }
  
  return (
    <TouchableHighlight style={styles.touchableHighlight} onPress={props.onPress}>
      {content}
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    margin: 5,
    width: "70%",
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: "#ff868e"
  },
  disabled: {
    backgroundColor: Colors.primaryColor,
    borderColor: "#ffffff"
  },
  disabledText: {
    color: "#ffffff"
  },
  enabled: {
    backgroundColor: Colors.primaryColor,
    borderColor: "#ffffff"
  },
  enabledText: {
    color: "#ffffff"
  },
  touchableHighlight: {
    flexDirection: 'row',
  },
  textButton: {
    fontSize: 17,
    color: "white"
  }
});

export default buttonWithBackground;
