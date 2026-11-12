import { useState } from "react"
import { useSelector } from "react-redux"
import { api } from "../config/api.config"
import { toast } from "sonner"

const Feriados = ({ campania, actualizar }) => {

    const token = useSelector(state => state.auth.token)
    const [loading, setLoading] = useState(false)
    const [consultado, setConsultado] = useState(campania.feriadosEnRango.length > 0)

    const consultar = () => {
        setLoading(true);

        api.get(`/campanias/${campania._id}/feriados`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                actualizar(response.data.campania);
                setConsultado(true);
                toast.success(`Feriados encontrados: ${response.data.cantidad}`);
            })
            .catch((error) => {
                toast.error(error.response?.data?.error || "No se pudieron consultar los feriados");
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString("es-UY", { timeZone: "UTC" });
    }

    return (
        <div className="card">
            <h2><i className="fas fa-calendar-day"></i> Feriados durante la campaña</h2>
            <p className="texto-suave card-descripcion">Feriados de Uruguay entre las fechas de la campaña.</p>

            {campania.feriadosEnRango.length > 0 &&
                <ul className="feriados">
                    {campania.feriadosEnRango.map(f => <li key={f.fecha}><span>{f.nombre}</span><strong>{formatearFecha(f.fecha)}</strong></li>)}
                </ul>
            }
            {consultado && campania.feriadosEnRango.length === 0 &&
                <p className="vacio">No hay feriados en estas fechas.</p>
            }

            <div className="card-acciones">
                <button className="btn btn-secundario" onClick={consultar} disabled={loading}>
                    {loading ?
                        <><i className="fas fa-spinner fa-spin"></i> Consultando...</> :
                        <><i className="fas fa-rotate"></i> Consultar feriados</>
                    }
                </button>
            </div>
        </div>
    )
}

export default Feriados