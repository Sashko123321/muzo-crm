import { type FC} from "react";
import { Phone, Truck, User, Weight,Eye } from "lucide-react";
import type { CarrierResponse } from "../../../types/carrier.type.ts";
import { Badge } from "../../../components/badge/Badge.tsx";
import { Button } from "../../../components/button/Button.tsx";

interface CarrierCardProps {
    carrier: CarrierResponse;
    onViewDetails?: (carrier: CarrierResponse) => void;
}

const CarrierCard: FC<CarrierCardProps> = ({ carrier, onViewDetails, }) => {


    return (
        <>
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative">

                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 sm:w-12 aspect-square rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
                            <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>

                        <div className="flex flex-col min-w-0">
                            <h3 className="text-base font-semibold text-slate-900 truncate">
                                {carrier.name || "Без назви"}
                            </h3>
                            <span className="text-xs font-mono text-slate-400 mt-0.5">ID: #{carrier.id}</span>
                        </div>

                    </div>

                    <Badge
                        className={`text-xs shrink-0 ${carrier.isActive ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-700 border-red-200"}`}
                        variant="default"
                    >
                        {carrier.isActive ? "Активний" : "Неактивний"}
                    </Badge>
                </div>

                <div className="mt-4 sm:mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {carrier.phoneNumber && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="w-4 h-4 text-slate-400" /> {carrier.phoneNumber}
                        </div>
                    )}
                    {carrier.telegram && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <User className="w-4 h-4 text-slate-400" /> @{carrier.telegram}
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Truck className="w-4 h-4 text-slate-400" /> {carrier.vehicleType || "-"}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Weight className="w-4 h-4 text-slate-400" /> {carrier.maxLoadKg || "-"} kg
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Truck className="w-4 h-4 text-slate-400" />
                        {carrier.regions.length > 0 ? carrier.regions.join(", ") : "-"}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-slate-500">Доставок</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-slate-900">{carrier.regions.length}</p>
                        <p className="text-xs text-slate-500">Регіонів</p>
                    </div>
                </div>

                <div className="flex gap-2 mt-4 sm:mt-5">
                    <Button
                        onClick={() => onViewDetails?.(carrier)}
                        variant="outline"
                        className="flex-1 gap-2 text-sm"
                    >
                        <Eye className="w-4 h-4" />
                        Детальніше
                    </Button>


                </div>
            </div>

        </>
    );
};

export default CarrierCard;
