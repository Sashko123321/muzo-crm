import { Eye, Phone } from "lucide-react";
import { type FC, useEffect, useState } from "react";

import { Button } from "../../../components/button/Button.tsx";
import { Badge } from "../../../components/badge/Badge.tsx";

import { usePayments } from "../../../hooks/payment/usePayments.ts";

import type { RoleType } from "../../../types/user.type.ts";
import type { Currency } from "../../../types/cargo.type.ts";


const getInitials = (firstName?: string, lastName?: string): string => {
    const name = `${firstName ?? ""} ${lastName ?? ""}`.trim();
    if (!name) return "U";

    return name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

const currencySymbols: Record<Currency, string> = {
    USD: "$",
    EUR: "€",
    UAH: "₴",
};


interface TeamMember {
    id: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    role: RoleType;
    isActive: boolean;
}

interface TeamMemberCardProps {
    member: TeamMember;
    onViewDetails: (member: TeamMember) => void;
}


export const MemberCard: FC<TeamMemberCardProps> = ({ member, onViewDetails }) => {
    const { getUserTotalPayments } = usePayments();

    const [revenueByCurrency, setRevenueByCurrency] = useState<Record<Currency, number>>({
        USD: 0,
        EUR: 0,
        UAH: 0,
    });

    const fullName = `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim();

    useEffect(() => {
        const loadStats = async () => {

            const payments = await getUserTotalPayments(member.id, "Paid");
            setRevenueByCurrency(prev => ({
                ...prev,
                ...(payments?.totalByCurrency ?? {}),
            }));
        };

        loadStats();
    }, [member.id]);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col">
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-semibold text-lg shrink-0">
                    {getInitials(member.firstName, member.lastName)}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 truncate">
                            {fullName || "Без імені"}
                        </h3>

                        <Badge
                            variant={member.isActive ? "active" : "inactive"}
                            className="text-xs px-2 py-0.5 shrink-0"
                        >
                            {member.isActive ? "Активний" : "Неактивний"}
                        </Badge>
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5">
                        {member.role}
                    </p>
                </div>
            </div>

            <div className="mt-4">
                <div className="rounded-xl bg-slate-50 p-4 space-y-3">
                    <p className="text-xs text-slate-500 text-center uppercase tracking-wide">
                        Заробіток
                    </p>

                    {Object.values(revenueByCurrency).some(v => v > 0) ? (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-lm">
                            {Object.entries(revenueByCurrency)
                                .filter(([, amount]) => amount > 0)
                                .slice(0, 4)
                                .map(([currency, amount]) => (
                                    <div key={currency} className="flex items-center gap-1">
                                        <span className="text-slate-600">{currencySymbols[currency as Currency]}</span>
                                        <span className="font-semibold text-slate-900">{amount.toLocaleString()}</span>
                                    </div>
                                ))}
                        </div>

                    ) : (
                        <p className="text-sm text-slate-400 text-center">
                            Немає доходу
                        </p>
                    )}

                    {Object.entries(revenueByCurrency).filter(([, a]) => a > 0).length > 4 && (
                        <p className="text-xs text-slate-500 text-center">
                            +{Object.entries(revenueByCurrency).filter(([, a]) => a > 0).length - 4} валют
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 space-y-3">
                {member.phoneNumber && (
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span>{member.phoneNumber}</span>
                    </div>
                )}

                <Button
                    onClick={() => onViewDetails(member)}
                    className="w-full gap-2 rounded-xl bg-slate-900"
                >
                    <Eye className="w-4 h-4" />
                    Детальніше
                </Button>
            </div>
        </div>
    );
};
