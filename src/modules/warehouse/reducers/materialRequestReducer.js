
import { createInitialState } from "../../../libs/reducerHelper";
import {
  AUTH_CLEAR_LOGIN_ERROR_MESSAGE, AUTH_ERR_LOG_IN,
  AUTH_LOGGED_IN, AUTH_LOGGING_IN, AUTH_LOGOUT,
} from "../constants/auth";
import { model } from "../models/materialRequestModel";

const INITIAL_STATE = createInitialState(model);

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_LOGOUT: {
      return {
        ...INITIAL_STATE,
      };
    }
    case AUTH_CLEAR_LOGIN_ERROR_MESSAGE: {
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
        token: action.payload.access_token,
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
