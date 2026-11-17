# Informe de la Fase 2 (35 → 70 %) — «Los 14 CRUD geoespaciales, ETL real, chat agente y carga»

**Fecha:** 2026-11-14 · **Proyecto:** Reconoce tu Barrio: El Tintal · **Creadora:** Marie Anne Lopez Poveda

La Fase 2 está terminada y verificada. Para empezar la Fase 3 hace falta tu **«OK»**. Antes de darlo, revisa las decisiones de la sección 6.

## 1. Entregables de la fase (PROMPT_MAESTRO §15, Fase 2)

| # | Entregable | Estado | Dónde |
|---|---|---|---|
| 1 | Los 14 CRUD de extremo a extremo: API, PostGIS, mapa temático con emojis, filtros, galerías, ranking y calificación por estrellas | ✅ | `barrio-backend/app/modules/`, `app/api/v1/router_factory.py`, `module_extras.py`; `barrio-frontend/src/features/modules/`, `features/ranking/` |
| 2 | Historia Local con línea de tiempo al hacer scroll (GSAP ScrollTrigger), fuentes verificadas y bandera de Kennedy | ✅ 10 hitos: 7 de fuente oficial y 3 de prensa; ninguno cita Wikipedia (D55–D57) | `src/features/history/`, `seed/historia.json` |
| 3 | ETL desde OpenStreetMap y Datos Abiertos de Bogotá, con semillas y trazabilidad | ✅ 4 321 registros, 4 226 verificados (sección 5) | `barrio-backend/etl/` |
| 4 | Chat de Mini Marie conectado a `ModelProvider` (Analítico, Generativo y MoE), con todas las intenciones y reacciones por evento | ✅ (D59, D60) | `app/providers/`, `app/services/chat_agent.py`, `src/components/chat/` |
| 5 | Animación de carga con Mini Marie corriendo sobre una barra de progreso real | ✅ (D61) | `src/components/avatar/LoadingRunnerBar.tsx`, `src/lib/loadingTracker.ts` |
| 6 | JWT con roles `admin` y `visitante` protegiendo las escrituras; PyTest ≥ 80 %, Vitest y axe-core en verde | ✅ (D58), cobertura 98,90 % | `app/api/guards.py`, `app/api/v1/auth.py`, `src/features/auth/` |
| 7 | `INFORME_FASE_2_70pct.md` y `CHECKLIST_SOLID.md` actualizado | ✅ | `docs/` |

## 2. Hitos y commits

| Hito | Frontend | Backend |
|---|---|---|
| H15 ETL real de los 14 módulos | — | `8b24b66` |
| H16 Módulos de puntos | — | `41c0ebd` |
| H17 Polígono, línea y ficha | — | `6c26dde` |
| H18 Calificaciones, fotos, ranking, estadísticas y cercanía | — | `ccaf306` |
| H19 Frontend de los módulos | `2e83ef6`, `a3b7751`, `2f7ef84`, `47c4c88`, `9ec1422` | `b8f1cb7` |
| H20 Historia Local | `e53091b`, `734acf1`, `3e37add` | `b1a3c5e`, `10e63bf`, `d3890a5` |
| H21 Autenticación JWT | `080d6dc` | `db665da`, `6e778a3` |
| H22 ModelProvider y `/api/v1/chat` | — | `bf93e2c` |
| H23 Chat conectado y reacciones | `6eef6d5` | `82a95be` |
| H24 LoadingRunnerBar | `812d143` | — |

No se hizo `git push` en ningún momento.

## 3. Verificación (salidas reales del 2026-11-14)

**Backend** (`barrio-backend/`, commit `82a95be`):
```
$ docker compose ps        → barrio-postgis Up (healthy)
$ pytest --cov=app --cov-fail-under=80
TOTAL  2272  13  176  14  99%
Required test coverage of 80% reached. Total coverage: 98.90%
298 passed in 68.01s
$ python scripts/check_line_length.py
check_line_length: OK, 210 archivos de código, todos <= 100 líneas.
$ alembic check            → No new upgrade operations detected.
```

**Frontend** (`barrio-frontend/`, commit `812d143`):
```
$ npm run lint             → exit=0
$ npm run typecheck        → exit=0
$ npx vitest run           → Test Files  42 passed (42) · Tests  194 passed (194)
$ node scripts/check_line_length.mjs
check_line_length: OK, 229 archivos de código, todos <= 100 líneas.
$ npm run build            → ✓ built
$ npm audit --omit=dev     → found 0 vulnerabilities
```

