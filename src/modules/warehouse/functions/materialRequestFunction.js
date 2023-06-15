
import uuid from "react-native-uuid";
import { debounce } from "lodash";
import { Alert } from "react-native";
import qs from "qs";

import i18n from "../../../../utils/i18n";
import { equalToId } from "../../../libs/commonHelper";
import { apiGet, apiGetById, apiPost } from "../../../libs/apiHelper";

const pickMaterial = async (self) => {
  const {
    pickedMaterials, productCode, objectId, 
    removeLotList, object,
  } = self.state;
  
  const requestId = uuid.v4();

  let { error, data } = await apiGetById("v1/stockPickups", objectId);

  if (error) {
    Alert.alert(i18n.t("serverError"));
    return;
  }

  const { materialList } = data;
  const deleteLotList = [];
  const addingMaterialList = [];

  const index = materialList.findIndex(
    (m) => m.productCode === productCode
  );
  const currentMaterial = materialList[index];
  const { _id: materialId, locationList } = currentMaterial;

  for (const pickedMaterial of pickedMaterials) {
    const { productCode, lotNo, qty, location, newPicked } = pickedMaterial;

    if (newPicked) {
      if (index > -1) {
        const query = { productCode, lotNo, location };
        const stock = await apiGet(
          "v1/stockPickups/getStockAddingMaterialList",
          `?${qs.stringify(query)}`
        );

        if (stock.length > 0) {
          const { 
            companyId, companyCode, companyName,
            expirationDate, lotDate, 
            storeId, storeCode, storeName,            
            storeTypeId, storeTypeCode, storeTypeName,
            warehouseId, warehouseCode, warehouseName, 
          } = stock[0];

          addingMaterialList.push({
            companyId, companyCode, companyName,
            expirationDate, location, lotDate,
            lotNo, qty, storeId, storeCode, storeName,            
            storeTypeId, storeTypeCode, storeTypeName,
            warehouseId, warehouseCode, warehouseName,
          });
        }
      }
    }
  }

  let currentLotList = locationList;

  if (removeLotList && removeLotList.length > 0) {
    for (const removeLot of removeLotList) {
      const { location, lotNo, qty } = removeLot;
      const index = currentLotList.findIndex(
        (c) =>
          c.location === location &&
          c.lotNo === lotNo &&
          c.qty === qty
      );

      if (index > -1) {
        const currentLot = currentLotList[index];

        deleteLotList.push(currentLot._id);
        currentLotList.splice(index, 1);
      }
    }
  }

  const postData = {
    _id: objectId,
    updateMaterialList: [
      {
        _id: materialId,
        insertLotList: addingMaterialList,
        deleteLotList,
      },
    ]
  };

  ({ error, data } = await apiPost(
    `v1/stockPickups/updateLot/${objectId}`,
    postData
  ));

  await self.setState({
    ...self.state,
    object: {
      ...self.state.object,
      ...data.data,
    },
    pickedMaterials: [],
    productCode: "",
    pickMaterialModalVisible: false,
    modalVisible: false,
    removeLotList: [],
    lotNoList: [],
    loadingReloadStock: false,
    isAutoGetLot: true,
    isLoading: false,
    success: true,
    messages: i18n.t("updateSuccess"),
  });
};

export const onConfirmPickMaterial = async (self) => {
  console.log("🚀 ~ file: materialRequestFunction.js:127 ~ onConfirmPickMaterial ~ self:", self)
  const { isLoading } = self.state;
  if (isLoading) return;

  self.setState({ ...self.state, isLoading: true });

  const confirmPick = debounce(async () => {
    await pickMaterial(self);
    return;
  }, 300);

  const { pickedMaterials, requestedQty } = self.state;

  if (requestedQty) {
    let realityQty = pickedMaterials.reduce(
      (acc, curr) => acc + Number(String(curr.qty).replace(/\,/, "")), 0
    );

    if (Number(realityQty) > Number(requestedQty)) {
      Alert.alert(
        i18n.t("pickMaterialConfirm"),
        i18n.t("pickingMoreThanRequest"),
        [
          {
            text: i18n.t("cancel"),
            onPress: () => {
              self.setState({ ...self.state, isLoading: false });
              return;
            },
            style: "cancel",
          },
          {
            text: i18n.t("yes"),
            onPress: confirmPick,
          },
        ]
      );

      return;
    } else if (Number(realityQty) < Number(requestedQty)) {
      Alert.alert(
        i18n.t("pickMaterialConfirm"),
        i18n.t("pickingLessThanRequest"),
        [
          {
            text: i18n.t("cancel"),
            onPress: () => {
              self.setState({ ...self.state, isLoading: false });
              return;
            },
            style: "cancel",
          },
          {
            text: i18n.t("yes"),
            onPress: confirmPick,
          },
        ]
      );

      return;
    } else {
      confirmPick();
      return;
    }
  } else {
    confirmPick();
    return;
  }
};

export const updateMaterialList = async (self) => {
  const { object } = self.state;
  const { materialList } = object;
  let productIdList = materialList.map((m) => m.productId);
  let query = {
    productId: productIdList,
    storeCode: { $eq: "NL" },
    sortBy: "lotDate.asc",
  };

  const stockList = await apiGet(
    "v1/stockPickups/getStockQty", `?${qs.stringify(query)}`
  );

  if (stockList) {
    for (let material of materialList) {
      const { productId } = material;
      const storeList = stockList.filter((s) =>
        equalToId(s.productId, productId)
      );

      let stockQty = storeList.reduce((acc, val) => acc + Number(val.qty), 0);
      material.stockQty = stockQty;
    }
  }

  await self.setState({
    ...self.state,
    object: {
      ...self.state.object,
      materialList,
    },
  });
};
