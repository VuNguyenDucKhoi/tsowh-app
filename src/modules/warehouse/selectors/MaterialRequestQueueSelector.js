import { View } from "react-native";
import { Text } from "native-base";
import i18n from "../../../../utils/i18n";
import { styles } from "../../../styles/css";

export const FlatList_Header = () => {
  return (
    <View
      style={{
        height: 60,
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
          width: "25%",
          height: "100%",
          padding: 10,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 10,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {i18n.t("documentNo")}
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
            fontSize: 10,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {i18n.t("documentDate")}
        </Text>
      </View>

      <View
        style={{
          ...styles.item,
          width: "25%",
          height: "100%",
          padding: 11,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 10,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {i18n.t("requestedBy")}
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
            fontSize: 10,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {i18n.t("requestedAt")}
        </Text>
      </View>
    </View>
  );
};
