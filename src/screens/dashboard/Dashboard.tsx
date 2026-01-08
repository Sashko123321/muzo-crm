
import StatCard from "../../components/dashboard/StatCard.tsx";
import {ArrowRight, ClipboardList, DollarSign, Package, Truck} from "lucide-react";
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {Link} from "react-router";
import {RouterEnum} from "../../config/RouterEnum.ts";
import {Badge} from "../../components/badge/Badge.tsx";
import { Button } from "../../components/button/Button.tsx";
import {useEffect, useState} from "react";
import type {UserResponse} from "../../types/user.type.ts";
import type {
    CargoCountResponse,
    CarrierCountResponse,
    OrderCountResponse, RecentOrderResponse, WeeklyActivityResponse,
} from "../../types/statistics.type.ts";
import {useStatistics} from "../../hooks/statistics/useStatistics.ts";
import type {UserTotalPaymentResponse} from "../../types/payments.type.ts";
import {usePayments} from "../../hooks/payment/usePayments.ts";



/* ===================== DASHBOARD ===================== */
const Dashboard = () => {

    const [profile, setProfile] = useState<UserResponse | null>(null);
    const {
        getOrderStats,
        getCargoStats,
        getCarrierStats,
        getWeeklyActivity,
        getRecentOrders
    } = useStatistics();


    const [orderStats, setOrderStats] = useState<OrderCountResponse | null>(null);
    const [cargoStats, setCargoStats] = useState<CargoCountResponse | null>(null);
    const [carrierStats, setCarrierStats] = useState<CarrierCountResponse | null>(null);

    const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivityResponse[]>([]);
    const [recentOrders, setRecentOrders] = useState<RecentOrderResponse[]>([]);
    const { getMyTotalPayments } = usePayments();

    const [myTotalPayments, setMyTotalPayments] =
        useState<UserTotalPaymentResponse | null>(null);
    useEffect(() => {
        const loadProfile = async () => {
            const raw = localStorage.getItem("profile");
            if (raw) {
                const data: UserResponse = JSON.parse(raw);
                setProfile(data);
            }
        };

        loadProfile();
    }, []);

    useEffect(() => {
        const loadStats = async () => {
            const [
                orders,
                cargos,
                carriers,
                weekly,
                totalPayments,
                recent
            ] = await Promise.all([
                getOrderStats(),
                getCargoStats(),
                getCarrierStats(),
                getWeeklyActivity(),
                getMyTotalPayments("Paid"),
                getRecentOrders()
            ]);

            if (orders) setOrderStats(orders);
            if (cargos) setCargoStats(cargos);
            if (carriers) setCarrierStats(carriers);
            if (totalPayments) setMyTotalPayments(totalPayments);

            setWeeklyActivity(weekly);
            setRecentOrders(recent);
        };

        loadStats();
    }, []);

    const statusColors: Record<RecentOrderResponse["status"], string> = {
        Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
        Accepted: "bg-blue-100 text-blue-800 border-blue-200",
        InProgress: "bg-indigo-100 text-indigo-800 border-indigo-200",
        Completed: "bg-green-100 text-green-800 border-green-200",
        Cancelled: "bg-red-100 text-red-800 border-red-200",
    };


    // const chartData = [
    //     { name: "Пн", completed: 0, canceled: 0 },
    //     { name: "Вт", completed: 0, canceled: 0 },
    //     { name: "Ср", completed: 0, canceled: 0 },
    //     { name: "Чт", completed: 0, canceled: 0 },
    //     { name: "Пт", completed: 0, canceled: 0 },
    //     { name: "Сб", completed: 0, canceled: 0 },
    //     { name: "Нд", completed: 0, canceled: 0 },
    // ];
    const chartData = weeklyActivity.map(d => ({
        name: new Date(d.date).toLocaleDateString("uk-UA", { weekday: "short" }),
        completed: d.completedCount,
        canceled: d.canceledCount
    }));


    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Доброго ранку";
        if (hour < 18) return "Доброго дня";
        return "Доброго вечора";
    };
    const currencyIcons: Record<string, React.ReactNode> = {
        USD: "$",
        EUR: "€",
        UAH: "₴",
    };
    return (

                <main className="space-y-6">

                    {/* Welcome section */}
                    <div className="bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
                        <div className="relative">

                            <h1 className="text-3xl font-bold">
                                {getGreeting()}, {profile?.firstName ?? "Користувач"}! 👋
                            </h1>

                            <p className="text-white/80 mt-2 max-w-xl">
                                Ось ваш огляд на сьогодні. У вас {(orderStats?.totalCountOrders ?? 0) - ((orderStats?.canceledCount ?? 0) + (orderStats?.completedCount ?? 0))} замовлення які очікують та {orderStats?.inProgressCount ?? 0} замовлень в дорозі.
                            </p>

                            {/* Personal stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                    <p className="text-white/60 text-sm">Мої замовлення</p>
                                    <p className="text-2xl font-bold mt-1">{orderStats?.totalCountOrders ?? 0}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                    <p className="text-white/60 text-sm">Завершено</p>
                                    <p className="text-2xl font-bold mt-1">{orderStats?.completedCount ?? 0}</p>
                                </div>
                                {/*<div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">*/}
                                {/*    <p className="text-white/60 text-sm">Мій дохід</p>*/}
                                {/*    <p className="text-2xl font-bold mt-1">${"none"}</p>*/}
                                {/*</div>*/}
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                    <p className="text-white/60 text-sm">Ефективність</p>
                                    <p className="text-2xl font-bold mt-1">
                                        {((orderStats?.completedCount ?? 0) - (orderStats?.canceledCount ?? 0)*0.5) / ((orderStats?.completedCount ?? 0) + (orderStats?.canceledCount ?? 0)) *100} %
                                    </p>

                                </div>
                            </div>
                        </div>
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
                                        .map(([currency, amount]) => `${amount.toFixed(2)}${currency ? currencyIcons[currency] : "$"}`)
                                        .join(" / ")
                                    : "—"
                            }
                            subtitle="Виплачено"
                            icon={DollarSign}
                            gradient="from-emerald-500 to-teal-600"
                        />
                        <StatCard
                            title="Активні замовлення"
                            value={(orderStats?.totalCountOrders ?? 0) - ((orderStats?.canceledCount ?? 0) + (orderStats?.completedCount ?? 0))}
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
                    <div className="grid lg:grid-cols-3 gap-6">
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

                        {/* Recent orders */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-slate-900">Останні замовлення</h2>
                                <Link to={RouterEnum.ORDERS}>
                                    <Button variant="ghost" size="sm" className="gap-1 text-indigo-600 hover:text-indigo-700">
                                        Всі <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {recentOrders.length === 0 ? (
                                    <p className="text-sm text-slate-500 text-center py-8">Немає замовлень</p>
                                ) : (
                                    recentOrders.map(order => (
                                        <div key={order.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                                <ClipboardList className="w-5 h-5 text-slate-600" />
                                            </div>

                                            <div className="flex-1">
                                                <p className="font-medium">{order.carrierName}</p>
                                                <p className="text-xs text-slate-500">Замовленння #{order.id}</p>
                                            </div>

                                            <Badge
                                                variant="default"
                                                className={`text-xs shrink-0 ${statusColors[order.status]}`}
                                            >
                                                {order.status}
                                            </Badge>

                                        </div>
                                    ))
                                )}

                            </div>
                        </div>
                    </div>

                </main>
    );
};

export default Dashboard;


