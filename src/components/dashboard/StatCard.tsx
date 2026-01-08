import type { ComponentType } from "react";
import { cn } from "../../helpers/cn";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: ComponentType<{ className?: string }>;
    trend?: string;
    trendUp?: boolean;
    gradient?: string;
}

export default function StatCard({
                                     title,
                                     value,
                                     subtitle,
                                     icon: Icon,
                                     trend,
                                     trendUp,
                                     gradient
                                 }: StatCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl p-6",
                gradient
                    ? `bg-gradient-to-br ${gradient} text-white`
                    : "bg-white border border-slate-200"
            )}
        >
            {/* Background decoration */}
            <div
                className={cn(
                    "absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10",
                    gradient ? "bg-white" : "bg-slate-200"
                )}
            />

            <div className="relative">
                <div className="flex items-start justify-between">
                    <div>
                        <p
                            className={cn(
                                "text-sm font-medium",
                                gradient ? "text-white/80" : "text-slate-500"
                            )}
                        >
                            {title}
                        </p>

                        <p
                            className={cn(
                                "text-3xl font-bold mt-2 tracking-tight",
                                gradient ? "text-white" : "text-slate-900"
                            )}
                        >
                            {value}
                        </p>

                        {subtitle && (
                            <p
                                className={cn(
                                    "text-sm mt-1",
                                    gradient ? "text-white/70" : "text-slate-400"
                                )}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {Icon && (
                        <div
                            className={cn(
                                "p-3 rounded-xl",
                                gradient ? "bg-white/20" : "bg-slate-100"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "w-5 h-5",
                                    gradient ? "text-white" : "text-slate-600"
                                )}
                            />
                        </div>
                    )}
                </div>

                {trend && (
                    <div
                        className={cn(
                            "flex items-center gap-1 mt-4 text-sm font-medium",
                            trendUp ? "text-emerald-500" : "text-red-500",
                            gradient &&
                            (trendUp
                                ? "text-emerald-200"
                                : "text-red-200")
                        )}
                    >
                        <span>
                            {trendUp ? "↑" : "↓"} {trend}
                        </span>
                        <span
                            className={cn(
                                gradient ? "text-white/60" : "text-slate-400"
                            )}
                        >
                            vs last month
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
