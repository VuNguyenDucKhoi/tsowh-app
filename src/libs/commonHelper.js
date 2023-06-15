import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationActions } from "react-navigation";
import axios from "axios";
import { API_URL } from "../constants/config";

export const LOADING_STATE = {
  loading: true,
  error: false,
  success: false,
  messages: "",
};

// const WO_FUNCTION_ID = '62962401624a4b005e7c7b19'; // DEV
const WO_FUNCTION_ID = "62df4917076b6b0035b9d632"; // PRODUCTION

export const getToken = async () => await AsyncStorage.getItem("access_token");
export const getFunctionId = async () => (await AsyncStorage.getItem("functionId")) || WO_FUNCTION_ID;
export const removeToken = async () => await AsyncStorage.removeItem("access_token");

export const checkAsyncStorage = async () => {
  const token = await AsyncStorage.getItem("access_token");
  return { token };
};

function login(email, password) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/v1/users/login`, {
        credentials: {
          userName: email,
          password,
        },
      })
      .then(async (response) => {
        resolve(response);
        await AsyncStorage.setItem("access_token", response.data.data.token);
      })
      .catch((err) => {
        console.log("err :", JSON.stringify(err));
        reject(err);
      });
  });
}

async function logout(getState) {
  return new Promise(async (resolve, reject) => {
    try {
      const currentState = await getState();
      const { token } = currentState.warehouse_signin;

      await AsyncStorage.removeItem("access_token")
        .then(async (response) => {
          resolve(response);
        })
        .catch((err) => {
          console.log("error logout :", err);
          reject(err);
        });

      console.log("logout success");
    } catch (error) {
      console.log("error : ", error);
    }
  });
}

export const userService = { login, logout };

export const validate = (val, rules, connectedValue) => {
  let isValid = true;

  for (let rule in rules) {
    switch (rule) {
      case "isEmail":
        isValid = isValid && emailValidator(val);
        break;
      case "minLength":
        isValid = isValid && minLengthValidator(val, rules[rule]);
        break;
      case "equalTo":
        isValid = isValid && equalToValidator(val, connectedValue[rule]);
        break;
      case "notEmpty":
        isValid = isValid && notEmptyValidator(val);
        break;
      default:
        isValid = true;
    }
  }

  return isValid;
};

const emailValidator = (val) => {
  return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
    val
  );
};

const minLengthValidator = (val, minLength) => { return val.length >= minLength; };
const equalToValidator = (val, checkValue) => { return val === checkValue; };
const notEmptyValidator = (val) => { return val.trim() !== ""; };

let _navigator;

export function setTopLevelNavigator(navigatorRef) { _navigator = navigatorRef; }

export function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

export const equalToId = (id, otherId) => {
  if (!id || !otherId) { return false }
  return (String(id) === String(otherId));
};
