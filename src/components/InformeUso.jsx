import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { api } from "../config/api.config"

const InformeUso = () => {

    const token = useSelector(state => state.auth.token)
    const plan = useSelector(state => state.auth.usuario.plan)
    const cantidad = useSelector(state => state.campanias.lista.length)
    const [resumen, setResumen] = useState(null)

    useEffect(() => {
        api.get("/campanias/resumen", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                setResumen(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [cantidad, plan])

    if (!resumen) {
        return (
            <div className="card">
                <h2><i className="fas fa-chart-pie"></i> Uso del plan</h2>
                <p className="vacio"><i className="fas fa-spinner fa-spin"></i></p>
            </div>
        )
    }

    if (resumen.plan === "premium") {
        return (
            <div className="card">
                <h2><i className="fas fa-chart-pie"></i> Uso del plan</h2>
                <div className="uso-numero">{resumen.campaniasUsadas} <small>campañas</small></div>
                <p className="texto-suave">Plan Premium · campañas ilimitadas</p>
            </div>
        )
    }

    const porcentaje = Math.round(resumen.campaniasUsadas / resumen.limite * 100);

    return (
        <div className="card">
            <h2><i className="fas fa-chart-pie"></i> Uso del plan</h2>
            <div className="uso-numero">{porcentaje}% <small>usado</small></div>
            <div className="barra">
                <div className={porcentaje >= 100 ? "barra-relleno llena" : "barra-relleno"}
                    style={{ width: `${porcentaje}%` }}></div>
            </div>
            <p className="texto-suave">
                {resumen.campaniasUsadas} de {resumen.limite} campañas · {resumen.disponibles === 0 ? "llegaste al límite" : `te quedan ${resumen.disponibles}`}
            </p>
        </div>
    )
}

export default InformeUso