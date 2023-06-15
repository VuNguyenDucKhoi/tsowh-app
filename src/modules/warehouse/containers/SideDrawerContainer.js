import { connect } from "react-redux";

import { getStateProps } from "../../../libs/listContainerHelper";
import SideDrawer from "../components/SideDrawer";
import { moduleConfig } from "../moduleConfig";
import { logout } from "../actions/authAction";
import { model } from "../models/signinModel";

function mapStateToProps(state) {
  return getStateProps(state, moduleConfig.moduleCode, model.stateName);
}

function mapDispatchToProps(dispatch) {
  return {
    onLogout: () => dispatch(logout()),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(SideDrawer);
