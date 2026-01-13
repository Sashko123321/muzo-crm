import { Outlet } from "react-router";
import Snowfall from 'react-snowfall';
const AuthLayout = () => {
    return (
        <div className="
            min-h-screen
            flex items-center justify-center
            bg-gradient-to-br from-indigo-50 via-white to-purple-50
            relative overflow-hidden
        ">
            <Snowfall color="#7986CB"/> {/* Winter Theme */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />

            <Outlet />
        </div>
    );
};

export default AuthLayout;
