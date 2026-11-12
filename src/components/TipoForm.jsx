import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { joiResolver } from "@hookform/resolvers/joi"
import { tipoSchema } from "../validators/tipo.validators"
import { api } from "../config/api.config"
import { agregarTipo } from "../features/tipos.slice"
import { toast } from "sonner"

const TipoForm = () => {

    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)
    const [loading, setLoading] = useState(false)
    const [errorApi, setErrorApi] = useState("")

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm({
        resolver: joiResolver(tipoSchema),
        mode: "onChange"
    })

    const crear = (data) => {
        setLoading(true);
        setErrorApi("");

        const nuevoTipo = { nombre: data.nombre };
        if (data.descripcion) {
            nuevoTipo.descripcion = data.descripcion;
        }

        api.post("/tipos-campania", nuevoTipo, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                dispatch(agregarTipo(response.data.tipo));
                toast.success(`Tipo "${response.data.tipo.nombre}" creado`);
                reset();
            })
            .catch((error) => {
                setErrorApi(error.response?.data?.error || "No se pudo crear el tipo");
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return (
        <div className="card">
            <h2><i className="fas fa-plus"></i> Nuevo tipo</h2>

            {errorApi && <div className="alerta alerta-error"><i className="fas fa-circle-exclamation"></i> {errorApi}</div>}

            <form onSubmit={handleSubmit(crear)}>
                <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input {...register("nombre")} type="text" id="nombre" placeholder="Lanzamiento"
                        className={errors.nombre ? "input-error" : ""} />
                    <span className="error">{errors.nombre?.message}</span>
                </div>
                <div className="form-group">
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea {...register("descripcion")} id="descripcion" rows="3" placeholder="Campañas de lanzamiento de producto"
                        className={errors.descripcion ? "input-error" : ""}></textarea>
                    <span className="error">{errors.descripcion?.message}</span>
                </div>
                <button type="submit" className="btn btn-block" disabled={!isValid || loading}>
                    {loading ? <><i className="fas fa-spinner fa-spin"></i> Creando...</> : <><i className="fas fa-plus"></i> Crear tipo</>}
                </button>
            </form>
        </div>
    )
}

export default TipoForm