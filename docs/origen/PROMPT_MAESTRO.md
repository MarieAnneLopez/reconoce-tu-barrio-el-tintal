# PROMPT MAESTRO — Aplicación Web "Reconoce tu Barrio: El Tintal" (Claude Code)

## 1. TU ROL Y REGLA DE ORO

Eres el arquitecto de software, ingeniero full-stack senior, diseñador UI/Motion y desarrollador WebGL/3D de este proyecto, y eres su único desarrollador. Tu misión es construir de principio a fin, **sin omitir, simplificar ni silenciar un solo requisito de este documento**, una **aplicación web de tres capas (Frontend → API → Backend → Base de Datos Geoespacial)** para reconocer de manera detallada el barrio **El Tintal (Localidad de Kennedy, Bogotá D.C., Colombia)**, con estética futurista realista, animaciones coreografiadas de nivel producción, escena 3D real en el inicio y asistente virtual pixel art animado ("Mini Marie"), para la estudiante **Marie Anne Lopez Poveda**.

**Regla de oro:** Si algún requisito técnico o recurso externo presenta un bloqueo real que impida cumplirlo exactamente como se especifica, **DETENTE y pregúntame antes de improvisar**. Nunca silencies requisitos, nunca dejes `TODO` vacíos ni entregues implementaciones a medias.

---

## 2. CONTEXTO DEL PROYECTO Y DATOS CANÓNICOS

- **Nombre del proyecto:** Aplicación Web de Reconocimiento de Barrio — El Tintal.
- **Estudiante / creadora:** Marie Anne Lopez Poveda — bachiller con énfasis agroindustrial y estudiante de Ingeniería Catastral y Geodesia, residente de Funza (Cundinamarca).
- **Territorio objetivo:** Barrio **El Tintal**, Localidad **Kennedy** (Localidad 8), **Bogotá D.C., Colombia**.
- **Contacto oficial de la creadora / chatbot:** WhatsApp `+57 3132596937` (`https://wa.me/573132596937`).
- **Mascota / asistente virtual:** **"Mini Marie"** — spritesheet pixel art ubicado en la raíz del proyecto: `./MINI MARIE.png`.
- **Naturaleza:** proyecto académico con entregables estrictamente evaluables (Secciones 6 y 7) y entregas incrementales verificadas al **35%**, **70%** y **100%** (Sección 15).

**Anclaje geográfico obligatorio (`bbox_tintal`):**
El primer paso técnico del backend es obtener el polígono oficial del barrio **El Tintal** en la localidad de Kennedy, Bogotá D.C. (entorno Av. Ciudad de Cali / Av. de las Américas / Biblioteca Pública El Tintal Manuel Zapata Olivella, centroide aproximado `lat: 4.6445, lon: -74.1545`).
1. Consulta OpenStreetMap (Overpass API: `relation["boundary"="administrative"]["name"~"Tintal",i]` / `way` / `place="neighbourhood"`) y/o Datos Abiertos de Bogotá (`datos.gov.co` / IDECA barrios de Bogotá).
2. Valida que el centroide caiga dentro de Kennedy (`lat ∈ [4.62, 4.66]`, `lon ∈ [-74.17, -74.13]`). Si la API devuelve múltiples polígonos (ej. Tintal Norte vs. El Tintal), selecciona el correspondiente al barrio El Tintal en Kennedy y documenta la fuente exacta.
3. Persiste el GeoJSON verificado en `barrio-backend/seed/el_tintal_polygon.geojson`, calcula `bbox_tintal` desde esa geometría (nunca coordenadas inventadas a ojo) y expón `/api/v1/barrio/poligono` para que tanto la escena 3D como los 14 mapas 2D consuman exactamente el mismo polígono.

---

## 3. PROTOCOLO DE ARRANQUE Y SKILLS OBLIGATORIAS (en este orden exacto)

Nota operativa: la carpeta raíz `"Mini Marie/"` contiene un espacio en el nombre. **Envuelve siempre las rutas entre comillas dobles (`"$ROOT/..."`) en todos los comandos de shell y scripts.**

Ejecuta esta secuencia estricta antes de escribir código de aplicación:

1. **Superpowers:** Invoca inmediatamente la skill `using-superpowers` y sigue su flujo estructurado (`brainstorm → plan → tareas verificadas`). Inspecciona las skills disponibles en el entorno para mapear nombres exactos.
2. **Planificación por hitos:** Invoca `planning-and-task-breakdown`, genera el plan detallado de las **3 fases (35% → 70% → 100%)** con checklists marcables y guárdalo en `"./PLAN_MAESTRO.md"`.
3. **UI/UX:** Invoca `ui-ux-pro-max` enfocada en: estética futurista dark mode de alta fidelidad, paneles de vidrio técnico (*glassmorphism* oscuro), dashboards geoespaciales con escena 3D y accesibilidad WCAG AA.
4. **Diseño e interacción Emil Kowalski:** Invoca todas las skills de diseño de Emil Kowalski disponibles (`emil-design-eng`, `diseños` y cualquier skill adicional de Emil Kowalski presente) para gobernar microinteracciones, curvas de aceleración, estados de botones/inputs, origen de tooltips y transiciones sin fricción.
5. **Diseño y animación 3D:** Invoca todas las skills de diseño 3D y animación 3D disponibles (`threejs-webgl`, `react-three-fiber`, `web3d-integration-patterns` y afines) para estructurar la escena 3D del hero de El Tintal.
6. **Animación y coreografía 2D:** Invoca `animate`, `gsap-scrolltrigger`, `choreograph` (para la coreografía de bienvenida con 8 avatares y el letrero `"Hola"`), y `animation-performance` (y posteriormente `find-animation-opportunities` e `improve-animations` en auditoría).
7. **Ingeniería Backend y Calidad:** Invoca `security-and-hardening`, `test-driven-development` (ciclo rojo-verde-refactor con PyTest), `incremental-implementation` y `code-review-and-quality`.
8. **Trazabilidad:** Registra en `PLAN_MAESTRO.md` qué skill invocaste en cada bloque de trabajo.
9. **Primer checkpoint:** Presenta el resumen de `PLAN_MAESTRO.md` y el análisis visual de las referencias (Sección 17) y **espera mi confirmación antes de escribir la primera línea de código.**

---

## 4. CONCEPTOS TEÓRICOS DEL CURSO Y SU APLICACIÓN OBLIGATORIA EN CÓDIGO

El sistema debe implementar y documentar explícitamente estos 4 pilares teóricos:

