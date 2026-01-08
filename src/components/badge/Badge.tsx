import type { FC, HTMLAttributes } from "react";
import { cn } from "../../helpers/cn";

type BadgeVariant = "default" | "outline" | "active" | "inactive";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
    default:
        "bg-blue-600 text-white border border-blue-600",

    outline:
        "bg-transparent text-slate-700 border border-slate-300",

    active:
        "bg-emerald-100 text-emerald-700 border border-emerald-200",

    inactive:
        "bg-red-100 text-red-700 border border-red-200",
};

export const Badge: FC<BadgeProps> = ({
                                          variant = "default",
                                          className,
                                          children,
                                          ...props
                                      }) => {
    return (
        <div
            {...props}
            className={cn(
                "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold",
                variantClasses[variant],
                className
            )}
        >
            {children}
        </div>
    );
};
