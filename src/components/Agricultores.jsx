import { useState } from "react";
import { api } from "../api";
import Estado from "./Estado.jsx";

const FORM_VACIO = { nombre: "", parcela: "", contacto: "" };

export default function Agricultores({ agricultores, cargando, error, recargar, alCambiar }) {
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [errorForm, setErrorForm] = useState(null);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  function cancelar() {
    setEditandoId(null);
    setForm(FORM_VACIO);
    setErrorForm(null);
  }

  async function enviar(e) {
    e.preventDefault();
    setGuardando(true);
    setErrorForm(null);
    try {
      if (editandoId) {
        await api.actualizar("agricultores", editandoId, form); // PATCH
      } else {
        await api.crear("agricultores", form); // POST
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

  function editar(a) {
    setEditandoId(a.id);
    setForm({ nombre: a.nombre, parcela: a.parcela, contacto: a.contacto });
    setErrorForm(null);
  }

  async function eliminar(a) {
    const aviso =
      a.total_cultivos > 0
        ? `Se eliminará a ${a.nombre} y sus ${a.total_cultivos} cultivo(s). ¿Continuar?`
        : `¿Eliminar a ${a.nombre}?`;
    if (!window.confirm(aviso)) return;
    try {
      await api.eliminar("agricultores", a.id); // DELETE
      await recargar();
      alCambiar();
    } catch (err) {
      setErrorForm(err.message);
    }
  }

  return (
    <section className="panel">
      <form className="formulario" onSubmit={enviar}>
        <h2>{editandoId ? "Editar agricultor" : "Nuevo agricultor"}</h2>

        <label>
          Nombre
          <input name="nombre" value={form.nombre} onChange={cambiar} required maxLength={120} />
        </label>
        <label>
          Parcela
          <input
            name="parcela"
            value={form.parcela}
            onChange={cambiar}
            required
            maxLength={40}
            placeholder="Ej. Parcela 4"
          />
        </label>
        <label>
          Contacto
          <input
            name="contacto"
            value={form.contacto}
            onChange={cambiar}
            maxLength={80}
            placeholder="Teléfono o correo"
          />
        </label>

        {errorForm && (
          <p className="error-form" role="alert">
            {errorForm}
          </p>
        )}

        <div className="acciones">
          <button className="btn btn-primario" disabled={guardando}>
            {guardando ? "Guardando…" : editandoId ? "Guardar cambios" : "Crear agricultor"}
          </button>
          {editandoId && (
            <button type="button" className="btn" onClick={cancelar}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="listado">
        <h2>Agricultores</h2>
        <Estado
          cargando={cargando}
          error={error}
          onReintentar={recargar}
          vacio={agricultores.length === 0}
          mensajeVacio="Aún no hay agricultores. Registra al primer vecino con el formulario."
        >
          <div className="tabla-scroll">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Parcela</th>
                  <th>Contacto</th>
                  <th className="num">Cultivos</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {agricultores.map((a) => (
                  <tr key={a.id}>
                    <td>{a.nombre}</td>
                    <td>{a.parcela}</td>
                    <td>{a.contacto || "—"}</td>
                    <td className="num">{a.total_cultivos}</td>
                    <td className="fila-acciones">
                      <button className="btn btn-chico" onClick={() => editar(a)}>
                        Editar
                      </button>
                      <button className="btn btn-chico btn-peligro" onClick={() => eliminar(a)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Estado>
      </div>
    </section>
  );
}
