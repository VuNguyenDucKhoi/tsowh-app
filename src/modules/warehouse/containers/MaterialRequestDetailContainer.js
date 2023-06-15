import { connect } from "react-redux";
import { connectActionSheet } from "@expo/react-native-action-sheet";

import { getStateProps } from "../../../libs/listContainerHelper";
import { model } from "../models/materialRequestModel";
import { moduleConfig } from "../moduleConfig";
import MaterialRequestDetail from "../components/MaterialRequestDetail";

function mapStateToProps(state) {
  const props = getStateProps(state, moduleConfig.moduleCode, model.stateName);
  return props;
}

function mapDispatchToProps(dispatch) {
  return {};
}
const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(MaterialRequestDetail);

export default connectActionSheet(ConnectedApp);
