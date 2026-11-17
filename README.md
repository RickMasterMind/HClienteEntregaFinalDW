# Huerta Comunitaria — Cliente (React + Vite + JSX)

Consume la API Django REST del repositorio `huerta-servidor`.

## Puesta en marcha

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. El servidor debe estar corriendo en `http://127.0.0.1:8000`.
Para usar otra URL, copia `.env.example` a `.env` y cambia `VITE_API_URL`.

## Qué incluye
- Listar, crear y eliminar **Agricultores** (tabla) y **Cultivos** (tarjetas).
- Filtro de cultivos que ofrecen semillas o cosecha para intercambiar.
- Estados de **carga** y **error** (con botón Reintentar) en cada listado, y errores de validación del servidor en los formularios.
- **Bonus:** editar con `PATCH` desde el mismo formulario.
- `src/api.js` concentra todas las llamadas con `fetch`.

## Estructura
```
src/
  api.js                 # fetch: listar, crear, actualizar (PATCH), eliminar
  opciones.js            # listas de opciones (iguales a las del modelo) y helpers de fecha
  hooks/useRecurso.js    # carga + estados cargando/error
  components/            # Agricultores, Cultivos, Estado
  App.jsx                # pestañas y coordinación
```
