import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../../auth/tokenStorage";

export const PrivateRoute = () => {
    const token = getAccessToken();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
