// src/types/statistics.type.ts

// -------- Orders --------
import type {OrderStatus} from "./order.type.ts";

export interface OrderCountResponse {
    totalCountOrders: number;
    pendingCount: number;
    acceptedCount: number;
    inProgressCount: number;
    completedCount: number;
    canceledCount: number;
    efficiencyPercent: number;


}

export interface OrderShortResponse {
    id: number;
    cargosDescription: string[];
    statusOrder: string;
    createdAt: string; // ISO
}


// -------- Cargo --------
export interface CargoCountResponse {
    totalCountCargos: number;
    activeCount: number;
    inactiveCount: number;
}

// -------- Carrier --------
export interface CarrierCountResponse {
    totalCountCarrier: number;
    activeCount: number;
    inactiveCount: number;
}

export interface WeeklyActivityResponse {
    date: string;
    completedCount: number;
    canceledCount: number;
}
export interface RecentOrderResponse {
    id: number;
    status: OrderStatus;
    carrierName: string;
    createdAt: string;
}
