import { createSelector } from 'reselect';

export const getStateName = (moduleName, modelName) => `${moduleName}_${modelName.replace('/', '_')}`;

// selectors
const getCurrentState = (currentState) => { return currentState; };
const getSystemState = (currentState, systemState) => systemState;

// expensive calculation
const getFunctionProps = (currentState, systemState) => {
  const { userName } = systemState;

  const {
    modelName,
    apiEndpoint,
    query,
    objectList,
    pageLoad,
    error,
    errorMessage,
    manipulation,
    objectId,
    fields,
  } = currentState;
  
  return {
    userName: userName,
    modelName,
    apiEndpoint,
    query,
    objectList,
    objectId,
    pageLoad,
    error,
    errorMessage,
    manipulation,
    fields,
  };
};

export const stateSelector = createSelector(
  getCurrentState,
  getSystemState,
  getFunctionProps,
  (currentState, systemState, stateName) => stateName
);
