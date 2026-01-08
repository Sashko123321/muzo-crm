import type {UserResponse} from "./user.type.ts";


export interface LoginRequest {
    phoneNumber: string;
    password?: string;
}

export interface RegisterRequest {
    firstName?: string;
    lastName?: string;
    password?: string;
    phoneNumber?: string;
    role: "User" | "Admin";
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: UserResponse;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}
