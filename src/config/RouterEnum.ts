
export const RouterEnum = {
    DASHBOARD:'/dashboard',
    ANALYTICS:'/analytics',
    CARRIERS:'/table/carriers',
    CARGOS:'/table/cargos',
    ORDERS:'/table/orders',
    PROFILE:'/profile',
    LOGIN:'/auth/login',
    REGISTER:'/auth/register',
    CARRIER:'/carrier/:id',
    CARGO:'/cargo/:id',
    MAIN:'/',
    MEMBERS:'/members',
    PAYMENTS:'/payments',
    CLIENTS:'/clients',
}

export type RouterEnum = typeof RouterEnum[keyof typeof RouterEnum];
