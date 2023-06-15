
import { createInitialState } from "../../../libs/reducerHelper";
import {
  AUTH_CLEAR_LOGIN_ERROR_MESSAGE, AUTH_ERR_LOG_IN,
  AUTH_LOGGED_IN, AUTH_LOGGING_IN, AUTH_LOGOUT,
} from "../constants/auth";
import { model } from "../models/signinModel";


const INITIAL_STATE = createInitialState(model);

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_LOGOUT: {
      return {
        ...INITIAL_STATE,
      };
    }
    case AUTH_CLEAR_LOGIN_ERROR_MESSAGE: {
      console.log("vào xóa error message");
      return {
        ...state,
        errorMessage: "",
      };
    }
    case AUTH_LOGGING_IN:
      return {
        ...state,
        loggingIn: true,
      };
    case AUTH_LOGGED_IN:
      return {
        ...state,
        // user: action.payload.user,
        // token: action.payload.token,
        token: action.payload.access_token,
        userName: action.payload.userName,
        loggingIn: false,
      };
    case AUTH_ERR_LOG_IN:
      return {
        ...state,
        loggingIn: false,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
}
