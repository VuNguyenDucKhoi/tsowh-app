import React, { Component } from "react";
import {
  TouchableNativeFeedback, TouchableOpacity,
  Alert, Platform, BackHandler, Button,
} from "react-native";
import { View, Text } from "native-base";
import * as Notifications from "expo-notifications";

import i18n from "../../../../utils/i18n";
import { initComponent } from "../../../libs/listComponentHelper"; // [!] component LIST helper
import { navigate } from "../../../libs/commonHelper";
import { registerForPushNotificationsAsync } from "../../../constants/registerForPushNotificationsAsync";
import { regisSocket, regisAllMaterialType } from "../functions/materialRegisterFunction";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default class MaterialRegister extends Component {
  constructor(props) {
    super(props);
    initComponent(this, props);
    this.state = {
      ...this.state,
      materialType: "ime",
      isLoading: false,
      requestList: [],
    };
  }

  backAction = () => {
    Alert.alert(i18n.t("confirmation"), i18n.t("confirmGoBack"), [
      {
        text: i18n.t("cancel"),
        onPress: () => null,
        style: "cancel",
      },
      { text: i18n.t("yes"), onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };

  onSelect = (data) => {
    this.setState(data);
  };

  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );

    await registerForPushNotificationsAsync();
    await regisAllMaterialType(this);
  }

  componentDidUpdate(prevProps) {
    console.log("prevProps");
    if (prevProps.isFocused !== this.props.isFocused) {
    }
    return true;
  }

  componentWillUnmount() {
    console.log("remove");
    this.backHandler.remove();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("nextProps");
    const { errorMessage } = this.props;

    if (
      nextProps.errorMessage !== errorMessage &&
      nextProps.errorMessage !== ""
    ) {
      Alert.alert(nextProps.errorMessage, "", [
        {
          text: "OK",
          onPress: () => {
            this.setState({ isLoading: false });
          },
        },
      ]);
    }
  }

  async logout() {
    await this.props.onLogout();
    await navigate("Auth", { screen: "SignIn" });
  }

  render() {
    const { messages, error, materialType } = this.state;
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === "android" && Platform.Version >= 21) {
      TouchableCmp = TouchableNativeFeedback;
    }

    return (
      <View style={{ padding: 10 }}>
        {messages && (
          <View>
            <Text style={{ color: error ? "red" : "#009946" }}>{messages}</Text>
          </View>
        )}

        <Button
          title={i18n.t("confirm")}
          onPress={async () => {
            await regisSocket(this);
          }}
        />

        <View style={{ height: 8 }}></View>

        <Button
          color={"#ec1c24"}
          title={i18n.t("logout")}
          onPress={async () => {
            await this.logout();
          }}
        />
      </View>
    );
  }
}
