import { useState } from "react"
import { useSelector } from "react-redux"
import { api } from "../config/api.config"
import { toast } from "sonner"

const TAMANIO_MAXIMO = 4 * 1024 * 1024;

const Piezas = ({ campania, actualizar }) => {

    const token = useSelector(state => state.auth.token)
    const [archivo, setArchivo] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const elegirArchivo = (e) => {
        const elegido = e.target.files[0];
        setError("");
        setArchivo(null);

        if (!elegido) {
            return;
        }
        if (!elegido.type.startsWith("image/")) {
            setError("El archivo debe ser una imagen");
            return;
        }
        if (elegido.size > TAMANIO_MAXIMO) {
            setError("La imagen no puede pesar más de 4 MB");
            return;
        }
        setArchivo(elegido);
    }

    const subir = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("imagen", archivo);

        api.post(`/campanias/${campania._id}/piezas`, formData, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                actualizar(response.data.campania);
                toast.success("Pieza subida");
                setArchivo(null);
                e.target.reset();
            })
            .catch((error) => {
                setError(error.response?.data?.error || "No se pudo subir la imagen");
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return (
        <div className="card">
            <h2><i className="fas fa-images"></i> Piezas de la campaña</h2>

            <form className="subida" onSubmit={subir}>
                <input type="file" accept="image/*" onChange={elegirArchivo} />
                <button type="submit" className="btn" disabled={!archivo || loading}>
                    {loading ?
                        <><i className="fas fa-spinner fa-spin"></i> Subiendo...</> :
                        <><i className="fas fa-upload"></i> Subir</>
                    }
                </button>
            </form>
            <span className="error">{error}</span>

            {campania.piezas.length === 0 ?
                <p className="vacio">Todavía no subiste piezas.</p> :
                <div className="piezas">
                    {campania.piezas.map(p =>
                        <div key={p._id} className="pieza">
                            <img src={p.url} alt={p.descripcion} />
                            <p>{p.descripcion}</p>
                        </div>
                    )}
                </div>
            }
        </div>
    )
}

export default Piezas