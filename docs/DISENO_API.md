# Diseño de la API — Reconoce tu Barrio: El Tintal

Entregable 6 de `docs/origen/PROMPT_MAESTRO.md`: contratos REST `/api/v1/*`, esquemas Pydantic, formatos GeoJSON, autenticación JWT, códigos de error estándar y documentación OpenAPI. Todo lo que sigue sale del código de `barrio-backend/` (rutas relativas a esa carpeta) y de las decisiones de `PLAN_MAESTRO.md`. Estado: 2026-11-14.

## 1. Principios

| Principio | Cómo se cumple | Dónde |
|---|---|---|
| REST por recurso | Cada módulo es un recurso `/{slug}` con `GET` (lista y detalle), `POST`, `PATCH` (parcial) y `DELETE`. No hay `PUT`. | `app/api/v1/router_factory.py` |
| Versión en la ruta | Todo cuelga de `API_PREFIX`, por defecto `/api/v1`. | `app/core/config.py`, `app/main.py` |
| Un solo formato de error | `{"error": {"code", "message", "details?"}}` para errores de dominio, HTTP, validación y no controlados; nunca trazas. | `app/core/exceptions.py` |
| JSON y GeoJSON | Respuestas JSON; geometrías GeoJSON RFC 7946 (lon/lat WGS84, SRID 4326). `/geojson` devuelve `FeatureCollection`. | `app/schemas/geojson.py`, `app/schemas/crud.py` |
| Paginación uniforme | Toda lista CRUD devuelve `PageOut` (`items`, `total`, `page`, `size`, `pages`). | `app/schemas/crud.py` |
| Rutas estáticas antes de `/{id}` | Por módulo se monta primero `ModuleExtrasFactory` (`/cercania`, `/ranking`, `/stats`) y luego `CrudRouterFactory` (`/geojson` antes de `/{item_id}`); `item_id: int` (D10). | `app/api/v1/router.py` |
| Abstracciones inyectadas | Los endpoints reciben servicios por `Depends`; los 14 módulos salen de dos fábricas genéricas a partir de un `ModuleSpec` (D41). | `app/api/deps.py`, `app/modules/spec.py`, `app/modules/registry.py` |
| Entradas cerradas | Los esquemas de entrada usan `extra="forbid"`: un campo desconocido (p. ej. `id`, `rol`) es 422. | `app/schemas/*.py` |
| Trazabilidad | Cada registro lleva `source_type` (`osm`, `datos_abiertos`, `seed`), `source_ref` y `verified`. | `app/schemas/crud.py` |

## 2. Endpoints

La especificación OpenAPI generada por `create_app().openapi()` tiene **137 rutas y 207 operaciones**: 11 transversales y 196 de los 14 módulos (14 operaciones × 14 módulos).

Permisos: **público** (sin sesión), **sesión** (`require_user`: visitante o admin), **admin** (`require_admin`). Ver `app/api/guards.py`.

### 2.1 Transversales (11)

| Método | Ruta (`/api/v1` +) | Permiso | Respuesta | Archivo |
|---|---|---|---|---|
| GET | `/health` | público | 200 `HealthReport`; 503 `HealthReport` si la base no responde | `health.py` |
| POST | `/auth/login` | público (límite) | 200 `SesionOut` + cookie `mm_session` | `auth.py` |
| POST | `/auth/register` | público (límite) | 201 `SesionOut` + cookie; siempre rol `visitante` | `auth.py` |
| GET | `/auth/session` | público | 200 `SesionActual` (`usuario` o `null`) | `auth.py` |
| GET | `/auth/me` | sesión | 200 `UsuarioOut`; 401 sin sesión | `auth.py` |
| POST | `/auth/logout` | público | 204, borra la cookie | `auth.py` |
| POST | `/chat` | público (límite) | 200 `ChatOut` | `chat.py` |
| GET | `/historia` | público | 200 `HistoriaOut` | `historia.py` |
| GET | `/barrio/poligono` | público | 200 `BarrioPolygon` (GeoJSON `Feature`) | `barrio.py` |
| GET | `/barrio/capas/{nombre}` | público | 200 GeoJSON de la capa base; `nombre` ∈ `vias`, `parques`, `edificios`, `manzanas` (otro valor: 422) | `barrio.py` |
| GET | `/ranking?limit=` | público | 200 `list[RankingItem]` de los 14 módulos (`limit` 1–50, por defecto 10) | `ranking.py` |
| GET | `/fotos?page=&size=` | público | 200 `PageOut[GaleriaItem]`: todas las fotos, con `categoria_slug`, `objeto_id` y `nombre` del lugar (`size` 1–100, por defecto 60; D66) | `galeria.py` |

