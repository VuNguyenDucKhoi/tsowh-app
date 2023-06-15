import React, { Component } from "react";
import AuthLoadingContainer from "../containers/AuthLoadingContainer";

export default class AuthLoadingScreen extends Component {
  render() {
    return <AuthLoadingContainer navigation={this.props.navigation} />;
  }
}
