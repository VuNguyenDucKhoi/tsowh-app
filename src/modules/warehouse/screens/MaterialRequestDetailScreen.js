import React, { Component } from 'react';

import MaterialRequestDetailContainer from '../containers/MaterialRequestDetailContainer';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
export default class MaterialRequestDetailScreen extends Component {
  
  render() {
    return (
      <ActionSheetProvider>
        <MaterialRequestDetailContainer navigation={this.props.navigation} />
      </ActionSheetProvider>
    );
  };
};
