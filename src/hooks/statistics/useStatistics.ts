// src/hooks/statistics/useStatistics.ts

import { useCallback, useState } from "react";
import type {
    OrderCountResponse,
    OrderShortResponse,
    CargoCountResponse,
    CarrierCountResponse, RecentOrderResponse, WeeklyActivityResponse,
} from "../../types/statistics.type.ts";
import { StatisticsService } from "../../services/statistics/statistics.service.ts";

export const useStatistics = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleError = (err: unknown, defaultMsg: string) => {
        if (err instanceof Error) setError(err.message);
        else setError(defaultMsg);
    };

    const getOrderStats = useCallback(async (): Promise<OrderCountResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await StatisticsService.getOrderStats();
            return data;
        } catch (err) {
            handleError(err, "Failed to fetch order statistics");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getCompletedOrdersLastWeek = useCallback(async (): Promise<OrderShortResponse[] | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await StatisticsService.getCompletedOrdersLastWeek();
            return data;
        } catch (err) {
            handleError(err, "Failed to fetch completed orders");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getCancelledOrdersLastWeek = useCallback(async (): Promise<OrderShortResponse[] | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await StatisticsService.getCancelledOrdersLastWeek();
            return data;
        } catch (err) {
            handleError(err, "Failed to fetch cancelled orders");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getWeeklyActivity = useCallback(async (): Promise<WeeklyActivityResponse[]> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await StatisticsService.getWeeklyActivity();
            return data;
        } catch (err) {
            handleError(err, "Failed to fetch weekly activity");
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const getRecentOrders = useCallback(async (): Promise<RecentOrderResponse[]> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await StatisticsService.getRecentOrders();
            return data;
        } catch (err) {
            handleError(err, "Failed to fetch recent orders");
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const getCargoStats = useCallback(async (): Promise<CargoCountResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await StatisticsService.getCargoStats();
            return data;
        } catch (err) {
            handleError(err, "Failed to fetch cargo statistics");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getCarrierStats = useCallback(async (): Promise<CarrierCountResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await StatisticsService.getCarrierStats();
            return data;
        } catch (err) {
            handleError(err, "Failed to fetch carrier statistics");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,

        getOrderStats,
        getCompletedOrdersLastWeek,
        getCancelledOrdersLastWeek,
        getWeeklyActivity,
        getRecentOrders,
        getCargoStats,
        getCarrierStats,
    };
};