1. **Modelo:** programa que define una estructura de red neuronal artificial para, dada una entrada general, generar una salida conforme a su entrenamiento.
2. **Tipos de modelos:** **Generativos**, **Analíticos** y **Mixture of Experts (MOE)**.
3. **Ambientes de ejecución:** **Nube**, **Local** e **Híbrido**.
4. **Agentes:** conceptos fundamentales y su rol autónomo/reactivo dentro de los sistemas.

**Implementación exigida en `barrio-backend/app/providers/`:**
- Define la abstracción `ModelProvider` (patrón **Strategy + Factory**, cumpliendo SOLID) con tres implementaciones concretas e intercambiables:
  - `AnalyticModel`: clasificación de intención, extracción de entidades y ranking/búsqueda semántica espacial sobre los datos reales de El Tintal (activo por defecto en ambiente **Local**, sin requerir internet ni API keys).
  - `GenerativeModel`: adaptador desacoplado listo para conectar un LLM generativo vía API key (ambiente **Nube**), con fallback determinista controlado si no hay credencial configurada.
  - `MoERouter`: enrutador *Mixture of Experts* que despacha consultas según dominio (consultas geoespaciales/catastrales → experto analítico espacial; historia/contexto → experto documental; conversación abierta → experto generativo) representando ejecución **Híbrida**.
- El chatbot **"Mini Marie"** actúa como el **Agente** del sistema: percibe el contexto de navegación del usuario, razona mediante el `ModelProvider` activo, consulta herramientas/repositorios del barrio y ejecuta acciones visuales en el frontend (cambio de expresión, sugerencias de ruta o filtrado de mapa).
- Documenta en `docs/ARQUITECTURA.md` y `docs/DISENO_BACKEND.md` el ambiente de ejecución elegido (**Local** por defecto) y el procedimiento exacto de configuración (`.env`) para conmutar a **Nube** o **Híbrido** sin modificar una sola línea de lógica de negocio.

---

## 5. OBJETIVO DEL SISTEMA

Desarrollar una **aplicación web de tres capas** orientada a **reconocer de manera detallada el barrio El Tintal**: su historia local, símbolos de la localidad de Kennedy, geografía catastral y sus **14 categorías de puntos y geometrías de interés**, integrando:
- Mapa 3D principal interactivo en el inicio.
- 14 módulos CRUD completos con sus 14 mapas temáticos interactivos MapLibre.
- Iconografía dinámica por temática (emojis), galerías contextuales de fotografías y sistema de calificación por estrellas.
- Barra lateral, selector de idioma (ES/EN), barra lateral derecha de accesibilidad (contraste y tamaño de fuente dinámico) y botón flotante permanente de WhatsApp (`3132596937`).
- Asistente virtual pixel art **"Mini Marie"** con recorte profesional del spritesheet, animación de bienvenida multi-avatar con el letrero `"Hola"`, reacciones en tiempo real a cada evento de navegación/CRUD y animación de carga con Mini Marie corriendo sobre la barra de progreso real.

---

## 6. ENTREGABLES ESTRICTOS (los 8 documentos + código + pruebas)

Todos los documentos van en `"./docs/"`, redactados en español técnico claro, con diagramas en Mermaid y trazabilidad real al código:

1. `docs/MODELO_REQUERIMIENTOS.md`: acorde a los 14 casos de uso, con diagrama de casos de uso (Mermaid), actores (`Visitante`, `Administradora / Marie`, `Agente Mini Marie`, `APIs Externas OSM/Datos Abiertos`), matriz de requerimientos funcionales/no funcionales y flujos principales + alternos por caso.
2. `docs/ARQUITECTURA.md`: arquitectura de 3 capas, diagrama de componentes, diagrama de despliegue (`docker-compose`), flujo de datos, aplicación de los 4 conceptos teóricos (Modelo, Generativo/Analítico/MOE, Local/Nube/Híbrido, Agentes) y ADRs (incluyendo elección de PostGIS sobre MySQL y Spatialite).
3. **Código Fuente Completo:** en ambos repositorios independientes (`barrio-frontend/` y `barrio-backend/`).
4. `docs/ESTRATEGIA_PRUEBAS.md`: pirámide de pruebas, cobertura PyTest ≥ 80% de endpoints, pruebas de geometrías PostGIS, pruebas frontend Vitest + Testing Library y auditoría de accesibilidad `axe-core` en cero violaciones AA.
5. `docs/DISENO_FRONTEND.md`: diseño propio del componente Frontend (design tokens, paleta, arquitectura de micro-módulos, escena 3D, MapLibre, máquina de estados de Mini Marie, i18n y accesibilidad).
6. `docs/DISENO_API.md`: diseño propio del componente API (contratos REST `/api/v1/*`, esquemas Pydantic, formatos GeoJSON, autenticación JWT, códigos de error estándar y documentación OpenAPI).
7. `docs/DISENO_BACKEND.md`: diseño propio del componente Backend (capas `api → services → repositories → models`, inyección de dependencias, ETL OSM/Datos Abiertos, `ModelProvider` y cumplimiento SOLID).
8. `docs/DISENO_BASE_DATOS.md`: diseño propio del componente Base de Datos (modelo entidad-relación Mermaid, diccionario de las 14 tablas geoespaciales SRID 4326 + tablas transversales, índices `GIST` y migraciones Alembic).
9. Adicionalmente en cada cierre de fase: `docs/CHECKLIST_SOLID.md` y los 3 informes `docs/INFORME_FASE_1_35pct.md`, `docs/INFORME_FASE_2_70pct.md` y `docs/INFORME_FASE_3_100pct.md`.

---

## 7. NORMAS DE DESARROLLO INNEGOCIABLES

1. **Principios SOLID obligatorios (POO real en Backend y Frontend):**
   - **S (Single Responsibility):** una única responsabilidad por clase/módulo (ej. `EduCenterCrudService` separado de `EduCenterGeoQueryService`).
   - **O (Open/Closed):** los 14 routers y servicios CRUD se construyen mediante fábricas genéricas tipadas (`CrudRouterFactory` / `BaseCrudRepository<T>`), permitiendo agregar un módulo #15 sin editar el núcleo.
   - **L (Liskov Substitution):** `AnalyticModel`, `GenerativeModel` y `MoERouter` sustituyen transparentemente a `ModelProvider`; los repositorios cumplen sus contratos base sin excepciones inesperadas.
   - **I (Interface Segregation):** interfaces pequeñas y específicas (`ReadableRepository`, `WritableRepository`, `SpatialQueryRepository`, `RateableService`) — prohibidas las interfaces monolíticas.
   - **D (Dependency Inversion):** los endpoints FastAPI dependen exclusivamente de abstracciones inyectadas (`Depends(...)`), nunca instancian sesiones SQLAlchemy ni consultas PostGIS directamente.
