

export const SERVER_URL = import.meta.env.VITE_SERVER_URL;
export const API_URL = `${SERVER_URL}/api`;

// ====================== AUTH ======================
export const login = () => `/users/login`;
export const register = () => `/users/register`;
export const postAccessTokenUrl = () => `/users/refresh`;
// export const logout = () => `/users/logout`;
export const getProfile = () => `/users/profile`;

// ====================== CARGO ======================
export const getCargos = () => `/cargos`;
export const getCargo = (id: string) => `/cargos/${id}`;
export const createCargo = () => `/cargos`;
export const updateCargo = (id: string) => `/cargos/${id}`;
export const deleteCargo = (id: string) => `/cargos/${id}`;
export const toggleCargoActivity = (id: string) => `/cargos/${id}/toggle-activity`;

// ====================== USERS ======================
export const getUsers = () => `/users`;
export const getUser = (id: string) => `/users/${id}`;
// export const createUser = () => `/users`;
export const updateUser = (id: string) => `/users/${id}`;
export const deleteUser = (id: string) => `/users/${id}`;
export const toggleUserActivity = (id: string) => `/users/${id}/toggle-activity`;

// ====================== CARRIERS ======================
export const getCarriers = () => `/carriers`;
export const getCarrier = (id: string) => `/carriers/${id}`;
export const createCarrier = () => `/carriers`;
export const updateCarrier = (id: string) => `/carriers/${id}`;
export const deleteCarrier = (id: string) => `/carriers/${id}`;
export const toggleCarrierActivity = (id: string) => `/carriers/${id}/toggle-activity`;

// ====================== ORDERS ======================
export const getOrders = () => `/orders`;
export const getOrder = (id: string) => `/orders/${id}`;
export const createOrder = () => `/orders`;
export const updateOrderStatus = (id: string) => `/orders/${id}/status`;
export const deleteOrder = (id: string) => `/orders/${id}`;
export const updateOrderPaymentStatus = (id: string) =>
    `/orders/${id}/payment-status`;

// ====================== STATISTICS ======================
export const getOrderStats = () => `/infos/orders`;
export const getCompletedOrdersWeek = () => `/infos/orders/completed-week`;
export const getCancelledOrdersWeek = () => `/infos/orders/cancelled-week`;
export const getCargoStats = () => `/infos/cargos`;
export const getCarrierStats = () => `/infos/carriers`;
export const getWeeklyActivity = () => "/infos/activity/weekly";
export const getRecentOrders = () => "/infos/orders/recent";

// ======================== PAYMENTS ========================

export const getPayment = () => `/payments`;
export const updatePaymentStatus = (id: string) => `/payments/${id}/status`;
export const updatePaymentPercentage = (id: string) => `/payments/${id}/percentage`;
export const getMyTotalPayments = () =>
    `/payments/me/total-payments`;

export const getUserTotalPayments = (userId: number | string) =>
    `/payments/users/${userId}/total-payments`;

// ====================== CLIENTS ======================
export const getClients = () => `/clients`;
export const getClient = (id: string) => `/clients/${id}`;
export const createClient = () => `/clients`;
export const updateClient = (id: string) => `/clients/${id}`;
export const deleteClient = (id: string) => `/clients/${id}`;
export const toggleClientStatus = (id: string) => `/clients/${id}/toggle-status`;
