

import StatCard from "../../components/dashboard/StatCard.tsx";
import {
    ClipboardList,
    DollarSign,
    Package,
    Truck,
} from "lucide-react";
import {useEffect, useState} from "react";
import {useStatistics} from "../../hooks/statistics/useStatistics.ts";
import type {
    CargoCountResponse,
    CarrierCountResponse,
    OrderCountResponse,
    WeeklyActivityResponse
} from "../../types/statistics.type.ts";
import {usePayments} from "../../hooks/payment/usePayments.ts";
import type {UserTotalPaymentResponse} from "../../types/payments.type.ts";
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";





const Analytics = () => {
    // const { isOpen } = useSidebarStore();



    // const totalOrders = orderStatuses.reduce((s, o) => s + o.count, 0);
    const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivityResponse[]>([]);

    const {
        getOrderStats,
        getCargoStats,
        getCarrierStats,
        getWeeklyActivity,
    } = useStatistics();

    const { getMyTotalPayments } = usePayments();
    const [orderStats, setOrderStats] = useState<OrderCountResponse | null>(null);
    const [cargoStats, setCargoStats] = useState<CargoCountResponse | null>(null);
    const [carrierStats, setCarrierStats] = useState<CarrierCountResponse | null>(null);

    const [myTotalPayments, setMyTotalPayments] =
        useState<UserTotalPaymentResponse | null>(null);


    useEffect(() => {
        const loadStats = async () => {
            const [
                orders,
                cargos,
                carriers,
                weekly,
                totalPayments,
            ] = await Promise.all([
                getOrderStats(),
                getCargoStats(),
                getCarrierStats(),
                getWeeklyActivity(),
                getMyTotalPayments("Paid"),
            ]);

            if (orders) setOrderStats(orders);
            if (cargos) setCargoStats(cargos);
            if (carriers) setCarrierStats(carriers);
            if (totalPayments) setMyTotalPayments(totalPayments);

            setWeeklyActivity(weekly);
        };

        loadStats();
    }, []);

    const chartData = weeklyActivity.map(d => ({
        name: new Date(d.date).toLocaleDateString("uk-UA", { weekday: "short" }),
        completed: d.completedCount,
        canceled: d.canceledCount
    }));
    return (

                <main className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Аналітика</h1>
                        <p className="text-slate-500 mt-1">Детальний огляд ефективності вашого бізнесу</p>
                    </div>


                    {/*{loading && <p className="text-sm text-gray-500">Loading…</p>}*/}
                    {/*{error && <p className="text-sm text-red-500">{error}</p>}*/}

                    {/* Global stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Загальний дохід"
                            value={
                                myTotalPayments
                                    ? Object.entries(myTotalPayments.totalByCurrency)
                                        .map(([currency, amount]) => `${amount.toFixed(2)} ${currency}`)
                                        .join(" / ")
                                    : "—"
                            }
                            subtitle="Виплачено"
                            icon={DollarSign}
                            gradient="from-emerald-500 to-teal-600"
                        />

                        <StatCard
                            title="Активні замовлення"
                            value={orderStats?.inProgressCount ?? 0}
                            subtitle={`${orderStats?.completedCount ?? 0} завершено`}
                            icon={ClipboardList}
                            gradient="from-blue-500 to-cyan-600"
                        />

                        <StatCard
                            title="Активні вантажі"
                            value={cargoStats?.activeCount ?? 0}
                            subtitle={`${cargoStats?.totalCountCargos ?? 0} всього`}
                            icon={Package}
                            gradient="from-orange-500 to-amber-600"
                        />

                        <StatCard
                            title="Активні перевізники"
                            value={carrierStats?.activeCount ?? 0}
                            subtitle={`${carrierStats?.totalCountCarrier ?? 0} всього`}
                            icon={Truck}
                            gradient="from-violet-500 to-purple-600"
                        />

                    </div>
                    <div className="grid  gap-6">
                        {/* Chart */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Активність за тиждень</h2>
                                    <p className="text-sm text-slate-500">Виконані та Скасовані замовленя</p>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                        <span className="text-slate-600">Виконані</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <span className="text-slate-600">Скасовані</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorCanceled" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#fb2c36" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#fb2c36" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                        <YAxis stroke="#94a3b8" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '12px',
                                                border: 'none',
                                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                        <Area type="monotone" dataKey="canceled" stroke="#fb2c36" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                                        <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={1} fill="url(#colorOrders)" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                </main>
    );
};

export default Analytics;


