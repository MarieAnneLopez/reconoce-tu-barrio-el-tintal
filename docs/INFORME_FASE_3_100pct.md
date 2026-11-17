# Informe de la Fase 3 (70 → 100 %): pulido, rendimiento, accesibilidad y documentación final

**Fecha:** 2026-11-15 · **Proyecto:** Reconoce tu Barrio: El Tintal · **Creadora:** Marie Anne Lopez Poveda

- **Publicada en:** https://reconoce-el-tintal.pages.dev (D64).
- **Estado:** la Fase 3 está terminada, verificada y **aprobada**: Marie dio el «OK» el 2026-11-15.

## 1. Entregables de la fase (PROMPT_MAESTRO §15, Fase 3)

| # | Entregable | Estado | Dónde |
|---|---|---|---|
| 1 | Pulido de microinteracciones, transiciones, tooltips y reveals | ✅ H26: auditoría con `improve-animations`; tooltips agrupados; curvas del proyecto; token `--ease-drawer`. Se verificaron el modal, el press scale, el hover y el movimiento reducido. | FE `0e03280` |
| 2 | Rendimiento y accesibilidad | ✅ H27: rutas en diferido, chunk inicial de 226 a 115 kB gz (presupuesto < 200 kB); el mapa y la escena 3D ya cargaban en diferido. H28: axe 0 en 48 combinaciones, teclado, alto contraste, movimiento reducido. | FE `802003f`, `e2fc5c8` |
| 3 | Auditoría final, SOLID y regla de 100 líneas | ✅ H29 y la revisión de H30; 0 archivos de más de 100 líneas en los dos repos | `docs/CHECKLIST_SOLID.md` |
| 4 | Los 8 documentos técnicos y el README | ✅ | `docs/*.md`, `README.md` |
| 5 | Builds de producción limpios y este informe | ✅ (sección 3) | |

Además, por tus decisiones D62–D64:
- la página **Ayuda**, que el enunciado §5.3 sí pide;
- la página **Mapa 3D**, al final, como pediste;
- la **publicación en internet**.

## 2. Hitos y commits

| Hito | Frontend | Backend |
|---|---|---|
| Decisiones de cierre F2 y publicación preparada (D62) | `17fa580` | `17ef2a7` |
| Opción A de El Tintal, 662 ha (D63) | `2128c8b` | `4257184` |
| Publicación: arranque por módulo y `RESEED_MODULES` (D64) | — | `e4d0eff`, `cbe2392` |
| H26 Auditoría de movimiento | `0e03280` | — |
| H27 Rendimiento | `802003f` | — |
| H28 Accesibilidad y Ayuda | `e2fc5c8` | — |
| H29 Revisión SOLID | `7fa5ec4` | `5a2ef0a` |
| H30 Mapa 3D | `2fa647b` | — |
| H30 Arreglos de la revisión de documentos | `87598ee` | `01d8b78` |

Los dos repos están en GitHub como privados (`MarieAnneLopez/barrio-frontend` y `MarieAnneLopez/barrio-backend`), con el push que autorizaste.

## 3. Verificación (salidas reales)

**Backend** (`01d8b78`):
- `pytest --cov=app`: 311 pruebas, todas en verde.
- Cobertura **98,93 %**. Ahora el mínimo de 80 % también está en `pyproject.toml` (`fail_under = 80`).
- `check_line_length`: 216 archivos, todos de 100 líneas o menos.
- `alembic check`: sin cambios pendientes.

**Frontend** (`87598ee`):
- `npm run lint` y `npm run typecheck` sin errores.
- `npx vitest run`: 46 archivos, 202 pruebas, todas en verde.
- `check_line_length`: 237 archivos, todos de 100 líneas o menos.
- `npm run build` correcto y `npm audit --omit=dev` sin vulnerabilidades.

**En navegador real** (Edge + Playwright + axe-core, WCAG 2.0/2.1 A y AA):
- **12 vistas en 4 modos, 0 violaciones.** Los modos: normal y alto contraste, ES y EN, escritorio y móvil, letra al 125 % y movimiento reducido.
- **Mapa 3D:** se auditó aparte; 0 violaciones y 0 errores.
- **Teclado:** el primer Tab es «Saltar al contenido» y se recorrieron entre 50 y 60 elementos por vista, todos con foco visible.

