export type Currency = "USD" | "EUR" | "UAH";
export type DirectionForward = "Ukraine" | "Europe" ;

export interface CreateCargoRequest {
    description: string;
    weightKg: number;
    dimensions?: string;
    clientId: number;
    fromLocation?: string;
    toLocation?: string;
    availableFrom: string;
    availableTo: string;
    directionForward: DirectionForward;
    price: number;
    currency: Currency;
    notes?: string;
    isActive: boolean;
}


export interface CargoResponse {
    id: number;
    description?: string;
    weightKg: number;
    dimensions?: string;
    clientName?: string;
    clientPhone?: string;
    fromLocation?: string;
    toLocation?: string;
    availableFrom: string;
    availableTo: string;
    directionForward: DirectionForward;

    price: number;
    currency: Currency;
    notes?: string;
    isActive: boolean;
}
export interface CargoQueryParams {
    searchField?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
}

export interface CargoListResponse {
    data: CargoResponse[];
    totalCount: number;
    page: number;
    pageSize: number;
}
