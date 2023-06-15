import React from 'react';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/config';
import { moderateScale } from '../constants/config';

const CustomHeaderButton = props => {
  return (
    <HeaderButton
      {...props}
      IconComponent={Ionicons}
      iconSize={moderateScale(32)}
      color={Colors.primaryColor}
    />
  );
};

export default CustomHeaderButton;
