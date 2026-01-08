
import {Link, useLocation} from "react-router";
import {
    LayoutDashboard,
    BarChart3,
    Users,
    Package,
    Truck,
    ClipboardList,
    HandCoins,
    X, Building2,
} from "lucide-react";
import {RouterEnum} from "../../config/RouterEnum.ts";
import type {UserResponse} from "../../types/user.type.ts";
import {getUserRole} from "../../ utils/auth.ts";

const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, to: RouterEnum.DASHBOARD },
    { name: "Cargos", icon: Package, to: RouterEnum.CARGOS },
    { name: "Carriers", icon: Truck, to: RouterEnum.CARRIERS },
    { name: "Orders", icon: ClipboardList, to: RouterEnum.ORDERS },
    { name: "Analytics", icon: BarChart3, to: RouterEnum.ANALYTICS },
    { name: "Members", icon: Users, to: RouterEnum.MEMBERS },
    { name: "Payments", icon: HandCoins , to: RouterEnum.PAYMENTS },
    { name: "Clients", icon: Building2 , to: RouterEnum.CLIENTS },

];



interface SidebarProps {
    sidebarOpen: boolean;
    onClose: () => void;
    user?: UserResponse | null; // додали user
}

const Sidebar = ({ sidebarOpen, onClose, user}: SidebarProps) => {
    const role = getUserRole();
    const location = useLocation();
    return (
        <>
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-slate-200/80
                    transform transition-transform duration-300 ease-out
                    lg:translate-x-0
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="h-16 flex items-center px-6 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
                                <Truck className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-semibold text-lg text-slate-800">
                                MuzoCRM
                            </span>
                        </div>

                        <button
                            className="ml-auto lg:hidden p-2 hover:bg-slate-100 rounded-lg"
                            onClick={onClose}
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {/* --- Звичайні пункти --- */}
                        {navItems
                            .filter(item => item.name !== "Analytics" && item.name !== "Members" && item.name !== "Payments")
                            .map(item => {
                                const isActive = location.pathname === item.to;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.to}
                                        onClick={onClose}
                                        className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm
                        transition-all
                        ${isActive
                                            ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg"
                                            : "text-slate-600 hover:bg-slate-100"
                                        }
                    `}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                );
                            })
                        }

                        {/* --- Лінія перед адмінськими пунктами --- */}
                        {role === "Admin" && (
                            <div className="my-2 border-t border-slate-200"></div>
                        )}

                        {/* --- Адмінські пункти --- */}
                        {role === "Admin" && navItems
                            .filter(item => item.name === "Analytics" || item.name === "Members" || item.name === "Payments")
                            .map(item => {
                                const isActive = location.pathname === item.to;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.to}
                                        onClick={onClose}
                                        className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm
                        transition-all
                        ${isActive
                                            ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg"
                                            : "text-slate-600 hover:bg-slate-100"
                                        }
                    `}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                );
                            })
                        }
                    </nav>

                    <div className="p-4 border-t border-slate-100">
                        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-semibold">
                                {user
                                    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`
                                    : "NA"}

                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">
                                    {user ? `${user.firstName} ${user.lastName}` : "None "}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                    {user ? user.phoneNumber : "+380000000000"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
