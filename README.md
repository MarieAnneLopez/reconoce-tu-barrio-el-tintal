# Reconoce tu Barrio: El Tintal

Aplicación web de tres capas para reconocer el barrio El Tintal (Localidad de Kennedy, Bogotá D.C.).

- **Creadora:** Marie Anne Lopez Poveda.
- **Asistente:** Mini Marie, un personaje en pixel art que hace de chat, de bienvenida y de animación de carga.

**Publicada en: https://reconoce-el-tintal.pages.dev**

> **Antes de mostrarla:** la API corre en el plan gratis de Render, que se duerme tras 15 minutos sin visitas. Abre la página uno o dos minutos antes; la primera carga tarda cerca de un minuto.

## Qué tiene

- **14 módulos geoespaciales** (CRUD), cada uno con:
  - mapa temático con emojis, búsqueda, filtros y ficha;
  - galería, calificaciones con estrellas y ranking.
- **Galería General** con fotos reales de Wikimedia Commons, cada una con su autor y su licencia.
- **Historia Local:** línea de tiempo con la fuente de cada hito, la bandera de Kennedy, cifras y ubicación.
- **Maqueta 3D** de El Tintal en el Inicio y en el Mapa 3D.
- **Chat de Mini Marie** conectado a un `ModelProvider` con tres modelos: Analítico, Generativo y MoE.
- **Sesión con roles:**
  - visitante: consulta y califica;
  - administración: crea, edita y elimina.
- **Accesibilidad:**
  - letra de 90 a 125 %, alto contraste, movimiento reducido;
  - uso completo con teclado;
  - español e inglés.
- **Datos** de OpenStreetMap y de Datos Abiertos de Bogotá. Cada dato muestra su fuente y lleva una etiqueta cuando no es oficial: «por verificar», «Prensa» o «dato de ejemplo».

## Repositorios y arquitectura

