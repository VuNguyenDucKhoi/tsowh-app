import socketIOClient from "socket.io-client";
import * as Notifications from "expo-notifications";

import i18n from "../../../../utils/i18n";
import { navigate } from "../../../libs/commonHelper";
import { SOCKET_GATEWAY_URL } from "../../../constants/config";

export const SOCKET_NAMESPACE = "/wh-ime-mse";
export const SOCKET_PATH = "/ws/socket.io";
export let socketClient;

export const regisAllMaterialType = async (self) => {
  const namespace = `/wh-sp`;
  const { requestList } = self.state;

  socketClient = socketIOClient(`${SOCKET_GATEWAY_URL}${namespace}`, {
    path: SOCKET_PATH,
    transports: ["websocket"],
    pingInterval: 1000,
  });

  socketClient.on("connect", () => {
    console.log("Socket connected");
  });

  socketClient.on("materialRequest", async (message) => {
    const { newData } = message;
    const {
      _id, documentNo, documentDate, woNumber, materialList,
      requestedBy, requestedByUserName, requestedByFullName,
    } = newData;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t("requestNotification", { documentNo }),
        body: i18n.t("tapToShowDetail"),
        data: { data: newData },
      },
      trigger: null,
    });

    requestList.push({
      _id, documentNo, woNumber, materialList,
      requestedBy, requestedByUserName, requestedByFullName,
      documentDate: documentDate ? new Date(documentDate) : null,
    });

    self.setState({
      ...self.state,
      requestList,
    });
  });
};

export const regisSocket = async (self) => {
  const { requestList } = self.state;
  await navigate("MaterialRequestQueue", { requestList });
};