### 2.2 Los 14 módulos (fábrica)

Slugs, en el orden de `app/modules/registry.py` (iguales a `categoryConfig.ts` del frontend):

| # | Slug | Geometría | Búsqueda `q` en | Filtros | `sort` |
|---|---|---|---|---|---|
| 1 | `centros-educativos` | Point | nombre, direccion, niveles | tipo, caracter, verified | id, nombre, tipo |
| 2 | `escenarios-deportivos` | Polygon | nombre, deportes | acceso, iluminacion, verified | id, nombre |
| 3 | `camaras-seguridad` | Point | codigo, operador | tipo, estado, verified | id, codigo, tipo |
| 4 | `zonas-verdes` | Polygon | nombre | tipo, arborizacion, estado, verified | id, nombre, area_m2 |
| 5 | `datos-catastrales` | Polygon | codigo_lote, direccion | estrato, uso, verified | id, codigo_lote, area_lote_m2, estrato |
| 6 | `estado-calles` | LineString | nombre_via, material | estado, tipo_via, material, verified | id, nombre_via |
| 7 | `estaciones-transporte` | Point | nombre, lineas, direccion | tipo, verified | id, nombre, tipo |
| 8 | `sitios-comida` | Point | nombre, especialidad, direccion | rango_precios, verified | id, nombre |
| 9 | `librerias` | Point | nombre, especialidad, direccion | verified | id, nombre |
| 10 | `robos` | Point | modalidad, fuente | modalidad, franja_horaria, fecha, verified | id, fecha, cantidad, modalidad |
| 11 | `localidad` | MultiPolygon (opcional) | nombre_localidad, historia, retos | verified | id, nombre_localidad |
| 12 | `atencion-inmediata` | Point | nombre, direccion | tipo, verified | id, nombre, tipo |
| 13 | `veterinarias` | Point | nombre, servicios, direccion | verified | id, nombre |
| 14 | `barberias` | Point | nombre, servicios, direccion | verified | id, nombre |

Operaciones de cada módulo (`/api/v1/{slug}` +), en el orden en que se registran:

| Método | Ruta | Permiso | Respuesta | Archivo |
|---|---|---|---|---|
| GET | `/cercania?lon=&lat=&radio_m=&limit=` | público | 200 `list[Cercano]`, del más cercano al más lejano | `module_extras.py` |
| GET | `/ranking?limit=` | público | 200 `list[RankingItem]` del módulo | `module_extras.py` |
| GET | `/stats` | público | 200 `Estadisticas` | `module_extras.py` |
| GET | `/{item_id}/calificaciones?limit=` | público | 200 `ResumenCalificaciones`; 404 si el lugar no existe | `module_extras.py` |
| POST | `/{item_id}/calificaciones` | sesión | 201 `CalificacionOut`; guarda `usuario_id` | `module_extras.py` |
| GET | `/{item_id}/fotos` | público | 200 `list[FotoOut]` | `module_extras.py` |
| POST | `/{item_id}/fotos` | admin | 201 `FotoOut` | `module_extras.py` |
| DELETE | `/{item_id}/fotos/{foto_id}` | admin | 204; 404 si la foto no es de ese lugar | `module_extras.py` |
| GET | `` (raíz) | público | 200 `PageOut[{Modulo}Out]` | `router_factory.py` |
| GET | `/geojson` | público | 200 `FeatureCollectionOut` | `router_factory.py` |
| GET | `/{item_id}` | público | 200 `{Modulo}Out`; 404 | `router_factory.py` |
| POST | `` (raíz) | admin | 201 `{Modulo}Out`; 409 si choca con una restricción | `router_factory.py` |
| PATCH | `/{item_id}` | admin | 200 `{Modulo}Out`; 404 | `router_factory.py` |
| DELETE | `/{item_id}` | admin | 204; borra también sus calificaciones y fotos (D53) | `router_factory.py` |

Parámetros de los extras: `lon` −180…180, `lat` −90…90, `radio_m` > 0 y ≤ 5000 (por defecto 500, en metros reales con `ST_DWithin` sobre `geography`), `limit` 1–50 (20 en cercanía y calificaciones, 10 en ranking). El ranking ordena por promedio, luego por más votos (`app/repositories/rating_repository.py`).

