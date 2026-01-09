import axios, {
    AxiosHeaders,
    type InternalAxiosRequestConfig
} from "axios";
import store from "store2";
import {API_URL, postAccessTokenUrl} from "../../config/api.config.ts";
import {RouterEnum} from "../../config/RouterEnum.ts";

const BASENAME = "/muzo-crm";
// ===== Функція оновлення токена через refreshToken =====
export const getAccessTokenByRefresh = async (): Promise<string | null> => {
    const authStorage = store.get("auth-storage-todo");
    const refreshToken = authStorage?.state?.refreshToken;
    if (!refreshToken) return null;

    try {
        const response = await axios.post(
            API_URL + postAccessTokenUrl(),
            {refreshToken}, // тепер бек чекає { refreshToken }
            {headers: {"Content-Type": "application/json"}}
        );

        const {accessToken, refreshToken: newRefreshToken} = response.data;
        store.set("auth-storage-todo", {
            state: {accessToken, refreshToken: newRefreshToken},
            version: (authStorage?.version || 0) + 1,
        });

        return accessToken;
    } catch (err) {
        console.error("Refresh token failed", err);
        return null;
    }
};

// ===== Axios instance =====
const instance = axios.create({
    baseURL: API_URL,
    headers: {"Content-Type": "application/json"},
});

instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const authStorage = store.get("auth-storage-todo");
        const token = authStorage?.state?.accessToken;

        const url = config.url ?? "";
        const isAuthEndpoint =
            url.endsWith("/users/login") ||
            url.endsWith("/users/register") ||
            url.endsWith("/users/refresh");

        if (!token && !isAuthEndpoint) {
            store.remove("auth-storage-todo");
            window.location.href = BASENAME + RouterEnum.LOGIN;
            return Promise.reject(
                new Error("No token, redirecting to login")
            );
        }

        if (token && !isAuthEndpoint) {
            if (!config.headers) {
                config.headers = new AxiosHeaders();
            }

            config.headers.set("Authorization", `Bearer ${token}`);
        }

        return config;
    }
);

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
    _isRetry?: boolean;
}


instance.interceptors.response.use(
    async (response) => {
        return response;
    },
    async (error) => {


        if (!error.config) return Promise.reject(error);

        const originalRequest = error.config as RetryAxiosRequestConfig;
        const url = originalRequest.url ?? "";

        const isAuthEndpoint =
            url.endsWith("/users/login") ||
            url.endsWith("/users/register") ||
            url.endsWith("/users/refresh");

        if (
            error.response?.status === 401 &&
            !originalRequest._isRetry &&
            !isAuthEndpoint
        ) {
            originalRequest._isRetry = true;

            const newToken = await getAccessTokenByRefresh();
            if (newToken) {
                if (!originalRequest.headers) {
                    originalRequest.headers = new AxiosHeaders();
                }

                originalRequest.headers.set(
                    "Authorization",
                    `Bearer ${newToken}`
                );

                return instance(originalRequest);
            }
        }

        store.remove("auth-storage-todo");
        window.location.href = BASENAME + RouterEnum.LOGIN;
        return Promise.reject(error);
    }
);


export default instance;
