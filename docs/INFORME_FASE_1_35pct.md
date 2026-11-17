# Informe de la Fase 1 (0 → 35 %) — «Fundación viva, 3D, bienvenida y arquitectura»

**Fecha:** 2026-11-14 · **Proyecto:** Reconoce tu Barrio: El Tintal · **Creadora:** Marie Anne Lopez Poveda

La Fase 1 está terminada y verificada. Para empezar la Fase 2 hace falta tu **«OK»**. Antes de darlo, revisa las dos decisiones de la sección 6.

## 1. Entregables de la fase (PROMPT_MAESTRO §15, Fase 1)

| # | Entregable | Estado | Dónde |
|---|---|---|---|
| 1 | Dos repos Git, `docker-compose.yml` con PostGIS y validadores de 100 líneas | ✅ | `barrio-frontend/`, `barrio-backend/`, `scripts/check_line_length.*` |
| 2 | Recorte de «MINI MARIE.png»: 6 poses limpias + `atlas.json` con anclaje de pies | ✅ El original no se tocó (hash idéntico, sección 4) | `scripts/slice_spritesheet.mjs`, `public/assets/avatar/` |
| 3 | Design system con la paleta oficial y componentes con todos sus estados | ✅ | `src/styles/tokens.css`, `src/components/ui/` |
| 4 | Hero con maqueta 3D, carrusel, sidebar, ES/EN, barra de accesibilidad, WhatsApp y footer con FAQ y perfil | ✅ | `src/features/home/`, `src/three/`, `src/components/layout/` |
| 5 | Bienvenida con 8 Mini Marie y «Hola», y chat flotante que reacciona a la navegación | ✅ Chat con respuestas locales; el agente con backend llega en la Fase 2 | `src/components/avatar/`, `src/components/chat/` |
| 6 | Rutas de los 14 módulos con emoji; backend en capas, esquema PostGIS completo, polígono real, `/health` y CRUD de Centros Educativos de extremo a extremo | ✅ | `src/lib/categoryConfig.ts`, `barrio-backend/app/` |
| 7 | `ARQUITECTURA.md`, `MODELO_REQUERIMIENTOS.md`, `CHECKLIST_SOLID.md` y este informe | ✅ | `docs/` |

## 2. Hitos y commits

| Hito | Frontend | Backend |
|---|---|---|
| H0 Tooling | `a7599f6` | `34ecfef` |
| H1 Scaffold frontend | `46f829e` | — |
| H2 Sprite de Mini Marie | `cbd5153` | — |
| H3 Design system | `7c0eaee` | — |
| H4 Shell y navegación | `89f1e0a` | — |
| H5 Accesibilidad, WhatsApp y footer | `38741d4` | — |
| H6 Scaffold backend | — | `c141646` |
| H7 Polígono de El Tintal | — | `a79e9e3`, `5abdfc7` |
| H8 Esquema PostGIS y fábricas CRUD | — | `e5521c2` |
| H9 Centros Educativos de extremo a extremo | `081ef63` | `3994c42` |
| H10 Escena 3D | `e69819a` | — |
| H11 Carrusel | `e454b51` | — |
| H12 Bienvenida | `cd30fb6` | — |
| H13 Chat flotante | `2377dd1` | — |
| H14 Cierre (corrección de accesibilidad) | `a463f79` | — |

Nada se ha subido a ningún remoto (`git push` nunca se ejecuta).

## 3. Verificación (salidas reales del 2026-11-14)

**Frontend** (`barrio-frontend/`):
```
$ npm run lint            → eslint . --max-warnings 0      exit=0
$ npm run typecheck       → tsc --noEmit                   exit=0
$ npx vitest run          → Test Files  28 passed (28)
                            Tests  142 passed (142)
$ node scripts/check_line_length.mjs
check_line_length: OK, 156 archivos de código, todos <= 100 líneas.
$ npm run build           → ✓ built in 450ms
```

**Backend** (`barrio-backend/`):
```
$ docker compose up -d    → Container barrio-postgis Running
$ pytest --cov=app --cov-fail-under=80
TOTAL  964  7  76  8  99%
Required test coverage of 80% reached. Total coverage: 98.56%
103 passed in 6.12s
$ python scripts/check_line_length.py
check_line_length: OK, 99 archivos de código, todos <= 100 líneas.
```

**Accesibilidad en navegador real** (Playwright + Edge, axe-core 4.14, reglas WCAG 2.0/2.1 A y AA, contraste incluido), con backend y base reales:

| Vista | Escritorio 1440×900 | Móvil 390×844 |
|---|---|---|
| Inicio | 0 violaciones | 0 violaciones |
| Mapa 3D | 0 | 0 |
| Historia | 0 | 0 |
| Centros Educativos | 0 | 0 |
| Preguntas frecuentes | 0 | 0 |
| Perfil de la creadora | 0 | 0 |

