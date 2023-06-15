import React from "react";
import { Provider } from "react-redux";
import { NativeBaseProvider } from "native-base";

import AppRouter from "./src/modules/AppRouter";
import configureStore from "./src/startup/configureStore";
import { setTopLevelNavigator, navigate } from "./src/libs/commonHelper";

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <NativeBaseProvider>
      <AppRouter
        ref={(navigatorRef) => {
          setTopLevelNavigator(navigatorRef);
        }}
      />
    </NativeBaseProvider>
  </Provider>
);
export default App;
