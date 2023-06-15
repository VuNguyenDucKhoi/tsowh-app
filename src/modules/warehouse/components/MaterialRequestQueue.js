import React, { Component } from "react";
import {
  TouchableNativeFeedback, TouchableOpacity,
  Alert, Platform, BackHandler, FlatList, 
  ActivityIndicator, RefreshControl, ScrollView,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { Icon } from 'react-native-elements';
import { View, Text, Button } from "native-base";
import qs from "qs";
import dateFormat from "date-and-time";

import i18n from "../../../../utils/i18n";
import { initComponent } from "../../../libs/listComponentHelper"; // [!] component LIST helper
import { navigate } from "../../../libs/commonHelper";
import { apiGetList } from "../../../libs/apiHelper";
import { styles } from "../../../styles/css";
import { Colors } from "../../../constants/config";

import { MATERIAL_TYPE_OPTIONS } from "../constants/materialRequestConstant";
import { FlatList_Header } from "../selectors/MaterialRequestQueueSelector";
import { socketClient } from "./Signin";

export default class MaterialRequestQueue extends Component {
  constructor(props) {
    super(props);

    initComponent(this, props);
    this.state = {
      ...this.state,
      refreshing: false,
      materialType: "v1/MaterialOrders",
      isLoading: false,
      requestList: [],
      filterRequestNo: "",
      filterArea: "",
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

  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );

    socketClient && socketClient.on("materialRequest", async (message) => {
      const { newData } = message;
      const { requestList } = this.state;
      const newRequestList = requestList ? requestList : [];
      const {
        _id, originModelName, documentNo, documentDate, 
        state, materialList, note, requestedAt, 
        requestedBy, requestedByUserName, requestedByFullName,
      } = newData;

      !newRequestList.some((r) => r.documentNo === documentNo) && newRequestList.push({
        _id, originModelName, documentNo, materialList, state, note,
        requestedBy, requestedByUserName, requestedByFullName, 
        requestedAt: requestedAt ? new Date(requestedAt) : null,
        documentDate: documentDate ? new Date(documentDate) : null,
      });

      this.setState({
        ...self.state,
        requestList: newRequestList,
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) { }
    return true;
  }

  componentWillUnmount() {
    this.backHandler?.remove();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { errorMessage } = this.props;
    const { navigation } = nextProps;
    const pickedRequestNo = navigation.getParam("pickedRequestNo");

    if (pickedRequestNo) {
      this.setState({
        ...this.state,
        requestList: this.state.requestList.filter(
          (r) => r.documentNo !== pickedRequestNo
        ),
      });
    }

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

  render() {
    const { isLoading, messages, error, requestList, refreshing, materialType } = this.state;
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === "android" && Platform.Version >= 21) {
      TouchableCmp = TouchableNativeFeedback;
    }

    const haveIssueTimeList = requestList.filter((r) => r.requestedAt);

    let sortByTimeRequestList = haveIssueTimeList.sort((a, b) => {
      return a.requestedAt.getTime() - b.requestedAt.getTime();
    });

    if (isLoading) {
      return (
        <View style={styles.loadingScreen}>
          <ActivityIndicator size="large" color={Colors.logoColor} />
        </View>
      );
    }

    return (
      <View style={{ padding: 10 }}>
        {messages && (
          <View>
            <Text style={{ color: error ? "red" : "#009946" }}>{messages}</Text>
          </View>
        )}

        <ScrollView
          nestedScrollEnabled={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                try {
                  this.setState({ isLoading: true });
                  let query = { state: 'pending', originModelName: materialType };

                  const { error, data } = await apiGetList(
                    "v1/stockPickups/", qs.stringify(query)
                  );

                  if (error) {
                    Alert.alert(i18n.t("serverError"));
                    return;
                  }

                  const spList = Array.from(data);

                  const requestList = spList.map((sp) => {
                    const {
                      _id, originModelName, documentNo, documentDate,
                      state, materialList, note, requestedAt,
                      requestedBy, requestedByUserName, requestedByFullName,
                    } = sp;

                    return {
                      _id, originModelName, documentNo, materialList, state, note,
                      requestedBy, requestedByUserName, requestedByFullName,
                      requestedAt: requestedAt ? new Date(requestedAt) : null,
                      documentDate: documentDate ? new Date(documentDate) : null,
                    };
                  });

                  this.setState({
                    ...this.state,
                    requestList,
                    isLoading: false,
                  });
                } catch (error) {
                  this.setState({
                    error: true,
                    loading: false,
                    messages: error,
                  });

                  return;
                }
              }}
            />
          }
        >
          <View
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ ...styles.pickerStyle, width: '82%' }}>
              <Picker
                selectedValue={materialType}
                mode='dropdown'
                onValueChange={(itemValue) => {
                  this.setState({ ...this.state, materialType: itemValue });
                }}
              >
                {MATERIAL_TYPE_OPTIONS.map((item, index) => {
                  return (
                    <Picker.Item
                      key={item.key}
                      color='#000000'
                      label={`${item.text}`}
                      value={item.value}
                      index={index}
                    />
                  );
                })}
              </Picker>
            </View>

            <View style={{ ...styles.buttonLayout, marginTop: 0 }}>
              <Button 
                style={{ ...styles.button, backgroundColor: 'red' }} 
                onPress={async () => {
                  try {
                    this.setState({ isLoading: true });
                    let query = { state: 'pending', originModelName: materialType };

                    const { error, data } = await apiGetList(
                      "v1/stockPickups/", qs.stringify(query)
                    );

                    if (error) {
                      Alert.alert(i18n.t("serverError"));
                      return;
                    }

                    const spList = Array.from(data);

                    const requestList = spList.map((sp) => {
                      const {
                        _id, originModelName, documentNo, documentDate,
                        state, materialList, note, requestedAt,
                        requestedBy, requestedByUserName, requestedByFullName,
                      } = sp;

                      return {
                        _id, originModelName, documentNo, materialList, state, note,
                        requestedBy, requestedByUserName, requestedByFullName,
                        requestedAt: requestedAt ? new Date(requestedAt) : null,
                        documentDate: documentDate ? new Date(documentDate) : null,
                      };
                    });

                    this.setState({
                      ...this.state,
                      requestList,
                      isLoading: false,
                    });
                  } catch (error) {
                    this.setState({
                      error: true,
                      loading: false,
                      messages: error,
                    });

                    return;
                  }
                }}
              >
                <Icon name='reload' color='#fff' type='material-community' />
              </Button>
            </View>
          </View>

          {/* List Request */}
          <FlatList
            style={{ marginBottom: 60, marginTop: 10 }}
            keyExtractor={(item) => item._id}
            data={sortByTimeRequestList}
            ListHeaderComponent={FlatList_Header}
            renderItem={(item) => {
              const {
                _id, documentNo, documentDate, materialList, requestedAt,
                requestedBy, requestedByUserName, requestedByFullName,
              } = item.item;

              return (
                <TouchableOpacity
                  key={documentNo}
                  onPress={async () => {
                    await navigate("MaterialRequestDetail", {
                      objectId: _id, documentNo, documentDate, materialList, 
                      requestedAt, requestedBy, requestedByUserName, requestedByFullName,
                    });
                  }}
                >
                  <View key={_id} style={{ ...styles.view }}>
                    <View
                      style={{
                        ...styles.item,
                        backgroundColor: item.index % 2 === 0 ? "white" : "#ECECEC",
                        width: "25%",
                        height: "100%",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          textAlign: "center",
                          color: "blue",
                          fontWeight: "bold",
                        }}
                      >
                        {documentNo}
                      </Text>
                    </View>

                    <View
                      style={{
                        ...styles.item,
                        backgroundColor: item.index % 2 === 0 ? "white" : "#ECECEC",
                        width: "25%",
                        height: "100%",
                      }}
                    >
                      <Text
                        style={{
                          minHeight: 21,
                          fontSize: 10,
                          textAlign: "left",
                          color: "blue",
                          fontWeight: "bold",
                        }}
                      >
                        {documentDate ? dateFormat.format(new Date(documentDate), "DD-MM-YYYY HH:mm") : "-"}
                      </Text>
                    </View>

                    <View
                      style={{
                        ...styles.item,
                        backgroundColor: item.index % 2 === 0 ? "white" : "#ECECEC",
                        width: "25%",
                        height: "100%",
                      }}
                    >
                      <Text
                        style={{
                          minHeight: 21,
                          fontSize: 10,
                          textAlign: "center",
                          color: "blue",
                          fontWeight: "bold",
                        }}
                      >
                        {requestedByFullName}
                      </Text>
                    </View>

                    <View
                      style={{
                        ...styles.item,
                        backgroundColor: item.index % 2 === 0 ? "white" : "#ECECEC",
                        width: "25%",
                        height: "100%",
                      }}
                    >
                      <Text
                        style={{
                          minHeight: 21,
                          fontSize: 10,
                          textAlign: "left",
                          color: "blue",
                          fontWeight: "bold",
                        }}
                      >
                        {requestedAt ? dateFormat.format(new Date(requestedAt), "DD-MM-YYYY HH:mm") : "-"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            onEndReachedThreshold={0.1}
          />
        </ScrollView>
      </View>
    );
  }
}
