import configObj from "../config/config";
import { Cookies } from "react-cookie";
import toast from "react-hot-toast";
import { axiosInstance } from "../config/axiosInstance";

const tokenEnv = configObj.token;

const LoginJs = async (login, password) => {
    const cookies = new Cookies();
    try {
        const response = await axiosInstance.post('/auth/login', {
            username: login,
            password: password
        });

        if (response.status === 400) {
            toast.error("Login və ya şifrə səhvdir");
            return;
        }

        if (response.status !== 200) {
            throw new Error('Login failed');
        }

        const data = response.data;
        const token = data.token;
        cookies.set(`${tokenEnv}`, token);
    } catch (error) {
        console.error('Error:', error.message);
    }
};

export default LoginJs