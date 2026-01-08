import instance from "../api/interseptors.api.ts";
import { login, register, postAccessTokenUrl} from "../../config/api.config.ts";
import type { LoginRequest, LoginResponse, RegisterRequest } from "../../types/auth.type.ts";
import type { UserResponse } from "../../types/user.type.ts";

export const AuthService = {
    login: (data: LoginRequest) =>
        instance<LoginResponse>({
            url: login(),   // /users/login
            method: "POST",
            data,
        }),

    register: (data: RegisterRequest) =>
        instance<UserResponse>({
            url: register(),  // /users/register
            method: "POST",
            data,
        }),

    refreshToken: (refreshToken: string) =>
        instance<LoginResponse>({
            url: postAccessTokenUrl(), // /users/refresh
            method: "POST",
            data: { refreshToken },    // ключ повинен збігатись з бекендом
        }),

};
