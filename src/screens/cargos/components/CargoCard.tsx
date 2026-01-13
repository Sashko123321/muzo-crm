import {Eye, MapPin, Weight, Package, HandCoins, Compass} from "lucide-react";
import type { FC } from "react";
import type {CargoResponse} from "../../../types/cargo.type.ts";
import { Badge } from "../../../components/badge/Badge.tsx";
import {Button} from "../../../components/button/Button.tsx";

interface CargoCardProps {
    cargo: CargoResponse;
    onViewDetails: (cargo: CargoResponse) => void;
}

export const CargoCard: FC<CargoCardProps> = ({ cargo, onViewDetails }) => {
    const currencyIcons: Record<string, React.ReactNode> = {
        USD: "$",
        EUR: "€",
        UAH: "₴",
    };
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "Н/Д";
        const date = new Date(dateStr);
        return `${date.getDate().toString().padStart(2,"0")}.${(date.getMonth()+1).toString().padStart(2,"0")}.${date.getFullYear()}`;
    };
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">

            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-10 sm:w-12 aspect-square rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 shrink-0">
                        <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    <div className="flex flex-col min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-slate-900 truncate">
                            {cargo.description || "Без опису"}
                        </h3>
                        <span className="text-xs font-mono text-slate-400 mt-0.5">ID: #{cargo.id}</span>
                        <p className="text-xs sm:text-sm text-slate-500 truncate mt-0.5">
                            {cargo.clientName ? `Клієнт: ${cargo.clientName}` : "Клієнт невідомий"}
                        </p>
                    </div>

                </div>
                <Badge
                    className={`text-xs shrink-0 ${cargo.isActive ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-700 border-red-200"}`}
                    variant="default"
                >
                    {cargo.isActive ? "Активний" : "Неактивний"}
                </Badge>
            </div>

            <div className="mt-4 sm:mt-5 space-y-3">
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
                        <span className="text-slate-600 truncate">{cargo.fromLocation || "Н/Д"}</span>
                    </div>
                    <span className="text-slate-300 shrink-0">→</span>
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0 justify-end">
                        <span className="text-slate-600 truncate">{cargo.toLocation || "Н/Д"}</span>
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 shrink-0" />
                    </div>
                </div>
            </div>

            <div className="mt-4 sm:mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                {cargo.weightKg && (
                    <div className="bg-slate-50 rounded-xl p-2 sm:p-3 text-center">
                        <Weight className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 mx-auto" />
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 mt-1">{cargo.weightKg} кг</p>
                    </div>
                )}
                <div className="bg-slate-50 rounded-xl p-2 sm:p-3 text-center">
                    <Compass className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 mx-auto" />
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 mt-1">
                        {cargo.directionForward || "-"}
                    </p>
                </div>
                {cargo.price && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-2 sm:p-3 text-center flex flex-col items-center justify-center shadow-sm">
                        <HandCoins className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 mx-auto" />
                        <p className="text-lg font-semibold text-slate-700">
                            {cargo.price.toLocaleString()} {cargo.currency ? currencyIcons[cargo.currency] : "$"}
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-2 sm:p-3 text-center">
                    <p className="text-xs sm:text-sm text-slate-500">Завантаження з</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{formatDate(cargo.availableFrom)}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-2 sm:p-3 text-center">
                    <p className="text-xs sm:text-sm text-slate-500">Завантаження до</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{formatDate(cargo.availableTo)}</p>
                </div>
            </div>
            <Button
                onClick={() => onViewDetails(cargo)}
                variant="outline"
                className="w-full mt-4 sm:mt-5 gap-2 text-sm"
            >
                <Eye className="w-4 h-4" />
                Детальніше
            </Button>
        </div>
    );
};

export default CargoCard;
