import { Eye, Package, HandCoins } from "lucide-react";
import type { FC } from "react";
import type { OrderResponse } from "../../../types/order.type";
import { Badge } from "../../../components/badge/Badge.tsx";
import { Button } from "../../../components/button/Button.tsx";
// import OrderDetailsModal from "../../../components/modals/OrderDetailsModal.tsx";
import { useState, useEffect } from "react";
import { useCargo } from "../../../hooks/cargo/useCargo";
import type { CargoResponse } from "../../../types/cargo.type.ts";

interface OrderCardProps {
    order: OrderResponse;
    onViewDetails?: (cargo: OrderResponse) => void;
}

const statusColors: Record<OrderResponse["status"], string> = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Accepted: "bg-blue-100 text-blue-800 border-blue-200",
    InProgress: "bg-indigo-100 text-indigo-800 border-indigo-200",
    Completed: "bg-green-100 text-green-800 border-green-200",
    Cancelled: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels: Record<OrderResponse["status"], string> = {
    Pending: "Очікує",
    Accepted: "Прийнято",
    InProgress: "В процесі",
    Completed: "Завершено",
    Cancelled: "Скасовано",
};


const OrderCard: FC<OrderCardProps> = ({ order, onViewDetails }) => {
    // const [showModal, setShowModal] = useState(false);
    const { getOne: getCargo } = useCargo();
    const [cargoDetails, setCargoDetails] = useState<CargoResponse[]>([]);

    useEffect(() => {
        const fetchCargoDetails = async () => {
            const details: CargoResponse[] = [];
            for (const id of order.cargoIds) {
                const cargo = await getCargo(id.toString());
                if (cargo) details.push(cargo);
            }
            setCargoDetails(details);
        };
        fetchCargoDetails();
    }, [order.cargoIds, getCargo]);

    // const cargoText = cargoDetails.map(c => c.description).join(", ");
    // const shortCargoText = cargoText.length > 60 ? cargoText.slice(0, 60) + "..." : cargoText || "-";

    return (
        <>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 p-4 sm:p-6 flex flex-col gap-4">

                {/* HEADER */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="w-10 sm:w-12 aspect-square rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
                            <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>


                        <div className="flex flex-col min-w-0">
                            <h3 className="text-sm sm:text-base font-semibold text-slate-900 truncate">
                                {order.userName || "Без користувача"}
                            </h3>
                            <span className="text-xs font-mono text-slate-400 mt-0.5">ID: #{order.id}</span>

                            {order.carrierName && (
                                <p className="text-xs sm:text-sm text-slate-500 truncate mt-0.5">
                                    Перевізник: {order.carrierName}
                                    {order.carrierId && <span className="font-mono text-slate-400 ml-1">(#{order.carrierId})</span>}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end shrink-0">
                        <Badge className={`text-xs ${statusColors[order.status]}`} variant="default">
                            {statusLabels[order.status]}
                        </Badge>

                    </div>

                </div>

                {/* CARGO INFO */}
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-600 flex-wrap">
                    <Package className="w-4 h-4 text-slate-400 shrink-0" />
                    {cargoDetails.length > 0 ? (
                        <span className="truncate" title={cargoDetails.map(c => c.description).join(", ")}>
            {cargoDetails.map(c => `${c.description || "-"}(#${c.id})`).join(", ")}
        </span>
                    ) : (
                        <span>-</span>
                    )}
                </div>

                {/* FINANCE / METRICS */}
                <div className="mt-2 flex flex-wrap gap-2 text-sm">
                    {/* Суми по валютам */}
                    {order.total && Object.keys(order.total).length > 0 && Object.entries(order.total).map(([currency, amount]) => (
                        <Badge
                            key={currency}
                            className="bg-slate-50 text-slate-900 border-slate-200"
                            variant="default"
                        >
                            {amount.toLocaleString()} {currency}
                        </Badge>
                    ))}

                    {/* Комісія по відсотку для кожної валюти */}
                    {order.total && order.percentage && Object.keys(order.total).length > 0 && Object.entries(order.total).map(([currency, amount]) => (
                        <Badge
                            key={`commission-${currency}`}
                            className="bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-1"
                            variant="default"
                        >
                            <HandCoins className="w-3 h-3" />
                            {(amount * order.percentage / 100).toFixed(2)} {currency} ({order.percentage}%)
                        </Badge>
                    ))}

                    {/* Тип комісії */}
                    {order.commissionFor && (
                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100" variant="default">
                            {order.commissionFor === "Carrier" ? "Комісія перевізника" : "Комісія вантажу"}
                        </Badge>
                    )}
                </div>


                {/* BUTTON */}
                <Button
                    onClick={() => onViewDetails?.(order)}
                    variant="outline"
                    className="w-full mt-3 gap-2 flex justify-center items-center text-sm"
                >
                    <Eye className="w-4 h-4" />
                    Детальніше
                </Button>

            </div>

            {/*{showModal && <OrderDetailsModal order={order} onClose={() => setShowModal(false)} />}*/}
        </>
    );
};

export default OrderCard;
