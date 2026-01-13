import { useEffect, useState } from "react";
import {Search, Plus, Weight, Package, MapPin, Box, HandCoins, Truck} from "lucide-react";

import Pagination from "../../components/Pagination";
import CardModal from "../../components/shered/CardModal";
import FilterButton from "../../components/button/FilterButton.tsx";
import OrderCard from "./components/OrderCard";

import { useOrder } from "../../hooks/order/useOrder";
import { useCargo } from "../../hooks/cargo/useCargo";
import type { OrderResponse, OrderStatus } from "../../types/order.type";
import type { CargoResponse } from "../../types/cargo.type.ts";
import {Badge} from "../../components/badge/Badge.tsx";
import AddOrderForm from "./components/AddOrderForm.tsx";
import OrderCardSkeleton from "./components/OrderCardSkeleton.tsx";
import AddModal from "../../components/shered/AddModal.tsx";

const Orders = () => {
    const { loading, error, getAll, updateStatus, remove} = useOrder();
    const { getOne: getCargo } = useCargo();
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;
    const [totalPages, setTotalPages] = useState(1);

    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
    const [cargoDetails, setCargoDetails] = useState<CargoResponse[]>([]);
    const statusOptions: OrderStatus[] = ["Pending", "Accepted", "InProgress", "Completed", "Cancelled"];
    const STATUS_BADGE_VARIANT: Record<OrderStatus, "default" | "active" | "outline" | "inactive"> = {
        Pending: "active",
        Accepted: "active",
        InProgress: "default",
        Completed: "active",
        Cancelled: "inactive",
    };


    useEffect(() => {
        let isMounted = true;
        const fetchOrders = async () => {
            const params = {
                limit: pageSize,
                offset: (currentPage - 1) * pageSize,
                searchField: search || undefined,
                status: statusFilter === "All" ? undefined : statusFilter,
            };
            const data = await getAll(params);

            if (!isMounted) return;

            if (data?.data) {
                setOrders(data.data);
                const pages = Math.ceil((data.totalCount || 1) / pageSize) || 1;
                setTotalPages(pages);
            } else {
                setOrders([]);
                setTotalPages(1);
            }
        };
        fetchOrders();
        return () => { isMounted = false; };
    }, [currentPage, search, statusFilter, getAll]);

    useEffect(() => {
        if (!selectedOrder) return;
        let mounted = true;
        const fetchCargoDetails = async () => {
            const details: CargoResponse[] = [];
            for (const id of selectedOrder.cargoIds) {
                const cargo = await getCargo(id.toString());
                if (cargo) details.push(cargo);
            }
            if (mounted) setCargoDetails(details);
        };
        fetchCargoDetails();
        return () => { mounted = false; };
    }, [selectedOrder, getCargo]);

    const handleStatusChange = async (value: OrderStatus) => {
        if (!selectedOrder) return;
        const updated = await updateStatus(selectedOrder.id.toString(), value);
        if (updated) {
            setSelectedOrder(updated);
            setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
        }
    };
    const ORDER_STATUS_UA: Record<OrderStatus | "All", string> = {
        All: "Усі",
        Pending: "Очікує",
        Accepted: "Прийнято",
        InProgress: "В процесі",
        Completed: "Завершено",
        Cancelled: "Скасовано",
    };

    const [isEdit, setIsEdit] = useState(false);
    const toggleEditMode = () => {
        setIsEdit((prev) => !prev);
    };
    return (
        <main className="p-4 w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Список Замовлень</h1>
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        {(["All", "Pending", "Accepted", "InProgress", "Completed", "Cancelled"] as (OrderStatus | "All")[])
                            .map(status => (
                                <FilterButton
                                    key={status}
                                    label={ORDER_STATUS_UA[status]}
                                    active={statusFilter === status}
                                    onClick={() => {
                                        setStatusFilter(status);
                                        setCurrentPage(1);
                                    }}
                                />
                            ))}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Пошук..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                                className="
                                    w-full h-9 pl-10 pr-3 rounded-xl
                                    border border-slate-300
                                    text-sm text-slate-900
                                    placeholder:text-slate-400
                                    focus:outline-none
                                    focus:ring-2 focus:ring-indigo-500
                                "
                            />
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="
                                inline-flex items-center gap-2
                                h-9 px-4 rounded-xl
                                bg-indigo-600 text-white font-medium
                                hover:bg-indigo-700 transition
                            "
                        >
                            <Plus size={18} /> Додати Замовлення
                        </button>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {Array.from({ length: pageSize }).map((_, i) => (
                        <OrderCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {error && <p className="text-red-500">{error}</p>}

            {!loading && orders.length === 0 && !error && (
                <p className="text-center text-slate-500 mt-10">
                    Немає даних за вибраними фільтрами
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {orders.map(order => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        onViewDetails={setSelectedOrder}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}

            {showAddModal && (
                <AddModal
                    open={showAddModal}
                    onClose={setShowAddModal}
                    title="Додати Замовлення"
                    description="Створіть нове замовленн"
                >
                    <AddOrderForm
                        onSuccess={(newOrder) => {
                            setOrders(prev => [newOrder, ...prev]);
                            setShowAddModal(false);
                        }}
                    />
                </AddModal>
            )}


            <CardModal
                open={!!selectedOrder}
                onClose={() => {
                    setSelectedOrder(null);
                    setIsEdit(false);
                }}
                title={selectedOrder?.id ? `Order #${selectedOrder.id}` : "Order Details"}
                badge={selectedOrder ? ORDER_STATUS_UA[selectedOrder.status] : undefined}
                badgeVariant={selectedOrder ? STATUS_BADGE_VARIANT[selectedOrder.status] : "default"}

                isEdit={isEdit}
                onToggleEdit={toggleEditMode}
                onDelete={async () => {
                    if (!selectedOrder) return;
                    const confirmed = confirm("Ви дійсно хочете видалити цей вантаж?");
                    if (!confirmed) return;

                    const success = await remove(selectedOrder.id.toString());
                    if (success) {
                        setOrders((prev) => prev.filter((c) => c.id !== selectedOrder.id));
                        setSelectedOrder(null);
                        setIsEdit(false);
                    }
                }}
            >
                {selectedOrder && (
                    <div className="space-y-6">


                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                                <Truck className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm text-slate-500">Перевізник</p>
                                <p className="font-semibold text-slate-900">
                                    {selectedOrder.carrierName || "-"}
                                    {selectedOrder.carrierId && (
                                        <span className="text-xs font-mono text-slate-400 ml-1">#{selectedOrder.carrierId}</span>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <p className="text-sm font-semibold text-slate-600 uppercase">Статус</p>
                            <select
                                value={selectedOrder.status}
                                onChange={e => handleStatusChange(e.target.value as OrderStatus)}
                                className="
                        w-full h-10 rounded-xl px-3
                        border border-slate-300
                        text-sm
                        focus:outline-none focus:ring-2 focus:ring-indigo-500
                        bg-white
                        hover:border-indigo-400 transition
                    "
                            >
                                {statusOptions.map(s => (
                                    <option key={s} value={s}>
                                        {ORDER_STATUS_UA[s]}
                                    </option>
                                ))}
                            </select>
                        </div>


                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-slate-600 uppercase">Вантаж ({cargoDetails.length})</p>
                            {cargoDetails.length ? (
                                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                    {cargoDetails.map(c => (
                                        <div key={c.id} className="p-4 border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition flex flex-col gap-3">
                                            {/* Header */}
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg">
                                                        <Package className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <h4 className="font-semibold text-slate-900 truncate">{c.description || "Без опису"}</h4>
                                                        <span className="text-xs font-mono text-slate-400 mt-0.5">ID: #{c.id}</span>
                                                        <p className="text-xs text-slate-500 truncate mt-0.5">
                                                            {c.clientName ? `Клієнт: ${c.clientName}` : "Клієнт невідомо"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant="default"
                                                    className={`text-xs ${c.isActive ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-700 border-red-200"}`}
                                                >
                                                    {c.isActive ? "Active" : "Inactive"}
                                                </Badge>


                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-600">
                                                <MapPin className="w-4 h-4 text-emerald-500" />
                                                <span>{c.fromLocation || "N/A"}</span>
                                                <span className="mx-2 text-slate-300">→</span>
                                                <span>{c.toLocation || "N/A"}</span>
                                                <MapPin className="w-4 h-4 text-red-500" />
                                            </div>

                                            <div className="grid grid-cols-4 gap-2">
                                                {c.weightKg && (
                                                    <div className="bg-slate-50 rounded-xl p-2 text-center">
                                                        <Weight className="mx-auto text-slate-400" />
                                                        <p className="text-sm font-semibold mt-1">{c.weightKg} кг</p>
                                                    </div>
                                                )}
                                                <div className="bg-slate-50 rounded-xl p-2 text-center">
                                                    <Box className="mx-auto text-slate-400" />
                                                    <p className="text-sm font-semibold mt-1">{c.directionForward || "-"}</p>
                                                </div>
                                                {c.price && (
                                                    <div className="bg-green-50 border border-green-200 rounded-xl p-2 text-center flex flex-col items-center justify-center shadow-sm">
                                                        <HandCoins className="mx-auto text-slate-400" />
                                                        <p className="text-sm font-semibold mt-1">{c.price} {c.currency}</p>
                                                    </div>
                                                )}
                                                {c.price && selectedOrder && (
                                                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-2 text-center flex flex-col items-center justify-center shadow-sm">
                                                        <p className="text-xs text-yellow-600">Комісія</p>
                                                        <p className="text-sm font-semibold mt-1">
                                                            {((c.price * selectedOrder.percentage) / 100).toFixed(2)} {c.currency}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 italic">Немає вантажів</p>
                            )}
                        </div>

                        {cargoDetails.length > 0 && selectedOrder && (
                            <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
                                <p className="text-sm font-semibold text-slate-600">Комісія від {selectedOrder.percentage}%:</p>

                                {Object.entries(
                                    cargoDetails.reduce<Record<string, number>>((acc, c) => {
                                        if (!c.price || !c.currency) return acc;
                                        const commission = (c.price * selectedOrder.percentage) / 100;
                                        acc[c.currency] = (acc[c.currency] || 0) + commission;
                                        return acc;
                                    }, {})
                                ).map(([currency, total]) => (
                                    <p key={currency} className="text-sm font-bold text-slate-900">
                                        {total.toFixed(2)} {currency}
                                    </p>
                                ))}
                            </div>
                        )}

                    </div>
                )}
            </CardModal>
        </main>
    );
};

export default Orders;