2. **Dos repositorios Git independientes:**
   - `"./barrio-frontend/"` con su propio `.git` (exclusivo Frontend).
   - `"./barrio-backend/"` con su propio `.git` (exclusivo API + Backend + DB/ETL).
   - Nunca mezcles historiales ni código entre ambos repos. Realiza commits atómicos y descriptivos por cada tarea verificada.
3. **Modularidad restringida (`≤ 100 líneas` por archivo de código):**
   - **Ningún archivo de código puede superar las 100 líneas físicas (`wc -l <= 100`)**. Aplica estrictamente a `.ts`, `.tsx`, `.js`, `.mjs`, `.py` y `.css` (excepto archivos JSON de datos/traducciones y migraciones autogeneradas de Alembic).
   - Para lograrlo limpiamente sin sacrificar funcionalidad, aplica desde el inicio descomposición en micro-módulos (un hook por archivo, una capa 3D por archivo, un subcomponente por archivo, un esquema por archivo).
   - Incluye `scripts/check_line_length.mjs` en frontend y `scripts/check_line_length.py` en backend, y **ejecútalos después de cada bloque de tareas** para corregir de inmediato cualquier archivo que pase de 100 líneas.
4. **Motor de Base de Datos Geoespacial:** **PostGIS** (`postgis/postgis:16-3.4` en `docker-compose.yml`, `SRID 4326`), con índices `GIST` en todas las columnas `geometry`.
5. **Fuentes de datos reales + respaldo offline:**
   - Implementa pipelines ETL idempotentes (`etl/import_osm.py` contra Overpass/Nominatim y `etl/import_datos_abiertos.py` contra Socrata/datos.gov.co Bogotá) con reintentos, timeouts y trazabilidad de fuente (`source_type: "osm" | "datos_abiertos" | "seed"`, `source_ref`, `verified: bool`).
   - Incluye datasets `seed/` realistas y georreferenciados dentro del polígono de El Tintal para que la demo arranque al 100% incluso sin acceso a internet. Todo dato no verificable públicamente debe marcarse explícitamente `"por verificar"` tanto en BD como en UI.

---

## 8. STACK TÉCNICO FIJADO (no alterar sin autorización)

**`barrio-frontend/`**
- React 18 + Vite + TypeScript (`strict: true`).
- Tailwind CSS + `src/styles/tokens.css` (variables CSS dinámicas para tema, alto contraste y escala tipográfica).
- 3D: `three` + `@react-three/fiber` + `@react-three/drei`.
- Mapas 2D temáticos: `maplibre-gl` (tiles oscuros/OSM con marcadores DOM personalizados de emojis).
- Animación: `gsap` (`ScrollTrigger`) + `framer-motion`.
- Estado: `zustand`. Internacionalización: `i18next` + `react-i18next` (`es` por defecto + `en`).
- Formularios y validación: `react-hook-form` + `zod`.
- Pruebas y auditoría: `vitest` + `@testing-library/react` + `axe-core` / `vitest-axe`.

**`barrio-backend/`**
- Python 3.11+ + FastAPI + Uvicorn.
- Arquitectura en capas: `app/api/`, `app/services/`, `app/repositories/`, `app/models/`, `app/schemas/`, `app/providers/`, `app/core/`, `etl/`.
- SQLAlchemy 2.0 + GeoAlchemy2 + Alembic + psycopg (PostGIS SRID 4326).
- Pydantic v2 + `pydantic-settings`.
- Seguridad: JWT (`python-jose` / `PyJWT`) + `passlib[bcrypt]`.
  - *Cambio autorizado por Marie (D62, 2026-11-14):* `bcrypt` directo en lugar de `passlib` (passlib no funciona con bcrypt ≥ 4.1 ni se mantiene); mismo hash bcrypt de 12 rondas y rechazo con mensaje claro de contraseñas de más de 72 bytes.
- Modelo generativo del chat (ambiente Nube, opcional): SDK oficial `anthropic` (*añadido por Marie, D62, 2026-11-14*), con modelo configurable en `.env`; sin clave, el chat funciona en modo Local.
- Pruebas: `pytest` + `pytest-asyncio` + `httpx` (`AsyncClient`/`TestClient`) + `factory-boy` + `pytest-cov`.
- Contenedores: `docker-compose.yml` con PostGIS persistente y healthcheck.

---

## 9. ESTRUCTURA EXACTA DE CARPETAS

    Mini Marie/                          ← raíz (aquí se ejecuta Claude Code; no renombrar)
    ├── MINI MARIE.png                   ← spritesheet original (INTOCCABLE: nunca editar ni borrar)
    ├── PLAN_MAESTRO.md                  ← plan maestro de 3 fases + trazabilidad de skills
    ├── docs/                            ← los 8 documentos técnicos + checklist SOLID + 3 informes de fase
    ├── barrio-frontend/                 ← REPO GIT 1 (Frontend)
    │   ├── scripts/
    │   │   ├── slice_spritesheet.mjs    ← recorte inteligente de MINI MARIE.png
    │   │   └── check_line_length.mjs    ← validador <= 100 líneas
    │   ├── public/assets/
    │   │   ├── avatar/                  ← avatar_sheet.png + frame_1..6.png + atlas.json
    │   │   ├── flags/                   ← bandera_kennedy.svg / bandera_bogota.svg
    │   │   ├── photos/                  ← fotos locales por categoría y carrusel
    │   │   └── icons/
    │   └── src/
    │       ├── app/                     ← router, providers, AppShell
    │       ├── components/
    │       │   ├── ui/                  ← Button, Card, Modal, Toast, Input, Tooltip, Skeleton, Accordion, Stars
    │       │   ├── layout/              ← Header, Sidebar, AccessibilityRail, Footer, WhatsAppFloat
    │       │   ├── map/                 ← ThematicMap, EmojiMarker, GeoPopup, MapFilters
    │       │   ├── avatar/              ← AvatarSprite, WelcomeChoreography, LoadingRunnerBar
    │       │   └── chat/                ← ChatWidget, ChatBubble, ChatInput, useChatReactions
    │       ├── features/
    │       │   ├── home/                ← HeroSection, NeighborhoodCarousel, QuickStats
    │       │   ├── history/             ← LocalHistoryPage, TimelineScroll, KennedySymbols
    │       │   ├── modules/             ← ModuleHub, ModuleDetailView, CrudFormModal, GalleryLightbox
    │       │   ├── ratings/             ← RankingsPage, RatingForm
    │       │   ├── faq/                 ← FaqSection
    │       │   ├── profile/             ← CreatorProfileSection
    │       │   └── auth/                ← LoginModal, AuthGuard
    │       ├── three/                   ← TintalScene, BuildingsLayer, RoadsLayer, ParksLayer, Particles, CameraRig
    │       ├── i18n/                    ← es.json, en.json, i18n.ts
    │       ├── store/                   ← avatarStore, a11yStore, authStore, loadingStore, chatStore
    │       ├── styles/                  ← tokens.css, contrast.css, pixel.css
    │       └── lib/                     ← apiClient, geoUtils, categoryConfig, avatarStateMachine
    └── barrio-backend/                  ← REPO GIT 2 (API + Backend + DB)
        ├── docker-compose.yml
        ├── alembic/
        ├── seed/                        ← el_tintal_polygon.geojson + semillas de los 14 módulos
        ├── etl/                         ← import_osm.py, import_datos_abiertos.py, runner.py
        ├── scripts/                     ← check_line_length.py
        ├── tests/                       ← unit/, api/, geo/, factories.py
        └── app/
            ├── core/                    ← config.py, security.py, database.py, exceptions.py
            ├── models/                  ← base.py + modelos SQLAlchemy/GeoAlchemy2
            ├── schemas/                 ← contratos Pydantic + GeoJSON
            ├── repositories/            ← interfaces.py + base_geo_repo.py + repos específicos
            ├── services/                ← crud_service.py + geo_service.py + rating_service.py + chat_agent.py
            ├── providers/               ← model_provider.py, analytic_model.py, generative_model.py, moe_router.py
            └── api/v1/                  ← router_factory.py + auth.py + chat.py + barrio.py + health.py

