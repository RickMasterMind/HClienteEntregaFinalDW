const BASE = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

// Convierte el JSON de errores de DRF ({campo: ["mensaje"]}) en un texto legible
function textoDeError(datos) {
  if (typeof datos === "string") return datos;
  if (datos?.detail) return datos.detail;
  return Object.entries(datos ?? {})
    .map(([campo, msg]) => `${campo}: ${Array.isArray(msg) ? msg.join(", ") : msg}`)
    .join(" | ");
}

async function peticion(ruta, opciones = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${BASE}${ruta}`, {
      headers: { "Content-Type": "application/json" },
      ...opciones,
    });
  } catch {
    throw new Error(
      `No se pudo conectar con el servidor (${BASE}). Revisa que Django esté corriendo y que CORS esté habilitado.`
    );
  }

  if (!respuesta.ok) {
    let detalle = "";
    try {
      detalle = textoDeError(await respuesta.json());
    } catch {
      /* la respuesta no era JSON */
    }
    throw new Error(detalle || `Error ${respuesta.status} del servidor`);
  }

  return respuesta.status === 204 ? null : respuesta.json();
}

export const api = {
  listar: (recurso) => peticion(`/${recurso}/`),
  crear: (recurso, datos) =>
    peticion(`/${recurso}/`, { method: "POST", body: JSON.stringify(datos) }),
  actualizar: (recurso, id, datos) =>
    peticion(`/${recurso}/${id}/`, { method: "PATCH", body: JSON.stringify(datos) }),
  eliminar: (recurso, id) => peticion(`/${recurso}/${id}/`, { method: "DELETE" }),
};
