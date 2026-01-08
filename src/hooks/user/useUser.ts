import { useCallback, useState } from "react";
import type { CreateUserRequest, UserListResponse, UserQueryParams, UserResponse } from "../../types/user.type.ts";
import { UserService } from "../../services/user/user.service.ts";

export const useUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleError = (err: unknown, defaultMsg: string) => {
        if (err instanceof Error) setError(err.message);
        else setError(defaultMsg);
    };

    // ---------- Get ALL ----------
    const getAll = useCallback(async (params?: UserQueryParams): Promise<UserListResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await UserService.getAll(params);
            return data;
        } catch (err) {
            handleError(err, "Failed to fetch users");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ---------- Get ONE ----------
    const getOne = useCallback(async (id: string): Promise<UserResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await UserService.getOne(id);
            return data as UserResponse;
        } catch (err) {
            handleError(err, "Failed to fetch user");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ---------- Get PROFILE ----------
    const getProfile = useCallback(async (): Promise<UserResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await UserService.getProfile();
            return data as UserResponse;
        } catch (err) {
            handleError(err, "Failed to fetch profile");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ---------- Create ----------
    const create = useCallback(async (payload: CreateUserRequest): Promise<UserResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await UserService.create(payload);
            return data as UserResponse;
        } catch (err) {
            handleError(err, "Failed to create user");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ---------- Update ----------
    const update = useCallback(async (id: string, payload: CreateUserRequest): Promise<UserResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await UserService.update(id, payload);
            return data as UserResponse;
        } catch (err) {
            handleError(err, "Failed to update user");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ---------- Delete ----------
    const remove = useCallback(async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await UserService.delete(id);
            return true;
        } catch (err) {
            handleError(err, "Failed to delete user");
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // ---------- Block / Unblock ----------
    const toggleActivity = useCallback(async (id: string, isActive: boolean): Promise<UserResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await UserService.toggleActivity(id, isActive);
            return data as UserResponse;
        } catch (err) {
            handleError(err, "Failed to toggle user activity");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);



    return {
        loading,
        error,
        getAll,
        getOne,
        getProfile,
        create,
        update,
        remove,
        toggleActivity,
    };
};
