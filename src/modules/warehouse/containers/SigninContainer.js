import { connect } from "react-redux";

import { getStateProps } from "../../../libs/listContainerHelper";
import { clearLoginErrorMessage, login } from "../actions/authAction";
import Signin from "../components/Signin";
import { model } from "../models/signinModel";
import { moduleConfig } from "../moduleConfig";

const mapStateToProps = (state) => {
  return getStateProps(state, moduleConfig.moduleCode, model.stateName);
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAuth: (authData) => dispatch(login(authData)),
    clearLoginErrorMessage: () => dispatch(clearLoginErrorMessage()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
