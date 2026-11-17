import { useCallback, useEffect, useState } from "react";
import { api } from "../api";

// Carga una lista desde la API y expone los estados de carga y error
export function useRecurso(recurso) {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setItems(await api.listar(recurso));
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, [recurso]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { items, cargando, error, recargar };
}
