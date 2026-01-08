export type PaymentQueryParams = {
    status?: "Paid" | "Unpaid";
    searchField?: string;
    limit?: number;
    offset?: number;
};

export type UpdatePaymentStatusRequest = {
    status: "Paid" | "Unpaid";
};

export type UpdatePaymentPercentageRequest = {
    percentage: number;
};

export type OrderPaymentResponse = {
    id: number;                   // <-- PaymentId
    orderId: number;               // ID замовлення
    userId: number;                // ID користувача
    userName: string;
    clientName: string;
    carrierId: number;
    carrierName: string;
    cargoIds: number[];
    amountByCurrency: Record<string, number>;
    percentage: number;
    finalAmount: Record<string, number>;
    status: "Paid" | "Unpaid";
};


export type UserTotalPaymentResponse = {
    userId: number;
    userName: string;
    totalByCurrency: Record<string, number>;
};
