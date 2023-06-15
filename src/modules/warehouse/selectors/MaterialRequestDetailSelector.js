import { View } from "react-native";
import { Text } from "native-base";
import i18n from "../../../../utils/i18n";
import { styles } from "../../../styles/css";

export const FlatList_Header = () => {
  return (
    <View
      style={{
        height: 50,
        width: "100%",
        display: "flex",
        backgroundColor: "#6c7ae0",
        alignItems: "flex-start",
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 0,
        marginTop: 10,
      }}
    >
      <View
        style={{
          ...styles.item,
          width: "20%",
          height: "100%",
          paddingTop: 5,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 12,
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
          }}
        >
          {i18n.t("productCode")}
        </Text>
      </View>

      <View
        style={{
          ...styles.item,
          width: "20%",
          height: "100%",
          paddingTop: 5,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 12,
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
          }}
        >
          {i18n.t("productName")}
        </Text>
      </View>

      <View
        style={{
          ...styles.item,
          width: "10%",
          height: "100%",
          paddingTop: 5,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 12,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {i18n.t("requestedQty")}
        </Text>
      </View>

      <View
        style={{
          ...styles.item,
          width: "20%",
          height: "100%",
          paddingTop: 5,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 12,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {i18n.t("stockQty")}
        </Text>
      </View>

      <View
        style={{
          ...styles.item,
          width: "30%",
          height: "100%",
          paddingTop: 5,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 12,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {i18n.t("pickedLotList")}
        </Text>
      </View>
    </View>
  );
};

export const StockList_Header = () => {
  return (
    <View
      style={{
        height: 40,
        width: "100%",
        display: "flex",
        backgroundColor: "#6c7ae0",
        alignItems: "flex-start",
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 0,
      }}
    >
      <View
        style={{
          ...styles.item,
          width: "15%",
          height: "100%",
          padding: 10,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 12,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {i18n.t("location")}
        </Text>
      </View>

      <View
        style={{
          ...styles.item,
          width: "20%",
          height: "100%",
          padding: 10,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 12,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {i18n.t("lotNo")}
        </Text>
      </View>

      <View
        style={{
          ...styles.item,
          width: "25%",
          height: "100%",
          padding: 10,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 12,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {i18n.t("lotDate")}
        </Text>
      </View>

      <View
        style={{
          ...styles.item,
          width: "25%",
          height: "100%",
          padding: 10,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 12,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {i18n.t("expirationDate")}
        </Text>
      </View>
      
      <View
        style={{
          ...styles.item,
          width: "15%",
          height: "100%",
          padding: 10,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 12,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {i18n.t("quantity")}
        </Text>
      </View>
    </View>
  );
};