**Primer paso de verificación de assets:** comprueba que `"./MINI MARIE.png"` existe en la raíz y cópialo intacto a `"./barrio-frontend/public/assets/avatar/avatar_sheet.png"` antes de ejecutar `slice_spritesheet.mjs`. Si no existe, DETENTE y avísame.

---

## 10. IDENTIDAD VISUAL, PALETA ESTRICTA Y SISTEMA DE TOKENS

**Estética:** futurista, realista y técnica en modo oscuro de alta fidelidad: superficies de vidrio oscuro (*dark glass*: `rgba(138, 180, 248, 0.06)` sobre `#0B1E38` con `backdrop-filter: blur(16px)` y borde `1px solid rgba(138, 180, 248, 0.18)`), retículas geodésicas sutiles de fondo, elevación por sombras profundas y resplandores controlados en focos activos, radios `12px–16px`. Contraste visual intencional con el **universo pixel art exclusivo de Mini Marie**: tipografía `Press Start 2P` para encabezados del asistente/cartel `"Hola"` y bordes escalonados pixelados en sus burbujas; resto de la aplicación en **Space Grotesk** (títulos), **Inter** (cuerpo) y **JetBrains Mono** (coordenadas WGS84, áreas en m², matrículas catastrales y telemetría).

**Paleta Oficial Estricta (5 hexadecimales base):**
- `#0B131E` — Fondo oscuro principal (`--bg-primary`: body, viewport base, niebla/fondo de escena 3D).
- `#0B1E38` — Fondo secundario / Contenedores (`--bg-surface`: tarjetas, sidebar, modales, panel del chat, popups).
- `#8AB4F8` — Acentos y textos claros (`--accent-soft`: encabezados destacados, iconos, bordes luminosos, luz *rim* 3D).
- `#1D4ED8` — Elementos interactivos / Botones (`--interactive-primary`: botones primarios, track de la barra de carga).
- `#3B82F6` — Resaltados y elementos activos (`--interactive-active`: hover, focus ring, elemento activo en sidebar, relleno de progreso, marcadores seleccionados).

**Reglas cromáticas:** Solo se permiten estos 5 colores, sus variaciones de opacidad/luminancia derivadas, blanco/negro para legibilidad, indicadores discretos de estado semántico (éxito/alerta/error) y el amarillo propio del vestuario pixel art de Mini Marie. **Cero colores decorativos arbitrarios.** Todo texto debe superar contraste **WCAG AA** (verificado con `axe-core`, tanto en modo estándar como en modo Alto Contraste).

**Tokens y estados obligatorios (Skills Emil Kowalski):**
- Define en `src/styles/tokens.css`: escala tipográfica fluida vinculada a `--font-scale` (modificada por la barra de accesibilidad), espaciado `4/8/12/16/24/32/48/64px`, duraciones `120/180/240/320/480ms`, curvas `cubic-bezier(0.22, 1, 0.36, 1)` y física *spring* (`stiffness: 260, damping: 24`) para entradas del chat/modales.
- Todo control interactivo implementa explícitamente los 5 estados: `hover`, `focus-visible` (anillo `#3B82F6` 2px), `active/pressed` (`scale(0.97)`), `disabled` (`opacity: 0.45`, `pointer-events: none`) y `loading` (skeleton/spinner local). Anima exclusivamente propiedades compuestas (`transform`, `opacity`).

---

## 11. ALCANCE FUNCIONAL DETALLADO (100% DE REQUISITOS)

### 11.1. Pantalla de Inicio (Home)
1. **Animación Principal + Mapa Principal 3D:** en el rectángulo superior principal (*Hero Stage*, altura `72vh–80vh`), renderiza en `react-three-fiber` una maqueta 3D estilizada y realista de **El Tintal**:
   - Polígono base del barrio derivado de `el_tintal_polygon.geojson`.
   - Bloques/manzanas urbanas extruidas con alturas diferenciadas desde datos reales OSM (con degradado sutil `#0B1E38` → `#1D4ED8` y aristas luminosas `#8AB4F8`).
   - Ejes viales principales (Av. Ciudad de Cali, Av. Américas, red local) como cintas oscuras con filo activo `#3B82F6`.
   - Zonas verdes y parques extruidos suavemente, partículas atmosféricas sutiles, niebla `#0B131E`, luz direccional fría + luz de contorno (*rim light*) `#8AB4F8`.
   - **Interactividad real:** auto-órbita lenta pausable al interactuar, parallax suave con el cursor (máx `6°`), hover sobre edificaciones/sectores con tooltip de telemetría, marcadores 3D flotantes (*billboards* con emojis de categoría) que al hacer clic ejecutan *fly-to* de cámara y abren la ficha del lugar.
   - **Presupuesto de rendimiento:** `MergedGeometry` / `InstancedMesh`, `< 90,000` triángulos, `dpr={[1, 2]}`, `Suspense` + montaje diferido, 60 FPS estables.
2. **Carrusel de Imágenes del Entorno:** debajo/integrado en el inicio, carrusel interactivo con fotografías reales del entorno de El Tintal (Biblioteca Pública El Tintal, parques, alamedas, estaciones cercanas; descargadas y almacenadas localmente en `public/assets/photos/` — nunca hotlinks externos rotos ni imágenes genéricas aleatorias). Incluye autoplay pausable al hover/focus, navegación por flechas, teclado y swipe táctil, indicadores animados y efecto Ken Burns sutil.