## 3. Listas: parámetros y paginación

`GET /api/v1/{slug}` (`router_factory.py`, `app/repositories/query.py`, `app/repositories/filters.py`):

| Parámetro | Regla | Error |
|---|---|---|
| `page` | entero ≥ 1, por defecto 1 | 422 |
| `size` | 1–`MAX_PAGE_SIZE` (100), por defecto 20 | 422 |
| `q` | ≤ 100 caracteres; `ILIKE '%q%'` sobre los campos de búsqueda del módulo, con `%`, `_` y `\` escapados | 422 si es más largo |
| `sort` | ≤ 40 caracteres; `campo` ascendente o `-campo` descendente; desempate por `id`; sin `sort`, orden por `id` | 422 `Orden no permitido en sort` |
| cualquier otro | se toma como filtro de igualdad; solo los `filter_fields` del módulo; el valor se convierte al tipo de la columna (`true`/`false`, entero, decimal, fecha ISO) | 422 `Filtro no permitido` o `Valor inválido para el filtro` |

Todo pasa por expresiones de SQLAlchemy con parámetros; el texto del usuario nunca se concatena en SQL.

```json
PageOut[T] = { "items": [T], "total": 0, "page": 1, "size": 20, "pages": 0 }
```

`pages = ceil(total / size)`. Una página más allá de la última devuelve `items: []`.

`/geojson` acepta los mismos `q`, filtros y `sort`, pero no pagina: ignora `page` y `size` y devuelve como máximo `MAX_FEATURES` = 5000 entidades.

## 4. Esquemas Pydantic y validación

### 4.1 Esquemas genéricos (`app/schemas/crud.py`)

| Esquema | Uso | Contenido |
|---|---|---|
| `AuditIn` | base de cada `{Modulo}Create` | `source_type` (`osm`/`datos_abiertos`/`seed`, por defecto `seed`), `source_ref` (≤ 500), `verified` (por defecto `false`); `extra="forbid"`, recorta espacios |
| `partial_schema(create)` | `{Modulo}Update` del `PATCH` | todos los campos opcionales, conserva longitudes, patrones y rangos; enviar `null` a un campo obligatorio sigue siendo 422; la geometría solo cambia si se envía |
| `output_schema(create)` | `{Modulo}Out` | `AuditOut` (`id`, `source_type`, `source_ref`, `verified`, `created_at`, `updated_at`) + campos del módulo + `geometry` (GeoJSON o `null`) |
| `PageOut[T]` | listas | ver §3 |
| `FeatureCollectionOut` | `/geojson` | `type: "FeatureCollection"`, `features` |

Un `ModuleSpec` (`app/modules/spec.py`) deriva `update_schema` y `out_schema` del `create_schema`; el campo que nombra un registro en rankings sale de la primera coincidencia en `nombre`, `nombre_via`, `nombre_localidad`, `codigo`, `codigo_lote`, `modalidad`. `calificacion_promedio` no se recibe ni se expone por el CRUD (D53).

### 4.2 Reglas de validación destacadas

| Regla | Esquema | Archivo |
|---|---|---|
| Geometría del tipo exacto del módulo (`type` literal) y `extra="forbid"` | `geometry_schema(kind)` | `app/schemas/geojson.py` |
| Cada posición es `[lon, lat]` (o con altura), números no booleanos, lon −180…180, lat −90…90 | `_position` | `app/schemas/geojson.py` |
| Línea con ≥ 2 posiciones; anillo de polígono con ≥ 4 posiciones y cerrado (primera = última) | `_line`, `_polygon` | `app/schemas/geojson.py` |
| Estrellas de 0,0 a 5,0 en pasos de 0,5 (`multiple_of=0.5`); comentario ≤ 500; autor ≤ 120 | `CalificacionIn` | `app/schemas/engagement.py` |
| Fotos solo locales: `^/assets/photos/…\.(jpg\|jpeg\|png\|webp)$`, `alt_text` 3–300, `orden` 0–999 | `FotoIn` | `app/schemas/engagement.py` |
| Contraseña ≤ 72 **bytes** UTF-8 (límite de bcrypt; la ñ y las tildes ocupan 2), además de ≤ 72 caracteres; nueva clave ≥ 8 | `Password`, `NewPassword` | `app/schemas/auth.py` |
| Correo con patrón simple, ≤ 254, se recorta y pasa a minúsculas | `Email` | `app/schemas/auth.py` |
| Registro: `nombre` 1–120; no acepta `rol` | `RegisterIn` | `app/schemas/auth.py` |
| Chat: `mensaje` 1–500; `idioma` `es`/`en`; `ruta` `^/[\w\-/]*$` ≤ 200; `lon` y `lat` van juntas | `ChatIn` | `app/schemas/chat.py` |
| Teléfono `^[0-9 +()\-]{7,30}$`; nombre 2–200; textos largos ≤ 500 | tipos compartidos | `app/schemas/modules/fields.py` |
| Catastro: `codigo_lote` `^[0-9A-Za-z\-]+$`, `estrato` 1–6, `avaluo_cop` entero ≥ 0 | `DatoCatastralCreate` | `app/schemas/modules/dato_catastral.py` |
| Localidad: `bandera_url` solo ruta local `^/[A-Za-z0-9_./\-]+$` | `LocalidadKennedyCreate` | `app/schemas/modules/localidad_kennedy.py` |
| Enumeraciones cerradas (`Literal`): p. ej. `tipo` de centro educativo `jardin`/`colegio`/`universidad`, `rango_precios` `$`/`$$`/`$$$`, `franja_horaria` de robos | esquemas de módulo | `app/schemas/modules/*.py` |

**Dentro de El Tintal.** La API valida que las coordenadas sean WGS84 válidas, no que caigan dentro del polígono. La comprobación `ST_Within` contra El Tintal la hace la carga de semillas (`etl/load_seed.py`, con `ModuleSpec.within_tintal`; `localidad` queda exenta porque abarca toda Kennedy), que además valida cada registro con el mismo `create_schema` de la API.

## 5. GeoJSON

| Aspecto | Contrato |
|---|---|
| Sistema de referencia | WGS84, SRID 4326 (`app/models/base.py`); posiciones `[lon, lat]` |
| Salida de geometría | `ST_AsGeoJSON(geom, 7)`: 7 decimales (`app/repositories/base_geo_repo.py`) |
| Entrada de geometría | GeoJSON validado (§4.2) y guardado con `ST_SetSRID(ST_GeomFromGeoJSON(...), 4326)` |
| Detalle y lista | el registro trae `geometry` como objeto GeoJSON dentro del JSON plano |
| `/{slug}/geojson` | `FeatureCollection`; cada `Feature` tiene `id` (= `id` del registro), `geometry` y `properties` (todos los campos de `{Modulo}Out` salvo `geometry`, en modo JSON) |
| `/barrio/poligono` | `Feature` con `bbox` `[oeste, sur, este, norte]` y `properties` (`nombre`, `localidad`, `ciudad`, `definicion`, `source_type`, `source_ref`, `verified`, `license`, `osm_timestamp`, `area_km2`, `centroid` `[lon, lat]`) (`app/schemas/barrio.py`) |
| `/barrio/capas/{nombre}` | GeoJSON de `seed/base/{nombre}.geojson`, ya recortado al polígono (OSM, ODbL); sin `response_model` |

Tipos por módulo: Point en 10 módulos; Polygon en `escenarios-deportivos`, `zonas-verdes` y `datos-catastrales`; LineString en `estado-calles`; MultiPolygon opcional en `localidad` (ver tabla de §2.2).

## 6. Autenticación

| Aspecto | Diseño | Dónde |
|---|---|---|
| Token | JWT HS256 (PyJWT) con solo `sub` (id), `iat` y `exp`; los tres obligatorios al decodificar | `app/core/security.py` |
| Duración | `JWT_EXPIRE_MINUTES` = 60; la cookie usa el mismo `max_age` y `SesionOut.expires_in` lo da en segundos | `app/core/config.py`, `app/api/v1/auth.py` |
| Transporte | solo cookie `mm_session`: `HttpOnly`, `SameSite=Strict`, `Path=/api`, `Secure` en producción. El token no va en el cuerpo ni en `localStorage` | `app/api/v1/auth.py`, D58 |
| Clave | `JWT_SECRET` ≥ 32 caracteres; obligatoria en producción (sin ella la API no arranca); fuera de producción, clave aleatoria por proceso | `app/core/security.py`, `app/main.py` |
| Contraseñas | bcrypt directo, 12 rondas; hash de relleno para que un correo desconocido tarde lo mismo | `app/core/security.py` |
| Roles | `admin` y `visitante` (`UsuarioOut.rol`). El rol y `activo` se leen de la base en cada petición, no del token | `app/api/guards.py`, D58 |
| CORS | orígenes explícitos, `allow_credentials=False`; la cookie funciona porque el frontend llega por proxy del mismo origen (Vite en local, Pages Function publicado) | `app/main.py`, D58, D62 |

`/auth/session` frente a `/auth/me`:

| Ruta | Sin sesión | Con sesión | Para qué |
|---|---|---|---|
| `GET /auth/session` | 200 `{"usuario": null}` | 200 `{"usuario": {...}}` | el frontend la consulta al cargar sin dejar errores en consola |
| `GET /auth/me` | 401 `AUTH_REQUIRED` | 200 `UsuarioOut` | ruta protegida estándar |

401 frente a 403:

| Situación | Estado | `code` |
|---|---|---|
| Sin cookie, token inválido o vencido, en ruta de sesión | 401 | `AUTH_REQUIRED` («Inicia sesión para calificar») |
| Sin cookie, token inválido o vencido, en ruta de admin | 401 | `AUTH_REQUIRED` («Inicia sesión con una cuenta de administración») |
| Visitante con sesión en ruta de admin | 403 | `FORBIDDEN` |
| Correo desconocido, clave errada o cuenta inactiva en login | 401 | `INVALID_CREDENTIALS` (mismo mensaje en los tres casos) |
| Registro con correo existente | 409 | `EMAIL_TAKEN` |

Límites de intentos: §8.

## 7. Códigos de error estándar

Formato (`app/core/exceptions.py`):

```json
{ "error": { "code": "NOT_FOUND", "message": "No existe el registro 99 en librerias" } }
```

`details` solo aparece cuando hay datos útiles (validación, límites).

| `code` | Estado | Cuándo | Origen |
|---|---|---|---|
| `VALIDATION_ERROR` | 422 | cuerpo, ruta o query inválidos (`details`: lista de `{loc, msg, type}`); filtro o `sort` no permitidos, o valor de filtro inválido (`details`: `{loc, msg}`) | `exceptions.py`, `repositories/filters.py` |
| `AUTH_REQUIRED` | 401 | ruta de sesión o admin sin sesión válida | `api/guards.py` |
| `INVALID_CREDENTIALS` | 401 | login fallido | `services/auth_service.py` |
| `FORBIDDEN` | 403 | visitante en ruta de admin | `api/guards.py` |
| `NOT_FOUND` | 404 | registro o foto inexistente; también ruta inexistente (mensaje de Starlette) | `services/crud_service.py`, `services/photo_service.py`, `exceptions.py` |
| `METHOD_NOT_ALLOWED` | 405 | método no soportado en la ruta | `exceptions.py` (`HTTP_CODES`) |
| `CONFLICT` | 409 | `IntegrityError` al confirmar (p. ej. código repetido) | `repositories/transactions.py` |
| `EMAIL_TAKEN` | 409 | registro con correo en uso | `services/auth_service.py` |
| `TOO_MANY_ATTEMPTS` | 429 | límite de login, registro o chat; `details: {"retry_after_s": n}` | `core/rate_limit.py` |
| `SEED_UNAVAILABLE` | 503 | falta un archivo semilla (polígono, capa base, `historia.json`) | `repositories/barrio_repository.py`, `repositories/historia_repository.py` |
| `INTERNAL_ERROR` | 500 | excepción no controlada; se registra en el log, sin trazas en la respuesta | `exceptions.py` |
| `BAD_REQUEST`, `UNAUTHORIZED`, `HTTP_ERROR` | 400, 401, otros | traducción genérica de un `HTTPException` de Starlette | `exceptions.py` (`HTTP_CODES`) |

Excepción al formato: `GET /health` con la base caída responde 503 con su propio `HealthReport` (`status: "degraded"`, `database: "unavailable"`, `postgis: null`), porque `HealthService` atrapa `DATABASE_UNAVAILABLE`.

## 8. Límites y IP real

`AttemptLimiter` (`app/core/rate_limit.py`) es una ventana fija en memoria: vale para un solo proceso de uvicorn, que es como corre el proyecto.

| Ruta | Clave | Límite | Qué cuenta |
|---|---|---|---|
| `POST /auth/login` | `login|IP|correo` | 10 por 15 min | solo los fallos; un login correcto reinicia el contador |
| `POST /auth/register` | `register|IP` | 10 por 15 min | cada intento, correcto o no |
| `POST /chat` | `chat|IP` | `CHAT_MESSAGES_PER_MINUTE` = 30 por 60 s **y** `CHAT_MESSAGES_PER_HOUR` = 120 por 3600 s | cada mensaje; se comprueban los dos antes de contar |

IP del visitante (`app/core/client_ip.py`, D62): publicada, la API recibe las peticiones del proxy (Cloudflare Pages Function), así que la IP de conexión sería la misma para todos. El proxy reenvía la IP real en `X-Client-IP` junto con `X-Proxy-Secret`; la API solo la cree si `X-Proxy-Secret` coincide con `PROXY_SECRET` (comparación de tiempo constante con `secrets.compare_digest`) y la recorta a 64 caracteres. Sin clave configurada, sin cabecera o con clave distinta, usa la IP de la conexión.

## 9. OpenAPI y configuración de producción

| Aspecto | Comportamiento | Dónde |
|---|---|---|
| Documentación | `/docs` (Swagger UI) y `/openapi.json` solo si `ENVIRONMENT` ≠ `production`; ReDoc desactivado | `app/main.py`, `Settings.docs_enabled` |
| Rutas de la doc | en la raíz del servidor, fuera de `/api/v1` | `app/main.py` |
| Agrupación | una etiqueta (`tags`) por router: `health`, `auth`, `barrio`, `ranking`, `galeria`, `historia`, `chat` y el slug de cada módulo | `app/api/v1/*.py` |
| Esquemas | cada `response_model` y cada cuerpo aparecen como componentes (`PageOut[...]`, `{Modulo}Create/Update/Out`, `PointGeometry`, etc.) | fábricas y `app/schemas/` |
| Cabeceras | `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `Permissions-Policy`, COOP; CSP `default-src 'none'` salvo en las rutas de la documentación | `app/core/security_headers.py` |
| Producción | `JWT_SECRET` obligatorio, cookie `Secure`, sin documentación, base por `DATABASE_URL` | `app/main.py`, `app/core/config.py`, D62 |

Para listar todas las operaciones (solo lectura), en `barrio-backend/`:

```
.venv/Scripts/python -c "import json; from app.main import create_app; s=create_app().openapi(); print(json.dumps(sorted((p, sorted(m.keys())) for p,m in s['paths'].items())))"
```

## 10. Ejemplos

Los valores son ilustrativos; la forma es la del contrato.

**Lista filtrada y ordenada**

```http
GET /api/v1/centros-educativos?tipo=colegio&sort=-nombre&page=1&size=1
```

```json
{
  "items": [{
    "id": 1, "source_type": "osm", "source_ref": "node/…", "verified": true,
    "created_at": "…", "updated_at": "…",
    "nombre": "IED Gabriel Betancourt Mejía", "tipo": "colegio", "caracter": "publico",
    "direccion": null, "jornadas": null, "niveles": null, "telefono": null,
    "geometry": { "type": "Point", "coordinates": [-74.1566, 4.6448] }
  }],
  "total": 1, "page": 1, "size": 1, "pages": 1
}
```

**Inicio de sesión**

```http
POST /api/v1/auth/login
Content-Type: application/json

{ "email": "admin@ejemplo.org", "password": "…" }
```

```http
HTTP/1.1 200 OK
Set-Cookie: mm_session=<jwt>; HttpOnly; Max-Age=3600; Path=/api; SameSite=strict

{ "usuario": { "id": 1, "email": "admin@ejemplo.org", "nombre": "Administración", "rol": "admin" },
  "expires_in": 3600 }
```

**Calificación: sin sesión y con estrellas inválidas**

```http
POST /api/v1/zonas-verdes/7/calificaciones
{ "estrellas": 4.5 }
```

```json
401 { "error": { "code": "AUTH_REQUIRED", "message": "Inicia sesión para calificar" } }
```

Con sesión y `{ "estrellas": 4.3 }`:

```json
422 { "error": { "code": "VALIDATION_ERROR", "message": "Datos inválidos",
  "details": [{ "loc": ["body", "estrellas"], "msg": "Input should be a multiple of 0.5",
                "type": "multiple_of" }] } }
```
