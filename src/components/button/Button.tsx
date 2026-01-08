import type { ButtonHTMLAttributes, FC } from "react";
import { cn } from "../../helpers/cn";

type ButtonVariant = "default" | "ghost" | "outline";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
    default:
        "bg-indigo-600 text-white hover:bg-indigo-700",

    ghost:
        "bg-transparent text-slate-700 hover:bg-slate-100",

    outline:
        "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
};

export const Button: FC<ButtonProps> = ({
                                            variant = "default",
                                            size = "md",
                                            className,
                                            children,
                                            ...props
                                        }) => {
    return (
        <button
            {...props}
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                "[&_svg]:pointer-events-none [&_svg]:shrink-0",
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
        >
            {children}
        </button>
    );
};
