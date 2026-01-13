import instance from "../api/interseptors.api.ts";
import {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    toggleUserActivity,
    getProfile,
    register
} from "../../config/api.config.ts";
import type { CreateUserRequest, UserQueryParams } from "../../types/user.type.ts";

export const UserService = {
    getAll: (params?: UserQueryParams) =>
        instance({
            url: getUsers(),
            method: "GET",
            params
        }),

    getOne: (id: string) =>
        instance({
            url: getUser(id),
            method: "GET",
        }),

    create: (data: CreateUserRequest) =>
        instance({
            url: register(),
            method: "POST",
            data,
        }),

    update: (id: string, data: CreateUserRequest) =>
        instance({
            url: updateUser(id),
            method: "PUT",
            data,
        }),

    delete: (id: string) =>
        instance({
            url: deleteUser(id),
            method: "DELETE",
        }),

    toggleActivity: (id: string, isActive: boolean) =>
        instance({
            url: toggleUserActivity(id),
            method: "PATCH",
            data: isActive,
        }),

    getProfile: () =>
        instance({
            url: getProfile(),
            method: "GET",
        }),

};