La primera pasada encontró 1 violación seria repetida en todas las vistas: el nombre accesible del enlace de la marca y de los botones A−/A+ no contenía su texto visible (WCAG 2.5.3). Se corrigió en `a463f79`, con una prueba de regresión. Errores de consola durante el recorrido: ninguno.

**Rendimiento 3D** (D45, equipo de desarrollo con RTX 4050): 40 352 triángulos (presupuesto 90 000) y 7,06 ms por cuadro de media. No es un equipo de gama media; la medida se repite en H27.

## 4. Capturas y sprite

Capturas en `docs/capturas/fase1/` (16 archivos): bienvenida, inicio, mapa, historia, centros educativos, preguntas frecuentes, creadora y chat abierto, cada una en escritorio y en móvil.

Hash SHA-256 de «MINI MARIE.png» al cierre: `65F8F964FC3C368154B0D52EA33F58D57C6F429B5437298D80B891F56E36D106`, idéntico al de referencia.

## 5. Datos reales cargados

- **Polígono de El Tintal:** UPZ 78 + UPZ 79, 6,4966 km², desde OSM (pendiente de tu confirmación, sección 6).
- **Capas base del mapa y de la maqueta 3D:** vías, parques, edificios y manzanas de OSM, recortados al polígono.
- **Centros Educativos:** 5 registros de OSM. 2 verificados (Jardín Infantil El Caracol e IED Gabriel Betancourt Mejía Sede A) y 3 «por verificar» porque su carácter público se infiere de «IED». 4 se omitieron por falta de evidencia, con el motivo registrado. Ningún dato inventado.
- **Fotos del carrusel:** 8 fotos libres de Wikimedia Commons, guardadas en local, con autor y licencia visibles (D46).

## 6. Decisiones que necesitan tu confirmación

1. **Límite de El Tintal (D38).** OpenStreetMap no tiene un límite de «barrio El Tintal». Usé la unión de las UPZ 78 Tintal Norte y 79 Calandaima de Kennedy, que contiene la Biblioteca El Tintal, el Parque El Tintal, Tintal Plaza y Ciudad Tintal. Si en clase el barrio tiene otro límite, se cambia en `etl/tintal_config.py` y se vuelve a importar.
2. **Campos de los 14 casos de uso.** La especificación no trae los campos de los casos definidos en clase; usé los del PROMPT_MAESTRO §11.3, marcados como *propuestos* en `MODELO_REQUERIMIENTOS.md`. Si en clase son otros, dímelo antes de la Fase 2, que crea los 13 CRUD restantes.

## 7. Limitaciones conocidas

- **Página «Mapa 3D» (`/mapa`).** Todavía es una página de sección; la maqueta 3D completa está en el inicio. La vista dedicada llega en la Fase 2.
- **Chat.** Responde con un repertorio local de intenciones y acciones rápidas, sin datos de lugares; se conecta a `/api/v1/chat` en H22–H23.
- **Escrituras del CRUD.** Responden 401 hasta que exista la autenticación JWT (H21). Es seguro por defecto.
- **Tamaño del bundle.** Los chunks diferidos de MapLibre (1,08 MB; 295 kB gzip) y de la escena 3D (832 kB; 221 kB gzip) se cargan solo al usarse. Se optimizan en H27.
- **Móvil.** El botón plegado de la barra de accesibilidad flota sobre el borde derecho del contenido y puede tapar parte de una etiqueta (se ve en la captura de Centros Educativos). Queda para el pulido de la Fase 3.

## 8. Cómo levantar la demo

Requisitos: Docker Desktop encendido; Node 24 y Python 3.13 ya instalados.

```powershell
# 1) Base de datos y API
cd "C:\Users\mps20\OneDrive\Documentos\Mini Marie\barrio-backend"
docker compose up -d
.venv\Scripts\python -m alembic upgrade head      # solo la primera vez
.venv\Scripts\python -m etl.load_seed              # solo la primera vez
.venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

# 2) Frontend (otra terminal)
cd "C:\Users\mps20\OneDrive\Documentos\Mini Marie\barrio-frontend"
npm run dev
# Abre http://localhost:5173
```

Para ver de nuevo la bienvenida, usa el botón «Repetir bienvenida» del header o abre una pestaña nueva.

## 9. Fase 2 (al recibir tu «OK»)

13 CRUD restantes por la misma fábrica, ETL real de cada módulo, autenticación JWT, calificaciones y ranking, galerías, `ModelProvider` (Analítico, Generativo y MoE) con el chat conectado al backend, y la animación de carga con Mini Marie corriendo. El detalle está en `PLAN_MAESTRO.md` (H15–H25).
