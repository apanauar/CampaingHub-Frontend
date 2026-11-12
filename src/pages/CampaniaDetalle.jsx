import { useEffect, useState } from "react"
import { useParams, Link } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../config/api.config"
import { actualizarCampania } from "../features/campanias.slice"
import BriefIA from "../components/BriefIA"
import Feriados from "../components/Feriados"
import Piezas from "../components/Piezas"

const CampaniaDetalle = () => {

    const { id } = useParams()
    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)

    const [campania, setCampania] = useState(null)
    const [loading, setLoading] = useState(true)
    const [errorApi, setErrorApi] = useState("")

    useEffect(() => {
        setLoading(true);
        setErrorApi("");

        api.get(`/campanias/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                setCampania(response.data.campania);
            })
            .catch((error) => {
                setErrorApi(error.response?.data?.error || "No se pudo cargar la campaña");
            })
            .finally(() => {
                setLoading(false);
            })
    }, [id])

    const actualizar = (campaniaNueva) => {
        setCampania(campaniaNueva);
        dispatch(actualizarCampania(campaniaNueva));
    }

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString("es-UY", { timeZone: "UTC" });
    }

    if (loading) {
        return (
            <div className="container">
                <p className="vacio"><i className="fas fa-spinner fa-spin"></i> Cargando campaña...</p>
            </div>
        )
    }

    if (errorApi) {
        return (
            <div className="container">
                <Link to="/dashboard" className="volver"><i className="fas fa-arrow-left"></i> Volver a mis campañas</Link>
                <div className="alerta alerta-error"><i className="fas fa-circle-exclamation"></i> {errorApi}</div>
            </div>
        )
    }

    return (
        <div className="container">
            <Link to="/dashboard" className="volver"><i className="fas fa-arrow-left"></i> Volver a mis campañas</Link>

            <div className="page-title">
                <div>
                    <h1>{campania.nombre} <span className={`badge estado-${campania.estado}`}>{campania.estado}</span></h1>
                    <p>{campania.cliente} · {campania.tipo?.nombre}</p>
                </div>
            </div>

            <div className="card">
                <div className="datos">
                    <div className="dato"><span>Presupuesto</span><strong>USD {campania.presupuesto}</strong></div>
                    <div className="dato"><span>Inicio</span><strong>{formatearFecha(campania.fechaInicio)}</strong></div>
                    <div className="dato"><span>Fin</span><strong>{formatearFecha(campania.fechaFin)}</strong></div>
                    <div className="dato"><span>Canales</span>
                        <div className="canales">
                            {campania.canales.map(c => <span key={c} className="canal">{c}</span>)}
                        </div>
                    </div>
                    <div className="dato dato-completo">
                        <span>Objetivo</span><strong>{campania.objetivo || "Sin objetivo"}</strong>
                    </div>
                </div>
            </div>

            <div className="grid grid-2">
                <BriefIA campania={campania} actualizar={actualizar} />
                <Feriados campania={campania} actualizar={actualizar} />
            </div>

            <Piezas campania={campania} actualizar={actualizar} />
        </div>
    )
}

export default CampaniaDetalle