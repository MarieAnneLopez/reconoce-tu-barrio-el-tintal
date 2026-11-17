# Publicar «Reconoce tu Barrio: El Tintal» gratis

> **Publicado el 2026-11-15 (D64):**
> - Página: **https://reconoce-el-tintal.pages.dev** (Cloudflare Pages, proyecto `reconoce-el-tintal`, despliegue directo con `wrangler pages deploy dist`).
> - API: **https://barrio-backend-ghc3.onrender.com** (Render free, servicio `srv-dbshb9ek1f9s7399q2k0`, se redespliega solo con cada push a `main`).
> - Base de datos: Neon `barrio-tintal` (PostgreSQL 18 + PostGIS 3.6, us-east-1).
> - Los valores secretos están en `Mini Marie/PUBLICACION_SECRETOS.txt`, fuera de los repos.
> - Para volver a publicar el frontend, desde `barrio-frontend/`: `npm run build` y luego `npx wrangler pages deploy dist --project-name reconoce-el-tintal --branch main`.
> - Lo de abajo es la guía original.


Estado: los archivos de configuración están en los repos y el arranque de producción se probó en local (sección 5). **No se ha subido ni desplegado nada.** Cada paso de abajo lo haces tú en los paneles, cuando lo autorices.

## 1. Qué se publica

| Pieza | Tecnología | Dónde | Costo |
|---|---|---|---|
| Frontend | React 18 + Vite, sitio estático | **Cloudflare Pages** | Gratis |
| Proxy `/api/*` | Cloudflare Pages Function (`functions/api/[[path]].ts`) | Cloudflare Pages | Gratis |
| Backend | FastAPI + Uvicorn (Python 3.13) | **Render Web Service** (plan free) | Gratis |
| Base de datos | PostgreSQL + PostGIS | **Neon** (plan free) | Gratis |

**Cómo encuentra el frontend al backend:**
- El código llama a `/api/v1` en su propio dominio.
- La función de Pages reenvía esas llamadas a la URL de Render que pongas en `BACKEND_URL`.
- Así la cookie de sesión sigue siendo de mismo origen, que es como la diseñamos (D58).
- Además, la IP real del visitante llega al backend con una clave compartida (`PROXY_SECRET`) para los límites de intentos.

**Servicios externos:** ninguno en producción.
- El mapa usa capas propias (`seed/base/`), sin teselas de terceros.
- Fotos y tipografías van dentro del sitio.
- El ETL (OSM y Datos Abiertos) solo corre en tu computador; producción carga los datos ya preparados en `seed/`.
- El chat corre sin la API de Anthropic.

## 2. Por qué Neon para la base

- **Render Postgres gratis** caduca a los 30 días: la página dejaría de funcionar antes de terminar el semestre.
- **SQLite en el disco de Render** se borra en cada reinicio, porque el disco es efímero, y además no tiene PostGIS.
- **Neon (free)** es PostgreSQL con PostGIS y no caduca. Se suspende sin uso y despierta en segundos.
  - **Por verificar al crear la cuenta:** no pude abrir sus páginas porque no están en la red permitida del proyecto, así que no confirmé el tamaño máximo ni las horas de cómputo del plan gratis.
  - Los datos actuales pesan pocas decenas de MB.
- Alternativa: **Supabase (free)**, también con PostGIS, pero pausa el proyecto tras una semana sin uso.

**Datos de ejemplo al arrancar:** `python -m etl.bootstrap` corre antes de Uvicorn en cada arranque.
1. Activa PostGIS y aplica las migraciones.
2. Carga los 14 módulos desde `seed/` **solo si la base está vacía**. Así un reinicio de Render no cambia los id y no se pierden calificaciones.
3. Recarga la Historia Local.
4. Crea o actualiza la cuenta de administración.

**Render gratis se apaga a los 15 min sin tráfico.** La primera visita después de eso tarda alrededor de un minuto. Antes de mostrarla a tus profesores, abre `https://<tu-servicio>.onrender.com/api/v1/health` y espera a que responda `"status":"ok"`.

## 3. Pasos que haces tú (cuando autorices)

### 3.1 GitHub: dos repositorios privados
1. En github.com → **New repository**: crea `barrio-backend` y `barrio-frontend`, los dos **Private**, sin README, sin .gitignore y sin licencia, porque ya existen.
2. Dime «autorizo el push» y ejecuto en cada repo:
   `git remote add origin https://github.com/<tu-usuario>/<repo>.git` y `git push -u origin main`.
   - También puedes hacerlo tú con esos mismos comandos.
   - `.env` no se sube porque está en `.gitignore`. `.env.example` sí, sin secretos reales.

