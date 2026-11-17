# Checklist SOLID — cierre de la Fase 3 (100 %)

Revisión final (H29–H30) sobre `barrio-backend` (commit `01d8b78`) y `barrio-frontend` (commit `87598ee`). La revisión de la Fase 2 se conserva abajo con sus añadidos. Cada punto cita el archivo que lo demuestra. ✅ cumple · ⚠️ cumple con una salvedad documentada · ⏳ pendiente de la Fase 3.

## Backend

### S — Responsabilidad única
- ✅ Capas separadas: los routers traducen HTTP (`app/api/v1/*.py`), los servicios aplican reglas (`app/services/`), los repositorios hablan con PostGIS (`app/repositories/`) y los modelos describen tablas (`app/models/`, uno por tabla).
- ✅ Autenticación repartida por responsabilidad:
  - `core/security.py`: hash y token;
  - `core/rate_limit.py`: límite de intentos;
  - `repositories/usuario_repository.py`: persistencia;
  - `services/auth_service.py`: reglas de login y registro;
  - `api/guards.py`: autorización;
  - `api/v1/auth.py`: HTTP y cookie.
- ✅ Chat: cada pieza hace una cosa.
  - `providers/intents.py`: clasifica la intención;
  - `providers/lexicon.py`: vocabulario;
  - `providers/phrases.py`: textos ES/EN;
  - `analytic_handlers.py` y `documental_handlers.py`: respuestas;
  - `services/chat_agent.py`: percepción y acciones;
  - `api/v1/chat.py`: HTTP.
- ✅ ETL: un módulo por fuente y por regla (`etl/datos_abiertos/`, `etl/modules/`, `etl/load_seed.py`, `etl/load_historia.py`, `etl/admin.py`) y un orquestador (`etl/runner.py`).

### O — Abierto/cerrado
- ✅ Los 14 módulos son 14 `ModuleSpec` en `app/modules/registry.py`. `CrudRouterFactory`, `ModuleExtrasFactory`, `CrudService` y `BaseCrudRepository` no cambiaron al pasar de 1 a 14 módulos.
- ✅ Cambiar de modelo del chat se hace por configuración, sin tocar código (`CHAT_MODEL` en `.env`, `providers/factory.py`):
  - Local: `AnalyticModel`;
  - Nube: `GenerativeModel`;
  - Híbrido: `MoERouter`.
- ✅ Una intención nueva es una entrada en `HANDLERS` (`providers/analytic_model.py`) más sus palabras en `intents.py`.
- ✅ Un paso nuevo del ETL es una entrada en `steps()` (`etl/runner.py`). Así se agregaron `historia` y `admin`.

### L — Sustitución de Liskov
- ✅ `AnalyticModel`, `GenerativeModel` y `MoERouter` cumplen `ModelProvider` (`providers/model_provider.py`). `ChatAgent` no sabe cuál recibe; `tests/unit/test_generative_moe.py` los usa como intercambiables, y `MoERouter` acepta cualquiera de ellos como experto.
- ✅ `SqlBarrioTools` y `FakeTools` (`tests/unit/chat_fakes.py`) cumplen `BarrioTools`. `ClaudeTextGenerator` y los escritores falsos cumplen `TextGenerator`.
- ✅ `require_admin` y `require_user` devuelven un `Usuario`. Las pruebas del CRUD los sustituyen por un doble (`tests/api/crud_app.py`) sin cambiar los routers.
- ✅ `GeoJsonBarrioRepository` y su doble cumplen `BarrioRepository`; `SqlDatabaseProbe` y `FakeProbe` cumplen `DatabaseProbe`.

### I — Segregación de interfaces
- ✅ `RatingRepository`, `PhotoRepository` y `GeoInsightsRepository` son contratos separados (`repositories/engagement_interfaces.py`). `RateableService`, `PhotoService` y `GeoInsightsService` piden solo el suyo.
- ✅ Protocolos pequeños:
  - `UsuarioStore` (`services/auth_service.py`): `by_email`, `get` y `add`;
  - `TextGenerator`: un método;
  - `HistoriaSource`, del servicio de historia.
- ⚠️ `BarrioTools` (`providers/tools.py`) tiene 8 métodos porque es la caja de herramientas del agente. Cada manejador usa uno o dos y el doble de pruebas los implementa todos sin esfuerzo. Si crece, se divide por experto (espacial y documental).

### D — Inversión de dependencias
- ✅ Los endpoints reciben servicios por `Depends`:
  - `get_auth_service`, `get_chat_agent` y `get_historia_service`;
  - las fábricas de cada módulo.
- ✅ Los modelos del chat dependen de `BarrioTools` y `TextGenerator`, no de SQLAlchemy ni del SDK de Anthropic. `anthropic` se importa solo en `claude_generator.py`, y la fábrica lo carga solo si hay clave.
- ⚠️ Raíces de composición:
  - `CrudRouterFactory.service()` construye el repositorio del módulo, y `get_chat_agent` arma `SqlBarrioTools` y el proveedor.
  - Son los únicos lugares donde se elige la implementación, y se inyectan con `Depends`.

## Frontend

