import React from "react";
import { checkAsyncStorage } from "../../../libs/commonHelper";
import { navigate } from "../../../libs/commonHelper";
import SigninContainer from "../containers/SigninContainer";

export default class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
  }

  componentWillUnmount() {
    this.bootstrapAsync();
  }
  
  bootstrapAsync = async () => {
    const userStorage = await checkAsyncStorage();

    this.props.loggedIn({
      access_token: userStorage.token,
    });
    
    navigate(userStorage.token ? "App" : "Auth", {});
  };

  render() {
    return <SigninContainer />;
  }
}
