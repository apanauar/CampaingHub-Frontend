import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import { planSchema, PRECIOS, MESES, ANIOS } from "../validators/plan.validators"
import { api } from "../config/api.config"
import { actualizarPlan } from "../features/auth.slice"
import { toast } from "sonner"

const CambioPlan = () => {

    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)
    const usuario = useSelector(state => state.auth.usuario)
    const [abierto, setAbierto] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errorApi, setErrorApi] = useState("")

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isValid },
    } = useForm({
        resolver: joiResolver(planSchema),
        mode: "onChange",
        defaultValues: { ciclo: "mensual", titular: "", numero: "", mes: "", anio: "", cvv: "", aceptaTerminos: false }
    })

    const ciclo = watch("ciclo");
    const numero = watch("numero");

    let marca = "";
    if (numero.startsWith("4")) {
        marca = "visa";
    } else if (/^5[1-5]/.test(numero) || /^2[2-7]/.test(numero)) {
        marca = "mastercard";
    }

    const abrir = () => {
        reset();
        setErrorApi("");
        setAbierto(true);
    }

    const confirmar = () => {
        setLoading(true);
        setErrorApi("");

        api.patch("/usuarios/me/plan", {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
                dispatch(actualizarPlan(response.data));
                reset();
                setAbierto(false);
                toast.success("¡Listo! Ahora tenés el plan Premium");
            })
            .catch((error) => {
                setErrorApi(error.response?.data?.error || "No se pudo cambiar el plan");
            })
            .finally(() => {
                setLoading(false);
            })
    }

    if (usuario.plan === "premium") {
        return (
            <div className="card">
                <h2><i className="fas fa-crown"></i> Plan Premium</h2>
                <ul className="plan-beneficios">
                    <li><i className="fas fa-check"></i>Campañas ilimitadas</li>
                    <li><i className="fas fa-check"></i>Sin el límite de 4 campañas del plan Plus</li>
                </ul>
                <p className="texto-suave">Ya tenés el plan más completo.</p>
            </div>
        )
    }

    return (
        <div className="card">
            <h2><i className="fas fa-crown"></i> Pasate a Premium</h2>
            <ul className="plan-beneficios">
                <li><i className="fas fa-check"></i>Campañas ilimitadas</li>
                <li><i className="fas fa-check"></i>Sin perder tus campañas actuales</li>
                <li><i className="fas fa-check"></i>Se activa al instante</li>
            </ul>
            <button className="btn btn-premium btn-block" onClick={abrir}>
                <i className="fas fa-crown"></i> Cambiar a Premium
            </button>

            {abierto &&
                <div className="modal-fondo">
                    <div className="modal">
                        <h2><i className="fas fa-crown"></i> Activar plan Premium</h2>

                        <div className="alerta alerta-aviso">
                            <i className="fas fa-flask"></i>
                            <span>Modo demo: no se realiza ningún cobro y la tarjeta no se guarda. Probá con Visa 4111111111111111 o Mastercard 5555555555554444.</span>
                        </div>

                        {errorApi && <div className="alerta alerta-error"><i className="fas fa-circle-exclamation"></i> {errorApi}</div>}

                        <form onSubmit={handleSubmit(confirmar)}>
                            <div className="opciones-plan">
                                <label className={ciclo === "mensual" ? "opcion-plan seleccionada" : "opcion-plan"}>
                                    <input {...register("ciclo")} type="radio" value="mensual" /> Mensual
                                    <strong>USD {PRECIOS.mensual}<small>/mes</small></strong>
                                </label>
                                <label className={ciclo === "anual" ? "opcion-plan seleccionada" : "opcion-plan"}>
                                    <input {...register("ciclo")} type="radio" value="anual" /> Anual
                                    <strong>USD {PRECIOS.anual}<small>/año</small></strong>
                                    <span className="badge badge-premium">2 meses gratis</span>
                                </label>
                            </div>

                            <div className="form-group">
                                <label htmlFor="titular">Nombre del titular</label>
                                <input {...register("titular")} type="text" id="titular" placeholder="Como figura en la tarjeta"
                                    autoComplete="off" className={errors.titular ? "input-error" : ""} />
                                <span className="error">{errors.titular?.message}</span>
                            </div>

                            <div className="form-group">
                                <label htmlFor="numero">Número de tarjeta</label>
                                <div className="input-tarjeta">
                                    <input {...register("numero")} type="text" id="numero" inputMode="numeric" maxLength="16"
                                        placeholder="1234567812345678" autoComplete="off"
                                        className={errors.numero ? "input-error" : ""} />
                                    {marca === "visa" && <i className="fab fa-cc-visa marca"></i>}
                                    {marca === "mastercard" && <i className="fab fa-cc-mastercard marca"></i>}
                                </div>
                                <span className="error">{errors.numero?.message}</span>
                            </div>

                            <div className="tarjeta-fila">
                                <div className="form-group">
                                    <label htmlFor="mes">Mes</label>
                                    <select {...register("mes")} id="mes" className={errors.mes ? "input-error" : ""}>
                                        <option value="">MM</option>
                                        {MESES.map(m => <option key={m} value={m}>{m < 10 ? `0${m}` : m}</option>)}
                                    </select>
                                    <span className="error">{errors.mes?.message}</span>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="anio">Año</label>
                                    <select {...register("anio")} id="anio" className={errors.anio ? "input-error" : ""}>
                                        <option value="">AAAA</option>
                                        {ANIOS.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                    <span className="error">{errors.anio?.message}</span>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cvv">CVV</label>
                                    <input {...register("cvv")} type="password" id="cvv" inputMode="numeric" maxLength="3"
                                        placeholder="123" autoComplete="off" className={errors.cvv ? "input-error" : ""} />
                                    <span className="error">{errors.cvv?.message}</span>
                                </div>
                            </div>

                            <div className="resumen-pago">
                                <span>Total a pagar hoy</span>
                                <strong>USD {PRECIOS[ciclo]}</strong>
                            </div>

                            <label className="terminos">
                                <input {...register("aceptaTerminos")} type="checkbox" />
                                Acepto los términos y condiciones del plan Premium
                            </label>
                            <span className="error">{errors.aceptaTerminos?.message}</span>

                            <div className="modal-acciones">
                                <button type="button" className="btn btn-secundario" onClick={() => setAbierto(false)} disabled={loading}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-premium" disabled={!isValid || loading}>
                                    {loading ? <><i className="fas fa-spinner fa-spin"></i> Activando...</> : <><i className="fas fa-lock"></i> Pagar USD {PRECIOS[ciclo]}</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </div>
    )
}

export default CambioPlan