import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { api } from "../config/api.config"
import { guardarTipos } from "../features/tipos.slice"
import TipoForm from "../components/TipoForm"
import Tipos from "../components/Tipos"

const AdminTipos = () => {

    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)

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
                    <h1>Tipos de campaña</h1>
                    <p>Las categorías que usan los marketers al crear sus campañas.</p>
                </div>
            </div>

            <div className="grid grid-admin">
                <TipoForm />
                <Tipos />
            </div>
        </div>
    )
}

export default AdminTipos