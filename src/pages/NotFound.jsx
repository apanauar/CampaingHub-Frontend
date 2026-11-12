import { Link } from "react-router"

const NotFound = () => {
    return (
        <div className="no-encontrado">
            <h1>404</h1>
            <p className="texto-suave">La página que buscás no existe.</p>
            <Link to="/dashboard" className="btn"><i className="fas fa-house"></i> Ir al inicio</Link>
        </div>
    )
}

export default NotFound