import { Navigate, Outlet } from "react-router";
import {getUserRole} from "../../ utils/auth.ts";

interface AdminRouteProps {
    redirectPath?: string;
}
const ProtectedRoute = ({ redirectPath = "/dashboard" }: AdminRouteProps) => {
    const role = getUserRole();

    if (role !== "Admin") {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
