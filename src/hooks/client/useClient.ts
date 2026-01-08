import { useCallback, useState } from "react";
import {
    type ClientListResponse,
    type ClientQueryParams,
    type ClientResponse,
    type CreateClientRequest, isDuplicateResponse
} from "../../types/client.type.ts";
import { ClientService } from "../../services/clients/client.service.ts";

export const useClient = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleError = (err: unknown, defaultMsg: string) => {
        if (err instanceof Error) setError(err.message);
        else setError(defaultMsg);
    };

    // ---------- Get ALL ----------
    const getAll = useCallback(async (params?: ClientQueryParams): Promise<ClientListResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await ClientService.getAll(params);
            return data;
        } catch (err) {
            handleError(err, "Failed to fetch clients");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ---------- Get ONE ----------
    const getOne = useCallback(async (id: string): Promise<ClientResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await ClientService.getOne(id);
            return data;
        } catch (err) {
            handleError(err, "Failed to fetch client");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ---------- Create ----------
    const create = useCallback(
        async (
            payload: CreateClientRequest
        ): Promise<ClientResponse | { duplicated: true; message: string } | null> => {
            setLoading(true);
            setError(null);

            try {
                const { data } = await ClientService.create(payload);

                // Type guard
                if (isDuplicateResponse(data)) {
                    return data;
                }

                return data as ClientResponse;
            } catch (err) {
                handleError(err, "Failed to create client");
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );


    // ---------- Update ----------
    const update = useCallback(async (id: string, payload: CreateClientRequest): Promise<ClientResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await ClientService.update(id, payload);
            return data;
        } catch (err) {
            handleError(err, "Failed to update client");
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
            await ClientService.delete(id);
            return true;
        } catch (err) {
            handleError(err, "Failed to delete client");
            return false;
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
        remove
    };
};
