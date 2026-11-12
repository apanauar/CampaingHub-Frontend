import { useState } from "react"
import { Link } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../config/api.config"
import { eliminarCampania } from "../features/campanias.slice"
import CampaniaEditar from "./CampaniaEditar"
import ModalConfirmar from "./ModalConfirmar"
import { toast } from "sonner"

const Campania = (props) => {

    const { _id, nombre, cliente, presupuesto, tipo, canales, fechaInicio, fechaFin, estado } = props;

    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)
    const [editando, setEditando] = useState(false)
    const [eliminando, setEliminando] = useState(false)
    const [confirmando, setConfirmando] = useState(false)

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString("es-UY", { timeZone: "UTC" });
    }

    const eliminar = () => {
        setEliminando(true);

        api.delete(`/campanias/${_id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                dispatch(eliminarCampania(_id));
                toast.success(`Campaña "${nombre}" eliminada`);
            })
            .catch((error) => {
                toast.error(error.response?.data?.error || "No se pudo eliminar la campaña");
                setEliminando(false);
                setConfirmando(false);
            })
    }

    if (editando) {
        return <CampaniaEditar {...props} cerrar={() => setEditando(false)} />
    }

    return (
        <tr>
            <td>
                <Link to={`/campanias/${_id}`} className="campania-nombre">{nombre}</Link>
                <div className="texto-suave">{cliente} · USD {presupuesto}</div>
            </td>
            <td>{tipo?.nombre}</td>
            <td>
                <div className="canales">
                    {canales.map(c => <span key={c} className="canal">{c}</span>)}
                </div>
            </td>
            <td className="texto-suave">{formatearFecha(fechaInicio)} → {formatearFecha(fechaFin)}</td>
            <td><span className={`badge estado-${estado}`}>{estado}</span></td>
            <td>
                <div className="acciones">
                    <Link to={`/campanias/${_id}`} className="btn btn-icono" title="Ver detalle">
                        <i className="fas fa-eye"></i>
                    </Link>
                    <button className="btn btn-icono" title="Editar" onClick={() => setEditando(true)}>
                        <i className="fas fa-pen"></i>
                    </button>
                    <button className="btn btn-icono peligro" title="Eliminar" onClick={() => setConfirmando(true)} disabled={eliminando}>
                        {eliminando ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-trash"></i>}
                    </button>
                </div>

                {confirmando &&
                    <ModalConfirmar
                        titulo="Eliminar campaña"
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

export default Campania