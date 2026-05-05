# Proyecto1 — Bundesliga Client

Frontend del Bundesliga Tracker: HTML, CSS y JavaScript vanilla (sin frameworks ni librerías).

Backend: https://github.com/jsam1904/Proyecto1-Tracker-Api

## Stack
- HTML5
- CSS3
- JavaScript (Fetch API, async/await)
- Fuentes: Bebas Neue, Barlow

## Requisitos
Asegúrate de que el backend esté ejecutándose en `http://localhost:8080`.

## Instalación y ejecución 
Opción 1 — Python (servidor estático rápido):
```bash
python3 -m http.server 3000
```

Opción 2 — Node (serve):
```bash
npx serve .
```

Opción 3 — Vite (recomendado para desarrollo):
Si estás usando Vite, inicia el dev server desde la raíz del proyecto:

```bash
# instalar dependencias (si no están)
npm install

# iniciar Vite (modo dev)
npm run dev
```

Vite normalmente servirá en `http://localhost:5173` — abre esa URL en tu navegador. Asegúrate de que el backend esté corriendo en `http://localhost:8080` para que las llamadas a la API funcionen correctamente.
## Estructura del proyecto
- `proyecto1-bundesliga/` — raíz del frontend
	- `index.html`
	- `css/styles.css`
	- `js/api.js` — solo `fetch()`, sin manipular el DOM
	- `js/ui.js` — solo DOM, sin `fetch()`
	- `js/main.js` — estado, eventos y conexión entre `api` y `ui`
	- `img/` — recursos gráficos

## Funcionalidades y retos
- Búsqueda, paginación y ordenamiento
- Exportar CSV manual (sin librerías)
- Enfoque en calidad visual y organización del código

## Reflexión
Usar JS vanilla fue útil para entender lo que hacen los frameworks. `fetch()` con `async/await` mantiene el código claro para este alcance. El DOM requiere más boilerplate que librerías como React, pero el resultado es un frontend ligero y rápido.

## Recomendaciones (opcionales)
- **Demo:** añadir un enlace, captura o GIF de la app en funcionamiento.
- **Tests:** instrucciones si existen pruebas automatizadas.
- **Licencia:** indicar licencia (por ejemplo MIT) si procede.
- **Contribuir:** breve nota sobre cómo aceptar PRs o reportar issues.

Si quieres, aplico estos cambios directamente al repositorio y creo un commit.