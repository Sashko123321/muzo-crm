import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { FC, ReactNode } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "../../helpers/cn.ts";

interface AddModalProps {
    open: boolean;
    onClose: (open: boolean) => void;

    title: string;
    description?: string;

    children: ReactNode;

    footer?: ReactNode; // кнопки ззовні (Create / Cancel)
}

const AddModal: FC<AddModalProps> = ({
                                         open,
                                         onClose,
                                         title,
                                         description,
                                         children,
                                         footer,
                                     }) => {
    return (
        <DialogPrimitive.Root open={open} onOpenChange={onClose}>
            <DialogPrimitive.Portal>
                {/* BACKDROP */}
                <DialogPrimitive.Overlay
                    className={cn(
                        "fixed inset-0 bg-black/50",
                        "z-[9999]" // ставимо великий z-index
                    )}
                />

                {/* MODAL CONTENT */}
                <DialogPrimitive.Content
                    className={cn(
                        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                        "sm:max-w-lg max-h-[90vh] w-full",
                        "bg-white rounded-xl shadow-lg flex flex-col",
                        "z-[10000]" // content ще вище, ніж overlay
                    )}
                >
                    {/* ================= HEADER ================= */}
                    <div className="p-6 border-b border-gray-200 flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                                <Plus className="w-5 h-5" />
                            </div>

                            <div>
                                <DialogPrimitive.Title className="text-xl font-semibold">
                                    {title}
                                </DialogPrimitive.Title>

                                {description && (
                                    <p className="text-sm text-slate-500 mt-1">
                                        {description}
                                    </p>
                                )}
                            </div>
                        </div>

                        <DialogPrimitive.Close asChild>
                            <button
                                aria-label="Close"
                                className="
                                    rounded-md p-1.5 text-slate-500
                                    hover:text-slate-900 hover:bg-slate-100
                                    transition focus:outline-none focus:ring-2 focus:ring-slate-400
                                "
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </DialogPrimitive.Close>
                    </div>

                    {/* ================= CONTENT ================= */}
                    <div className="p-6 overflow-y-auto flex-1">{children}</div>

                    {/* ================= FOOTER ================= */}
                    {footer && (
                        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                            {footer}
                        </div>
                    )}
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
};

export default AddModal;
