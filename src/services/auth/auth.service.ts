import instance from "../api/interseptors.api.ts";
import { login, postAccessTokenUrl} from "../../config/api.config.ts";
import type {LoginRequest, LoginResponse} from "../../types/auth.type.ts";

export const AuthService = {
    login: (data: LoginRequest) =>
        instance<LoginResponse>({
            url: login(),
            method: "POST",
            data,
        }),

    refreshToken: (refreshToken: string) =>
        instance<LoginResponse>({
            url: postAccessTokenUrl(),
            method: "POST",
            data: { refreshToken },
        }),

};
