import React, { Component } from "react";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import MaterialRegisterContainer from "../containers/MaterialRegisterContainer";

export default class MaterialRegisterScreen extends Component {
  render() {
    return (
      <ActionSheetProvider>
        <MaterialRegisterContainer navigation={this.props.navigation} />
      </ActionSheetProvider>
    );
  }
}
