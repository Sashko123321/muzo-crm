import instance from "../api/interseptors.api.ts";
import {
    getCancelledOrdersWeek,
    getCargoStats,
    getCarrierStats,
    getCompletedOrdersWeek,
    getOrderStats, getRecentOrders, getWeeklyActivity,
} from "../../config/api.config.ts";

export const StatisticsService = {
    getOrderStats: () =>
        instance({
            url: getOrderStats(),
            method: "GET",
        }),

    getCompletedOrdersLastWeek: () =>
        instance({
            url: getCompletedOrdersWeek(),
            method: "GET",
        }),

    getCancelledOrdersLastWeek: () =>
        instance({
            url: getCancelledOrdersWeek(),
            method: "GET",
        }),

    getWeeklyActivity: () =>
        instance({
            url: getWeeklyActivity(),
            method: "GET",
        }),

    getRecentOrders: () =>
        instance({
            url: getRecentOrders(),
            method: "GET",
        }),

    getCargoStats: () =>
        instance({
            url: getCargoStats(),
            method: "GET",
        }),

    getCarrierStats: () =>
        instance({
            url: getCarrierStats(),
            method: "GET",
        }),
};
