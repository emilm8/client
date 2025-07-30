import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../public/caffecino.png";
import { useEffect, useState } from "react";
import LoginJs from "../LoginCheck";
import { Cookies } from "react-cookie";
import authVerify from "../authVerify";
import configObj from "../../config/config";

function Login() {
    const cooki = new Cookies();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [login, setLogin] = useState({ email: "", pass: "" });
    const navigate = useNavigate()


    useEffect(() => {
        if (cooki.get('token')) {
            navigate('/admin')
        }
    }, [])


    async function handleLogin() {
        setLoading(true);
        await LoginJs(login.email, login.pass);
        const deyer = await cooki.get(configObj.token);
        if (deyer) {
            const sorgu = await authVerify();
            if (sorgu !== true) { }
            else {
                window.location.href = "/admin";
            }
        } else {
            toast.error("Login və ya Şifrə səhvdir!");
            setError(true);
        }
        setLoading(false);
    }

    return (
        <main className="h-screen grid place-items-center">
            <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white border rounded-lg shadow-lg lg:max-w-4xl">
                <div className="hidden bg-cover lg:block lg:w-1/2"></div>

                <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
                    <Link to={"/"} className="flex justify-center mx-auto">
                        <img className="w-auto h-auto sm:h-20" src={Logo} alt="Teleclub logo" />
                    </Link>

                    <p className="mt-3 text-xl text-center text-gray-600 ">
                        Xoş geldin!
                    </p>



                    <div className="flex items-center justify-between mt-4">
                        <span className="w-1/5 border-b lg:w-1/4"></span>

                        <span className="text-xs text-center text-gray-500 uppercase  hover:underline">giriş et</span>

                        <span className="w-1/5 border-b  lg:w-1/4"></span>
                    </div>

                    <div className="mt-4">
                        <label className="block mb-2 text-sm font-medium text-gray-600 " htmlFor="LoggingEmailAddress">Login</label>
                        <input onChange={(e) => {
                            setLogin({
                                ...login,
                                email: e.target.value
                            })
                        }}
                            style={{
                                borderColor: error ? "red" : ""
                            }}
                            className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg  focus:border-blue-400 focus:ring-opacity-40  focus:outline-none focus:ring focus:ring-blue-300" type="email" />
                    </div>

                    <div className="mt-4">
                        <div className="flex justify-between">
                            <label className="block mb-2 text-sm font-medium text-gray-600 " htmlFor="loggingPassword">Şifrə</label>
                            <span onClick={() => toast.success("Davidlə əlaqə saxla")} href="#" className="cursor-pointer text-xs text-gray-500  hover:underline">Şifrəni unutmusan?</span>
                        </div>

                        <input onChange={(e) => {
                            setLogin({
                                ...login,
                                pass: e.target.value
                            })
                        }}

                            style={{
                                borderColor: error ? "red" : ""
                            }}
                            className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg  focus:border-blue-400 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300" type="password" />
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className={`w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
                            {loading ? "Yüklənir..." : "Giriş et"}
                        </button>
                    </div>

                </div>
            </div>
        </main>
    );
}

export default Login;
