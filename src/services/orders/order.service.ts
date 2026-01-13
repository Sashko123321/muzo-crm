import instance from "../api/interseptors.api.ts";
import {
    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    deleteOrder,
} from "../../config/api.config.ts";
import type {CreateOrderRequest, OrderQueryParams} from "../../types/order.type.ts";

export const OrdersService = {
    getAll: (params?: OrderQueryParams) =>
        instance({
            url: getOrders(),
            method: "GET",
            params,
        }),

    getOne: (id: string) =>
        instance({
            url: getOrder(id),
            method: "GET",
        }),

    create: (data: CreateOrderRequest) =>
        instance({
            url: createOrder(),
            method: "POST",
            data,
        }),

    updateStatus: (id: string, status: string) =>
        instance({
            url: updateOrderStatus(id),
            method: "PATCH",
            data: status,
        }),

    delete: (id: string) =>
        instance({
            url: deleteOrder(id),
            method: "DELETE",
        }),

};
