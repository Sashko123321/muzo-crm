import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "../../../../services/auth/auth.service.ts";
import type {UserResponse} from "../../../../types/user.type.ts";
import type {RegisterRequest} from "../../../../types/auth.type.ts";

export const useRegisterMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<UserResponse, unknown, RegisterRequest>({
        mutationKey: ["register-post"],
        mutationFn: (data) => AuthService.register(data).then(res => res.data),
        onSuccess: async () => {
            // Можна відразу логінити або просто перейти на логін
            await queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (err) => console.error("Register error", err),
    });
};
