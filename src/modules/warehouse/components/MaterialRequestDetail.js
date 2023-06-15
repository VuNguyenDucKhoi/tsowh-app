import React, { Component } from "react";
import {
  TextInput, View, ScrollView, 
  Alert, ActivityIndicator, FlatList, 
  RefreshControl, Modal, TouchableOpacity, 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import NetInfo from "@react-native-community/netinfo";
import { Text, Button } from "native-base";
import { isArray, debounce } from "lodash";
import { Icon } from "react-native-elements";
import qs from "qs";
import dateFormat from "date-and-time";

import i18n from "../../../../utils/i18n";

import { initComponent, loadComponentData } from "../../../libs/listComponentHelper"; // [!] component FORM helper
import { apiGet, apiPost } from "../../../libs/apiHelper";
import { Colors, verticalScale } from "../../../constants/config";
import Label from "../../../userControls/Label";
import { styles, modalStyle } from "../../../styles/css";

import { updateMaterialList, onConfirmPickMaterial } from "../functions/materialRequestFunction";
import { FlatList_Header, StockList_Header } from "../selectors/MaterialRequestDetailSelector";

const ThisContext = React.createContext({});

export default class MaterialRequestDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
    initComponent(this, props);

    this.materialProductRef = React.createRef();
    this.scrollRef = React.createRef();
    this.updateMaterialList = updateMaterialList.bind(this, this);
    this.onConfirmPickMaterial = onConfirmPickMaterial.bind(this, this);
  }

  async shouldComponentUpdate(nextProps, nextState) {
    const { navigation } = nextProps;
    return true;
  }

  async UNSAFE_componentWillMount() {
    const { navigation } = this.props;
    const object = navigation.getParam("object", {});
    await this.setState({
      object,
    });
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const objectId = navigation.getParam("objectId", "default value");
    const documentNo = navigation.getParam("documentNo", "default value");

    await this.setState({
      ...this.state,
      documentNo,
      objectId,
      object: {
        ...this.state.object,
        documentNo,
      },
      materialProductCode: "",
      newLotNo: "",
      newLotQty: "",
      newLotDate: "",
      location: "",
      modalVisible: false,
      pickMaterialModalVisible: false,
      workerInputModalVisible: false,
      pickedMaterials: [],
      removeLotList: [],
      requestedBy: null,
      requestedByUserName: "",
      requestedByFullName: "",
      filterByProductCode: "",
      locationListOptions: [],
      locationList: [],
      loadingReloadStock: false,
      requestedQty: null,
      isAutoGetLot: true,
    });

    await loadComponentData(this);
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ isLoading: true });
    const { navigation } = nextProps;
    const { objectId } = this.state;
    const object = navigation.getParam("object", {});

    this.setState({
      object: {
        ...this.state.object,
        ...object,
      },
      isLoading: false,
    });

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

  async onGoBack() {
    this.props.navigation.navigate("MaterialRequestQueue", {});
  }

  async onConfirmButton() {
    const stateNetwork = await NetInfo.fetch();

    if (!stateNetwork.isConnected) {
      Alert.alert(i18n.t('noInternet'));
    } else {
      const { object, objectId } = this.state;
      const { documentNo } = object;

      await this.setState({
        ...this.state,
        object: {
          ...this.state.object,
        },
      });

      const postData = {
        data: { _id: objectId },
        updateType: "updateValue",
      };

      const { error, data } = await apiPost(
        `v1/stockPickups/updateValue/${objectId}`, 
        postData
      );

      if (error) {
        Alert.alert(`${i18n.t('serverError')}`);
        return;
      }

      this.props.navigation.navigate('MaterialRequestQueue', {
        pickedRequestNo: documentNo,
      });
    }
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  openStockModal = async (
    productId, productCode, productName,
    stockQty, requestedQty, locationList
  ) => {
    let query = {
      productId: [productId],
      storeCode: { $eq: "NL" },
      sortBy: "lotDate.asc",
    };

    const stockList = await apiGet(
      "v1/stockPickups/getStockQty", `?${qs.stringify(query)}`
    );

    this.setState({
      productId,
      productCode,
      productName,
      stockQty,
      requestedQty,
      locationList,
      pickedMaterials: locationList.map((lot) => ({
        ...lot,
        newPicked: false,
      })),
      stockList,
      modalVisible: true,
    });
  };

  openPickMaterialModal = () => {
    this.setState({
      pickMaterialModalVisible: true,
    });
  };

  render() {
    const {
      isLoading, object, refreshing,
      messages, error, success, stockList,
      productId, productCode, productName,
      materialProductCode, newLotNo, newLotQty, 
      newLotDate, location, filterByProductCode, 
      modalVisible, pickMaterialModalVisible, workerInputModalVisible,
      pickedMaterials, locationListOptions, locationList,
      loadingReloadStock, requestedQty, isAutoGetLot,
    } = this.state;

    if (!object || isLoading) {
      return (
        <View style={styles.loadingScreen}>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
      );
    }

    const { materialList } = object;

    if (materialList) {
      const hasMissingStockQty = materialList.some(
        (material) => !material.hasOwnProperty("stockQty")
      );
      
      if (hasMissingStockQty) updateMaterialList(this);
    }

    let typeMaterialList = materialList;

    if (filterByProductCode) {
      typeMaterialList = typeMaterialList.filter((m) =>
        m.productCode.includes(filterByProductCode)
      );
    }

    const canPick = materialProductCode && newLotNo && location;
    const canConfirm = typeMaterialList && typeMaterialList.findIndex(
      (m) => !m.locationList || (m.locationList && !m.locationList.length)
    ) === -1;

    return (
      <ThisContext.Provider value={{ self: this }}>
        {/* Detail material request */}
        <View style={{ paddingTop: verticalScale(17) }}>
          <View style={styles.buttonOuterLayout}>
            {/* {canConfirm && ( */}
              <View style={styles.buttonLayout}>
                <Button
                  style={styles.button}
                  onPress={() => this.onConfirmButton()}
                >
                  {i18n.t("confirm")}
                </Button>
              </View>
            {/* )} */}

            <View style={styles.buttonLayout}>
              <Button style={styles.backButton} onPress={() => this.onGoBack()}>
                {i18n.t("goBack")}
              </Button>
            </View>
          </View>

          <ScrollView
            nestedScrollEnabled={true}
            style={styles.scrollView}
            ref={this.scrollRef}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={async () => {
                  await loadComponentData(this);
                  this.setState({
                    success: false,
                    error: false,
                    messages: "",
                  });
                }}
              />
            }
          >
            {(error || success) && (
              <View style={{}}>
                <Text style={{ color: error ? "red" : "#009946" }}>
                  {isArray(messages)
                    ? messages.map((msg, index) => {
                        const { name, message } = msg;
                        if (index >= 10) return <React.Fragment />;

                        return (
                          <Text key={`${msg.name}.${index}`}>
                            <Text>
                              {i18n.t(name)} {": "}
                            </Text>
                            <Text>{message + "\n"}</Text>
                          </Text>
                        );
                      })
                    : messages}
                </Text>
              </View>
            )}

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Label style={{ fontSize: 16 }}>
                {i18n.t("documentNo")}: {object.documentNo}
              </Label>
            </View>

            <FlatList
              nestedScrollEnabled
              style={{ marginBottom: 60 }}
              keyExtractor={(item) => item._id}
              data={typeMaterialList}
              ListHeaderComponent={FlatList_Header}
              renderItem={(item) => {
                const {
                  productId,
                  productCode,
                  productName,
                  requestedQty,
                  locationList,
                  stockQty,
                } = item.item;

                return (
                  <View style={{ ...styles.view }}>
                    <View
                      style={{
                        ...styles.item,
                        backgroundColor: item.index % 2 === 0 ? "white" : "#ECECEC",
                        width: "20%",
                        height: "100%",
                      }}
                    >
                      <TouchableOpacity
                        onPress={async () => {
                          this.openStockModal(
                            productId,
                            productCode,
                            productName,
                            stockQty,
                            requestedQty,
                            locationList
                          );
                        }}
                      >
                        <Text style={{ fontSize: 10, color: "blue" }}>
                          {productCode}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        ...styles.item,
                        backgroundColor: item.index % 2 === 0 ? "white" : "#ECECEC",
                        width: "20%",
                        height: "100%",
                      }}
                    >
                      <TouchableOpacity
                        onPress={async () => {
                          this.openStockModal(
                            productId,
                            productCode,
                            productName,
                            stockQty,
                            requestedQty,
                            locationList
                          );
                        }}
                      >
                        <Text style={{ fontSize: 10, color: "blue" }}>
                          {productName}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        ...styles.item,
                        backgroundColor: item.index % 2 === 0 ? "white" : "#ECECEC",
                        width: "10%",
                        height: "100%",
                        padding: 0,
                        margin: 0,
                        paddingLeft: 3,
                      }}
                    >
                      <Text
                        style={{
                          alignSelf: "flex-start",
                          fontSize: 8,
                          paddingTop: 2,
                        }}
                      >
                        <Text>{requestedQty}</Text>
                      </Text>
                    </View>

                    <View
                      style={{
                        ...styles.item,
                        backgroundColor: item.index % 2 === 0 ? "white" : "#ECECEC",
                        width: "20%",
                        height: "100%",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 8,
                          lineHeight: 13,
                          paddingTop: 2,
                        }}
                      >
                        {stockQty}
                      </Text>
                    </View>

                    <View
                      style={{
                        ...styles.item,
                        backgroundColor: item.index % 2 === 0 ? "white" : "#ECECEC",
                        width: "30%",
                        height: "100%",
                      }}
                    >
                      <Text
                        style={{ fontSize: 10, lineHeight: 13, paddingTop: 2 }}
                      >
                        {locationList.map((lot, index) => {
                          const { location, lotNo, qty } = lot;
                          if (index !== locationList.length - 1) {
                            return `${location}-${lotNo}-${qty}\n`;
                          }

                          return `${location}-${lotNo}-${qty}`;
                        })}
                      </Text>
                    </View>
                  </View>
                );
              }}
              onEndReachedThreshold={0.1}
            />

            <View style={{ padding: 10 }}></View>
          </ScrollView>
        </View>

        {/* Detail stock modal */}
        <View style={{ ...modalStyle.centeredView, position: "relative" }}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              this.setModalVisible(!modalVisible);
            }}
            propagateSwipe={true}
            swipeDirection={["down"]}
          >
            <View style={modalStyle.centeredView}>
              <View style={modalStyle.modalView}>
                <View style={styles.buttonOuterLayout}>
                  <View style={styles.buttonLayout}>
                    <Button
                      style={styles.button}
                      disabled={isLoading}
                      isLoading={isLoading}
                      onPress={debounce(this.onConfirmPickMaterial, 300)}
                    >
                      {i18n.t("confirm")}
                    </Button>
                  </View>

                  <View style={styles.buttonLayout}>
                    <Button
                      style={styles.button}
                      onPress={() => {
                        this.setState({ pickMaterialModalVisible: true });
                      }}
                    >
                      {i18n.t("pickMaterial")}
                    </Button>
                  </View>

                  <View style={styles.buttonLayout}>
                    <Button
                      style={styles.backButton}
                      onPress={() => {
                        this.setState({
                          pickMaterialModalVisible: false,
                          modalVisible: false,
                          pickedMaterials: [],
                          isAutoGetLot: true,
                        });
                      }}
                    >
                      {i18n.t("goBack")}
                    </Button>
                  </View>
                </View>

                <ScrollView nestedScrollEnabled={true}>                 
                  <TouchableOpacity
                    style={{
                      marginTop : 10,
                      marginLeft: 8,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'flex-start',
                    }}
                    onPress={() => this.setState({ isAutoGetLot: !this.state.isAutoGetLot })}
                  >
                    <Icon
                      name={
                        isAutoGetLot
                          ? 'checkbox-marked-outline'
                          : 'checkbox-blank-outline'
                      }
                      style={styles.iconCheckBox}
                      type='material-community'
                    />
                    <Text style={{ color: '#000' }}>
                      {i18n.t('isAutoGetLot')}
                    </Text>

                  </TouchableOpacity>

                  <Text style={{ marginLeft: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>
                      {i18n.t("productCode")}:{" "}
                    </Text>
                    <Text>{productCode}</Text>
                  </Text>

                  <Text style={{ marginTop: 5, marginLeft: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>
                      {i18n.t("productName")}:{" "}
                    </Text>
                    <Text>{productName}</Text>
                  </Text>

                  <Text style={{ marginTop: 5, marginLeft: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>
                      {i18n.t("requestedQty")}:{" "}
                    </Text>
                    <Text>{requestedQty}</Text>
                  </Text>

                  <Text
                    style={{ marginTop: 5, marginLeft: 10, fontWeight: "bold" }}
                  >
                    {i18n.t("pickedMaterials")}:
                  </Text>

                  <Text style={{ marginTop: 0, marginLeft: 10 }}>
                    {pickedMaterials &&
                      pickedMaterials.map((m, index) => (
                        <Text key={index} style={{ lineHeight: 25 }}>
                          {"\t" + (index + 1) + ". "}
                          {m.location} - {m.lotNo} - {m.qty}
                          {"  "}
                          <Icon
                            name="remove"
                            type="font-awesome"
                            color="red"
                            size={14}
                            onPress={() => {
                              Alert.alert(
                                i18n.t("confirmation"),
                                i18n.t("confirmDelete", { index: index + 1 }),
                                [
                                  {
                                    text: i18n.t("cancel"),
                                    onPress: () => null,
                                    style: "cancel",
                                  },
                                  {
                                    text: i18n.t("yes"),
                                    onPress: () => {
                                      const { removeLotList } = this.state;
                                      const { isStockExported } = m;

                                      if (isStockExported) {
                                        Alert.alert(i18n.t("materialExported"));
                                        return;
                                      }

                                      removeLotList.push(
                                        pickedMaterials[index]
                                      );

                                      pickedMaterials.splice(index, 1);

                                      this.setState({
                                        ...this.state,
                                        pickedMaterials,
                                        removeLotList,
                                      });
                                    },
                                  },
                                ]
                              );
                              return true;
                            }}
                          />
                          {"\n"}
                        </Text>
                      ))}
                  </Text>

                  <FlatList
                    nestedScrollEnabled={true}
                    style={{
                      marginTop: 0,
                      marginLeft: 10,
                      marginRight: 10,
                      marginBottom: 50,
                    }}
                    keyExtractor={(item) => item._id}
                    data={stockList}
                    ListHeaderComponent={StockList_Header}
                    stickyHeaderIndices={[0]}
                    renderItem={(item) => {
                      const { location, lotNo, lotDate, expirationDate, qty } = item.item;
                      
                      return (
                        <View style={{ ...styles.view }}>
                          <View
                            style={{
                              ...styles.item,
                              backgroundColor: item.index % 2 === 0 ? "white" : "#ECECEC",
                              width: "15%",
                              height: "100%",
                              lineHeight: 10,
                            }}
                          >
                            <Text style={{ fontSize: 11, alignSelf: "center" }}>
                              {location}
                            </Text>
                          </View>

                          <View
                            style={{
                              ...styles.item,
                              backgroundColor: item.index % 2 === 0 ? "white" : "#ECECEC",
                              width: "20%",
                              height: "100%",
                              lineHeight: 10,
                            }}
                          >
                            <Text style={{ fontSize: 11, alignSelf: "center" }}>
                              {lotNo}
                            </Text>
                          </View>

                          <View
                            style={{
                              ...styles.item,
                              backgroundColor: item.index % 2 === 0 ? "white" : "#ECECEC",
                              width: "25%",
                              height: "100%",
                              lineHeight: 10,
                            }}
                          >
                            <Text style={{ alignSelf: "center", fontSize: 11 }}>
                              {lotDate ? dateFormat.format(new Date(lotDate), "DD-MM-YYYY HH:mm") : "-"}
                            </Text>
                          </View>

                          <View
                            style={{
                              ...styles.item,
                              backgroundColor: item.index % 2 === 0 ? "white" : "#ECECEC",
                              width: "25%",
                              height: "100%",
                              lineHeight: 10,
                            }}
                          >
                            <Text style={{ alignSelf: "center", fontSize: 11 }}>
                              {expirationDate ? dateFormat.format(new Date(expirationDate), "DD-MM-YYYY HH:mm") : "-"}
                            </Text>
                          </View>
                          
                          <View
                            style={{
                              ...styles.item,
                              backgroundColor: item.index % 2 === 0 ? "white" : "#ECECEC",
                              width: "15%",
                              height: "100%",
                              lineHeight: 10,
                            }}
                          >
                            <Text style={{ alignSelf: "center", fontSize: 11 }}>
                              {qty}
                            </Text>
                          </View>
                        </View>
                      );
                    }}
                    onEndReachedThreshold={0.1}
                  />
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>

        {/* pick material modal */}
        <View style={modalStyle.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={pickMaterialModalVisible}
            onRequestClose={() => {
              this.setState({ pickMaterialModalVisible: false });
            }}
          >
            <View style={modalStyle.centeredView}>
              <View style={modalStyle.pickMaterialModalView}>
                <View style={{ ...styles.elementView, paddingTop: 10 }}>
                  <Text style={{ fontWeight: "bold" }}>
                    {i18n.t("materialProductCode")}:{"  "}
                  </Text>
                  <TextInput
                    style={{
                      ...styles.input,
                      width: 150,
                      height: 30,
                      margin: 0,
                      padding: 0,
                    }}
                    autoFocus={true}
                    ref={this.materialProductRef}
                    value={materialProductCode}
                    onChangeText={async (valueText) => {
                      const { stockList } = this.state;
                      const locationListOptions = [];
                      const value = valueText.split(" ");

                      let lotNo = "";
                      let lotDate = "";
                      let productCode = "";                     
                      let qty = "";
                      let location = "";

                      if (valueText.indexOf(" ") > 0) {
                        if (value.length === 4) {
                          lotNo = value[0];
                          const dateString = value[1];                 
                          lotDate = new Date(
                            parseInt(dateString.substr(0, 4)), 
                            parseInt(dateString.substr(4, 2)) - 1,
                            parseInt(dateString.substr(6, 2))
                          );                  
                          productCode = value[2];
                          qty = value[3];                      
                        }
                      } else {
                        productCode = valueText;
                      }

                      if (productCode !== this.state.productCode) {
                        Alert.alert(i18n.t("wrongMaterial"));

                        this.setState({
                          ...this.state,
                          materialProductCode: "",
                          newLotNo: "",
                          newLotQty: "",
                          newLotDate: "",
                          location: "",
                          locationListOptions: [],
                        });

                        this.materialProductRef.current.focus();
                        return;
                      }

                      const currentStockList = stockList;

                      for (const stock of currentStockList) {
                        const { location } = stock;

                        if (
                          !locationListOptions.some((l) => l.value === location)
                        ) {
                          locationListOptions.push({
                            key: location,
                            text: location,
                            value: location,
                          });
                        }
                      }

                      location = locationListOptions.length
                        ? locationListOptions[0].value
                        : "";
                      const { pickedMaterials } = this.state;

                      if (isAutoGetLot) {
                        // validate valid location
                        // [!] must use filter because have case multiple line stock
                        const stockInLocations = stockList;

                        if (!stockInLocations.length) {
                          Alert.alert(i18n.t("stockNotFound", { location }));
                          return;
                        }

                        const totalStockQty = stockInLocations.reduce(
                          (acc, curr) => acc + curr.qty,
                          0
                        );
                        const pickedLotInLocation = pickedMaterials.filter(
                          (p) => p.location === location && p.lotNo === lotNo
                        );
                        const totalPickedQty = pickedLotInLocation.reduce(
                          (acc, curr) =>
                            acc + Number(String(curr.qty).replace(/\,/, "")),
                          0
                        );
                        const newTotalQty =
                          Number(totalPickedQty) +
                          Number(String(qty).replace(/\,/, ""));

                        if (newTotalQty > totalStockQty) {
                          Alert.alert(
                            i18n.t("stockNotEnoughInLoc", {
                              location,
                              stockQty: totalStockQty,
                            })
                          );

                          this.setState({
                            ...this.state,
                            materialProductCode: productCode,
                            newLotNo: lotNo,
                            newLotQty: qty,
                            newLotDate: lotDate,
                            location,
                            locationListOptions,
                          });

                          return;
                        }

                        pickedMaterials.push({
                          productCode,
                          lotNo,
                          lotDate,
                          qty,
                          location,
                          newPicked: true,
                        });

                        // pick and reset scanned information
                        this.setState({
                          ...this.state,
                          pickedMaterials,
                          materialProductCode: "",
                          newLotNo: "",
                          newLotQty: "",
                          newLotDate: "",
                          mng: "",
                          location: "",
                          locationListOptions: [],
                        });

                        this.materialProductRef.current.focus();
                      } else {
                        this.setState({
                          ...this.state,
                          materialProductCode: productCode,
                          newLotNo: lotNo,
                          newLotQty: qty,
                          newLotDate: lotDate,
                          location,
                          locationListOptions,
                        });

                        return;
                      }
                    }}
                  />
                </View>

                <View style={{ ...styles.elementView, marginBottom: 5 }}>
                  <Text style={{ fontWeight: "bold" }}>
                    {i18n.t("materialLotNo")}:{"  "}
                  </Text>
                  <TextInput
                    style={{ ...styles.input, width: 150, height: 30 }}
                    value={newLotNo}
                    onChangeText={(value) => {
                      this.setState({
                        ...this.state,
                        newLotNo: value,
                      });
                    }}
                  />
                </View>
                
                <View style={{ ...styles.elementView, marginBottom: 5 }}>
                  <Text style={{ fontWeight: "bold" }}>
                    {i18n.t("materialLotDate")}:{"  "}
                  </Text>
                  <TextInput
                    style={{ ...styles.input, width: 150, height: 30 }}
                    value={newLotDate ? dateFormat.format(new Date(newLotDate), "DD-MM-YYYY") : ""}
                    onChangeText={(value) => {
                      this.setState({
                        ...this.state,
                        newLotDate: value,
                      });
                    }}
                  />
                </View>

                <View style={{ ...styles.elementView, marginBottom: 5 }}>
                  <Text style={{ fontWeight: "bold" }}>
                    {i18n.t("qtyOfLot")}:{"  "}
                  </Text>
                  <TextInput
                    style={{ ...styles.input, width: 150, height: 30 }}
                    value={String(newLotQty)}
                    keyboardType="number-pad"
                    onChangeText={(value) => {
                      this.setState({
                        ...this.state,
                        newLotQty: value,
                      });
                    }}
                  />
                </View>

                <View>
                  <Text style={{ fontWeight: "bold" }}>
                    {i18n.t("location")}:{"  "}
                  </Text>
                  <View
                    style={{
                      marginBottom: 5,
                      borderWidth: 1,
                      borderColor: "#22242626",
                      borderRadius: 5,
                    }}
                  >
                    <Picker
                      style={{ width: 150, height: 30 }}
                      selectedValue={location}
                      mode="dropdown"
                      onValueChange={(itemValue, itemPosition) =>
                        this.setState({ ...this.state, location: itemValue })
                      }
                    >
                      {locationListOptions &&
                        locationListOptions.map((item, index) => {
                          return (
                            <Picker.Item
                              key={item.key}
                              color="#0087F0"
                              label={`${item.text}`}
                              value={item.value}
                              index={index}
                            />
                          );
                        })}
                    </Picker>
                  </View>
                </View>

                <View
                  style={{ flexDirection: "row", justifyContent: "flex-start" }}
                >
                  {canPick ? (
                    <View style={styles.buttonLayout}>
                      <Button
                        disabled={!canPick}
                        style={{ ...styles.button }}
                        onPress={async () => {
                          const {
                            materialProductCode,
                            newLotNo,
                            newLotQty,
                            newLotDate,
                            pickedMaterials,
                            stockList,
                            location,
                          } = this.state;

                          pickedMaterials.push({
                            productCode: materialProductCode,
                            lotNo: newLotNo,
                            qty: newLotQty,
                            lotDate: newLotDate,
                            location,
                            newPicked: true,
                          });

                          this.setState({
                            ...this.state,
                            pickedMaterials,
                            materialProductCode: "",
                            newLotNo: "",
                            newLotQty: "",
                            newLotDate: "",
                            location: "",
                            locationListOptions: [],
                          });

                          this.materialProductRef.current.focus();
                        }}
                      >
                        {i18n.t("pick")}
                      </Button>
                    </View>
                  ) : null}

                  <View style={styles.buttonLayout}>
                    <Button
                      style={styles.backButton}
                      onPress={() => {
                        this.setState({
                          pickMaterialModalVisible: false,
                          materialProductCode: "",
                          newLotNo: "",
                          newLotDate: "",
                          newLotQty: "",
                          location: "",
                          locationListOptions: [],
                        });
                      }}
                    >
                      {i18n.t("cancel")}
                    </Button>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ThisContext.Provider>
    );
  }
}
