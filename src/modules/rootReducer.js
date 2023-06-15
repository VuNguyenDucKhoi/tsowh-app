import { combineReducers } from "redux";

import uiReducer from "./warehouse/reducers/uiReducer";
import signinReducer from "./warehouse/reducers/signinReducer";
import materialRequestReducer from "./warehouse/reducers/materialRequestReducer";

const rootReducer = combineReducers({
  warehouse_ui: uiReducer,
  warehouse_signin: signinReducer,
  warehouse_stockPickups: materialRequestReducer,
});

export default rootReducer;