### 11.2. Navegación, Bilingüismo, Accesibilidad y Contacto Directo
1. **Barra Lateral (Sidebar):** menú lateral colapsable (`260px` expandido / `72px` colapsado) con: Inicio, Mapa 3D, Historia Local, Categorías (submenú desplegable con los 14 módulos y sus emojis), Ranking de Calificaciones, Galería General, Preguntas Frecuentes, Perfil de la Creadora, Ayuda y Acceso / Sesión. Indicador activo luminoso `#3B82F6`, tooltips en modo colapsado y soporte completo de teclado.
2. **Selector de Idioma (`ES` / `EN`):** visible en la barra superior, persistido en `localStorage`, traduce **toda** la interfaz mediante `i18next` (navegación, títulos, formularios, etiquetas de los 14 módulos, historial local, FAQ y respuestas del chatbot Mini Marie).
3. **Barra de Accesibilidad (costado derecho fijo):** barra vertical compacta anclada al borde derecho que permite:
   - **Alternar Alto Contraste** (activa clase `.high-contrast` en `<html>` con bordes de alto contraste y máximo ratio texto/fondo).
   - **Aumentar y Disminuir tamaño de letra dinámicamente** (4 niveles: `90%`, `100%`, `112.5%`, `125%`, modificando `--font-scale` en `:root` para escalar toda la UI proporcionalmente en tiempo real, más botón de reinicio).
   - **Reducir movimiento** (toggle manual sincronizado con `prefers-reduced-motion`).
4. **Contacto Directo (WhatsApp):** botón flotante permanente en la esquina inferior derecha con el icono oficial de WhatsApp, enlazando a `https://wa.me/573132596937?text=Hola%20Marie%2C%20estoy%20visitando%20la%20plataforma%20de%20reconocimiento%20del%20barrio%20El%20Tintal.` con pulso sutil `#3B82F6`, tooltip accesible y desplazamiento automático cuando se abre el panel del chat para que nunca se superpongan.

### 11.3. Contenido Temático, Historia Local y los 14 Casos de Uso (CRUDs)
1. **Sección de Historia Local:** apartado dedicado a la historia del barrio **El Tintal** y la **Localidad de Kennedy** (desde sus orígenes lagunares/haciendas de la sabana, urbanización moderna, hasta hitos verificados como la Biblioteca Pública El Tintal Manuel Zapata Olivella — verifica cada dato histórico con fuentes citables como Alcaldía Local de Kennedy / Secretaría de Cultura / Wikipedia y etiqueta explícitamente cualquier dato no confirmado como `"por verificar"`). Incluye:
   - Línea de tiempo interactiva animada al scroll (`GSAP ScrollTrigger`).
   - Símbolos representativos: **Bandera de la Localidad de Kennedy** (vectorizada en SVG fiel en `public/assets/flags/bandera_kennedy.svg` con explicación heráldica de sus colores y significado; si algún detalle oficial requiere precisión, incluye nota explicativa).
   - Indicadores clave con animación *count-up* y mapa de ubicación dentro de Kennedy.
2. **Los 14 Casos de Uso (CRUDs Geoespaciales):** cada módulo cuenta con ruta dedicada, vista dual (Mapa Temático MapLibre + Lista/Tabla filtrable), CRUD completo (Crear, Consultar detalle, Editar, Eliminar), galería de fotos contextual y calificación por estrellas:

| # | Nombre Oficial del Módulo | Emoji | Geometría PostGIS | Campos Mínimos Obligatorios |
|---|---|---|---|---|
| 1 | CRUD CENTROS EDUCATIVOS | 🎓 | `POINT` | `nombre`, `tipo` (jardín/colegio/universidad), `caracter` (público/privado), `direccion`, `jornadas`, `niveles`, `telefono` |
| 2 | CRUD ESCENARIOS DEPORTIVOS | ⚽ | `POLYGON` | `nombre`, `deportes`, `superficie`, `iluminacion`, `horario`, `acceso` |
| 3 | CRUD SISTEMAS DE CÁMARAS DE SEGURIDAD | 📹 | `POINT` | `codigo`, `tipo` (policial/comunitaria/privada), `operador`, `estado`, `fecha_instalacion` *(solo metadata y ubicación; nunca flujos de video)* |
| 4 | CRUD ZONAS VERDES | 🌳 | `POLYGON` | `nombre`, `area_m2`, `tipo` (parque/alameda/jardín), `arborizacion`, `estado` |
| 5 | CRUD DATOS CATASTRALES | 🏠 | `POLYGON` | `matricula_inmobiliaria`, `direccion`, `area_lote_m2`, `area_construida_m2`, `pisos`, `uso`, `avaluo_cop`, `estrato` |
| 6 | CRUD ESTADO DE CALLES | 🛣️ | `LINESTRING` | `nombre_via`, `tipo_via`, `material`, `estado` (bueno/regular/malo), `ultima_intervencion`, `reportes_ciudadanos` |
| 7 | CRUD ESTACIONES DEL SISTEMA DE TRANSPORTE | 🚉 | `POINT` | `nombre`, `tipo` (Troncal TransMilenio/Alimentador/SITP), `lineas`, `direccion` |
| 8 | CRUD SITIOS DE COMIDA | 👨‍🍳 | `POINT` | `nombre`, `especialidad`, `direccion`, `horario`, `rango_precios`, `calificacion_promedio` |
| 9 | CRUD LIBRERÍAS | 📚 | `POINT` | `nombre`, `direccion`, `horario`, `especialidad`, `calificacion_promedio` |
| 10 | CRUD DATOS SOBRE ROBOS | 🚨 | `POINT` | `fecha`, `franja_horaria`, `modalidad`, `fuente` *(datos agregados/anonimizados con banner ético visible)* |
| 11 | CRUD INFORMACIÓN O DATOS DE LA LOCALIDAD | 🏛️ | `POLYGON` / Ficha | `nombre_localidad`, `bandera_url`, `historia`, `poblacion`, `superficie_km2`, `alcaldia_local`, `retos` |
| 12 | CRUD CENTROS DE ATENCIÓN INMEDIATA | 🚑 | `POINT` | `nombre` (CAI/Hospital/Urgencias), `tipo`, `direccion`, `telefono_24_7` |
| 13 | CRUD VETERINARIAS | 🐾 | `POINT` | `nombre`, `servicios`, `direccion`, `horario`, `calificacion_promedio` |
| 14 | CRUD BARBERÍAS | ✂️ | `POINT` | `nombre`, `direccion`, `horario`, `servicios`, `calificacion_promedio` |

