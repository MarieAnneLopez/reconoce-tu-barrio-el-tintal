# Guion de la demostración: Reconoce tu Barrio, El Tintal

**Duración:** 6 a 7 minutos · **Sitio:** https://reconoce-el-tintal.pages.dev · **Presenta:** Marie Anne Lopez Poveda

## Antes de empezar (10 minutos antes)

1. **Despierta la API.** Abre https://reconoce-el-tintal.pages.dev/api/v1/health y espera a que diga `ok` (la primera vez tarda cerca de un minuto, porque Render gratis se duerme).
2. **Abre el sitio en una ventana de incógnito**, para que salga la bienvenida de Mini Marie (solo sale la primera vez).
3. **Ten a mano la cuenta de administración de producción.** Está en `Mini Marie/PUBLICACION_SECRETOS.txt` (ADMIN_EMAIL y ADMIN_PASSWORD). No la muestres en pantalla: escríbela con el proyector apagado o en otra ventana.
4. Zoom del navegador al 100 % o 110 %, y pantalla completa (F11).
5. **Plan B sin internet:** la demo local del `README.md` (backend en el puerto 8000, frontend en el 5173).

## 1. Bienvenida e inicio (1 min)

- Aparecen **8 Mini Marie y el saludo «Hola»**. Pulsa **«¡Hola! Explorar El Tintal»**.
- *Qué decir:* «Mini Marie es el personaje de la plataforma: da la bienvenida, es el chat y es la animación de carga.»
- En el inicio, muestra la **maqueta 3D** (arrastra para girarla) y el **carrusel de fotos** del barrio.
- *Qué decir:* «Las fotos son reales, de Wikimedia Commons, con su autor y su licencia.»

## 2. Un módulo de principio a fin (2 min)

Usa **Centros Educativos** (menú Categorías).

1. **Mapa temático** con emojis y la **lista**: busca «colegio» y filtra.
2. Abre la **ficha** de un registro: fuente del dato (OpenStreetMap o Datos Abiertos), etiqueta «verificado» o «por verificar», galería y calificaciones.
3. **Inicia sesión** como administración (arriba a la derecha) y vuelve al módulo:
   - **califica** un lugar con 4,5 estrellas o más: Mini Marie salta de alegría;
   - **crea** un registro con el formulario y su punto en el mapa;
   - **edítalo** y después **elimínalo**, para dejar los datos como estaban.
4. *Qué decir:* «Los 14 módulos salen de las mismas fábricas genéricas del backend. Agregar un módulo es declarar su especificación, sin tocar el núcleo: es el principio abierto/cerrado.»
5. *Detalle para mostrar:* si se pone un punto fuera de El Tintal, la API lo rechaza.

## 3. Historia Local (45 s)

- La **línea de tiempo** se revela al bajar, y cada hito cita su fuente. Los hitos de prensa llevan la etiqueta «Prensa».
- La **bandera de Kennedy**, las cifras y la ubicación del barrio.

## 4. Chat con Mini Marie (1 min)

Abre el chat (botón con el sprite, abajo a la derecha) y pregunta:

1. «¿Cuántos colegios hay en El Tintal?» Responde con el conteo y un botón al módulo.
2. «¿Cuál es el lugar mejor calificado?» Responde con el lugar que calificaste en el paso 2.
3. «¿Dónde hay una veterinaria?» Contesta que son datos de ejemplo.
   *Qué decir:* «La plataforma no inventa datos: lo que no es oficial lo dice.»
4. *Qué decir:* «El chat usa un `ModelProvider` con tres modelos intercambiables: Analítico (reglas sobre PostGIS, el que corre en la demo), Generativo (Claude) y MoE, que enruta entre los dos. Se cambia con una variable de entorno, sin tocar el código.»

## 5. Galería, ranking y accesibilidad (1 min)

- **Galería General:** las fotos agrupadas por lugar, con autor, licencia y enlace a Commons.
- **Ranking de Calificaciones:** aparece el lugar que calificaste.
- **Barra de accesibilidad** (derecha): letra más grande (A+), **alto contraste** y movimiento reducido.
- Cambia el idioma a **EN** y vuelve a **ES**.
- *Qué decir:* «Se auditó con axe en 12 vistas y 4 modos: 0 violaciones de WCAG AA. Todo se puede usar con teclado.»

## 6. Cierre (30 s)

Al final de la página están el **Perfil de la Creadora**, **WhatsApp** y las **Preguntas frecuentes**.

*Qué decir:* «Son tres capas en dos repositorios: el frontend en React y la API con el backend en FastAPI, sobre PostgreSQL con PostGIS. Hay pruebas automatizadas en los dos: más de 300 en PyTest, con 98,9 % de cobertura, y más de 200 en Vitest.»

## Entregables del enunciado: dónde está cada uno

| Entregable (enunciado §3) | Dónde |
|---|---|
| Modelo de requerimientos (14 casos de uso) | `docs/MODELO_REQUERIMIENTOS.md` |
| Arquitectura de la solución | `docs/ARQUITECTURA.md` |
| Diseño del frontend | `docs/DISENO_FRONTEND.md` |
| Diseño de la API | `docs/DISENO_API.md` |
| Diseño del backend | `docs/DISENO_BACKEND.md` |
| Diseño de la base de datos | `docs/DISENO_BASE_DATOS.md` |
| Estrategia de pruebas (PyTest y Vitest) | `docs/ESTRATEGIA_PRUEBAS.md` |
| Principios SOLID | `docs/CHECKLIST_SOLID.md` |
| Código fuente en 2 repositorios | `MarieAnneLopez/barrio-frontend` y `MarieAnneLopez/barrio-backend` |

## Preguntas que te pueden hacer

| Pregunta | Respuesta corta |
|---|---|
| ¿Dónde se ve SOLID? | Los endpoints reciben abstracciones con `Depends` (inversión de dependencias); los 14 CRUD salen de `CrudRouterFactory` y `ModuleSpec` (abierto/cerrado); los repositorios tienen interfaces pequeñas (segregación de interfaces). La evidencia está en `docs/CHECKLIST_SOLID.md`. |
| ¿Por qué SRID 4326? | Es WGS84, el mismo de GPS, OpenStreetMap y los mapas web. Las distancias se calculan en metros reales con `geography`. |
| ¿De dónde salen los datos? | De OpenStreetMap (Overpass) y de Datos Abiertos de Bogotá, con un ETL. Cada registro guarda su fuente, y lo inventado dice «dato de ejemplo». |
| ¿Cómo se prueba? | PyTest contra una base PostGIS real (con cobertura mínima de 80 % obligatoria) y Vitest con Testing Library y axe en el frontend. |
| ¿Cómo está publicado? | El frontend está en Cloudflare Pages; la API en Render, y la base en Neon con PostGIS. Todo es gratis; por eso la API se duerme. |
| ¿Por qué El Tintal mide 662 ha? | Es la cifra de la SDP (2012) para la zona; el polígono es una delimitación de referencia, no una unidad administrativa oficial. |
