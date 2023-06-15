import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Platform, TouchableNativeFeedback, Dimensions
} from 'react-native';
import { Icon } from 'native-base';
import { Colors } from '../constants/config';
import { moderateScale } from '../constants/config';

const MainMenuGrid = props => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback
  }
  
  return (
    < View style={styles.gridItem} >
      <TouchableCmp
        onPress={props.onSelect}
        disabled={props.iconState === 'active' ? false : true}
      >
        <View style={[styles.container, props.iconState === 'active' ? { backgroundColor: Colors.primaryColor } : { backgroundColor: Colors.disableButtonColor }]}>
          <Icon active ios={props.iconName} android={props.iconName} type={props.iconType} style={{ fontSize: moderateScale(40), color: 'white' }} />
          <Text style={styles.title}>{props.title}</Text>
        </View>
      </TouchableCmp>
    </View >
  )
};

const styles = StyleSheet.create({
  gridItem: {
    margin: 15,
    height: Dimensions.get('window').width * 0.25,
    width: Dimensions.get('window').width * 0.26,
    borderRadius: 10,
    overflow: 'hidden'
  },
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primaryColor,
  },
  iconType: {
    flex: 5 / 8
  },
  title: {
    flex: 4 / 8,
    fontSize: moderateScale(16),
    textAlign: 'center',
    color: 'white'
  },

});


export default MainMenuGrid;
