import { connect } from "react-redux";

import { getStateProps } from "../../../libs/listContainerHelper";
import { model } from "../models/materialRequestModel";
import MaterialRequestQueue from "../components/MaterialRequestQueue";
import { moduleConfig } from "../moduleConfig";

function mapStateToProps(state) {
  return getStateProps(state, moduleConfig.moduleCode, model.stateName);
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MaterialRequestQueue);
