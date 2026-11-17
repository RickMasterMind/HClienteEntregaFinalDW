// Deben coincidir con las opciones (choices) de huerta/models.py en el servidor
export const TIPOS = [
  ["hortaliza", "Hortaliza"],
  ["fruta", "Fruta"],
  ["aromatica", "Hierba aromática"],
  ["legumbre", "Legumbre"],
  ["tuberculo", "Tubérculo"],
];

export const ESTADOS = [
  ["sembrado", "Sembrado"],
  ["creciendo", "En crecimiento"],
  ["listo", "Listo para cosechar"],
  ["cosechado", "Cosechado"],
];

export const OFRECE = [
  ["nada", "No intercambia"],
  ["semillas", "Semillas"],
  ["cosecha", "Cosecha"],
];

export const UNIDADES = [
  ["unidades", "unidades"],
  ["kg", "kg"],
  ["atados", "atados"],
  ["sobres", "sobres"],
];

// Fecha local de hoy en formato AAAA-MM-DD (para el input type="date")
export function hoy() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

export function fechaLegible(iso) {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d).toLocaleDateString("es-CO", { dateStyle: "long" });
}
