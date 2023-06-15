import { DATA_TYPE } from "../../../constants/dataType";

export const model = {
  stateName: "stockPickups",
  modelName: "v1/stockPickups",

  data: {
    _id: { type: DATA_TYPE.ID, defaultValue: "0", required: true },
    documentNo: { type: DATA_TYPE.STRING },
  },

  query: {
    fields: {
      type: DATA_TYPE.ARRAY,
      defaultValue: ["documentNo", "active"],
    },

    sortBy: {
      type: DATA_TYPE.STRING,
      defaultValue: "documentNo.asc",
    },
  },

  apiEndpoint: {
    create: "v1/stockPickups",
    read: "v1/stockPickups/",
    readOne: "v1/stockPickups",
    count: "v1/stockPickups",
    update: "v1/stockPickups",
    delete: "v1/stockPickups",
  },
};
export default model;
