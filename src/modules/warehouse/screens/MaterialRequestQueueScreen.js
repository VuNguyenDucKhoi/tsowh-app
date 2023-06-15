import React, { Component } from "react";
import MaterialRequestQueueContainer from "../containers/MaterialRequestQueueContainer";

export default class MaterialRequestListScreen extends Component {
  render() {
    return <MaterialRequestQueueContainer navigation={this.props.navigation} />;
  }
}
