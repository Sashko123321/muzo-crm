import type { FC, ButtonHTMLAttributes } from "react";
import { cn } from "../../helpers/cn";

interface FilterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
    label: string;
}

export const FilterButton: FC<FilterButtonProps> = ({
                                                        active = false,
                                                        label,
                                                        className,
                                                        ...props
                                                    }) => {
    return (
        <button
            type="button"
            {...props}
            className={cn(
                "h-9 px-4 rounded-lg text-sm font-medium border transition-colors",
                active
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100",
                className
            )}
        >
            {label}
        </button>
    );
};

export default FilterButton;
