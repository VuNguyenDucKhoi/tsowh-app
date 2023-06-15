import React, { Component } from "react";
import RouteListContainer from "../containers/RouteListContainer";

export default class RouteListScreen extends Component {
  render() {
    return <RouteListContainer navigation={this.props.navigation} />;
  }
}
