import { useSelector } from "react-redux"
import Tipo from "./Tipo"

const Tipos = () => {

    const tipos = useSelector(state => state.tipos.lista)

    return (
        <div className="card">
            <h2><i className="fas fa-tags"></i> Tipos existentes</h2>

            {tipos.length === 0 ?
                <p className="vacio">Todavía no hay tipos de campaña.</p> :
                <table className="tabla">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tipos.map(t => <Tipo key={t._id} {...t} />)}
                    </tbody>
                </table>
            }
        </div>
    )
}

export default Tipos