### 3.2 Neon (base de datos)
1. neon.tech → **Sign up** → **Create project**: nombre `barrio-tintal`, Postgres 16, región **AWS US East (N. Virginia)**, la misma zona que Render.
2. En **Connection Details**, copia la cadena **directa** (no la *pooled*), que termina en `sslmode=require`. Esa es tu `DATABASE_URL`.

### 3.3 Cloudflare Pages (frontend). Primero, para conocer su URL
1. dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → elige `barrio-frontend`.
2. Nombre del proyecto: por ejemplo `reconoce-el-tintal`. Tu URL será `https://reconoce-el-tintal.pages.dev`.
3. Build:
   - Framework preset **None**;
   - Build command `npm ci && npm run build`;
   - Output `dist`.
4. **Environment variables (Production):**
   - `NODE_VERSION` = `24`;
   - `BACKEND_URL` = `https://barrio-backend.onrender.com` (ajústala en el paso 3.5 si Render te da otro nombre);
   - `PROXY_SECRET` = un texto aleatorio largo, marcado como **Encrypt**. Guárdalo, porque va también en Render.
5. **Save and Deploy.**

### 3.4 Render (backend)
1. dashboard.render.com → **New** → **Blueprint** → conecta GitHub → elige `barrio-backend`. Render lee `render.yaml`.
2. Llena las variables que pide:

| Variable | Valor |
|---|---|
| `DATABASE_URL` | la cadena de Neon (3.2) |
| `CORS_ORIGINS` | `["https://reconoce-el-tintal.pages.dev"]` (tu URL de Pages, en formato JSON) |
| `ADMIN_EMAIL` | el correo de la cuenta de administración |
| `ADMIN_PASSWORD` | una clave **nueva**, de 12 caracteres o más; la de `.env.example` se rechaza |
| `PROXY_SECRET` | el mismo texto que pusiste en Pages |

3. **Apply.** `JWT_SECRET` lo genera Render solo. No agregues `ANTHROPIC_API_KEY`.
4. Cuando el despliegue termine, abre `https://<tu-servicio>.onrender.com/api/v1/health`. Debe responder `{"status":"ok","database":"ok",...}`.

### 3.5 Unir las dos partes
1. Si el nombre del servicio de Render no es `barrio-backend.onrender.com`, corrige `BACKEND_URL` en Pages: **Settings → Environment variables**, y luego **Deployments → Retry deployment**.
2. Abre tu URL de Pages: el inicio, los módulos, la historia y el chat deben cargar.
3. Entra con la cuenta de administración que pusiste en Render.

## 4. Configuración de producción (ya en el código)

- **Modo debug apagado:**
  - `ENVIRONMENT=production` desactiva `/docs` y `/openapi.json`;
  - Uvicorn corre sin `--reload`;
  - los errores no muestran trazas.
- **`JWT_SECRET` obligatorio:** si falta, la API no arranca.
- **Cookie de sesión:** `Secure`, `HttpOnly` y `SameSite=Strict`.
- **CORS por variable** (`CORS_ORIGINS`), solo con los orígenes listados.
- **Contraseña de administrador por variable de entorno:** el arranque se detiene antes de tocar la base si es la de demostración.
- **Inicio de sesión:** 10 intentos fallidos cada 15 minutos, por IP real y correo.
- **Chat:** 30 mensajes por minuto y 120 por hora por visitante, en modo Local, sin clave de Anthropic.

## 5. Comprobado en local (2026-11-14)

- **Frontend:**
  - `npm run build` → `dist/` con `index.html`, `assets/` y `_headers`;
  - el proxy tiene 2 pruebas: ruta, cuerpo, cookie, IP con clave, cabeceras falsas eliminadas y errores 502/503.
- **Backend en modo producción, sobre una base PostGIS nueva y vacía** (simula Neon):
  - con la clave de demostración, el arranque se detiene antes de crear tablas;
  - con una clave propia, migraciones y semillas cargadas;
  - el segundo arranque dice «semillas: ya cargadas»;
  - `/api/v1/health` → ok;
  - `/docs` → 404;
  - login con la clave de demostración → 401;
  - login con la clave propia → 200 con cookie `HttpOnly; Path=/api; SameSite=strict; Secure`;
  - CORS: el origen configurado se acepta y uno ajeno no;
  - 11 intentos fallidos → el último da 429.
- **Sin probar** (necesitan las cuentas y la red): la función de Pages corriendo en Cloudflare, el arranque en Render y la conexión a Neon. Los nombres de los menús de los paneles pueden variar un poco.
