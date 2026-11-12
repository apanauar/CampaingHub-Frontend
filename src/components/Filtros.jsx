import { useSelector } from "react-redux"
import { CANALES, ESTADOS } from "../validators/campania.validators"

const Filtros = ({ filtros, cambiarFiltro, limpiarFiltros }) => {

    const tipos = useSelector(state => state.tipos.lista)

    return (
        <div className="filtros">
            <div className="form-group">
                <label htmlFor="fEstado">Estado</label>
                <select id="fEstado" name="estado" value={filtros.estado} onChange={cambiarFiltro}>
                    <option value="">Todos</option>
                    {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="fCanal">Canal</label>
                <select id="fCanal" name="canal" value={filtros.canal} onChange={cambiarFiltro}>
                    <option value="">Todos</option>
                    {CANALES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="fTipo">Tipo</label>
                <select id="fTipo" name="tipo" value={filtros.tipo} onChange={cambiarFiltro}>
                    <option value="">Todos</option>
                    {tipos.map(t => <option key={t._id} value={t._id}>{t.nombre}</option>)}
                </select>
            </div>
            <button type="button" className="btn btn-secundario" onClick={limpiarFiltros}>
                <i className="fas fa-xmark"></i> Limpiar
            </button>
        </div>
    )
}

export default Filtros