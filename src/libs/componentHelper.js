import PropTypes from "prop-types";
import { isArray } from "lodash";

import { getToken, removeToken } from "./commonHelper";

export const LOADING_STATE = {
  isLoading: true,
  error: false,
  success: false,
  messages: "",
};

export const REFRESHING_STATE = {
  isLoading: false,
  error: false,
  success: false,
  messages: "",
};

export const bindComponentToContext = (componentList, context) => {
  if (isArray(componentList)) {
    componentList.forEach((component) => {
      component.contextType = context;
    });
  } else {
    componentList.contextType = context;
  }
};
