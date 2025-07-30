const tokenEnv = import.meta.env.VITE_TOKEN
const baseUrl = import.meta.env.VITE_BASE_URL

const configObj = {
    baseurl: baseUrl,
    token: tokenEnv
}

export default configObj