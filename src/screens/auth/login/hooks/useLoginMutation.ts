import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import store from "store2";
import { RouterEnum } from "../../../../config/RouterEnum.ts";
import type { LoginRequest, LoginResponse } from "../../../../types/auth.type.ts";
import { AuthService } from "../../../../services/auth/auth.service.ts";

export const useLoginMutation = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation<LoginResponse, unknown, LoginRequest>({
        mutationKey: ["login-post"],
        mutationFn: async (data: LoginRequest) => {
            const response = await AuthService.login(data);
            return response.data; // повертаємо тільки data
        },
        onSuccess: async ({ accessToken, refreshToken, user }) => {
            store.set("auth-storage-todo", {
                state: { accessToken, refreshToken, user },
                version: 1
            });

            await queryClient.removeQueries();
            navigate(RouterEnum.DASHBOARD);
        },
        onError: (err) => console.error("Login error", err),
    });
};
