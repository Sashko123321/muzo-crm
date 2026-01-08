import { User, Package, Eye } from "lucide-react";

import type { ClientResponse } from "../../../types/client.type";
import { Badge } from "../../../components/badge/Badge";
import { Button } from "../../../components/button/Button";
import type {FC} from "react";

interface ClientCardProps {
    client: ClientResponse;
    onView: () => void;
}

const statusLabels = {
    Thinking: "Думають",
    Supported: "Співпрацюємо",
    Declined: "Не співпрацюємо",
};

const statusBadgeVariant = {
    Thinking: "default",
    Supported: "active",
    Declined: "inactive",
} as const;
const ClientCard: FC<ClientCardProps> = ({ client, onView }) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 sm:w-12 aspect-square rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-500/25 shrink-0">
                        <User className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0"> {/* важливо для truncate */}
                        <h3 className="text-sm sm:text-base font-semibold text-slate-900 truncate">{client.name}</h3>
                        <p className="text-xs text-slate-500 truncate">
                            {client.phone || "Без телефону"}
                        </p>
                    </div>
                </div>
                <Badge variant={statusBadgeVariant[client.status]} className="font-medium">
                    {statusLabels[client.status]}
                </Badge>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                <Package className="w-4 h-4" />
                <span>{client.cargoCount} вантажів</span>
            </div>

            <Button
                onClick={onView}
                variant="outline"
                className="w-full mt-4 gap-2"
            >
                <Eye className="w-4 h-4" />
                Детальніше
            </Button>
        </div>
    );
};

export default ClientCard;
