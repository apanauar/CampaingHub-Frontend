import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../config/api.config"
import { guardarTipos } from "../features/tipos.slice"
import CampaniaForm from "../components/CampaniaForm"
import Campanias from "../components/Campanias"
import InformeUso from "../components/InformeUso"
import CambioPlan from "../components/CambioPlan"
import Grafica from "../components/Grafica"

const LIMITE_PLAN_PLUS = 4;

const Dashboard = () => {

    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)
    const plan = useSelector(state => state.auth.usuario.plan)
    const cantidad = useSelector(state => state.campanias.lista.length)

    const puedeCrear = plan === "premium" || cantidad < LIMITE_PLAN_PLUS;

    useEffect(() => {
        api.get("/tipos-campania", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                dispatch(guardarTipos(response.data.tipos));
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    return (
        <div className="container">
            <div className="page-title">
                <div>
                    <h1>Mis campañas</h1>
                    <p>Planificá, ejecutá y medí las campañas de tus clientes.</p>
                </div>
            </div>

            <div className="grid grid-3">
                <InformeUso />
                <CambioPlan />
                <Grafica />
            </div>

            {puedeCrear ? <CampaniaForm /> :
                <div className="card">
                    <h2><i className="fas fa-plus"></i> Nueva campaña</h2>
                    <div className="alerta alerta-aviso">
                        <i className="fas fa-lock"></i> Llegaste al límite de {LIMITE_PLAN_PLUS} campañas del plan Plus. Pasate a Premium para crear más.
                    </div>
                </div>
            }

            <Campanias />
        </div>
    )
}

export default Dashboard