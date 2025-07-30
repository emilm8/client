import { axiosInstance } from "../config/axiosInstance";
import configObj from "../config/config";
import { Cookies } from "react-cookie";

const tokenEnv = configObj.token;

const authVerify = async () => {
    const cookies = new Cookies();
    const token = cookies.get(`${tokenEnv}`);
    if (!token) {
        return false;
    }
    try {
        const response = await axiosInstance.get('/auth/verify-token', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        cookies.set("username", response.data.user_login)
        

        if (response.data.status == true) {
            return true;
        }

        return false;

    } catch (error) {
        return false;
    }
};

export default authVerify;