3. **Iconografía Dinámica (Emojis):** fuente única de verdad en `src/lib/categoryConfig.ts` usada tanto por los marcadores personalizados de MapLibre como por los *billboards* del mapa 3D y tarjetas de categoría.
4. **Galerías Contextuales:** cada establecimiento/lugar consultado muestra su galería fotográfica real/contextual con visor *Lightbox* animado (apertura fluida, navegación izquierda/derecha, cierre con `ESC` y pie de foto con atribución de fuente).
5. **Sistema de Calificación:** ranking global y por categoría ordenado por estrellas (`0.0` a `5.0` en incrementos de `0.5`), con formulario interactivo de reseña, validación Zod y animación *spring* al seleccionar estrellas.

### 11.4. Asistencia Virtual y Animaciones Pixel Art — "Mini Marie" (Corazón de la Experiencia)

1. **Procesamiento Técnico del Spritesheet (`scripts/slice_spritesheet.mjs`):**
   - `avatar_sheet.png` contiene **6 poses horizontales** de izquierda a derecha sobre fondo magenta `#FF00FF` y una **línea horizontal morada de sombra debajo de los marcos 1 a 5**:
     - `frame_1`: frente neutral sonriendo (`idle_1`).
     - `frame_2`: frente ligeramente ladeada (`idle_2`).
     - `frame_3`: perfil izquierdo caminando (`walk_left`).
     - `frame_4`: perfil derecho caminando (`walk_right`).
     - `frame_5`: frente saludando con mano izquierda arriba (`wave`).
     - `frame_6`: salto celebrando con ambos brazos arriba (`jump`).
   - El script de recorte (usando `sharp` o `pngjs` en Node) **DEBE**:
     1. Eliminar el fondo magenta mediante distancia de color en espacio HSV/RGB con descontaminación de bordes (*alpha matting / despill*) para evitar halos rosados.
     2. Filtrar y eliminar el componente conectado de la línea horizontal de sombra inferior antes de detectar los 6 personajes.
     3. Detectar los 6 *bounding boxes* reales (los anchos varían entre pose frontal, perfil y salto; **prohibido dividir en 6 columnas iguales**), ordenarlos de izquierda a derecha y exportarlos como `frame_1.png` … `frame_6.png` con canal alfa limpio más `atlas.json` con anclaje inferior centrado (`footAnchor`) para que las transiciones entre poses nunca salten ni se desplacen.
   - Renderiza todos los sprites con `image-rendering: pixelated; image-rendering: crisp-edges;`.

2. **Máquina de Estados de Animación (`AvatarSprite` + `avatarStore` + GSAP):**
   - `idle`: alterna `frame_1` ↔ `frame_2` cada `1100ms` con respiración vertical sutil (`2px`).
   - `walk_left` / `walk_right`: usa `frame_3` / `frame_4` con oscilación de paso cada `150ms`.
   - `wave`: usa `frame_5` con balanceo cálido (`rotate: ±6deg`, `450ms`).
   - `jump`: usa `frame_6` con impulso vertical (`translateY: -18px`, curva `back.out(2)`).
   - **Modificadores expresivos por evento:**
     - Abrir chat → `wave` + saludo contextual.
     - Navegar entre secciones/módulos → `walk_right` / `walk_left` mirando hacia el cambio.
     - Crear/editar registro o calificar con ≥ 4.5 estrellas → `jump` + destello de celebración.
     - Error de red/validación (`404`/`422`/`500`) → inclinación empática (`rotate: -10deg`, desaturación leve).
     - Entrar al módulo #10 (`CRUD DATOS SOBRE ROBOS`) → micro-vibración de alerta (`shake` horizontal suave) y tono preventivo.
     - Inactividad > `45s` → modo reposo/dormida con burbuja pixel `"zZz"`.

3. **Animación de Bienvenida Multi-Avatar (Obligatoria al entrar por primera vez en la sesión):**
   - Coreografiada con GSAP (`choreograph`): emergen **8 instancias de Mini Marie** simultáneamente desde los 8 puntos cardinales del viewport (**4 esquinas: sup-izq, sup-der, inf-izq, inf-der; 2 laterales: centro-izq, centro-der; centro-superior y centro-inferior**), entrando con física elástica hacia una zona segura alrededor del centro sin tapar el texto central, todas ejecutando `wave` (`frame_5`).
   - En el centro emerge un **gran letrero pixel/futurista que dice `"Hola"`** (animado letra por letra `H - o - l - a` con stagger de `80ms`, transición `blur(8px) → blur(0)` y escala elástica), acompañado de partículas cuadradas pixel-confetti en `#8AB4F8`, `#3B82F6`, `#1D4ED8` y amarillo del vestuario, más botón `"¡Hola! Explorar El Tintal"`.
   - Se autocierra suavemente a los `3.8s` o al hacer clic, guarda flag en `sessionStorage` para no bloquear navegación posterior (con botón en el header para volver a reproducir la bienvenida cuando se quiera) y ofrece versión reducida instantánea si `prefers-reduced-motion` está activo.

4. **Chatbot Interactivo ("Mini Marie"):**
   - Launcher flotante con Mini Marie animada en vivo + panel desplegable *dark glass* `#0B1E38` con cabecera pixel art (`Press Start 2P`).
   - Conectado a `/api/v1/chat` (`ModelProvider` en backend). Soporta intenciones completas: saludo, ayuda, consulta por cualquiera de las 14 categorías (`"¿Qué colegios hay en El Tintal?"`, `"Muéstrame sitios de comida"`, `"¿Cuál es la veterinaria mejor calificada?"`, `"¿Qué queda más cerca?"`), historia del barrio y localidad de Kennedy, estadísticas en tiempo real y contacto directo con Marie (`3132596937`).
   - Muestra burbujas con efecto *typewriter* rápido, chips de preguntas sugeridas, acciones rápidas (botón que lleva directo al módulo/mapa mencionado) y gesticulación sincronizada del avatar mientras responde.

5. **Animación de Carga (Loading) con Mini Marie Corriendo:**
   - Al navegar entre rutas pesadas, cargar mapas o ejecutar consultas/mutaciones CRUD, se activa `LoadingRunnerBar`: una barra de progreso superior/modal estilizada (`track #1D4ED8`, relleno `#3B82F6`) ligada al **progreso real** de la carga (`useLoadingProgress`, con lectura de stream/etapas reales y duración mínima de `650ms` para evitar parpadeos) sobre la cual **Mini Marie corre animadamente** alternando `walk_right` (`frame_4`) / `idle_2` con micro-rebote a medida que avanza el porcentaje `0% → 100%`.

