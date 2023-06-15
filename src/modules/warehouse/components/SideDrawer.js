import React, { Component } from "react";
import { View, Text, Image } from "react-native";
import PropTypes from "prop-types";
import { NavigationActions } from "react-navigation";
import Constants from "expo-constants";

import { sideDrawerStyles } from "../../../styles/css";
const imageUser = require("../../../assets/images/user-image.png");

export default class SideDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      userName: this.props.userName,
    };
  }

  navigateToScreen = (route) => async () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });

    if (route === "Home") {
      this.props.navigation.closeDrawer();
    } else if (route === "SignOut") {
      await this.props.onLogout();
      this.props.navigation.navigate("Auth");
    } else {
      this.props.navigation.dispatch(navigateAction);
    }
  };

  render() {
    const { userName } = this.state;

    return (
      <View style={sideDrawerStyles.container}>
        <View style={sideDrawerStyles.headerContainer}>
          <View style={sideDrawerStyles.infoView}>
            <Image source={imageUser} style={sideDrawerStyles.imageUser} />

            <View style={sideDrawerStyles.headerTextView}>
              <Text style={sideDrawerStyles.textName}>{userName}</Text>
            </View>
          </View>
        </View>

        <View style={sideDrawerStyles.line}></View>

        <View style={sideDrawerStyles.footerContainer}>
          <Text>{`v${Constants?.manifest?.version}`}</Text>
        </View>
      </View>
    );
  }
}



SideDrawer.propTypes = {
  navigation: PropTypes.object,
};
