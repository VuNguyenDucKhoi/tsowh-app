import React, { Component } from "react";
import { View, ImageBackground } from "react-native";
import DefaultInput from "../../../userControls/DefaultInput";
import { styles } from "../styles/homeStyle";

const backgroundImage = require("../../../assets/images/background.png");

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      notification: {},
    };
  }

  handleNotification() {
    console.warn("ok! got your notification");
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={backgroundImage}
          style={styles.bgImage}
          resizeMode="cover"
        >
          <View style={styles.inputContainer}>
            <DefaultInput placeholder="Mã công việc" />
          </View>
        </ImageBackground>
      </View>
    );
  }
}
