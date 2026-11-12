import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import { edicionSchema, TRANSICIONES } from "../validators/campania.validators"
import { api } from "../config/api.config"
import { actualizarCampania } from "../features/campanias.slice"
import { toast } from "sonner"

const CampaniaEditar = ({ _id, nombre, cliente, presupuesto, estado, tipo, canales, cerrar }) => {

    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)
    const [loading, setLoading] = useState(false)
    const [errorApi, setErrorApi] = useState("")

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: joiResolver(edicionSchema),
        mode: "onChange",
        defaultValues: { nombre, cliente, presupuesto, estado }
    })

    const estadosPosibles = [estado, ...TRANSICIONES[estado]];

    const guardar = (data) => {
        setLoading(true);
        setErrorApi("");

        api.patch(`/campanias/${_id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                dispatch(actualizarCampania(response.data.campania));
                toast.success("Campaña actualizada");
                cerrar();
            })
            .catch((error) => {
                setErrorApi(error.response?.data?.error || "No se pudo guardar");
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return (
        <tr className="editando">
            <td>
                <input {...register("nombre")} type="text" placeholder="Nombre" className={errors.nombre ? "input-error" : ""} />
                <span className="error">{errors.nombre?.message}</span>
                <input {...register("cliente")} type="text" placeholder="Cliente" className={errors.cliente ? "input-error" : ""} />
                <span className="error">{errors.cliente?.message}</span>
                {errorApi && <span className="error">{errorApi}</span>}
            </td>
            <td>{tipo?.nombre}</td>
            <td>
                <div className="canales">
                    {canales.map(c => <span key={c} className="canal">{c}</span>)}
                </div>
            </td>
            <td>
                <input {...register("presupuesto")} type="number" title="Presupuesto" className={errors.presupuesto ? "input-error" : ""} />
                <span className="error">{errors.presupuesto?.message}</span>
            </td>
            <td>
                <select {...register("estado")}>
                    {estadosPosibles.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
            </td>
            <td>
                <div className="acciones">
                    <button type="button" className="btn btn-icono exito" title="Guardar"
                        onClick={handleSubmit(guardar)} disabled={!isValid || loading}>
                        {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>}
                    </button>
                    <button type="button" className="btn btn-icono" title="Cancelar" onClick={cerrar}>
                        <i className="fas fa-xmark"></i>
                    </button>
                </div>
            </td>
        </tr>
    )
}

export default CampaniaEditar