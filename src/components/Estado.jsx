// Muestra carga, error o vacío; si no aplica ninguno, renderiza el contenido
export default function Estado({ cargando, error, vacio, mensajeVacio, onReintentar, children }) {
  if (cargando) {
    return (
      <p className="estado" role="status">
        Cargando…
      </p>
    );
  }
  if (error) {
    return (
      <div className="estado estado-error" role="alert">
        <p>{error}</p>
        <button type="button" className="btn" onClick={onReintentar}>
          Reintentar
        </button>
      </div>
    );
  }
  if (vacio) {
    return <p className="estado">{mensajeVacio}</p>;
  }
  return children;
}
