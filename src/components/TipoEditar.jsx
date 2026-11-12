import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import { tipoSchema } from "../validators/tipo.validators"
import { api } from "../config/api.config"
import { actualizarTipo } from "../features/tipos.slice"
import { toast } from "sonner"

const TipoEditar = ({ _id, nombre, descripcion, cerrar }) => {

    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)
    const [loading, setLoading] = useState(false)
    const [errorApi, setErrorApi] = useState("")

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: joiResolver(tipoSchema),
        mode: "onChange",
        defaultValues: { nombre, descripcion }
    })

    const guardar = (data) => {
        setLoading(true);
        setErrorApi("");

        api.patch(`/tipos-campania/${_id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                dispatch(actualizarTipo(response.data.tipo));
                toast.success("Tipo actualizado");
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
                {errorApi && <span className="error">{errorApi}</span>}
            </td>
            <td>
                <input {...register("descripcion")} type="text" placeholder="Descripción" className={errors.descripcion ? "input-error" : ""} />
                <span className="error">{errors.descripcion?.message}</span>
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

export default TipoEditar