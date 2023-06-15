import {
  AUTH_LOGGING_IN,
  AUTH_LOGGED_IN,
  AUTH_ERR_LOG_IN,
  AUTH_LOGOUT,
  AUTH_CLEAR_LOGIN_ERROR_MESSAGE,
} from '../constants/auth';
import { userService } from '../../../libs/commonHelper';
import { errorParser } from '../../../libs/errorHelper';
import { navigate } from '../../../libs/commonHelper';

export const loggedIn = data => ({
  type: AUTH_LOGGED_IN,
  payload: data,
});

export const clearLoginErrorMessage = () => ({
  type: AUTH_CLEAR_LOGIN_ERROR_MESSAGE,
});

export const errorLogIn = errorMessage => ({
  type: AUTH_ERR_LOG_IN,
  payload: errorMessage,
});

export const loggingIn = () => ({
  type: AUTH_LOGGING_IN,
});

export const loggedOut = () => ({
  type: AUTH_LOGOUT,
});

export const logout = () => async (dispatch, getState) => {
  await userService.logout(getState).then((res) => {
    dispatch(loggedOut());
  }).catch((err) => { console.log('errror : ', err) });
};

export const login = (authData) => (dispatch) => {
  dispatch(loggingIn());
  userService.login(authData.email, authData.password).then(async (res) => {
    const infoData = {
      userName: res.data.data.userName,
      access_token: res.data.data.token
    }
    dispatch(loggedIn(infoData))
    await navigate('App', {});
  }).catch((err) => {
    dispatch(errorLogIn(errorParser.parseLoginError(err).message));
  });
};
