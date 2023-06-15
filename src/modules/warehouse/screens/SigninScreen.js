import React, { Component } from "react";
import SigninContainer from "../containers/SigninContainer";

export default class SigninScreen extends Component {
  render() {
    return <SigninContainer navigation={this.props.navigation} />;
  }
}
