import { useEffect, useMemo, useState } from "react";
import type { OrderPaymentResponse, PaymentQueryParams } from "../../types/payments.type.ts";
import FilterButton from "../../components/button/FilterButton.tsx";
import { HandCoins, Search } from "lucide-react";
import { Badge } from "../../components/badge/Badge.tsx";
import Pagination from "../../components/Pagination.tsx";
import { usePayments } from "../../hooks/payment/usePayments.ts";
import {getUserRole} from "../../ utils/auth.ts";

type PaymentFilter = "All" | "Paid" | "Unpaid";

const Payments = () => {
    const role = getUserRole();
    const { loading, error, getAll, updateStatus, updatePercentage } = usePayments();

    const [payments, setPayments] = useState<OrderPaymentResponse[]>([]);
    const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("All");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const [totalPages, setTotalPages] = useState(1);
// Додати стан локальних відсотків
    const [localPercentages, setLocalPercentages] = useState<Record<number, number>>({});
    // ===================== FETCH PAYMENTS =====================
    useEffect(() => {
        const fetchPayments = async () => {
            const params: PaymentQueryParams = {
                limit: pageSize,
                offset: (currentPage - 1) * pageSize,
                searchField: search || undefined,
            };

            const res = await getAll(params);

            if (res) {
                setPayments(res);
                setTotalPages(Math.ceil(res.length / pageSize) || 1);
            } else {
                setPayments([]);
                setTotalPages(1);
            }
        };

        fetchPayments();
    }, [getAll, currentPage, search]);

    // ===================== FILTER + SEARCH =====================
    const filteredPayments = useMemo(() => {
        return payments.filter(p => {
            const matchPayment =
                paymentFilter === "All" || p.status === paymentFilter;

            const matchSearch =
                p.userId.toString().includes(search) ||
                p.orderId.toString().includes(search) ||
                p.userName.toLowerCase().includes(search.toLowerCase());

            return matchPayment && matchSearch;
        });
    }, [payments, paymentFilter, search]);

// PAY
    const handlePay = async (paymentId: number) => {
        const confirmed = confirm("Підтвердити виплату?");
        if (!confirmed) return;

        const updated = await updateStatus(paymentId.toString(), { status: "Paid" });
        if (updated) {
            setPayments(prev => prev.map(p => (p.id === updated.id ? updated : p)));
        }
    };

// CHANGE PERCENTAGE
//     const handleChangePercentage = async (paymentId: number, value: number) => {
//         const updated = await updatePercentage(paymentId.toString(), { percentage: value });
//         if (updated) {
//             setPayments(prev => prev.map(p => (p.id === updated.id ? updated : p)));
//         }
//     };


    return (
        <main className="p-4 w-full">
            {/* ===================== HEADER ===================== */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Виплати</h1>

                <div className="flex flex-col lg:flex-row justify-between gap-4">
                    {/* Filters */}
                    <div className="flex gap-2">
                        {(["All", "Paid", "Unpaid"] as PaymentFilter[]).map(f => (
                            <FilterButton
                                key={f}
                                label={f === "All" ? "Усі" : f === "Paid" ? "Виплачені" : "Не виплачені"}
                                active={paymentFilter === f}
                                onClick={() => {
                                    setPaymentFilter(f);
                                    setCurrentPage(1);
                                }}
                            />
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            value={search}
                            onChange={e => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Пошук по ID, користувачу"
                            className="
                                w-full h-9 pl-10 pr-3 rounded-xl
                                border border-slate-300
                                text-sm
                                focus:outline-none focus:ring-2 focus:ring-indigo-500
                            "
                        />
                    </div>
                </div>
            </div>

            {/* ===================== CONTENT ===================== */}
            {loading && <p className="text-center text-slate-500">Завантаження...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && filteredPayments.length === 0 && (
                <p className="text-center text-slate-500 mt-10">Немає даних</p>
            )}

            {!loading && filteredPayments.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                        <tr className="text-left text-slate-600">
                            <th className="p-3">ID Замовлення</th>
                            <th className="p-3">Юзер</th>
                            <th className="p-3">Клієнт</th>
                            <th className="p-3">Перевізник</th>
                            <th className="p-3">Зароблено</th>
                            <th className="p-3">Відсотки %</th>
                            <th className="p-3">Фінальна виплата</th>
                            <th className="p-3">Статус виплати</th>
                            <th className="p-3 text-right">Дія</th>
                        </tr>
                        </thead>

                        <tbody>
                        {filteredPayments.map(payment => (
                            <tr
                                key={payment.orderId}
                                className="border-t border-slate-200 hover:bg-slate-50 transition"
                            >
                                <td className="p-3 font-mono">#{payment.orderId}</td>
                                <td className="p-3">{payment.userName}</td>
                                <td className="p-3">{payment.clientName}</td>
                                <td className="p-3">{payment.carrierName}</td>
                                <td className="p-3">
                                    {Object.entries(payment.amountByCurrency).map(([currency, total]) => (
                                        <div key={currency} className="text-sm font-semibold text-slate-900">
                                            {total.toFixed(2)} {currency}
                                        </div>
                                    ))}
                                </td>
                                <td className="p-3">
                                    {payment.status === "Unpaid" ? (
                                        <input
                                            type="number"
                                            min={0}
                                            max={100}
                                            value={localPercentages[payment.id] ?? payment.percentage}
                                            onChange={e => {
                                                const val = Number(e.target.value);
                                                setLocalPercentages(prev => ({ ...prev, [payment.id]: val }));
                                            }}
                                            onBlur={async () => {
                                                const value = localPercentages[payment.id];
                                                if (value !== undefined && value !== payment.percentage) {
                                                    const updated = await updatePercentage(payment.id.toString(), { percentage: value });
                                                    if (updated) {
                                                        setPayments(prev => prev.map(p => (p.id === updated.id ? updated : p)));
                                                    }
                                                }
                                            }}
                                            className="w-16 text-sm px-1 py-0.5 border rounded"
                                        />
                                    ) : (
                                        <span className="text-sm font-semibold text-slate-900">
                                                {payment.percentage}%
                                            </span>
                                    )}
                                </td>
                                <td className="p-3">
                                    {Object.entries(payment.finalAmount).map(([currency, amount]) => (
                                        <div key={currency}>
                                            {currency}: {amount.toFixed(2)}
                                        </div>
                                    ))}
                                </td>

                                <td className="p-3">
                                    <Badge
                                        className={
                                            payment.status === "Paid"
                                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                                : "bg-red-100 text-red-700 border-red-200"
                                        }
                                    >
                                        {payment.status === "Paid" ? "Виплачено" : "Не виплачено"}
                                    </Badge>
                                </td>
                                <td className="p-3 text-right">
                                    {role === "Admin" && payment.status === "Unpaid" && (
                                        <button
                                            onClick={() => handlePay(payment.id)}
                                            className="
                                                    inline-flex items-center gap-2
                                                    h-8 px-3 rounded-lg
                                                    bg-emerald-600 text-white text-xs font-medium
                                                    hover:bg-emerald-700 transition
                                                "
                                        >
                                            <HandCoins size={14} />
                                            Виплатити
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ===================== PAGINATION ===================== */}
            {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            )}
        </main>
    );
};

export default Payments;
