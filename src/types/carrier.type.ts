
export type DirectionForward = 'Ukraine' | 'Europe';
    export interface CreateCarrierRequest {
        name: string;
        phoneNumber: string;
        telegram?: string;
        vehicleType: string;
        maxLoadKg: number;
        isActive: boolean;
        filesBase64?: string[];
        regions?: DirectionForward[];
    }

    export interface CarrierResponse {
        id: number;
        name: string;
        phoneNumber: string;
        telegram?: string;
        vehicleType: string;
        maxLoadKg: number;
        isActive: boolean;
        filesBase64: string[];
        regions: DirectionForward[];
    }

    export interface CarrierQueryParams {
        searchField?: string;
        isActive?: boolean;
        limit?: number;
        offset?: number;
    }

    export interface CarrierListResponse {
        data: CarrierResponse[];
        totalCount: number;
        page: number;
        pageSize: number;
    }
