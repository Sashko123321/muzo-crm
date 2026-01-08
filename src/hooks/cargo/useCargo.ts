import { useCallback, useState } from "react";
import type {
    CargoListResponse,
    CargoQueryParams,
    CargoResponse,
    CreateCargoRequest
} from "../../types/cargo.type.ts";
import { CargoService } from "../../services/cargos/cargo.service.ts";

export const useCargo = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleError = (err: unknown, defaultMsg: string) => {
        if (err instanceof Error) setError(err.message);
        else setError(defaultMsg);
    };

    // ---------- Get ALL ----------
    const getAll = useCallback(async (params?: CargoQueryParams): Promise<CargoListResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await CargoService.getAll(params);
            return data;
        } catch (err) {
            handleError(err, "Failed to fetch cargos");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ---------- Get ONE ----------
    const getOne = useCallback(async (id: string): Promise<CargoResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await CargoService.getOne(id);
            return data;
        } catch (err) {
            handleError(err, "Failed to fetch cargo");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ---------- Create ----------
    const create = useCallback(async (payload: CreateCargoRequest): Promise<CargoResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await CargoService.create(payload);
            return data;
        } catch (err) {
            handleError(err, "Failed to create cargo");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ---------- Update ----------
    const update = useCallback(async (id: string, payload: CreateCargoRequest): Promise<CargoResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await CargoService.update(id, payload);
            return data;
        } catch (err) {
            handleError(err, "Failed to update cargo");
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
            await CargoService.delete(id);
            return true;
        } catch (err) {
            handleError(err, "Failed to delete cargo");
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // ---------- Toggle Activity ----------
    const toggleActivity = useCallback(async (id: string, isActive: boolean): Promise<CargoResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await CargoService.toggleActivity(id, isActive);
            return data;
        } catch (err) {
            handleError(err, "Failed to toggle cargo activity");
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
        create,
        update,
        remove,
        toggleActivity
    };
};
