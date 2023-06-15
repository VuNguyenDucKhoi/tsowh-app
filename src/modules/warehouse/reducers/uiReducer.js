import { createInitialState } from "../../../libs/reducerHelper";
import { UI_START_LOADING, UI_STOP_LOADING } from "../actions/actionTypes";
import { model } from "../models/signinModel";

const INITIAL_STATE = createInitialState(model);

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UI_START_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case UI_STOP_LOADING:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default reducer;
