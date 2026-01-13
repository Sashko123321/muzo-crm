export type RoleType = "User" | "Admin";

export interface CreateUserRequest {
    firstName?: string;
    lastName?: string;
    password?: string;
    phoneNumber?: string;
    role: RoleType;
}

export interface UserResponse {
    id: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    role: RoleType;
    isActive: boolean;
}


export interface UserQueryParams {
    searchField?: string;
    isBlocked?: boolean;
    limit?: number;
    offset?: number;
}

export interface UserListResponse {
    data: UserResponse[];
    page: number;
    pageSize: number;
    totalCount: number;
    elapsedMilliseconds: number;
}
