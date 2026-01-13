export type ClientStatus = "Thinking" | "Declined" | "Supported";
export type ClientType = "Individual" | "Company" | "PartnerCompany";

export interface CreateClientRequest {
    name: string;
    description?: string;
    status: ClientStatus;
    type: ClientType;
    email?: string;
    phone?: string;
}

export interface ClientResponse {
    id: number;
    name: string;
    description?: string;
    status: ClientStatus;
    type: ClientType;
    email?: string;
    phone?: string;
    cargoCount: number;
}

export interface ClientQueryParams {
    searchField?: string;
    status?: ClientStatus;
    type?: ClientType;
    limit?: number;
    offset?: number;
}

export interface ClientListResponse {
    data: ClientResponse[];
    totalCount: number;
    page: number;
    pageSize: number;
}
export function isDuplicateResponse(obj: unknown): obj is { duplicated: true; message: string } {
    return (
        typeof obj === "object" &&
        obj !== null &&
        "duplicated" in obj &&
        (obj as { duplicated?: unknown }).duplicated === true
    );
}
