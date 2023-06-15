import { DATA_TYPE } from "../../../constants/dataType";

export const model = {
  stateName: "signin",
  modelName: "v1/signin",
  data: {
    _id: { type: DATA_TYPE.ID, defaultValue: "0", required: true },
    orderName: { type: DATA_TYPE.STRING },
  },
};
export default model;
