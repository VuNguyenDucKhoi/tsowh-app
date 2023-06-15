import { connect } from "react-redux";
import { connectActionSheet } from "@expo/react-native-action-sheet";

import { getStateProps } from "../../../libs/listContainerHelper";
import { model } from "../models/materialRequestModel";
import { moduleConfig } from "../moduleConfig";
import { logout } from "../actions/authAction";
import MaterialRegister from "../components/MaterialRegister";

function mapStateToProps(state) {
  const props = getStateProps(state, moduleConfig.moduleCode, model.stateName);
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    onLogout: () => dispatch(logout()),
  };
}
const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(MaterialRegister);

export default connectActionSheet(ConnectedApp);
