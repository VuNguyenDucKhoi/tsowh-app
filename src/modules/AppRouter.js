import React from "react";
import { Platform, Dimensions, BackHandler } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Icon } from "react-native-elements";
import { Text } from "native-base";

import i18n from "../../utils/i18n";

import SigninScreen from "./warehouse/screens/SigninScreen";
import MaterialRequestQueueScreen from "./warehouse/screens/MaterialRequestQueueScreen";
import MaterialRequestDetailScreen from "./warehouse/screens/MaterialRequestDetailScreen";
import SideDrawerScreen from "./warehouse/screens/SideDrawerScreen";
import AuthLoadingScreen from "./warehouse/screens/AuthLoadingScreen";

import HeaderButton from "../userControls/HeaderButton";
import TopBarTitle from "../userControls/TopBarTitle";
import { Colors } from "../constants/config";

const defaultStackNavOptions = (params) => {
  let functionName;

  switch (params.navigation.state.routeName) {
    case "Home":
      functionName = "Warehouse";
      break;
    case "MaterialRequestQueue":
      functionName = i18n.t("materialRequestQueue");
      break;
    case "MaterialRequestDetail":
      functionName = i18n.t("materialRequestDetail");
      break;
  }

  return {
    headerStyle: {
      backgroundColor: Platform.OS === "android" ? Colors.transparentColor : "",
    },
    headerBackTitleStyle: {
      fontFamily: "open-sans",
      Colors: Colors.logoColor,
    },
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="back"
          iconName="ios-arrow-back"
          buttonStyle={{ color: Colors.logoColor }}
          onPress={() => {
            params.navigation.goBack();
          }}
        />
      </HeaderButtons>
    ),
    headerTintColor: Colors.logoColor,
    headerTitle: () => <TopBarTitle functionName={functionName} />,
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Icon
          name="user-circle"
          style={{ marginRight: 10 }}
          color={Colors.logoColor}
          type="font-awesome"
          onPress={() => {}}
        />
        <Text>{"  "}</Text>
      </HeaderButtons>
    ),
  };
};

const HomeStack = createStackNavigator(
  {
    MaterialRequestQueue: {
      screen: MaterialRequestQueueScreen,
    },
    MaterialRequestDetail: {
      screen: MaterialRequestDetailScreen,
    },
  },
  {
    defaultNavigationOptions: defaultStackNavOptions,
  }
);

const AppStack = createDrawerNavigator(
  {
    Main: {
      screen: HomeStack,
    },
    Signin: {
      screen: SigninScreen,
    },
  },
  {
    contentComponent: SideDrawerScreen,
    drawerWidth: Dimensions.get("window").width * 0.65,
    edgeWidth: -100, // no swipe drawer in each screen
  }
);

const AuthStack = createStackNavigator({ Signin: SigninScreen });

const AppRouter = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: "AuthLoading",
    }
  )
);

export default AppRouter;