| Repositorio GitHub | Responsabilidad |
|---|---|
| [reconoce-tu-barrio-el-tintal](https://github.com/MarieAnneLopez/reconoce-tu-barrio-el-tintal) | Documentación, decisiones, UML de Modelio y spritesheet original de Mini Marie |
| [barrio-frontend](https://github.com/MarieAnneLopez/barrio-frontend) | Presentación con React 18, Vite y TypeScript. Incluye mapas de MapLibre, la maqueta 3D con React Three Fiber y la interfaz bilingüe |
| [barrio-backend](https://github.com/MarieAnneLopez/barrio-backend) | Lógica y persistencia. FastAPI expone los servicios REST y usa SQLAlchemy, GeoAlchemy2 y Alembic sobre PostgreSQL/PostGIS (SRID 4326) |

En producción, Cloudflare Pages sirve la interfaz y reenvía las peticiones `/api/*` a FastAPI en Render. El backend consulta PostGIS en Neon. En desarrollo, el proxy de Vite apunta a la API local y Docker Compose ejecuta PostGIS. Los diagramas y las decisiones están en [Arquitectura](docs/ARQUITECTURA.md) y en el [Plan maestro](PLAN_MAESTRO.md).

## Reproducir en Windows

Necesitas Git, Python 3.13, Node 24 con npm y Docker Desktop en ejecución. Con acceso a los tres repositorios, clona la documentación y, desde esa raíz, los otros dos repositorios. Si ya tienes las tres copias, continúa con la configuración del backend.

```powershell
git clone https://github.com/MarieAnneLopez/reconoce-tu-barrio-el-tintal.git
Set-Location "reconoce-tu-barrio-el-tintal"
git clone https://github.com/MarieAnneLopez/barrio-backend.git
git clone https://github.com/MarieAnneLopez/barrio-frontend.git
```

### 1. Backend (API en http://127.0.0.1:8000)

```powershell
cd "barrio-backend"
if (-not (Test-Path ".env")) { Copy-Item ".env.example" ".env" }
docker compose up -d                        # PostGIS 16 + 3.4 en Docker
python -m venv .venv
.venv\Scripts\python -m pip install -r requirements-dev.txt
.venv\Scripts\python -m alembic upgrade head
.venv\Scripts\python -m etl.runner --solo carga,historia,fotos,admin   # datos, fotos y cuenta de demostración
.venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

`etl.runner` sin `--solo` vuelve a descargar los datos reales desde OpenStreetMap y Datos Abiertos (tarda unos 8 minutos). Con `--solo carga` se usan los datos ya preparados en `seed/`, sin internet.

### 2. Frontend (http://localhost:5173)

Usa otra terminal de PowerShell ubicada en la raíz del repositorio de documentación.

```powershell
cd "barrio-frontend"
npm ci
npm run dev                                 # Vite reenvía /api al backend local
```

### 3. Cuenta de demostración (solo local)

`admin@eltintal.local` con la clave de `barrio-backend/.env.example`. Es una cuenta desechable para probar; en producción se usa otra, y la API rechaza esa clave cuando `ENVIRONMENT=production`. Las cuentas de visitante se crean en «Acceso / Sesión».

## Verificación

| Repo | Comandos |
|---|---|
| Frontend | `npm run lint` · `npm run typecheck` · `npx vitest run` · `node scripts/check_line_length.mjs` · `npm run build` |
| Backend | `docker compose up -d` · `.venv\Scripts\python -m pytest --cov=app` (mínimo 80 %) · `.venv\Scripts\python scripts\check_line_length.py` |

Regla del proyecto: ningún archivo de código pasa de 100 líneas.

## Chat: Local, Nube o Híbrido

Por defecto el chat corre en **Local** (`CHAT_MODEL=analitico`), sin internet ni claves. Para usar Claude (**Nube**) o el enrutador **Híbrido** (`moe`), se cambian `CHAT_MODEL` y `ANTHROPIC_API_KEY` en `.env`, sin tocar código. El procedimiento está en `docs/ARQUITECTURA.md` §5.1 y en `docs/DISENO_BACKEND.md`.

## Documentos

| Documento | Para qué |
|---|---|
| `docs/MODELO_REQUERIMIENTOS.md` | Actores, los 14 casos de uso con sus campos aprobados, requerimientos |
| `docs/ARQUITECTURA.md` | Tres capas, componentes, despliegue, flujo de datos, conceptos del curso y ADR |
| `docs/DISENO_FRONTEND.md` | Tokens, paleta, módulos, escena 3D, MapLibre, Mini Marie, i18n, accesibilidad |
| `docs/DISENO_API.md` | Contratos REST `/api/v1`, esquemas, GeoJSON, JWT, errores, OpenAPI |
| `docs/DISENO_BACKEND.md` | Capas, inyección de dependencias, fábricas, ETL, ModelProvider, SOLID |
| `docs/DISENO_BASE_DATOS.md` | Modelo entidad-relación, diccionario de datos, índices GIST, migraciones |
| `docs/ESTRATEGIA_PRUEBAS.md` | Pirámide de pruebas, cobertura, PostGIS, Vitest, axe, comandos |
| `docs/CHECKLIST_SOLID.md` | Evidencia de cada principio SOLID |
| `docs/PUBLICACION.md` | Cómo está publicada (Cloudflare Pages + Render + Neon) y cómo volver a publicar |
| `docs/INFORME_FASE_*` | Informes de cierre al 35 %, 70 % y 100 % |
| `docs/GUION_DEMO.md` | Guion de la demostración en clase (6–7 min), entregables y preguntas frecuentes del profesor |
| [Modelo UML XMI](modelio_export/diagrama_casos_uso.xmi) · [Trazabilidad](modelio_export/trazabilidad_modelio.md) | Actor Vecino, 14 casos de uso y pasos para abrir el modelo |
| [Informe E4](docs/INFORME_E4_interfaz_elegante.md) | Evidencia, desviaciones y atribuciones de la entrega |
