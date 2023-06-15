import { cloneDeep } from "lodash";

export function createInitialState(model) {
  const modelName = model.modelName || "";
  let apiEndpoint = model.apiEndpoint;
  const fields = [];

  if (model.query && model.query.fields) {
    const { defaultValue } = model.query.fields;
    fields.push(...defaultValue);
  }

  if (!apiEndpoint) {
    const endpoint = "v1/shipment_urbans";

    apiEndpoint = {
      create: `${endpoint}`,
      read: `${endpoint}`,
      update: `${endpoint}`,
      delete: `${endpoint}`,
    };
  }
  
  return {
    modelName,
    apiEndpoint,
    manipulation: {},
    objectList: [],
    query: null,
    pageLoad: null,
    fields,
    prevObjectId: "",
    objectId: "",
  };
}

export function getNewState(state, ACTIONS, action) {
  switch (action.type) {
    case MASTER_PAGE_ACTIONS[CHANGE_CURRENT_FUNCTION]: {
      // change function => clear all query state
      const defaultQuery = cloneDeep(state.defaultQuery);

      return {
        ...state,
        query: defaultQuery,
        objectList: {},
      };
    }

    case ACTIONS[SAVE_QUERY_STATE]: {
      const {
        queryList,
        selectedQueryId,
        query,
        objectList,
        pageLoad,
        prevObjectId,
        objectId,
        nextObjectId,
      } = action.payload;

      return {
        ...state,
        queryList,
        selectedQueryId,
        query,
        objectList,
        pageLoad,

        prevObjectId,
        objectId,
        nextObjectId,
      };
    }

    case ACTIONS[SAVE_OBJECT_SURFFING_STATE]: {
      const { prevObjectId, objectId, nextObjectId } = action.payload;

      return {
        ...state,
        prevObjectId,
        objectId,
        nextObjectId,
      };
    }

    default:
      return state;
  }
}
