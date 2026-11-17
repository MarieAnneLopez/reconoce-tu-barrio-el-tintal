# Proyecto: Reconoce tu Barrio — El Tintal

App web de 3 capas para reconocer el barrio El Tintal (Kennedy, Bogotá D.C.).
Creadora: Marie Anne Lopez Poveda.
Muñeco de píxeles: **Mini Marie** (asistente virtual, avatar de bienvenida y animación de carga). Es el personaje, no la creadora. Spritesheet: `MINI MARIE.png` en la raíz.

Fuentes, en este orden de autoridad (léelas cuando las necesites, no las copies aquí):
1. docs/origen/ESPECIFICACION_ORIGINAL_v4.md — requisitos del curso.
2. docs/origen/PROMPT_MAESTRO.md — diseño, stack, estructura y fases.
Capturas de referencia visual: docs/referencias/. Estado y plan: PLAN_MAESTRO.md.

## Estructura
- La raíz "Mini Marie/" tiene un espacio: cita siempre las rutas entre comillas.
- barrio-frontend/ es el repo Git 1 (React 18, Vite, TypeScript strict, Tailwind, r3f, MapLibre, zustand, i18next).
- barrio-backend/ es el repo Git 2 (FastAPI, SQLAlchemy 2, GeoAlchemy2, Alembic, PostGIS SRID 4326).
- No mezcles código ni historial entre los dos repos. Un commit atómico por tarea verificada.

## Verificación (convención del proyecto; créala en el Hito 0 si aún no existe)
- Frontend, en barrio-frontend/: npm run lint, npm run typecheck, npx vitest run, node scripts/check_line_length.mjs
- Backend, en barrio-backend/: docker compose up -d, pytest --cov=app, python scripts/check_line_length.py
- Antes de decir "hecho", ejecuta la verificación que corresponda y pega el comando con su salida real.

## Reglas del proyecto
- Ningún archivo de código (.ts .tsx .js .mjs .py .css) supera 100 líneas. Quedan fuera: JSON de datos y traducciones, migraciones Alembic autogeneradas, lockfiles, node_modules, dist.
- Paleta (D84, docs/DISENO-V3.md): solo noche #283845 (~55 %), papel #E8D8C9 (~30 %), ámbar #FFA649 (~10 %), acero #4B607F (~4 %) y naranja #F3701E (≤ 1 %); blanco y negro solo en alto contraste (el negro, además, translúcido en la única sombra suave), y colores semánticos de estado. Sobre ámbar solo va texto noche; ámbar nunca es texto sobre papel; acero nunca es texto sobre noche. Texto ≥ 4,5:1 con los pares medidos de DISENO-V3. El amarillo solo existe en el sprite de Mini Marie. Dentro de los mapas (2D, 3D, vista previa y marcadores) va el tema propio de styles/map-palette.css (D83), que no se toca; controles y paneles alrededor van en la paleta nueva.
- SOLID real: los endpoints dependen de abstracciones inyectadas con Depends; los 14 módulos CRUD salen de fábricas genéricas.
- UI en español por defecto e inglés vía i18next. Sin TODO, sin lorem ipsum, sin enlaces externos para imágenes.
- Cada registro de datos lleva source_type, source_ref y verified. Lo no verificable se marca "por verificar"; las semillas inventadas se muestran como "dato de ejemplo".
- "MINI MARIE.png" no se edita, mueve ni borra; trabaja sobre copias.

## Pregunta antes de
Agregar dependencias fuera del stack del PROMPT_MAESTRO §8, borrar archivos, cambiar un esquema ya migrado, tocar algo fuera de "Mini Marie/", o hacer red fuera de Overpass, Nominatim, datos.gov.co, Wikimedia y registros de paquetes. Nunca git push.
Excepción autorizada por Marie (2026-11-14, D22 en PLAN_MAESTRO.md): las instalaciones de entorno (también las globales, como WSL o Docker) y las dependencias que el plan necesite se hacen sin preguntar; cada una se anota en PLAN_MAESTRO.md con su motivo.

## Paradas
Si la misma verificación falla 3 veces seguidas, o dos fuentes se contradicen, detente y reporta.

## Fases
Una fase a la vez (35%, 70%, 100%). Al cerrar cada una: informe en docs/ y espera mi "OK".