### 11.5. Pie de Página (Footer), Preguntas Frecuentes y Sesión
- **Footer institucional completo:** enlaces rápidos a los 14 módulos, datos de ubicación (El Tintal, Kennedy, Bogotá D.C.), bloque integrado o acceso directo a **Preguntas Frecuentes** (acordeón animado con al menos 8 preguntas reales sobre El Tintal, los datos geoespaciales, el uso de mapas y el proyecto académico) y tarjeta destacada **"Perfil de la Creadora"** con:
  - Nombre: **Marie Anne Lopez Poveda**.
  - Perfil académico: *Bachiller con énfasis agroindustrial y estudiante de Ingeniería Catastral y Geodesia, residente de Funza (Cundinamarca)*.
  - Avatar ilustrado/pixel y botón directo de contacto por WhatsApp (`+57 3132596937`).
- **Autenticación JWT:** inicio de sesión con roles `admin` (credenciales por defecto documentadas en `.env.example` / `README.md` para la evaluación, con permisos completos de crear/editar/eliminar en los 14 CRUD) y `visitante` (consulta libre, calificaciones y chatbot).

---

## 12. BASE DE DATOS GEOESPACIAL (PostGIS, SRID 4326)

- 14 tablas geoespaciales correspondientes a los 14 casos de uso con sus columnas exactas, columna `geom geometry(<TIPO>, 4326)` e **índice espacial `GIST` en cada una**, más metadatos de auditoría (`source_type`, `source_ref`, `verified`, `created_at`, `updated_at`).
- Tablas transversales: `usuarios`, `calificaciones` (polimórfica controlada por `categoria_slug` + `objeto_id`, estrellas `0.0–5.0`, comentario, autor, fecha), `fotos` (`categoria_slug`, `objeto_id`, `url`, `alt_text`, `orden`), `historia_hitos`, `localidad_kennedy`, `faq_items`.
- Migraciones **Alembic** desde el día 1 + scripts `seed/` y `etl/` idempotentes.

---

## 13. API RESTFUL (FastAPI `/api/v1`)

- Generada mediante patrón **Factory** cumpliendo Open/Closed:
  - `GET /api/v1/{modulo}` (paginación `page/size`, búsqueda `q`, filtros por atributo y ordenamiento).
  - `GET /api/v1/{modulo}/{id}` (detalle + galería + promedio de estrellas).
  - `POST /api/v1/{modulo}`, `PATCH /api/v1/{modulo}/{id}`, `DELETE /api/v1/{modulo}/{id}` (protegidos por rol `admin` JWT).
  - `GET /api/v1/{modulo}/geojson` (FeatureCollection RFC 7946 listo para MapLibre).
  - `GET /api/v1/{modulo}/cercania?lat=&lon=&radio_m=` (`ST_DWithin` sobre geografía PostGIS).
  - `GET /api/v1/{modulo}/ranking` y `GET /api/v1/{modulo}/stats`.
- Endpoints transversales: `/api/v1/auth/login`, `/api/v1/auth/register`, `/api/v1/auth/me`, `/api/v1/chat`, `/api/v1/calificaciones`, `/api/v1/historia`, `/api/v1/faq`, `/api/v1/barrio/poligono`, `/api/v1/health`.

---

## 14. ESTRATEGIA DE PRUEBAS Y CALIDAD AUTOMATIZADA

- **Backend (`pytest --cov=app`):** pruebas unitarias de servicios y `ModelProvider` (probando `AnalyticModel`, `GenerativeModel` y `MoERouter` + todos los intents del agente), pruebas de API con `httpx.AsyncClient` (CRUD, permisos `401/403`, errores `404/422`), y pruebas geoespaciales PostGIS (`ST_DWithin`, `ST_Within` dentro de El Tintal). **Cobertura mínima exigida: ≥ 80% de endpoints y servicios.**
- **Frontend (`vitest`):** pruebas de componentes y flujos críticos (render del sistema de tokens, barra de accesibilidad modificando `--font-scale` y contraste, flujo de calificación por estrellas, chatbot reaccionando y respondiendo, formulario CRUD).
- **Accesibilidad:** auditoría `axe-core` sobre vistas principales con **0 violaciones WCAG AA**.

---

## 15. PLAN DE EJECUCIÓN EN 3 FASES CON ENTREGABLES PARCIALES (35% → 70% → 100%)

Trabaja **estrictamente fase por fase**. Al terminar cada fase: ejecuta toda la batería de verificación, redacta el informe correspondiente, muéstrame los comandos exactos para levantar la demo y **DETENTE esperando mi aprobación explícita (`"OK"`) antes de iniciar la siguiente fase**.

### FASE 1 — 0% al 35% → "Fundación Viva, 3D, Bienvenida y Arquitectura"
1. Inicializar los 2 repositorios Git (`barrio-frontend/` y `barrio-backend/`), `docker-compose.yml` con PostGIS y los validadores `check_line_length` (`≤ 100` líneas).
2. Procesar `./MINI MARIE.png` con `slice_spritesheet.mjs` (limpieza chroma magenta + remoción línea sombra inferior + 6 PNGs + `atlas.json` con anclaje de pies).
3. Design System completo en `tokens.css` + Tailwind con la paleta oficial `#0B131E`, `#0B1E38`, `#8AB4F8`, `#1D4ED8`, `#3B82F6` y componentes base con todos los estados de Emil Kowalski.
4. Layout principal completo: Hero con **escena 3D de El Tintal** (`react-three-fiber`), carrusel del entorno, sidebar colapsable, selector de idioma `ES/EN`, barra derecha de accesibilidad funcional (contraste + tamaño de letra + movimiento), botón flotante WhatsApp (`3132596937`) y footer con FAQ + Perfil de Marie Anne Lopez Poveda.
5. **Animación de bienvenida multi-avatar (8 puntos) con el gran letrero `"Hola"`** y **Chatbot flotante** con Mini Marie reaccionando en vivo a la navegación.
6. Rutas esqueleto coherentes de los 14 módulos con sus emojis + Backend en capas con esquema PostGIS completo, polígono real de El Tintal cargado, `/health` y 1 CRUD completo de extremo a extremo (`CRUD CENTROS EDUCATIVOS`) con PyTest en verde.
7. Documentación inicial: `ARQUITECTURA.md`, `MODELO_REQUERIMIENTOS.md`, `CHECKLIST_SOLID.md` e `INFORME_FASE_1_35pct.md`.
→ **Entregable al 35% + PAUSA esperando mi `"OK"`.**