**Accesibilidad en navegador real** (Playwright + Edge, axe-core, reglas WCAG 2.0/2.1 A y AA con contraste), con el backend y la base reales. Capturas en `docs/capturas/fase2/` (22 archivos):

| Vista | Escritorio 1440×900 | Móvil 390×844 |
|---|---|---|
| Inicio | 0 violaciones | 0 |
| Centros Educativos | 0 | 0 |
| Datos sobre Robos | 0 | 0 |
| Ficha de un lugar (Barberías) | 0 | 0 |
| Historia Local | 0 | 0 |
| Ranking | 0 | 0 |
| Acceso / Sesión | 0 | 0 |
| Diálogo de inicio de sesión | 0 | 0 |
| Chat abierto con una respuesta del servidor | 0 | 0 |
| Preguntas frecuentes | 0 | 0 |
| Perfil de la creadora | 0 | 0 |

Errores de consola durante el recorrido: 0.

**Pruebas de extremo a extremo en Edge:**
- Inicio de sesión: la cookie es httpOnly, Strict y `/api`, y `document.cookie` queda vacío. La sesión sigue al recargar.
- Visitantes: no ven los botones de escritura y un POST directo como visitante devuelve 403. Pueden calificar.
- Chat: respondió 4 preguntas en español y 2 en inglés con datos de la base.
- Barra de carga: avanzó 17 → 43 → 88 → 100 % en unos 865 ms sin bloquear clics.

## 4. Lo que se puede probar

- **Visitante sin cuenta:**
  - recorre los 14 módulos, con su mapa, filtros, fichas, fotos y fuente de cada dato;
  - ve el ranking y la Historia Local;
  - pregunta al chat cosas como «¿Qué colegios hay?», «¿Cuál es la veterinaria mejor calificada?», «¿Qué queda más cerca?», «¿Cuántos lugares hay?», «Cuéntame la historia» o «¿Cómo contacto a Marie?», en español o inglés.
- **Visitante con cuenta** (se crea en «Iniciar sesión → Crear cuenta»): además califica lugares con estrellas.
- **Administración:**
  - crea, edita y elimina en los 14 módulos y gestiona fotos;
  - la cuenta de evaluación está en `barrio-backend/.env.example` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) y se crea con `python -m etl.runner --solo admin`.

## 5. Datos reales cargados

| Módulo | Registros | Verificados | De ejemplo | Origen |
|---|---|---|---|---|
| Centros Educativos | 5 | 2 | 0 | OSM |
| Escenarios Deportivos | 31 | 1 | 0 | OSM |
| Zonas Verdes | 57 | 7 | 0 | OSM |
| Datos Catastrales | 3 706 | 3 706 | 0 | Datos Abiertos |
| Estado de Calles | 341 | 341 | 0 | OSM |
| Estaciones de Transporte | 28 | 28 | 0 | OSM |
| Sitios de Comida | 5 | 5 | 0 | OSM |
| Datos sobre Robos | 132 | 132 | 0 | Datos Abiertos |
| Información de la Localidad | 1 | 1 | 0 | Datos Abiertos + OSM |
| Atención Inmediata | 2 | 2 | 0 | Datos Abiertos |
| Cámaras de Seguridad | 3 | 0 | 3 | semilla «dato de ejemplo» |
| Librerías | 3 | 0 | 3 | semilla «dato de ejemplo» |
| Veterinarias | 3 | 0 | 3 | semilla «dato de ejemplo» |
| Barberías | 3 | 0 | 3 | semilla «dato de ejemplo» |

- Los 12 registros de ejemplo se muestran como «dato de ejemplo», porque no hay una fuente abierta para esos cuatro módulos.
- Lo que no se pudo verificar se muestra «por verificar».
- La base todavía no tiene calificaciones: el ranking se llena cuando la gente califica.

## 6. Decisiones que necesitan tu confirmación

1. **Siguen abiertas desde la Fase 1:** el límite de El Tintal como UPZ 78 + UPZ 79 (D38) y los campos *propuestos* de los 14 casos de uso. Hasta que digas otra cosa, se mantienen.
2. **Cuenta de evaluación.**
   - `admin@eltintal.local` con la clave que está en `.env.example`, como pide el PROMPT para la evaluación.
   - Cámbiala fuera de la evaluación.
   - En producción, `JWT_SECRET` es obligatorio.
