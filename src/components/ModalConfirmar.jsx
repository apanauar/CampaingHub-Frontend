const ModalConfirmar = ({ titulo, mensaje, textoConfirmar, loading, confirmar, cancelar }) => {
    return (
        <div className="modal-fondo">
            <div className="modal modal-chico">
                <h2><i className="fas fa-triangle-exclamation"></i> {titulo}</h2>
                <p className="texto-suave">{mensaje}</p>

                <div className="modal-acciones">
                    <button type="button" className="btn btn-secundario" onClick={cancelar} disabled={loading}>
                        Cancelar
                    </button>
                    <button type="button" className="btn btn-peligro" onClick={confirmar} disabled={loading}>
                        {loading ? <><i className="fas fa-spinner fa-spin"></i> Eliminando...</> : <><i className="fas fa-trash"></i> {textoConfirmar}</>}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ModalConfirmar