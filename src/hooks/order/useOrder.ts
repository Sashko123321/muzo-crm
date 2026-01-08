import { useCallback, useState } from "react";
import type {
    OrderListResponse,
    OrderQueryParams,
    OrderResponse,
    CreateOrderRequest,
    OrderStatus,
} from "../../types/order.type.ts";
import { OrdersService } from "../../services/orders/order.service.ts";

export const useOrder = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleError = (err: unknown, defaultMsg: string) => {
        if (err instanceof Error) setError(err.message);
        else setError(defaultMsg);
    };

    const getAll = useCallback(async (params?: OrderQueryParams): Promise<OrderListResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await OrdersService.getAll(params);
            return data;
        } catch (err) {
            handleError(err, "Failed to fetch orders");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getOne = useCallback(async (id: string): Promise<OrderResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await OrdersService.getOne(id);
            return data;
        } catch (err) {
            handleError(err, "Failed to fetch order");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const create = useCallback(async (payload: CreateOrderRequest): Promise<OrderResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await OrdersService.create(payload);
            return data;
        } catch (err) {
            handleError(err, "Failed to create order");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateStatus = useCallback(async (id: string, status: OrderStatus): Promise<OrderResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await OrdersService.updateStatus(id, status);
            return data;
        } catch (err) {
            handleError(err, "Failed to update order status");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const remove = useCallback(async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await OrdersService.delete(id);
            return true;
        } catch (err) {
            handleError(err, "Failed to delete order");
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
        updateStatus,
        remove
    };

};
