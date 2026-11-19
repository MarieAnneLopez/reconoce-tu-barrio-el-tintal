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
- Recursos (D95): máximo 1 navegador y 2 páginas abiertas a la vez; cierra cada página al terminar; servidores de verificación solo mientras corren las pruebas; al cerrar cada etapa repite el diagnóstico de memoria y pega el resultado.

## Reglas del proyecto
- Ningún archivo de código (.ts .tsx .js .mjs .py .css) supera 100 líneas. Quedan fuera: JSON de datos y traducciones, migraciones Alembic autogeneradas, lockfiles, node_modules, dist.
- Paleta (D100 de Martín, docs/DISENO-V3.md): crema #FCF0CF 60 % (fondo, márgenes, espacio negativo); rosa claro #F3D1DC 18 % (tarjetas, secciones alternas, barras laterales, paneles); rosa #F6A7C1 12 % (banners, badges, bordes activos, íconos ilustrativos; degradado sutil solo en hero y cabecera); amarillo #FDCF76 5 % (botones secundarios, novedad, estrellas, subrayados clave, hover); marrón #B16E4B 5 % (títulos de alto impacto, botón CTA y pie). Reparto medido por página sin fotos ni mapa: ±3 puntos. Texto del cuerpo negro (--texto-cuerpo, [PROPUESTA]); blanco solo en alto contraste. Títulos marrón SOLO sobre crema y grandes (≥ 24 px, o ≥ 18,66 px en negrita real de 700: h2/h3 en Cormorant 600 no cuentan, D110); nunca marrón como texto sobre rosa claro (2,88), rosa (2,16) ni amarillo (2,76). CTA: fondo marrón con texto crema de 19 px en Inter 700 (ui.css lo fuerza). Pie: banda marrón con texto crema grande y franja rosa claro con texto negro. Estados semánticos siempre con ícono y texto. Texto ≥ 4,5:1 (grande ≥ 3:1) con los pares de tokens.test.ts. Mini Marie nunca va sobre amarillo. Dentro de los mapas (2D, 3D, vista previa y marcadores) va el tema propio de styles/map-palette.css (D83); controles y paneles alrededor van en la paleta.
- SOLID real: los endpoints dependen de abstracciones inyectadas con Depends; los 14 módulos CRUD salen de fábricas genéricas.
- UI en español por defecto e inglés vía i18next. Sin TODO, sin lorem ipsum, sin enlaces externos para imágenes.
- Cada registro de datos lleva source_type, source_ref y verified. Lo no verificable se marca "por verificar"; las semillas inventadas se muestran como "dato de ejemplo".
- Los datos de la maqueta 3D y de los mapas son oficiales (D105: Catastro Bogotá UAECD, CC BY 4.0, y OpenStreetMap, ODbL 1.0), se procesan una vez en el build (npm run datos:3d) y no llevan "dato de ejemplo"; los registros de ejemplo de los módulos no se dibujan en el mapa (siguen en su lista, con su etiqueta).
- "MINI MARIE.png" no se edita, mueve ni borra; trabaja sobre copias.

## Pregunta antes de
Agregar dependencias fuera del stack del PROMPT_MAESTRO §8, borrar archivos, cambiar un esquema ya migrado, tocar algo fuera de "Mini Marie/", o hacer red fuera de Overpass, Nominatim, datos.gov.co, Wikimedia y registros de paquetes. Nunca git push.
Excepción autorizada por Marie (2026-11-14, D22 en PLAN_MAESTRO.md): las instalaciones de entorno (también las globales, como WSL o Docker) y las dependencias que el plan necesite se hacen sin preguntar; cada una se anota en PLAN_MAESTRO.md con su motivo.

## Paradas
Si la misma verificación falla 3 veces seguidas, o dos fuentes se contradicen, detente y reporta.

## Fases
Una fase a la vez (35%, 70%, 100%). Al cerrar cada una: informe en docs/ y espera mi "OK".
