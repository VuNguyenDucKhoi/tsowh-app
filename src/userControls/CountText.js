import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { moderateScale } from '../constants/config';

const countText = props => {
  if (props.children === 0 || props.children === null) {
    return null;
  }
  return (
    <View style={styles.countView}>
      <Text style={styles.countText}>{props.children}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  countView: {
    flex: 1,
    backgroundColor: 'red',
    justifyContent: 'center',
    borderRadius: 23,
    position: 'absolute',
    top: 0,
    right: 2,
    width: moderateScale(25),
    alignItems: 'center'
  },
  countText: {
    flex: 1,
    fontSize: moderateScale(8),
    color: 'white'
  }
});

export default countText;