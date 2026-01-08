import { Badge } from "../badge/Badge.tsx";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "../../helpers/cn.ts";
import type { FC, ReactNode } from "react";
import {Eye, Pen, Trash2, X} from "lucide-react";
import {getUserRole} from "../../ utils/auth.ts";

interface CardModalProps {
    open: boolean;
    onClose: (open: boolean) => void;
    title: string;
    badge?: string;
    badgeVariant?: "default" | "active" | "outline" | "inactive";
    children: ReactNode;

    isEdit?: boolean;
    onToggleEdit?: () => void;
    onDelete?: () => void;
}

export const CardModal: FC<CardModalProps> = ({
                                                  open,
                                                  onClose,
                                                  title,
                                                  badge,
                                                  badgeVariant = "default",
                                                  children,
                                                  isEdit = false,
                                                  onToggleEdit,
                                                  onDelete,
                                              }) => {
    const role = getUserRole();
    return (
        <DialogPrimitive.Root open={open} onOpenChange={onClose}>
            <DialogPrimitive.Portal>
                {/* BACKDROP */}
                <DialogPrimitive.Overlay
                    className={cn(
                        "fixed inset-0 bg-black/50",
                        "z-[9999]"
                    )}
                />

                {/* MODAL CONTENT */}
                <DialogPrimitive.Content
                    className={cn(
                        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                        "sm:max-w-lg max-h-[90vh] w-full bg-white rounded-xl p-6 shadow-lg overflow-y-auto",
                        "z-[10000]" // контент вище overlay
                    )}
                >
                    {/* Header */}
                    <div className="pb-4 border-b flex items-center justify-between gap-3 border-gray-200">
                        <div className="flex items-center gap-3">
                            <DialogPrimitive.Title className="text-xl font-semibold">
                                {title}
                            </DialogPrimitive.Title>

                            {badge && (
                                <Badge variant={badgeVariant} className="font-medium">
                                    {badge}
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Delete Button */}
                            {role === "Admin" && isEdit && onDelete && (
                                <button
                                    onClick={onDelete}
                                    className="rounded-md p-1.5 text-red-600 bg-red-50 hover:bg-red-100 transition"
                                    title="Видалити"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}

                            {onToggleEdit && (
                                <button
                                    onClick={onToggleEdit}
                                    className={cn(
                                        "rounded-md p-1.5 transition",
                                        isEdit
                                            ? "text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                                            : "text-slate-500 hover:text-indigo-600 hover:bg-slate-100"
                                    )}
                                >
                                    {isEdit
                                        ? <Eye className="h-4 w-4" />
                                        : <Pen className="h-4 w-4" />

                                    }
                                </button>
                            )}



                            <DialogPrimitive.Close asChild>
                                <button
                                    aria-label="Close"
                                    className="rounded-md p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </DialogPrimitive.Close>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="pt-4">{children}</div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
};

export default CardModal;
