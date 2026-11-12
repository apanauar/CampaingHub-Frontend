import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import { campaniaSchema, CANALES } from "../validators/campania.validators"
import { api } from "../config/api.config"
import { agregarCampania } from "../features/campanias.slice"
import { toast } from "sonner"

const CampaniaForm = () => {

    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)
    const tipos = useSelector(state => state.tipos.lista)
    const [loading, setLoading] = useState(false)
    const [errorApi, setErrorApi] = useState("")

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm({
        resolver: joiResolver(campaniaSchema),
        mode: "onChange"
    })

    const crear = (data) => {
        setLoading(true);
        setErrorApi("");

        api.post("/campanias", data, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                dispatch(agregarCampania(response.data.campania));
                toast.success(`Campaña "${response.data.campania.nombre}" creada`);
                reset();
            })
            .catch((error) => {
                setErrorApi(error.response?.data?.error || "No se pudo conectar con el servidor");
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return (
        <div className="card">
            <h2><i className="fas fa-plus"></i> Nueva campaña</h2>

            {errorApi && <div className="alerta alerta-error"><i className="fas fa-circle-exclamation"></i> {errorApi}</div>}

            <form onSubmit={handleSubmit(crear)}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input {...register("nombre")} type="text" id="nombre" placeholder="Lanzamiento de verano"
                            className={errors.nombre ? "input-error" : ""} />
                        <span className="error">{errors.nombre?.message}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="cliente">Cliente</label>
                        <input {...register("cliente")} type="text" id="cliente" placeholder="Visual Shop"
                            className={errors.cliente ? "input-error" : ""} />
                        <span className="error">{errors.cliente?.message}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="tipo">Tipo de campaña</label>
                        <select {...register("tipo")} id="tipo" className={errors.tipo ? "input-error" : ""}>
                            <option value="">Elegí un tipo</option>
                            {tipos.map(t => <option key={t._id} value={t._id}>{t.nombre}</option>)}
                        </select>
                        <span className="error">{errors.tipo?.message}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="presupuesto">Presupuesto (USD)</label>
                        <input {...register("presupuesto")} type="number" id="presupuesto" placeholder="1500"
                            className={errors.presupuesto ? "input-error" : ""} />
                        <span className="error">{errors.presupuesto?.message}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaInicio">Fecha de inicio</label>
                        <input {...register("fechaInicio")} type="date" id="fechaInicio"
                            className={errors.fechaInicio ? "input-error" : ""} />
                        <span className="error">{errors.fechaInicio?.message}</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaFin">Fecha de fin</label>
                        <input {...register("fechaFin")} type="date" id="fechaFin"
                            className={errors.fechaFin ? "input-error" : ""} />
                        <span className="error">{errors.fechaFin?.message}</span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Canales</label>
                    <div className="checks">
                        {CANALES.map(c => (
                            <label key={c}>
                                <input {...register("canales")} type="checkbox" value={c} /> {c}
                            </label>
                        ))}
                    </div>
                    <span className="error">{errors.canales?.message}</span>
                </div>

                <div className="form-group">
                    <label htmlFor="objetivo">Objetivo</label>
                    <textarea {...register("objetivo")} id="objetivo" rows="2" placeholder="Aumentar las ventas de la temporada"
                        className={errors.objetivo ? "input-error" : ""}></textarea>
                    <span className="error">{errors.objetivo?.message}</span>
                </div>

                <button type="submit" className="btn" disabled={!isValid || loading}>
                    {loading ? <><i className="fas fa-spinner fa-spin"></i> Creando...</> : <><i className="fas fa-plus"></i> Crear campaña</>}
                </button>
            </form>
        </div>
    )
}

export default CampaniaForm