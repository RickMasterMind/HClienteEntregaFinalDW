import { useState } from "react";
import { api } from "../api";
import { ESTADOS, OFRECE, TIPOS, UNIDADES, fechaLegible, hoy } from "../opciones.js";
import Estado from "./Estado.jsx";

const formVacio = () => ({
  nombre: "",
  tipo: "hortaliza",
  estado: "sembrado",
  fecha_siembra: hoy(),
  ofrece: "nada",
  cantidad: 0,
  unidad: "unidades",
  agricultor: "",
});

const FILTROS = [
  ["todos", "Todos"],
  ["semillas", "Ofrecen semillas"],
  ["cosecha", "Ofrecen cosecha"],
];

function Opciones({ lista }) {
  return lista.map(([valor, etiqueta]) => (
    <option key={valor} value={valor}>
      {etiqueta}
    </option>
  ));
}

export default function Cultivos({ cultivos, agricultores, cargando, error, recargar, alCambiar }) {
  const [form, setForm] = useState(formVacio);
  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [errorForm, setErrorForm] = useState(null);
  const [filtro, setFiltro] = useState("todos");

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  function cancelar() {
    setEditandoId(null);
    setForm(formVacio());
    setErrorForm(null);
  }

  async function enviar(e) {
    e.preventDefault();
    setGuardando(true);
    setErrorForm(null);
    const datos = {
      ...form,
      agricultor: Number(form.agricultor),
      cantidad: form.ofrece === "nada" ? 0 : Number(form.cantidad),
    };
    try {
      if (editandoId) {
        await api.actualizar("cultivos", editandoId, datos); // PATCH
      } else {
        await api.crear("cultivos", datos); // POST
      }
      cancelar();
      await recargar();
      alCambiar();
    } catch (err) {
      setErrorForm(err.message);
    } finally {
      setGuardando(false);
    }
  }

  function editar(c) {
    setEditandoId(c.id);
    setForm({
      nombre: c.nombre,
      tipo: c.tipo,
      estado: c.estado,
      fecha_siembra: c.fecha_siembra,
      ofrece: c.ofrece,
      cantidad: c.cantidad,
      unidad: c.unidad,
      agricultor: c.agricultor,
    });
    setErrorForm(null);
  }

  async function eliminar(c) {
    if (!window.confirm(`¿Eliminar el cultivo "${c.nombre}"?`)) return;
    try {
      await api.eliminar("cultivos", c.id); // DELETE
      await recargar();
      alCambiar();
    } catch (err) {
      setErrorForm(err.message);
    }
  }

  const sinAgricultores = agricultores.length === 0;
  const visibles = cultivos.filter((c) => filtro === "todos" || c.ofrece === filtro);

  return (
    <section className="panel">
      <form className="formulario" onSubmit={enviar}>
        <h2>{editandoId ? "Editar cultivo" : "Nuevo cultivo"}</h2>

        {sinAgricultores && (
          <p className="aviso">Para registrar un cultivo primero crea un agricultor en la pestaña Agricultores.</p>
        )}

        <label>
          Cultivo
          <input name="nombre" value={form.nombre} onChange={cambiar} required maxLength={100} />
        </label>
        <label>
          Agricultor
          <select name="agricultor" value={form.agricultor} onChange={cambiar} required disabled={sinAgricultores}>
            <option value="">Selecciona un agricultor</option>
            {agricultores.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre} ({a.parcela})
              </option>
            ))}
          </select>
        </label>
        <label>
          Tipo
          <select name="tipo" value={form.tipo} onChange={cambiar}>
            <Opciones lista={TIPOS} />
          </select>
        </label>
        <label>
          Estado
          <select name="estado" value={form.estado} onChange={cambiar}>
            <Opciones lista={ESTADOS} />
          </select>
        </label>
        <label>
          Fecha de siembra
          <input
            name="fecha_siembra"
            type="date"
            max={hoy()}
            value={form.fecha_siembra}
            onChange={cambiar}
            required
          />
        </label>
        <label>
          Para intercambiar
          <select name="ofrece" value={form.ofrece} onChange={cambiar}>
            <Opciones lista={OFRECE} />
          </select>
        </label>
        {form.ofrece !== "nada" && (
          <div className="fila-doble">
            <label>
              Cantidad
              <input
                name="cantidad"
                type="number"
                min="1"
                value={form.cantidad}
                onChange={cambiar}
                required
              />
            </label>
            <label>
              Unidad
              <select name="unidad" value={form.unidad} onChange={cambiar}>
                <Opciones lista={UNIDADES} />
              </select>
            </label>
          </div>
        )}

        {errorForm && (
          <p className="error-form" role="alert">
            {errorForm}
          </p>
        )}

        <div className="acciones">
          <button className="btn btn-primario" disabled={guardando || sinAgricultores}>
            {guardando ? "Guardando…" : editandoId ? "Guardar cambios" : "Crear cultivo"}
          </button>
          {editandoId && (
            <button type="button" className="btn" onClick={cancelar}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="listado">
        <div className="listado-cabecera">
          <h2>Cultivos</h2>
          <div className="filtros" role="group" aria-label="Filtrar por intercambio">
            {FILTROS.map(([valor, etiqueta]) => (
              <button
                key={valor}
                className={filtro === valor ? "activo" : ""}
                aria-pressed={filtro === valor}
                onClick={() => setFiltro(valor)}
              >
                {etiqueta}
              </button>
            ))}
          </div>
        </div>

        <Estado
          cargando={cargando}
          error={error}
          onReintentar={recargar}
          vacio={visibles.length === 0}
          mensajeVacio={
            cultivos.length === 0
              ? "Aún no hay cultivos registrados."
              : "Ningún cultivo coincide con este filtro."
          }
        >
          <div className="tarjetas">
            {visibles.map((c) => (
              <article key={c.id} className={`tarjeta oferta-${c.ofrece}`}>
                <h3>{c.nombre}</h3>
                <p className="detalle">
                  {c.tipo_display}, de {c.agricultor_nombre} ({c.agricultor_parcela})
                </p>
                <p className="detalle">Sembrado el {fechaLegible(c.fecha_siembra)}</p>
                <p className="chips">
                  <span className="sello">{c.estado_display}</span>
                  <span className={`sello sello-${c.ofrece}`}>
                    {c.ofrece === "nada"
                      ? c.ofrece_display
                      : `${c.ofrece_display}: ${c.cantidad} ${c.unidad_display}`}
                  </span>
                </p>
                <div className="acciones">
                  <button className="btn btn-chico" onClick={() => editar(c)}>
                    Editar
                  </button>
                  <button className="btn btn-chico btn-peligro" onClick={() => eliminar(c)}>
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </Estado>
      </div>
    </section>
  );
}
