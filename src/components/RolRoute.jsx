import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router"

const RolRoute = ({ rolesPermitidos }) => {

    const usuario = useSelector(state => state.auth.usuario);

    if (!rolesPermitidos.includes(usuario.rol)) {
        return <Navigate to={usuario.rol === "admin" ? "/admin/tipos" : "/dashboard"} replace />
    }

    return <Outlet />
}

export default RolRoute