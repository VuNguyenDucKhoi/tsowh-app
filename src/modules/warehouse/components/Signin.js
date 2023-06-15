import React, { Component } from "react";
import {
  View, StyleSheet, Image, Dimensions,
  KeyboardAvoidingView, Keyboard, Alert,
  TouchableWithoutFeedback, ActivityIndicator,
  Text, TouchableOpacity,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from "react-native-elements";
import PropTypes from "prop-types";
import Constants from "expo-constants";
import socketIOClient from "socket.io-client";

import i18n from "../../../../utils/i18n";

import DefaultInput from "../../../userControls/DefaultInput";
import HeadingText from "../../../userControls/HeadingText";
import ButtonWithBackground from "../../../userControls/ButtonWithBackground";
import logo from "../../../assets/images/logo.png";
import { Colors, scale, SOCKET_GATEWAY_URL } from "../../../constants/config";
import { initComponent } from "../../../libs/listComponentHelper"; // [!] component LIST helper
import { signinStyles } from "../../../styles/css";

export let socketClient;

export default class Signin extends Component {
  constructor(props) {
    super(props);
    Dimensions.addEventListener("change", this.updateStyles);

    initComponent(this, props);
    const tempState = {
      ...this.state,
      rememberMe: false,
      showPass: false,
      viewMode: Dimensions.get("window").height > 500 ? "portrait" : "landscape",
      controls: {
        email: { value: "" },
        password: { value: "" },
        confirmPassword: {
          value: "",
          valid: false,
          validationRules: { equalTo: "password" },
          touched: false,
        },
      },
    };

    this.state = tempState;
  }

  componentWillUnmount() {
    // Dimensions.removeEventListener('change', this.updateStyles);
  }

  async componentDidMount() {
    const infoUser = await this.getRememberedUser();
    const { controls } = this.state;

    controls.email.value = infoUser.username || "";
    controls.password.value = infoUser.password || "";

    await this.setState({
      controls,
      rememberMe: infoUser.username ? true : false,
    });
    
  }

  getRememberedUser = async () => {
    try {
      const username = await AsyncStorage.getItem("username");
      const password = await AsyncStorage.getItem("password");
      if (username !== null && password !== null) {
        // We have username!!
        return { username: username, password: password };
      }
    } catch (error) {
      console.log("error : ", error);
      // Error retrieving data
    }
    
    return { username: "", password: "" };
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { errorMessage } = this.props;

    if (
      nextProps.errorMessage !== errorMessage &&
      nextProps.errorMessage !== ""
    ) {
      Alert.alert(nextProps.errorMessage, "", [
        {
          text: "OK",
          onPress: () => {
            this.props.clearLoginErrorMessage();
            this.setState({ isLoading: false });
          },
        },
      ]);
    }
  }

  updateStyles = (dims) => {
    this.setState({
      viewMode: dims.window.height > 500 ? "portrait" : "landscape",
    });
  };

  regisSocket = () => {
    const namespace = `/wh-sp`;

    socketClient = socketIOClient(`${SOCKET_GATEWAY_URL}${namespace}`, {
      path: "/ws/socket.io",
      transports: ["websocket"],
      pingInterval: 1000,
    });

    socketClient.on("connect", () => {
      console.log("Socket connected");
    });
  };

  authHandler = () => {
    this.setState({
      isLoading: true,
    });

    const authData = {
      email: this.state.controls.email.value.toLowerCase(),
      password: this.state.controls.password.value,
    };

    this.rememberUser();

    const { onTryAuth } = this.props;
    onTryAuth(authData);

    this.regisSocket();
  };

  updateInputState = (key, value) => {
    this.setState((prevState) => {
      return {
        controls: {
          ...prevState.controls,
          [key]: {
            ...prevState.controls[key],
            value: value,
          },
        },
      };
    });
  };

  toggleRememberMe = async () => {
    await this.setState({ rememberMe: !this.state.rememberMe });
  };

  onShowPass = () => {
    const { showPass } = this.state;
    this.setState({ showPass: !showPass });
  };

  rememberUser = async (mode) => {
    try {
      if (this.state.rememberMe === true) {
        await AsyncStorage.setItem("username", this.state.controls.email.value);
        await AsyncStorage.setItem(
          "password",
          this.state.controls.password.value
        );
      } else {
        await AsyncStorage.removeItem("username");
        await AsyncStorage.removeItem("password");
      }
    } catch (error) {
      console.log("error : ", error);
    }
  };

  render() {
    const { isLoading, showPass, rememberMe, viewMode, controls } = this.state;
    let headingText = null;
    let submitButton = (
      <ButtonWithBackground color={Colors.primaryColor} onPress={this.authHandler}>
        {i18n.t("login")}
      </ButtonWithBackground>
    );

    if (viewMode === "portrait") {
      headingText = <HeadingText>WAREHOUSE</HeadingText>;
    }

    if (isLoading) {
      submitButton = (
        <ActivityIndicator
          size="large"
          style={{ padding: 12 }}
          color={Colors.primaryColor}
        />
      );
    }

    const version = Constants?.manifest?.version;

    return (
      <KeyboardAvoidingView style={signinStyles.container} behavior="padding" enabled>
        <View style={{ width: 152, height: 90 }}>
          <Image
            style={{ flex: 1, width: undefined, height: undefined }}
            source={logo}
          />
        </View>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: Colors.primaryColor,
            paddingTop: 10,
          }}
        >
          WAREHOUSE
        </Text>

        <Text style={{ paddingBottom: 35 }}>Ver. {version}</Text>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={signinStyles.inputContainer}>
            <DefaultInput
              placeholder={i18n.t("userName")}
              style={signinStyles.input}
              value={controls.email.value}
              onChangeText={(val) => this.updateInputState("email", val)}
              editable={isLoading ? false : true}
              keyboardType="email-address"
            />

            <View
              style={
                viewMode === "portrait"
                  ? signinStyles.portraitPasswordContainer
                  : signinStyles.landscapePasswordContainer
              }
            >
              <View
                style={
                  viewMode === "portrait"
                    ? signinStyles.portraitPasswordWrapper
                    : signinStyles.landscapePasswordWrapper
                }
              >
                <DefaultInput
                  placeholder={i18n.t("password")}
                  style={signinStyles.input}
                  value={controls.password.value}
                  onChangeText={(val) => this.updateInputState("password", val)}
                  editable={isLoading ? false : true}
                  secureTextEntry={!showPass}
                />

                <View style={signinStyles.viewShowPass}>
                  <Icon
                    name={showPass ? "eye" : "eye-slash"}
                    style={signinStyles.iconShowPass}
                    type="font-awesome"
                    onPress={this.onShowPass}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={signinStyles.checkBox}
              onPress={() => this.toggleRememberMe()}
            >
              <Icon
                name={
                  rememberMe
                    ? "checkbox-marked-outline"
                    : "checkbox-blank-outline"
                }
                style={signinStyles.iconCheckBox}
                type="material-community"
              />

              <Text style={signinStyles.textCheckBox}>{i18n.t("savePassword")}</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>

        {submitButton}
      </KeyboardAvoidingView>
    );
  }
}

Signin.propTypes = {
  errorMessage: PropTypes.string,
  loggingIn: PropTypes.bool,
  login: PropTypes.func,
};
