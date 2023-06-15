import axios from "axios";
import { API_URL, API_UPIMAGE_URL } from "../constants/config";
import { getToken, getFunctionId } from "./commonHelper";
import FormData from "form-data";

export async function apiGetList(endPoint, query) {
  let queryString = "?" + query;
  return apiGet(endPoint, queryString);
}

export const getRequestHeader = async (clientContext = {}) => {
  const { functionId, policyContext } = clientContext;
  return {
    Authorization: `Bearer ${(await getToken()) || "jwt.token.here"}`,
    "x-function-id": functionId || (await getFunctionId()),
    "x-policy-context": policyContext || "",
    "x-trace-id": /* uuidv4() ||  */ "",
    // [!] TODO: Accept-Language bind to web language
  };
};

export async function apiGet(endPoint, queryString) {
  try {
    const result = await axios({
      method: "GET",
      url: `${API_URL}/${endPoint}${queryString}`,
      headers: await getRequestHeader(),
    });

    return result.data;
  } catch (error) {
    return { error: error.response ? error.response : error };
  }
}

export async function apiUpdateImage(endPoint, object, images) {
  try {
    let data = new FormData();
    let flag_ImgExist = false;
    let newImages = [];

    images.map((image) => {
      if (image.source.id === "") {
        data.append("file", {
          uri:
            Platform.OS === "android"
              ? image.source.uri.includes("file:///")
                ? image.source.uri.replace("file:///", "file:/")
                : image.source.uri
              : image.source.uri.replace("file://", ""),
          name: image.source.uri.split("/").pop(),
          type: "image/jpeg",
        });

        flag_ImgExist = true;
      }
    });

    if (flag_ImgExist) {
      const resultUpImages = await axios({
        method: "POST",
        url: API_UPIMAGE_URL,
        data,
      });

      resultUpImages.data.data.map((resultObject) => {
        newImages.push(resultObject.id);
      });
    }

    if (object.note_detail === null) {
      object.note_detail = "";
    }

    const result = await axios.post(
      `${API_URL}/${endPoint}/${object.id}`,
      {
        images: newImages,
        note_detail: object.note_detail,
      },
      { headers: await getRequestHeader() }
    );

    return result.data;
  } catch (error) {
    return { error: error.response ? error.response : error };
  }
}

export const apiPost = async (endPoint, data, clientContext) => {
  try {
    const result = await axios({
      method: "POST",
      data,
      url: `${API_URL}/${endPoint}/`,
      headers: await getRequestHeader(),
    });

    return { data: result.data };
  } catch (error) {
    return { error: error.response || error };
  }
};

export async function apiUpdateById(endPoint, objectId, object) {
  return apiUpdate(endPoint, objectId, object);
}

export async function apiUpdate(endPoint, objectId, object) {
  try {
    const result = await axios({
      method: "PUT",
      url: `${API_URL}/${endPoint}/${objectId}`,
      data: object,
      headers: await getRequestHeader(),
    });

    return { data: result.data };
  } catch (error) {
    return { error: error.response ? error.response : error };
  }
}

export async function apiUpdateReceiverById(endPoint, objectId, receiver, phone) {
  try {
    const result = await axios.post(
      `${API_URL}/${endPoint}/${objectId}`,
      {
        address_contact_name: receiver,
        address_contact_phone: phone,
      },
      { headers: await getRequestHeader() }
    );

    return { data: result.data };
  } catch (error) {
    return { error: error.response ? error.response : error };
  }
}
export async function apiUpdateNoteById(endPoint, objectId, note_detail) {
  try {
    const result = await axios.post(
      `${API_URL}/${endPoint}/${objectId}`,
      {
        note_detail: note_detail,
      },
      { headers: await getRequestHeader() }
    );

    return { data: result.data };
  } catch (error) {
    return { error: error.response ? error.response : error };
  }
}

export async function apiGetById(endPoint, objectId) {
  const query = "/" + objectId;
  return apiGet(endPoint, query);
}
