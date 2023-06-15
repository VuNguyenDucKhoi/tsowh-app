
import { getStateName, stateSelector } from './containerHelper';

export const getStateProps = (state, moduleName, modelName) => {
  const stateName = getStateName(moduleName, modelName);
  return stateSelector(state[stateName], state.warehouse_signin, stateName);
};