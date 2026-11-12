import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useDispatch } from "react-redux"
import { useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import { registroSchema } from "../validators/auth.validators"
import { api } from "../config/api.config"
import { iniciarSesion } from "../features/auth.slice"

const Registro = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorApi, setErrorApi] = useState("")

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: joiResolver(registroSchema),
        mode: "onChange"
    })

    const registrarse = (data) => {
        setLoading(true);
        setErrorApi("");

        const nuevoUsuario = {
            nombre: data.nombre,
            email: data.email,
            password: data.password
        }

        api.post("/auth/register", nuevoUsuario)
            .then((response) => {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
                dispatch(iniciarSesion(response.data));
                navigate("/dashboard");
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
                    <h1>Crear cuenta</h1>
                    <p className="texto-suave">Empezás en el plan Plus: hasta 4 campañas gratis.</p>

                    {errorApi && <div className="alerta alerta-error"><i className="fas fa-circle-exclamation"></i> {errorApi}</div>}

                    <form onSubmit={handleSubmit(registrarse)}>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input {...register("nombre")} type="text" id="nombre" placeholder="Tu nombre"
                                className={errors.nombre ? "input-error" : ""} />
                            <span className="error">{errors.nombre?.message}</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input {...register("email")} type="email" id="email" placeholder="tu@email.com"
                                className={errors.email ? "input-error" : ""} />
                            <span className="error">{errors.email?.message}</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <input {...register("password")} type="password" id="password" placeholder="Mínimo 8 caracteres"
                                className={errors.password ? "input-error" : ""} />
                            <span className="error">{errors.password?.message}</span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="repetirPassword">Repetir contraseña</label>
                            <input {...register("repetirPassword")} type="password" id="repetirPassword" placeholder="Repetí la contraseña"
                                className={errors.repetirPassword ? "input-error" : ""} />
                            <span className="error">{errors.repetirPassword?.message}</span>
                        </div>

                        <button type="submit" className="btn btn-block" disabled={!isValid || loading}>
                            {loading ? <><i className="fas fa-spinner fa-spin"></i> Creando cuenta...</> : "Registrarme"}
                        </button>
                    </form>
                </div>

                <p className="auth-link">¿Ya tenés cuenta? <Link to="/">Ingresá</Link></p>
            </div>
        </div>
    )
}

export default Registro