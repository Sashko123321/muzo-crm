
export const RouterEnum = {
    DASHBOARD:'/muzo-crm/dashboard',
    ANALYTICS:'/muzo-crm/analytics',
    CARRIERS:'/muzo-crm/table/carriers',
    CARGOS:'/muzo-crm/table/cargos',
    ORDERS:'/muzo-crm/table/orders',
    PROFILE:'/muzo-crm/profile',
    LOGIN:'/muzo-crm/auth/login',
    REGISTER:'/muzo-crm/auth/register',
    CARRIER:'/muzo-crm/carrier/:id',
    CARGO:'/muzo-crm/cargo/:id',
    MAIN:'/muzo-crm/',
    MEMBERS:'/muzo-crm/members',
    PAYMENTS:'/muzo-crm/payments',
    CLIENTS:'/muzo-crm/clients',
}

export type RouterEnum = typeof RouterEnum[keyof typeof RouterEnum];
