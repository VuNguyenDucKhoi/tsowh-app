import { StyleSheet } from "react-native";
import { Colors } from "../../../constants/config";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 10,
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bgImage: {
    flex: 1,
    justifyContent: "flex-start",
  },
  inputContainer: {
    width: "100%",
    paddingBottom: 30,
    paddingLeft: 15,
    paddingRight: 15,
  },
});

export { styles };
