export type OrderStatus =
    | "Pending"
    | "Accepted"
    | "InProgress"
    | "Completed"
    | "Cancelled";

export type CommissionFor = "Carrier" | "Cargo";

export interface CreateOrderRequest {
    CarrierId: number;
    CargoIds: number[];
    Percentage: number;
    CommissionFor: CommissionFor;
}

export interface OrderResponse {
    id: number;
    status: OrderStatus;

    percentage: number;
    commissionFor: CommissionFor;
    userId: number;
    userName: string;
    carrierId: number;
    carrierName: string;
    cargoIds: number[];
    total: Record<string, number>;
}

export interface OrderQueryParams {
    searchField?: string;
    status?: OrderStatus;
    limit?: number;
    offset?: number;
}

export interface OrderListResponse {
    data: OrderResponse[];
    totalCount: number;
    page: number;
    pageSize: number;
}
