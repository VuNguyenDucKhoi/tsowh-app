import React, { Component } from "react";
import SideDrawerContainer from "../containers/SideDrawerContainer";

export default class SideDrawerScreen extends Component {
  render() {
    return <SideDrawerContainer navigation={this.props.navigation} />;
  }
}
