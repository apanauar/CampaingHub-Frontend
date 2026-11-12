import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../config/api.config"
import { guardarCampanias } from "../features/campanias.slice"
import Campania from "./Campania"
import Filtros from "./Filtros"

const Campanias = () => {

    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)
    const campanias = useSelector(state => state.campanias.lista)
    const [loading, setLoading] = useState(true)
    const [errorApi, setErrorApi] = useState("")
    const [filtros, setFiltros] = useState({ estado: "", canal: "", tipo: "" })

    useEffect(() => {
        api.get("/campanias", {
            params: { limit: 100 },
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                dispatch(guardarCampanias(response.data.campanias));
            })
            .catch((error) => {
                setErrorApi(error.response?.data?.error || "No se pudieron cargar las campañas");
            })
            .finally(() => {
                setLoading(false);
            })
    }, [])

    const cambiarFiltro = (e) => {
        setFiltros({ ...filtros, [e.target.name]: e.target.value });
    }

    const limpiarFiltros = () => {
        setFiltros({ estado: "", canal: "", tipo: "" });
    }

    const campaniasFiltradas = campanias.filter(c =>
        (filtros.estado === "" || c.estado === filtros.estado) &&
        (filtros.canal === "" || c.canales.includes(filtros.canal)) &&
        (filtros.tipo === "" || c.tipo?._id === filtros.tipo)
    );

    return (
        <div className="card">
            <h2><i className="fas fa-list"></i> Campañas</h2>

            {errorApi && <div className="alerta alerta-error"><i className="fas fa-circle-exclamation"></i> {errorApi}</div>}

            <Filtros filtros={filtros} cambiarFiltro={cambiarFiltro} limpiarFiltros={limpiarFiltros} />

            {loading ? <p className="vacio"><i className="fas fa-spinner fa-spin"></i> Cargando campañas...</p> :
                campanias.length === 0 ? <p className="vacio">Todavía no creaste campañas.</p> :
                    campaniasFiltradas.length === 0 ? <p className="vacio">Ninguna campaña coincide con los filtros.</p> :
                        <table className="tabla">
                            <thead>
                                <tr>
                                    <th>Campaña</th>
                                    <th>Tipo</th>
                                    <th>Canales</th>
                                    <th>Fechas</th>
                                    <th>Estado</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {campaniasFiltradas.map(c => <Campania key={c._id} {...c} />)}
                            </tbody>
                        </table>
            }
        </div>
    )
}

export default Campanias