**Producción** (https://reconoce-el-tintal.pages.dev):
- `health` responde ok, con PostGIS 3.6.
- Los 14 módulos tienen datos; por ejemplo, 3 706 lotes catastrales.
- El login de administración funciona con la cookie `HttpOnly`, `Secure` y `Strict`.
- La clave de demostración da 401.
- `/mapa`, `/ayuda` e `/historia` responden 200.

## 4. Hallazgos de la revisión final, ya corregidos

Los encontraron los agentes que escribieron los documentos. Cada uno se verificó en el código y se corrigió con su prueba:
1. **La API no exigía que una geometría cayera dentro de El Tintal:** solo lo exigían el formulario y el ETL. Ahora POST y PATCH responden 422 `OUTSIDE_TINTAL` (`app/repositories/tintal_area.py`).
2. **Con la base caída, cualquier endpoint daba 500.** Ahora responde 503 `DATABASE_UNAVAILABLE` con el formato único de error.
3. **`/auth/me` sin sesión decía «Inicia sesión para calificar».**
4. **El tamaño `text-step--2` no existía**, así que el texto pequeño del chat salía sin tamaño propio.
5. **Mini Marie saltaba con cualquier calificación.** Ahora solo con 4,5 estrellas o más, como pide §11.4.2.
6. **El mapa temático, la línea de tiempo y el count-up** no respetaban el movimiento reducido del sistema; ahora sí.
7. **La barra de carga** se desvanecía en 180 ms y no en los 240 ms decididos.

## 5. Definición de hecho global (PROMPT §18)

| Punto | Estado |
|---|---|
| 14 CRUD geoespaciales de extremo a extremo con PostGIS 4326 y 14 mapas temáticos con emojis | ✅ |
| Mapa 3D en el inicio, carrusel, Historia Local y bandera de Kennedy | ✅ (más la página `/mapa`) |
| Sidebar plegable, ES/EN, barra de accesibilidad, WhatsApp, FAQ y Perfil de la Creadora | ✅ |
| Bienvenida con 8 Mini Marie y «Hola» | ✅ |
| Chat con sprite, reacciones y ModelProvider (Analítico, Generativo y MoE) | ✅ (el modo Nube no se probó contra la API real: no hay clave) |
| Barra de carga con Mini Marie, ligada al progreso real | ✅ |
| Paleta oficial; WCAG AA con axe en 0 | ✅ |
| SOLID; 0 archivos de más de 100 líneas; 2 repos independientes | ✅ (con los compromisos de `CHECKLIST_SOLID.md`) |
| PyTest ≥ 80 % y pruebas del frontend en verde | ✅ 98,93 %, 202 pruebas |
| Documentos e informes de fase | ✅ (falta tu aprobación) |

## 6. Lo que necesita tu decisión o revisión

1. **«Galería General» (`/galeria`) seguía «En construcción»** (resuelto en D66, sección 6 bis).
   - El enunciado pide galerías dentro de cada módulo, y esas ya están; no pide una galería general.
   - Opción A: la quito del menú. Opción B: la construyo, juntando las fotos de los 14 módulos.
   - Hoy la base no tiene fotos subidas: el panel de administración muestra la galería, pero no tiene botón para subir fotos.
2. **Una restricción con nombre duplicado.** En la base, la restricción CHECK de `robos.cantidad` se llama `ck_robos_ck_robos_cantidad`. Funciona, pero el nombre está duplicado. Cambiarlo exige una migración nueva, y la regla es preguntarte antes de tocar un esquema ya migrado. ¿Lo cambio?
3. **La tabla `faq_items` existe pero no se usa:** las preguntas frecuentes vienen de las traducciones del frontend. ¿La dejas o la retiro? Retirarla también es una migración.
4. **La columna `datos_catastrales.matricula_inmobiliaria` guarda el código de lote (LOTCODIGO)**, porque la matrícula no es un dato público (D51). El nombre puede confundir en clase; renombrarla también es una migración.

## 6 bis. Respuesta de Marie (D65)

Aprobó los tres cambios de esquema. Se aplicaron con la migración `c7d2e9a41f06`, que tiene `downgrade` completo y `alembic check` sin diferencias, en local y en producción (Render la corrió en Neon al arrancar):
- `codigo_lote` reemplaza a `matricula_inmobiliaria`;
- `ck_robos_cantidad` queda con su nombre correcto;
- `faq_items` se retiró.

Commits: BE `c1bce8b`, FE `28aada1`.

**Punto 1, fotos (D66):** Marie eligió construir la galería con fotos reales.
- `/galeria` ya no está «En construcción». Muestra 7 fotos reales de Wikimedia Commons en 3 lugares (Biblioteca El Tintal, Universidad Agustiniana y C. C. Tintal Plaza, los tres en Estaciones de Transporte) y 4 vistas generales del barrio.
- Cada foto muestra su autor, su licencia con enlace al texto legal, y su página en Commons. Las fotos se guardan dentro de la plataforma, nunca se enlazan en caliente.
- Los demás lugares no tienen una foto libre en Commons y quedan sin foto; no se inventó ninguna.
- Commits: BE `38f6666` (API `GET /api/v1/fotos` y semilla `seed/fotos.json`), FE `fe2ab0f`. Verificado en producción.

## 7. Limitaciones conocidas

- **Render gratis se duerme a los 15 minutos sin visitas:** la primera carga tarda cerca de un minuto. Abre la página antes de mostrarla.
- **Historia mide un LCP de unos 3,0 s** con 4G lenta, porque la bandera se pinta al final de la cascada de descargas (H27).
- **El límite de intentos** (login, registro y chat) vive en memoria, así que sirve para un solo proceso, que es como corre el proyecto. El registro cuenta todos los intentos, no solo los fallidos, como freno al spam.
- **Las auditorías en navegador** se corren con scripts de Playwright fuera de los repos; no hay CI remoto.
- **La maqueta 3D** solo muestra marcadores de los centros educativos.
- **Faltan dos datos de prensa:** el nombre Zapata Olivella (2006) y el Portal Américas (2003) llevan «Prensa», como decidiste.

## 8. Cómo levantar la demo local

Los pasos exactos están en `README.md` de la raíz. La guía de publicación y de cómo volver a publicar está en `docs/PUBLICACION.md`.
