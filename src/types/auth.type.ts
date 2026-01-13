import type {UserResponse} from "./user.type.ts";


export interface LoginRequest {
    phoneNumber: string;
    password?: string;
}


export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: UserResponse;
}

