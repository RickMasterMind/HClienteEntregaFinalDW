import { useState } from "react";
import { useRecurso } from "./hooks/useRecurso.js";
import Agricultores from "./components/Agricultores.jsx";
import Cultivos from "./components/Cultivos.jsx";

export default function App() {
  const [pestana, setPestana] = useState("cultivos");
  const agricultores = useRecurso("agricultores");
  const cultivos = useRecurso("cultivos");

  return (
    <div className="app">
      <header className="cabecera">
        <h1>Huerta Comunitaria</h1>
        <p>Semillas y cosechas para intercambiar entre vecinos</p>
        <nav className="pestanas" aria-label="Secciones">
          <button
            className={pestana === "cultivos" ? "activa" : ""}
            onClick={() => setPestana("cultivos")}
          >
            Cultivos ({cultivos.items.length})
          </button>
          <button
            className={pestana === "agricultores" ? "activa" : ""}
            onClick={() => setPestana("agricultores")}
          >
            Agricultores ({agricultores.items.length})
          </button>
        </nav>
      </header>

      <main>
        {pestana === "cultivos" ? (
          <Cultivos
            cultivos={cultivos.items}
            agricultores={agricultores.items}
            cargando={cultivos.cargando}
            error={cultivos.error}
            recargar={cultivos.recargar}
            alCambiar={agricultores.recargar}
          />
        ) : (
          <Agricultores
            agricultores={agricultores.items}
            cargando={agricultores.cargando}
            error={agricultores.error}
            recargar={agricultores.recargar}
            alCambiar={cultivos.recargar}
          />
        )}
      </main>
    </div>
  );
}