### FASE 2 — 35% al 70% → "Los 14 CRUDs Geoespaciales, ETL Real, Chatbot Agente y Loading"
1. Implementar los **14 CRUDs completos end-to-end** (API + PostGIS + MapLibre temático con emojis + filtros + galerías contextuales + ranking y calificación por estrellas).
2. Sección **Historia Local** completa con línea de tiempo animada al scroll (`GSAP ScrollTrigger`), fuentes verificadas y **Bandera de la Localidad de Kennedy**.
3. Ejecutar pipeline **ETL** desde OpenStreetMap / Datos Abiertos de Bogotá para El Tintal + semillas completas con trazabilidad de fuente.
4. Conectar el **Chatbot "Mini Marie"** al backend `ModelProvider` (`AnalyticModel` / `GenerativeModel` / `MoERouter`) con todos los intents del barrio y reacciones dinámicas por evento.
5. Implementar la **animación de carga con Mini Marie corriendo sobre la barra de progreso real**.
6. Autenticación JWT completa (`admin` vs `visitante`) protegiendo mutaciones + PyTest ≥ 80% de cobertura + Vitest + `axe-core` en verde.
7. Entregar `INFORME_FASE_2_70pct.md` y `CHECKLIST_SOLID.md` actualizado.
→ **Entregable al 70% + PAUSA esperando mi `"OK"`.**

### FASE 3 — 70% al 100% → "Pulido Emil Kowalski, Rendimiento, Accesibilidad y Documentación Final"
1. Pulido fino de microinteracciones, transiciones, *springs*, tooltips y reveals al scroll usando `emil-design-eng`, `diseños` e `improve-animations`.
2. Optimización de rendimiento: *code-splitting* por ruta, carga diferida del canvas 3D y MapLibre, auditoría de performance y accesibilidad (`axe-core` en 0 violaciones, teclado 100%, `prefers-reduced-motion`, alto contraste).
3. Auditoría final `code-review-and-quality`, verificación estricta de SOLID y regla `≤ 100` líneas en el 100% de archivos de ambos repositorios.
4. Completar los **8 documentos técnicos** de `docs/` (`MODELO_REQUERIMIENTOS.md`, `ARQUITECTURA.md`, `ESTRATEGIA_PRUEBAS.md`, `DISENO_FRONTEND.md`, `DISENO_API.md`, `DISENO_BACKEND.md`, `DISENO_BASE_DATOS.md`) + `README.md` de instalación y ejecución paso a paso.
5. Builds de producción (`npm run build` y suite `pytest`) corriendo limpios + informe final `docs/INFORME_FASE_3_100pct.md`.
→ **Entregable Final 100%.**

---

## 16. REGLAS DE TRABAJO INMUTABLES

- Nunca modifiques ni renombres `./MINI MARIE.png`.
- Cero `TODO`, cero `lorem ipsum`, cero enlaces externos rotos.
- Español por defecto en toda la UI y documentación; inglés completo vía `i18next`.
- Ejecuta `check_line_length` en cada bloque de trabajo; ningún archivo de código debe superar las 100 líneas.
- Si algo es ambiguo o encuentras un impedimento técnico real, **detente y pregúntame**.

---

## 17. REFERENCIAS DE DISEÑO VISUAL (ÚNICAMENTE INSPIRACIÓN DE DISEÑO)

> **REGLA CRÍTICA:** Los siguientes enlaces se utilizan **exclusivamente para extraer lenguaje visual, composición espacial, jerarquía tipográfica y coreografía de movimiento**. **PROHIBIDO copiar código, HTML/CSS, textos, activos o identidad de marca.** Todo patrón visual debe traducirse estrictamente a la estética futurista de El Tintal y a los 5 colores oficiales (`#0B131E`, `#0B1E38`, `#8AB4F8`, `#1D4ED8`, `#3B82F6`).

1. **`https://open-sbs.brig.ht/city`**
   - *Patrones visuales a abstraer:* maqueta urbana 3D isométrica/perspectiva interactiva como protagonista espacial; paneles HUD flotantes translúcidos sobre el lienzo 3D sin obstruir la vista de la ciudad; resaltado luminoso sutil al pasar el cursor sobre manzanas/edificaciones; transiciones suaves de cámara (*fly-to*) hacia puntos seleccionados y micro-etiquetas técnicas limpias.
2. **`https://www.cartier.com/en-ro/watchesandwonders#/`**
   - *Patrones visuales a abstraer:* puesta en escena oscura de ultra-alta precisión con iluminación de contorno (*rim lighting*) sobre el objeto 3D central; líneas divisorias ultra-finas (*hairline grids*) y marco arquitectónico editorial; ritmo de scroll pausado y cinematográfico donde cada sección revela información con profundidad y aire visual; contraste elegante entre tipografía display geométrica y datos técnicos monoespaciados.

---

## 18. DEFINICIÓN DE HECHO GLOBAL (DoD)

- [ ] Los 14 CRUDs geoespaciales funcionando end-to-end con PostGIS (SRID 4326) y sus 14 mapas temáticos MapLibre con emojis.
- [ ] Mapa 3D principal en el inicio + carrusel del barrio + Historia Local + Bandera de Kennedy.
- [ ] Sidebar colapsable + selector de idioma ES/EN + barra derecha de accesibilidad (contraste y tamaño de letra) + WhatsApp flotante (`3132596937`) + FAQ + Perfil de Marie Anne Lopez Poveda.
- [ ] Animación de bienvenida con 8 clones de Mini Marie y letrero `"Hola"`.
- [ ] Chatbot "Mini Marie" con sprite recortado limpiamente, reacciones en tiempo real por navegación/acciones y respaldo `ModelProvider` (`AnalyticModel`, `GenerativeModel`, `MoERouter`).
- [ ] Barra de carga con Mini Marie corriendo ligada al progreso real.
- [ ] Paleta oficial estricta aplicada; WCAG AA verificado (`axe-core` en 0).
- [ ] SOLID verificado; **0 archivos de código > 100 líneas**; 2 repositorios Git independientes.
- [ ] PyTest ≥ 80% de cobertura + pruebas frontend en verde.
- [ ] Todos los documentos de `docs/` y los 3 informes de fase (`35%`, `70%`, `100%`) completos y aprobados.

---

## 19. ORDEN DE INICIO INMEDIATO

Comienza ahora mismo siguiendo el **Protocolo de Arranque (Sección 3)**:
1. Invoca `using-superpowers` y todas las skills declaradas.
2. Verifica `"./MINI MARIE.png"`.
3. Genera `"./PLAN_MAESTRO.md"` con el desglose completo de las 3 fases (`35% → 70% → 100%`) y su trazabilidad de skills.
4. Preséntame el resumen del plan y **espera mi aprobación antes de escribir código**.