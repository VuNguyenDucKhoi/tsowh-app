import React, { Component } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../../userControls/HeaderButton";
import HomeContainer from "../containers/HomeContainer";

export default class HomeScreen extends Component {
  render() {
    return <HomeContainer navigation={this.props.navigation} />;
  }
}

HomeScreen.navigationOptions = (navData) => {
  return {
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName="ios-menu"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};
