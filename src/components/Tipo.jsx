import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../config/api.config"
import { eliminarTipo } from "../features/tipos.slice"
import TipoEditar from "./TipoEditar"
import ModalConfirmar from "./ModalConfirmar"
import { toast } from "sonner"

const Tipo = (props) => {

    const { _id, nombre, descripcion } = props;

    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)
    const [editando, setEditando] = useState(false)
    const [eliminando, setEliminando] = useState(false)
    const [confirmando, setConfirmando] = useState(false)

    const eliminar = () => {
        setEliminando(true);

        api.delete(`/tipos-campania/${_id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                dispatch(eliminarTipo(_id));
                toast.success(`Tipo "${nombre}" eliminado`);
            })
            .catch((error) => {
                toast.error(error.response?.data?.error || "No se pudo eliminar el tipo");
                setEliminando(false);
                setConfirmando(false);
            })
    }

    if (editando) {
        return <TipoEditar {...props} cerrar={() => setEditando(false)} />
    }

    return (
        <tr>
            <td className="campania-nombre">{nombre}</td>
            <td className="texto-suave">{descripcion || "Sin descripción"}</td>
            <td>
                <div className="acciones">
                    <button className="btn btn-icono" title="Editar" onClick={() => setEditando(true)}>
                        <i className="fas fa-pen"></i>
                    </button>
                    <button className="btn btn-icono peligro" title="Eliminar" onClick={() => setConfirmando(true)} disabled={eliminando}>
                        {eliminando ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-trash"></i>}
                    </button>
                </div>

                {confirmando &&
                    <ModalConfirmar
                        titulo="Eliminar tipo de campaña"
                        mensaje={`¿Seguro que querés eliminar "${nombre}"? Esta acción no se puede deshacer.`}
                        textoConfirmar="Eliminar"
                        loading={eliminando}
                        confirmar={eliminar}
                        cancelar={() => setConfirmando(false)}
                    />
                }
            </td>
        </tr>
    )
}

export default Tipo