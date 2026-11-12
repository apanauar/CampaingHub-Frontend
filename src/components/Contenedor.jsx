import { Link, NavLink, Outlet, useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { cerrarSesion } from "../features/auth.slice"
import { guardarCampanias } from "../features/campanias.slice"
import { useAxiosInterceptor } from "../hooks/useAxiosInterceptor"

const Contenedor = () => {

    useAxiosInterceptor()

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const usuario = useSelector(state => state.auth.usuario)

    const esAdmin = usuario.rol === "admin";

    const salir = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        dispatch(cerrarSesion());
        dispatch(guardarCampanias([]));
        navigate("/");
    }

    return (
        <>
            <header className="main-header">
                <div className="header-content">
                    <Link to={esAdmin ? "/admin/tipos" : "/dashboard"} className="app-logo">
                        <i className="fas fa-bullhorn"></i><span>Campaign Hub</span>
                    </Link>
                    <nav className="nav">
                        {esAdmin ?
                            <NavLink to="/admin/tipos"><i className="fas fa-tags"></i> Tipos de campaña</NavLink> :
                            <NavLink to="/dashboard"><i className="fas fa-table-columns"></i> Mis campañas</NavLink>
                        }
                    </nav>
                    <div className="user-box">
                        <span className="user-name">{usuario.nombre}</span>
                        {esAdmin ?
                            <span className="badge badge-admin">admin</span> :
                            <span className={`badge badge-${usuario.plan}`}>{usuario.plan}</span>
                        }
                        <button className="logout-btn" onClick={salir} title="Cerrar sesión">
                            <i className="fas fa-right-from-bracket"></i>
                        </button>
                    </div>
                </div>
            </header>
            <Outlet />
        </>
    )
}

export default Contenedor