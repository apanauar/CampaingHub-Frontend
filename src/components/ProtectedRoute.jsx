import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router"

const ProtectedRoute = () => {

    const token = useSelector(state => state.auth.token);

    return (
        token ? <Outlet /> : <Navigate to="/" replace />
    )
}

export default ProtectedRoute