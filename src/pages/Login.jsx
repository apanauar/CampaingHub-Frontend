import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useDispatch } from "react-redux"
import { useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import { loginSchema } from "../validators/auth.validators"
import { api } from "../config/api.config"
import { iniciarSesion } from "../features/auth.slice"

const Login = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorApi, setErrorApi] = useState("")

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: joiResolver(loginSchema),
        mode: "onChange"
    })

    const ingresar = (data) => {
        setLoading(true);
        setErrorApi("");

        api.post("/auth/login", data)
            .then((response) => {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
                dispatch(iniciarSesion(response.data));

                if (response.data.usuario.rol === "admin") {
                    navigate("/admin/tipos");
                } else {
                    navigate("/dashboard");
                }
            })
            .catch((error) => {
                setErrorApi(error.response?.data?.error || "No se pudo conectar con el servidor");
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <Link to="/" className="app-logo"><i className="fas fa-bullhorn"></i><span>Campaign Hub</span></Link>

                <div className="card">
                    <h1>Ingresar</h1>
                    <p className="texto-suave">Gestioná las campañas de tus clientes en un solo lugar.</p>

                    {errorApi && <div className="alerta alerta-error"><i className="fas fa-circle-exclamation"></i> {errorApi}</div>}

                    <form onSubmit={handleSubmit(ingresar)}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input {...register("email")} type="email" id="email" placeholder="tu@email.com"
                                className={errors.email ? "input-error" : ""} />
                            <span className="error">{errors.email?.message}</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <input {...register("password")} type="password" id="password" placeholder="••••••••"
                                className={errors.password ? "input-error" : ""} />
                            <span className="error">{errors.password?.message}</span>
                        </div>

                        <button type="submit" className="btn btn-block" disabled={!isValid || loading}>
                            {loading ? <><i className="fas fa-spinner fa-spin"></i> Ingresando...</> : "Ingresar"}
                        </button>
                    </form>
                </div>

                <p className="auth-link">¿No tenés cuenta? <Link to="/registro">Registrate</Link></p>
            </div>
        </div>
    )
}

export default Login