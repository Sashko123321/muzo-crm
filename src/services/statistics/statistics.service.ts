import instance from "../api/interseptors.api.ts";
import {
    getCancelledOrdersWeek,
    getCargoStats,
    getCarrierStats,
    getCompletedOrdersWeek,
    getOrderStats, getRecentOrders, getWeeklyActivity,
} from "../../config/api.config.ts";

export const StatisticsService = {
    // -------- Orders --------
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

    // 🔥 NEW: Weekly activity
    getWeeklyActivity: () =>
        instance({
            url: getWeeklyActivity(),
            method: "GET",
        }),

    // 🔥 NEW: Recent orders
    getRecentOrders: () =>
        instance({
            url: getRecentOrders(),
            method: "GET",
        }),

    // -------- Cargo --------
    getCargoStats: () =>
        instance({
            url: getCargoStats(),
            method: "GET",
        }),

    // -------- Carrier --------
    getCarrierStats: () =>
        instance({
            url: getCarrierStats(),
            method: "GET",
        }),
};
