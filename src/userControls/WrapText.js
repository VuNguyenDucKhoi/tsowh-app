import React from 'react';
import _ from 'lodash';
import { Text, StyleSheet } from 'react-native';
import { scale, moderateScale, verticalScale } from '../constants/config';
const wrapText = props => {
    let wrapText;
    if (_.isArray(props.children)) {
        wrapText = props.children[0] + ". " + props.children[1] + ": " + props.children[2];
    } else {
        wrapText = props.children;
    }
    return (
        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.wrapText, props.style]}>{wrapText}</Text>
    )
};
const styles = StyleSheet.create({
    wrapText: {
        fontSize: moderateScale(16),
    },
});
export default wrapText;

