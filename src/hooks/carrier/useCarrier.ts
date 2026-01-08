import { useCallback, useState } from "react";
import type {
    CarrierListResponse,
    CarrierQueryParams,
    CarrierResponse,
    CreateCarrierRequest
} from "../../types/carrier.type.ts";
import { CarriersService } from "../../services/carriers/carrier.service.ts";

export const useCarrier = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleError = (err: unknown, defaultMsg: string) => {
        if (err instanceof Error) setError(err.message);
        else setError(defaultMsg);
    };

    // ---------- Get ALL ----------
    const getAll = useCallback(async (params?: CarrierQueryParams): Promise<CarrierListResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await CarriersService.getAll(params);
            return data;
        } catch (err) {
            handleError(err, "Failed to fetch carriers");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ---------- Get ONE ----------
    const getOne = useCallback(async (id: string): Promise<CarrierResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await CarriersService.getOne(id);
            return data;
        } catch (err) {
            handleError(err, "Failed to fetch carrier");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ---------- Create ----------
    const create = useCallback(async (payload: CreateCarrierRequest): Promise<CarrierResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await CarriersService.create(payload);
            return data;
        } catch (err) {
            handleError(err, "Failed to create carrier");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ---------- Update ----------
    const update = useCallback(async (id: string, payload: CreateCarrierRequest): Promise<CarrierResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await CarriersService.update(id, payload);
            return data;
        } catch (err) {
            handleError(err, "Failed to update carrier");
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
            await CarriersService.delete(id);
            return true;
        } catch (err) {
            handleError(err, "Failed to delete carrier");
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // ---------- Toggle Activity ----------
    const toggleActivity = useCallback(async (id: string, isActive: boolean): Promise<CarrierResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await CarriersService.toggleActivity(id, isActive);
            return data;
        } catch (err) {
            handleError(err, "Failed to toggle carrier activity");
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
