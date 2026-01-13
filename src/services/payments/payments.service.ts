import type {
    OrderPaymentResponse,
    PaymentQueryParams,
    UpdatePaymentPercentageRequest,
    UpdatePaymentStatusRequest,
    UserTotalPaymentResponse,
} from "../../types/payments.type.ts";

import {
    getPayment,
    updatePaymentPercentage,
    updatePaymentStatus,
    getMyTotalPayments,
    getUserTotalPayments,
} from "../../config/api.config.ts";
import instance from "../api/interseptors.api.ts";

export const PaymentService = {
    getAll: (params?: PaymentQueryParams) =>
        instance<OrderPaymentResponse[]>({
            url: getPayment(),
            method: "GET",
            params,
        }),

    updateStatus: (id: string, data: UpdatePaymentStatusRequest) =>
        instance<OrderPaymentResponse>({
            url: updatePaymentStatus(id),
            method: "PATCH",
            data,
        }),

    updatePercentage: (id: string, data: UpdatePaymentPercentageRequest) =>
        instance<OrderPaymentResponse>({
            url: updatePaymentPercentage(id),
            method: "PATCH",
            data,
        }),

    getMyTotalPayments: (status?: "Paid" | "Unpaid") =>
        instance<UserTotalPaymentResponse>({
            url: getMyTotalPayments(),
            method: "GET",
            params: { status },
        }),

    getUserTotalPayments: (userId: number, status?: "Paid" | "Unpaid") =>
        instance<UserTotalPaymentResponse>({
            url: getUserTotalPayments(userId),
            method: "GET",
            params: { status },
        }),
};