3. **LLM del ambiente Nube (D59).**
   - El adaptador generativo usa Claude (`claude-opus-5-5`) con el SDK oficial `anthropic` 2.3.0.
   - Ese SDK no está en el stack de §8; lo agregué bajo D22 porque el plan pide el adaptador.
   - Por defecto el chat corre en **Local**, sin internet ni claves. Nube e Híbrido se activan en `.env` (`CHAT_MODEL`, `ANTHROPIC_API_KEY`), como explica `docs/ARQUITECTURA.md` §5.1.
   - Cada mensaje en esos ambientes es una llamada pagada.
   - No probé el LLM real: no hay clave y no está en la red permitida. Las pruebas usan un cliente falso.
   - Dime si prefieres otro proveedor.
4. **bcrypt directo en vez de passlib (D58).** §8 nombra `passlib[bcrypt]`, pero passlib ya no se mantiene y no funciona con bcrypt ≥ 4.1. El hash es el mismo: bcrypt con 12 rondas.
5. **Páginas sin hito asignado.** «Mapa 3D» (`/mapa`), «Galería General» (`/galeria`) y «Ayuda» (`/ayuda`) todavía son páginas de sección, y ningún hito del plan las construye. La maqueta 3D completa está en el inicio y cada módulo tiene su galería. Propongo agregarlas a la Fase 3, dentro de H26–H28.

## 6 bis. Respuesta de Marie (D62)

Decisiones aceptadas e implementadas el 2026-11-14 (BE `17ef2a7`, FE `17fa580`). **El camino Nube del chat (Claude) no se probó contra la API real:** solo con un cliente falso. D38 quedó en pausa: el Portal Américas está fuera del polígono (≈ 1,35 km, UPZ 83). La publicación está preparada en `docs/PUBLICACION.md`, sin ejecutar.

## 7. Limitaciones conocidas

- **Carga de semillas.** Es idempotente por `source_ref`. Si una fuente cambia de URL, la fila vieja se queda. Pasó una vez: la ficha de Kennedy quedó duplicada al agregarle la fuente oficial en H20. Ya está corregido en la base de desarrollo, pero falta el arreglo en código (clave natural por módulo) en H29.
- **Límite de intentos** (login, registro y chat): vive en memoria, así que sirve con un solo proceso de uvicorn, que es como corre el proyecto. Con varios procesos habría que llevarlo a un almacén común.
- **Chat:**
  - no pide la ubicación del navegador; «¿qué queda cerca?» usa el centro de El Tintal (D60);
  - las respuestas que ya están en pantalla no cambian de idioma si cambias ES/EN, solo las nuevas;
  - los ejemplos del módulo de robos son modalidades («Hurto efectuado»), no lugares.
- **Auditoría de Python:** no corrí `pip-audit` porque no está en el plan. `npm audit` da 0.
- **Móvil:** el subtítulo del header se corta («KENNEDY · …»). Es cosmético y queda para el pulido.
- **Bundle:** MapLibre y la escena 3D siguen en chunks diferidos grandes, que se optimizan en H27.

## 8. Cómo levantar la demo

```powershell
# 1) Base de datos y API
cd "C:\Users\mps20\OneDrive\Documentos\Mini Marie\barrio-backend"
docker compose up -d
.venv\Scripts\python -m alembic upgrade head          # solo la primera vez
.venv\Scripts\python -m etl.runner --solo carga,historia,admin
.venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

# 2) Frontend (otra terminal)
cd "C:\Users\mps20\OneDrive\Documentos\Mini Marie\barrio-frontend"
npm run dev
# Abre http://localhost:5173
```

## 9. Fase 3 (al recibir tu «OK»)

- **H26:** auditoría de movimiento.
- **H27:** rendimiento: code-splitting y frame time.
- **H28:** accesibilidad: alto contraste, teclado y ES/EN.
- **H29:** revisión final de SOLID, incluido el arreglo de la carga de semillas.
- **H30:** los 7 documentos técnicos, `README.md` e `INFORME_FASE_3_100pct.md`.
- **Propuesta del punto 6.5:** las páginas Mapa 3D, Galería General y Ayuda.
