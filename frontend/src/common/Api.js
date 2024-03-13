import axios from "axios";
export const APIURL = "http://138.201.127.162:8080";
// export const APIURL = "http://localhost:8080";

export const findApi = async (payload) => {
  try {
    const response = await axios.post(`${APIURL}/api/dataset/search`, payload);
    console.log("response :", response);
    return response?.data;
  } catch (error) {
    console.log("Catch Error : ", error);
    return {};
  }
};

export const countApi = async (payload) => {
  try {
    const response = await axios.post(`${APIURL}/api/dataset/count`, payload);
    console.log("response :", response);
    return response?.data;
  } catch (error) {
    console.log("Catch Error : ", error);
    return {};
  }
};
