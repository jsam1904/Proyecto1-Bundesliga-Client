# Proyecto 1 — Bundesliga Tracker (Cliente)

Frontend del Bundesliga Tracker: gestión completa de equipos de la Bundesliga construido con HTML, CSS y JavaScript vanilla, sin frameworks ni librerías de terceros.

**Backend:** [jsam1904/Proyecto1-Tracker-Api](https://github.com/jsam1904/Proyecto1-Tracker-Api)

---

## Screenshot

![alt text](/img/image.png)

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior (solo si usás Vite)
- El servidor backend corriendo — ya sea localmente en `http://localhost:8080` o apuntando al servidor en producción (ver configuración más abajo)

---

## Cómo correr el proyecto localmente

### Opción 1 — Vite (recomendada para desarrollo)

```bash
# 1. Clonar el repositorio
git clone https://github.com/jsam1904/Proyecto1-Bundesliga-Client.git
cd Proyecto1-Bundesliga-Client

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

Vite sirve la app en `http://localhost:5173` con recarga automática ante cambios.

### Opción 2 — Python (sin instalación)

```bash
python3 -m http.server 3000
```

Abrí `http://localhost:3000` en el navegador.

### Opción 3 — Node serve

```bash
npx serve .
```

---

## Configuración del backend

Por defecto el cliente apunta al servidor en producción:

```text
https://proyecto1-tracker-api-production.up.railway.app
```

Para apuntar a un backend local, editá la constante `API_BASE` en [js/api.js](js/api.js):

```js
const API_BASE = 'http://localhost:8080';
```

---

## Estructura del proyecto

```text
Proyecto1-Bundesliga-Client/
├── index.html          # Punto de entrada
├── css/
│   └── styles.css      # Sistema de diseño completo (sin frameworks CSS)
├── js/
│   ├── api.js          # Capa de red — solo fetch(), sin tocar el DOM
│   ├── ui.js           # Capa de vista — solo DOM, sin fetch()
│   └── main.js         # Estado, eventos y orquestación
└── img/                # Recursos gráficos
```

---

## Challenges implementados

1. **CRUD completo de equipos** — crear, leer, actualizar y eliminar equipos mediante una API REST con `fetch()` y `async/await`.

2. **Búsqueda en tiempo real con debounce** — input de búsqueda con delay de 350 ms para evitar llamadas excesivas a la API mientras el usuario escribe.

3. **Ordenamiento multi-campo** — ordenar por ID, Nombre, Ciudad o Año de fundación en sentido ascendente/descendente, persistiendo el criterio activo visualmente.

4. **Paginación con rango inteligente** — controles de páginas que muestran puntos suspensivos cuando el rango es grande, evitando que la barra de paginación se desborde.

5. **Exportación a CSV sin librerías** — generación manual del archivo CSV con escapado correcto de comillas, comas y saltos de línea dentro de los valores.

6. **Skeleton loaders** — placeholders animados mientras se cargan los datos, evitando saltos de layout y mejorando la percepción de velocidad.

7. **Modal de confirmación para eliminar** — flujo de doble confirmación antes de borrar un equipo, previniendo eliminaciones accidentales.

8. **Validación de formularios en dos capas** — validación en el cliente (campos requeridos, tipos) y manejo de errores devueltos por el servidor con mensajes por campo.

9. **Escaping de HTML para prevención de XSS** — toda entrada del usuario pasa por una función `escapeHTML()` antes de insertarse en el DOM.

10. **Arquitectura separada en tres capas** — `api.js` solo habla HTTP, `ui.js` solo toca el DOM, `main.js` conecta ambas. Esto facilita el testing y el mantenimiento independiente de cada capa.

11. **Accesibilidad básica** — etiquetas ARIA en modales, soporte de teclado (Escape para cerrar modales), HTML semántico con roles implícitos.

12. **Barra de estadísticas dinámica** — muestra el total de equipos y la página actual, actualizándose con cada acción sin recargar la página.

---

## Reflexión técnica

### ¿Qué usamos y por qué?

Elegimos **JavaScript vanilla** (sin React, Vue ni Angular) de forma intencional. El objetivo era entender de primera mano lo que los frameworks resuelven: gestión de estado, actualizaciones del DOM, ciclo de vida de componentes. Trabajar sin ellos obliga a tomar esas decisiones explícitamente.

**Fetch API con `async/await`** resultó suficiente para el alcance del proyecto. La curva de aprendizaje es baja, el código queda legible y no agrega peso al bundle. Para una app de esta escala, no había razón para traer Axios.

**Vite** como build tool fue una excelente elección: el servidor de desarrollo arranca en menos de un segundo, la recarga es instantánea y la configuración es mínima.

La parte más desafiante fue mantener el **estado de la UI sincronizado** con la API sin un sistema reactivo. Cada acción (buscar, paginar, editar) requería recalcular manualmente qué datos mostrar y qué partes del DOM actualizar. Es exactamente el problema que frameworks como React resuelven, y haberlo implementado a mano nos dio una comprensión real de su valor.

### ¿Lo usaríamos de nuevo?

**JavaScript vanilla para proyectos pequeños o de aprendizaje: sí, definitivamente.** Es ideal para entender los fundamentos y produce frontends muy livianos sin overhead de framework.

**Para un proyecto en producción con más de 5-6 vistas o estado compartido entre componentes: no.** En ese contexto, la gestión manual del DOM se vuelve frágil y difícil de mantener. Usaríamos React o Vue sin dudarlo, ya que el problema que resuelven es real y lo experimentamos de cerca en este proyecto.

---

## Build para producción

```bash
npm run build
```

Genera la carpeta `dist/` lista para desplegar en cualquier hosting estático.
