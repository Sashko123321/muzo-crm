import Providers from "./providers/Providers.tsx";
import { Route, Routes } from "react-router";
import { RouterEnum } from "./config/RouterEnum.ts";
import Carriers from "./screens/carriers/Carriers.tsx";
import Cargos from "./screens/cargos/Cargos.tsx";
import Orders from "./screens/orders/Orders.tsx";
import NotFound from "./screens/not-found/NotFound.tsx";
import Dashboard from "./screens/dashboard/Dashboard.tsx";
import Analytics from "./screens/analytics/Analytics.tsx";
import Members from "./screens/team/Members.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
import AuthLayout from "./layouts/AuthLayout.tsx";
import Login from "./screens/auth/login/Login.tsx";
import Main from "./screens/main/Main.tsx";
import {useUser} from "./hooks/user/useUser.ts";
import ProtectedRoute from "./components/common/ProtectedRoute.tsx";
import Payments from "./screens/payments/Payments.tsx";
import Clients from "./screens/clients/Clients.tsx";


function App() {
    const { getProfile } = useUser(); // береш хук
    return (
        <Providers>
            <Routes>

                {/* AUTH */}
                <Route element={<AuthLayout />}>
                    <Route path={RouterEnum.LOGIN} element={<Login />} />
                </Route>

                {/* MAIN APP */}
                <Route element={<MainLayout getProfile={getProfile} />}>
                    <Route path={RouterEnum.DASHBOARD} element={<Dashboard />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path={RouterEnum.MEMBERS} element={<Members />} />
                        <Route path={RouterEnum.ANALYTICS} element={<Analytics />} />
                        <Route path={RouterEnum.PAYMENTS} element={<Payments />} />
                    </Route>
                    <Route path={RouterEnum.CARGOS} element={<Cargos />} />
                    <Route path={RouterEnum.CLIENTS} element={<Clients/>} />
                    <Route path={RouterEnum.CARRIERS} element={<Carriers />} />
                    <Route path={RouterEnum.ORDERS} element={<Orders />} />
                </Route>
                <Route path={RouterEnum.MAIN} element={<Main/>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Providers>
    );
}


export default App;
