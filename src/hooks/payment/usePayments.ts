import { useCallback, useState } from "react";
import { PaymentService } from "../../services/payments/payments.service.ts";
import type {
    PaymentQueryParams,
    OrderPaymentResponse,
    UpdatePaymentStatusRequest,
    UpdatePaymentPercentageRequest, UserTotalPaymentResponse
} from "../../types/payments.type.ts";

export const usePayments = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleError = (err: unknown, defaultMsg: string) => {
        if (err instanceof Error) setError(err.message);
        else setError(defaultMsg);
    };

    // ---------- Get ALL ----------
    const getAll = useCallback(async (params?: PaymentQueryParams): Promise<OrderPaymentResponse[] | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await PaymentService.getAll(params);
            return data;
        } catch (err) {
            handleError(err, "Failed to fetch payments");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ---------- Update Status ----------
    const updateStatus = useCallback(async (id: string, payload: UpdatePaymentStatusRequest): Promise<OrderPaymentResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await PaymentService.updateStatus(id, payload);
            return data;
        } catch (err) {
            handleError(err, "Failed to update payment status");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ---------- Update Percentage ----------
    const updatePercentage = useCallback(async (id: string, payload: UpdatePaymentPercentageRequest): Promise<OrderPaymentResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await PaymentService.updatePercentage(id, payload);
            return data;
        } catch (err) {
            handleError(err, "Failed to update payment percentage");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);
    const getMyTotalPayments = useCallback(
        async (status?: "Paid" | "Unpaid"): Promise<UserTotalPaymentResponse | null> => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await PaymentService.getMyTotalPayments(status);
                return data;
            } catch (err) {
                handleError(err, "Failed to fetch total payments");
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );
    const getUserTotalPayments = useCallback(
        async (
            userId: number,
            status?: "Paid" | "Unpaid"
        ): Promise<UserTotalPaymentResponse | null> => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await PaymentService.getUserTotalPayments(userId, status);
                return data;
            } catch (err) {
                handleError(err, "Failed to fetch user total payments");
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        loading,
        error,
        getAll,
        updateStatus,
        updatePercentage,
        getMyTotalPayments,
        getUserTotalPayments,
    };

};
