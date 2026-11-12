import { useState } from "react"
import { useSelector } from "react-redux"
import { api } from "../config/api.config"
import { toast } from "sonner"

const BriefIA = ({ campania, actualizar }) => {

    const token = useSelector(state => state.auth.token)
    const [loading, setLoading] = useState(false)
    const [generadoPorIA, setGeneradoPorIA] = useState(true)

    const generar = () => {
        setLoading(true);

        api.post(`/campanias/${campania._id}/brief`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                setGeneradoPorIA(response.data.generadoPorIA);
                actualizar(response.data.campania);
                toast.success("Brief generado");
            })
            .catch((error) => {
                toast.error(error.response?.data?.error || "No se pudo generar el brief");
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return (
        <div className="card">
            <h2><i className="fas fa-wand-magic-sparkles"></i> Brief con IA</h2>

            {campania.brief ?
                <>
                    <div className="brief">{campania.brief}</div>
                    <ul className="ideas">
                        {campania.ideasCopy.map((idea, i) => <li key={i}><i className="fas fa-quote-left"></i>{idea}</li>)}
                    </ul>
                </> :
                <p className="texto-suave">Generá un brief y 3 ideas de copy a partir de los datos de la campaña.</p>
            }

            {!generadoPorIA &&
                <div className="alerta alerta-aviso"><i className="fas fa-triangle-exclamation"></i> La IA no está disponible: se generó un brief de plantilla.</div>
            }

            <div className="card-acciones">
                <button className="btn" onClick={generar} disabled={loading}>
                    {loading ?
                        <><i className="fas fa-spinner fa-spin"></i> Generando...</> :
                        <><i className="fas fa-wand-magic-sparkles"></i> {campania.brief ? "Generar otro brief" : "Generar brief"}</>
                    }
                </button>
            </div>
        </div>
    )
}

export default BriefIA