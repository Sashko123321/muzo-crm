import {Menu as MenuIcon, LogOut, ChevronDown} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { UserResponse } from "../../types/user.type.ts";
import store from "store2";
import { RouterEnum } from "../../config/RouterEnum.ts";

interface HeaderProps {
    onOpenSidebar: () => void;
    title: string;
    user?: UserResponse | null;
}

const Header = ({ onOpenSidebar, title, user }: HeaderProps) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        store.remove("auth-storage-todo");
        store.remove("profile");

        window.location.href = RouterEnum.LOGIN;
    };

    // Закриваємо dropdown при кліку поза ним
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/80">
            <div className="h-full px-4 sm:px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        className="lg:hidden p-2 hover:bg-slate-100 rounded-xl"
                        onClick={onOpenSidebar}
                    >
                        <MenuIcon className="w-5 h-5 text-slate-600" />
                    </button>
                    <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
                </div>

                <div className="relative flex items-center gap-3" ref={containerRef}>
                    {/* Аватар + стрілка */}
                    <div
                        className="flex items-center gap-1 cursor-pointer select-none"
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                    >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600
              flex items-center justify-center text-white text-sm font-semibold">
                            {user
                                ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`
                                : "NA"}
                        </div>
                        <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${
                                isDropdownOpen ? "rotate-180" : "rotate-0"
                            }`}
                        />
                    </div>

                    {/* Dropdown меню з анімацією */}
                    <div
                        className={`
              absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-50
              transform transition-all duration-200 ease-out
              ${isDropdownOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-1 scale-95 pointer-events-none"}
            `}
                    >
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
