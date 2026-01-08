import {Outlet, useLocation} from "react-router";
import { useState, useEffect } from "react";
import Header from "../components/header/Header.tsx";
import Sidebar from "../components/sidebar/Sidebar.tsx";
import type { UserResponse } from "../types/user.type";

interface MainLayoutProps {
    getProfile: () => Promise<UserResponse | null>; // передаємо хук або функцію з JWT
}

const MainLayout = ({ getProfile }: MainLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profile, setProfile] = useState<UserResponse | null>(() => {
        const raw = localStorage.getItem("profile");
        return raw ? JSON.parse(raw) : null;
    });

    const location = useLocation();
    const currentPageName =
        location.pathname.split("/muzo-crm/")[1] || "Dashboard";

    // Оновлюємо профіль завжди при рендері MainLayout
    useEffect(() => {
        const loadProfile = async () => {
            const data = await getProfile();
            if (data) {
                setProfile(data);
                localStorage.setItem("profile", JSON.stringify(data));
            }
        };

        loadProfile();
    }, [getProfile]); // тут більше немає profile
    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar
                sidebarOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                user={profile}
            />

            <div className="lg:pl-72">
                <Header
                    title={currentPageName}
                    onOpenSidebar={() => setSidebarOpen(true)}
                    user={profile}
                />

                <main className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
