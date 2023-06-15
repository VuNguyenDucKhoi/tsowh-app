import { connect } from "react-redux";
import AuthLoading from "../components/AuthLoading";
import { loggedIn } from "../actions/authAction";

function mapStateToProps(state) {
  return { state };
}

function mapDispatchToProps(dispatch) {
  return {
    loggedIn: (authData) => dispatch(loggedIn(authData)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoading);