### S — Responsabilidad única
- ✅ Sesión repartida:
  - `store/authStore.ts`: estado en memoria;
  - `features/auth/authApi.ts`: llamadas;
  - `authSchema.ts`: validación;
  - `LoginForm` y `RegisterForm`: formularios;
  - `AuthGuard`: visibilidad por rol;
  - `LoginModal` y `AccessPage`: presentación.
- ✅ Carga repartida:
  - `store/loadingStore.ts`: lote de tareas;
  - `lib/loadingTracker.ts`: etapas de una petición;
  - `hooks/useLoadingProgress.ts`: tiempos mínimos;
  - `LoadingRunnerBar`: presentación.
- ✅ Chat:
  - `lib/chatApi.ts`: llamada;
  - `store/chatStore.ts`: conversación y respaldo;
  - `ChatBubble`, `ChatSuggestions` y `ChatPanel`: presentación;
  - `useChatReactions`: navegación e inactividad.
- ✅ Historia:
  - `projectPath.ts`: proyección;
  - `useScrollReveal`: animación;
  - `useHistoryData`: datos;
  - un componente por sección.

### O — Abierto/cerrado
- ✅ `lib/moduleFields.json` es la fuente única de campos, filtros, orden y formato de los 14 módulos (D54). Un módulo nuevo no toca los componentes genéricos (`ModulePage`, `ModuleDetailView`, `CrudFormModal`, `ModuleFilters`).
- ✅ Gestos del avatar: la tabla `REACTION` (`store/chatStore.ts`) traduce la `expresion` del servidor a eventos de la máquina de estados; una expresión nueva es una fila.
- ✅ Rutas silenciosas de la barra: el arreglo `QUIET` (`lib/loadingTracker.ts`).

### L — Sustitución de Liskov
- ✅ Las respuestas del servidor (`remote`) y las locales (`reply`) se pintan con la misma `MarieBubble` (`components/chat/ChatBubble.tsx`).
- ✅ `maplibre-gl` y `fetch` se sustituyen en las pruebas por dobles con el mismo contrato (`test/maplibreMock.ts`, `test/mockApi.ts`, que ahora acepta respuestas tardías).

### I — Segregación de interfaces
- ✅ Props mínimas:
  - `AuthGuard` (`role`, `fallback`);
  - `LoginPrompt` (`message`);
  - `ChatSuggestions` (`onPick`);
  - `SourceLinks` (`refs`).
- ✅ Suscripción selectiva a los stores: por ejemplo, `useAuthStore((s) => s.user)` y `useChatStore((s) => s.pending)`.
- ⏳ `WelcomeChoreography` sigue leyendo el store completo de la bienvenida (pulido de H29).

### D — Inversión de dependencias
- ✅ El único `fetch` de la app está en `lib/apiClient.ts`. Sesión, chat, módulos e historia pasan por `apiGet` y `apiSend`, y la barra de carga se alimenta desde ahí sin que las páginas lo sepan.
- ✅ La protección real está en la API (`require_admin`, `require_user`); `AuthGuard` es solo comodidad de interfaz.

## Reglas transversales

| Regla | Evidencia | Estado |
|---|---|---|
| Ningún archivo de código supera 100 líneas | `check_line_length`: 237 archivos FE y 216 BE | ✅ |
| Dos repositorios independientes | Historiales separados; nada fuera de `Mini Marie/` | ✅ |
| Procedencia en cada dato | Mixins `source_type`, `source_ref` y `verified`; la Historia cita su fuente en cada hito | ✅ |
| Sin hex sueltos en `src/` | `src/styles/tokens.test.ts` (la barra de carga usa `--palette-cobalt` y `--palette-azure`) | ✅ |
| Secretos fuera del código | `.env` ignorado; `.env.example` sin secretos reales, salvo la cuenta de evaluación que pide el PROMPT | ✅ |

## Cierre de la Fase 3

- ✅ `WelcomeChoreography` con selectores por campo (FE `7fa5ec4`).
- ✅ Las expresiones del chat están tipadas con `Expression`, sin `type: ignore` (BE `5a2ef0a`).
- ✅ **S/D:** la regla «dentro de El Tintal» vive en una sola pieza (`app/repositories/tintal_area.py`). La usan el CRUD (inyectada en `CrudService` como `inside`, solo para los módulos con `within_tintal`) y la carga ETL (BE `01d8b78`).
- ✅ **O:** una ruta nueva es una entrada `lazy` en `app/routes.tsx` (H27). La Ayuda y el Mapa 3D se sumaron así.
- ⚠️ **Compromiso — `# type: ignore`:** quedan 35 en el backend. 17 son `attr-defined`: atributos dinámicos de SQLAlchemy, `id`/`geom` de modelos genéricos. 18 son `valid-type`: tipos Pydantic creados en tiempo de ejecución. El proyecto no corre mypy, y quitarlas exigiría un `Protocol` de modelo geoespacial transversal.
- ⚠️ **Compromiso — idempotencia de semillas:** se basa en `source_ref`, sin clave natural. En producción la protege `etl/bootstrap.py`, que carga solo los módulos vacíos y admite `RESEED_MODULES`.
- ⚠️ **`BarrioTools`:** sigue con 8 métodos y no se dividió, porque no creció.
