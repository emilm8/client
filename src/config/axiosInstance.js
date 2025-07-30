import axios from "axios";
import configObj from "./config";
import { Cookies } from "react-cookie";

const cooki = new Cookies();
const token = cooki.get(configObj.token);

const axiosInstanceMultiPart = axios.create({
    baseURL: `https://${configObj.baseurl}`,
    headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": token ? `Bearer ${token}` : undefined
    }
});

const axiosInstance = axios.create({
    baseURL: `https://${configObj.baseurl}`,
    headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : undefined
    }
});

export { axiosInstance, axiosInstanceMultiPart };
