# Informe — Gran actualización

Reconoce tu Barrio — El Tintal · 2026-11-18 · para Martín

Sitio: https://reconoce-el-tintal.pages.dev · Decisiones D99–D120 en `PLAN_MAESTRO.md`.

**Cierre (2026-11-18):** producción publicada (despliegue `b98c04b5`) y sirviendo `/assets/index-DYLftdyt.js` (antes `index-OfFV0fuJ.js`); prod-check en 34 rutas×ancho (1440 y 390): 0 errores de consola. barrio-frontend empujado sin force: `a98fde4..4719402` a `origin/main`. barrio-backend sin cambios (limpio, `54c2ad0`, al día con su origin). sha256 de «MINI MARIE.png» igual al inicio y al final (65F8F964…D106).

## 0. Estado del cierre (una línea por bloque)

- **Bloque A, fusión (2026-11-18):** ✅ `gran/fix-paleta` (merge d8c492d, sin conflictos), `gran/fix-entradas` (984ac72; conflicto solo de comentario en `section-intro.css`, se unen los dos porqués) y `gran/fix-carga` (2d88f62; add/add en `src/test/cssLength.ts`: dos ayudantes distintos, se conservan los dos y el de la carga pasa a `cssGeometry.ts`) integradas en `interfaz-elegante` sin descartar commits. [PROPUESTA] cosméticas: cuerpo negro, piso de la Galería y colores día/noche ya estaban; logo estático aplicado con el revert 98bde0e de e817716 (D123). Tras cada merge: lint y typecheck en verde, pruebas de la zona y smoke en Edge sin errores de consola. Worktrees quitados: `gran-wt/calles` y `gran-wt/edificios`; NO quitados: `gran-wt/mapas` (2 archivos sin seguimiento: `src/test/stateScan.ts` y `src/components/ui/stateScan.test.ts`, un escáner PAL-06 que el carril no llegó a comitear) y el de deploy (detached 893b30c, con cambios sin comitear en `e2e/home.spec.ts`, `e2e/map.spec.ts`, `map.css` y `scale.css`, más 2 archivos sin seguimiento). No se borró ninguna rama.

- **Bloque B, sprites (2026-11-18):** ✅ run, wave y sit de 32 cuadros desde las hojas de Martín (commit 4719402, D124). Atlas antes→después (bytes): run_105 101376→40142, run_210 226734→124010, run_420 403314→169252, wave_80 76472→29592, wave_160 183496→99940, wave_320 424178→290498, wave_640 765574→212984, sit_48 30990→9378, sit_96 77436→36328, sit_192 160802→121164. Cero magenta y cero halo sobre crema, rosa claro, rosa y negro (`sprite_sheets32.test.mjs`).
- **Bloques C y D (2026-11-18):** lint, typecheck, líneas y build en verde; vitest con 1 fallo bloqueado; publicado y empujado (ver cierre arriba).
- **D117 (TBT de Galería):** la rejilla de espera muestra 12 fotos en vez de 208 (tarea de 262 ms en el primer pintado); prueba `PhotoRibbon.pending.test.tsx`. Detalle en PLAN_MAESTRO.md.

## 1. Qué se hizo, por bloque

| Bloque | Resultado | Decisión |
|---|---|---|
| Autorización | Registrada como D99 (alcance y no negociables). | D99 |
| Paleta | 60/18/12/5/5 exacta en `tokens.css`, `CLAUDE.md`, `docs/DISENO-V3.md`, `tokens.test.ts`, escáner de paleta y pruebas de contraste. Cuerpo negro en `--texto-cuerpo` [PROPUESTA]. | D100, D110 |
| Mini Marie de 32 cuadros | Carrera, saludo, sentada y reposo en atlas de 8 × 4 (32 cuadros por ciclo), paleta exacta del sprite, escala entera y `image-rendering: pixelated`; carrera a 24 fps, saludo y sentada a 20 fps, reposo a 12 fps. Zancada recalculada (292 px por ciclo a 420 px de alto). | D109 |
| Pantalla de carga | Mini Marie corre a la derecha de borde a borde en bucle (WAAPI + `translate3d`, una posición entera por cuadro); barrio en capas con parallax lento; barra con progreso real, muelle, brillo, chispas amarillas y una Mini Marie pequeña que avanza con el porcentaje. `role="status"`, `aria-live="polite"`, es/en; movimiento reducido: pose quieta y barra sin adornos. | D102, D111 |
| Bienvenida | Exactamente 8 asomadas fijas (4 esquinas y el centro de cada borde) en la pantalla visible real; se recolocan al redimensionar; saludo de 32 cuadros. | D103 |
| Inicio | Vuelo entre fotos con N = 9 (las 8 del carrusel y Campus Tagaste); runway (N+1)·100svh, mismas ecuaciones. | D104, D113 |
| Entrada en todas las secciones | `SectionIntro`: el manifiesto con el título de cada página, variante determinista por ruta (esquina, orden de palabras, desfase y color), sin repetir entre secciones seguidas; h1 real, fragmentos `aria-hidden`, < 1,5 s, estado final con movimiento reducido. | D101 |
| Galería General | Cinta curva en WebGL con la geometría, el sombreado y la interacción pedidos; botones nativos con roving tabindex y zonas de clic proyectadas; Enter abre el visor con autor y licencia; rejilla de respaldo sin WebGL. | — |
| Mapas | Mapa 3D y los 14 módulos van en la maqueta a pantalla completa, con un solo contexto WebGL vivo (ScenePortal) y los marcadores dentro de la escena. Panel izquierdo de vidrio (blur + saturate, tinte rosa claro, borde de 1 px, brillo especular) oculto por defecto tras un botón de tres rayas de ≥ 44 px con `aria-expanded` y Escape; respaldo opaco sin `backdrop-filter` o con `prefers-reduced-transparency`. Ficha derecha con el mismo vidrio: nombre, dirección oficial, datos del módulo y fuente. MapLibre y el mapa 2D salen del proyecto. | D118 |
| Maqueta 3D | Datos oficiales (Catastro UAECD y OSM) procesados en el build; ciclo día/noche de 13 min con atardecer y amanecer; isla, nubes, cielo, sol y luna; calidad adaptable y recuperación del contexto WebGL. 20 394 edificios reales por teselas armadas en un Web Worker, clicables, con ventanas por shader (encendidas al azar de noche), cornisas y pretiles; vías de OSM con sentidos, andenes, cebras, semáforos, faroles y árboles; carros, personitas y aviones con InstancedMesh. | D105, D106, D107, D118 |
| Rendimiento | Ver §6. | D111–D116 |
| Créditos | Las 8 vistas del carrusel figuran en Créditos de fotos con autor, licencia y origen. | — |

### Commits

173 commits de barrio-frontend desde 949b3a8 (`git log --oneline 949b3a8..4719402`). Merges: c9c0e4a datos, 97b8589 galería, bfdf830 sprites, 4b52212 y 621e0ce edificios, 18c7d7f calles, 4ee6a45 mapas, d8c492d fix-paleta, 984ac72 fix-entradas, 2d88f62 fix-carga; después 98bde0e (logo estático) y 4719402 (sprites de 32 cuadros de Martín, D124). barrio-backend: sin commits nuevos.

## 2. Mini Marie de 32 cuadros

Solo había 8 cuadros dibujados de la carrera, 7 del saludo y 4 de la sentada y del reposo. Los intermedios se generaron sobre copias (nunca sobre `MINI MARIE.png`), con 5 métodos candidatos por intermedio, comparados en hojas y elegidos a ojo (`gran-tools/s32/select.py`):

- **giro**: intermedio por piezas (cabeza, torso, brazos, piernas y pelo) con interpolación de pose y giro con vecino más cercano;
- **giro2**: lo mismo desde otro cuadro de partida (subir el brazo siempre desde el brazo colgando);
- **tras**: piezas solo trasladadas;
- **flujo**: interpolación de movimiento por flujo óptico (OpenCV, Farnebäck y DIS);
- **sosten**: sostener el cuadro dibujado.

Elegidos: «giro» en casi todo; «giro2» en 4 intermedios de la carrera y 5 del saludo; «flujo» en la patada de la sentada y en los cuadros donde el giro dejaba rayas o muescas. Cada cuadro se cuantizó a la paleta exacta del sprite y a su rejilla de píxeles: 0 píxeles fuera de paleta, sin desenfoque ni halos y con el contorno intacto. Los cuadros deformados se descartaron al revisar cada hoja.

Hojas de contacto, con los 32 cuadros de cada ciclo:

- `docs/capturas/sprites32/run_32.png`
- `docs/capturas/sprites32/wave_32.png`
- `docs/capturas/sprites32/sit_32.png`
- `docs/capturas/sprites32/idle_32.png`

Comparación de métodos: `docs/capturas/sprites32/comparacion/`.

Pruebas:

- `scripts/sprite_cycles.test.mjs`: paleta, cuadros dibujados intactos, pie sin patinar ≤ 3 px y zancada de ±4 px sobre `stridePx(420)`;
- `scripts/sprite_scales.test.mjs`: escalas enteras y reposo sin pérdida visible (0 píxeles visibles distintos).

## 3. Bienvenida, Inicio, secciones y Galería

- **Bienvenida (D103):** `e2e/welcome-peeks.spec.ts` mide, a 390, 768, 1440 y 1920 px, el centro de la caja visible de cada asomada contra su ancla: ≤ 12 px en las 8 (medido 0,1–0,2 px). Capturas: `docs/capturas/gran/bienvenida/bienvenida-{390,768,1440,1920}.png`.
- **Galería (cinta curva):** `e2e/gallery.spec.ts` a 1440 y a 390 × 844 px comprueba:
  - el pie de la foto centrada, con su atribución y «Ver en {módulo}»;
  - que Enter abre el visor con autor y licencia;
  - que con el visor abierto ningún botón de la cinta queda encima;
  - que los botones a la vista se apilan por profundidad.
- **Créditos:** las 8 vistas del barrio del carrusel (vuelo del Inicio y Galería) se suman a Créditos de fotos con autor, licencia y página de origen. axe sin violaciones a 390, 768 y 1440 px.

## 4. Paleta D100: reparto medido y contrastes

### Reparto por página

Medido con un script desechable sobre capturas de página completa, sin fotos ni mapas. Formato: crema / rosa claro / rosa / amarillo / marrón, en %. Objetivo 60 / 18 / 12 / 5 / 5, ±3 puntos.

| Página | 1440 px | 390 px |
|---|---|---|
| Inicio | 59,4 / 17,1 / 14,7 / 4,1 / 4,8 ✔ | 66,7 / 13,1 / 11,9 / 4,6 / 3,7 ✘ |
| Galería | 48,1 / 32,1 / 10,2 / 4,3 / 5,2 ✘ | 69,3 / 13,1 / 6,1 / 5,8 / 5,7 ✘ |
| Historia | 65,5 / 19,0 / 12,7 / 1,5 / 1,4 ✘ | 65,1 / 17,7 / 12,9 / 2,7 / 1,6 ✘ |
| Ranking | 60,9 / 18,2 / 8,8 / 4,3 / 7,7 ✘ | 56,0 / 18,4 / 12,8 / 6,2 / 6,5 ✘ |
| Preguntas | 58,8 / 17,7 / 15,3 / 3,6 / 4,6 ✘ | 59,1 / 15,0 / 14,1 / 5,6 / 6,2 ✔ |
| Ayuda | 59,1 / 22,4 / 12,1 / 3,2 / 3,3 ✘ | 58,9 / 20,6 / 11,0 / 5,4 / 4,1 ✔ |
| Acceso | 60,9 / 18,9 / 10,5 / 4,0 / 5,8 ✔ | 58,0 / 16,5 / 14,0 / 6,4 / 5,2 ✔ |
| Creadora | 59,2 / 18,1 / 11,1 / 4,4 / 7,2 ✔ | 57,8 / 14,7 / 14,1 / 7,3 / 6,1 ✘ |
| Créditos de fotos | 69,6 / 18,0 / 8,4 / 3,0 / 1,0 ✘ | 60,5 / 22,5 / 10,5 / 5,3 / 1,2 ✘ |
| 404 | 57,4 / 19,9 / 9,7 / 4,9 / 8,2 ✘ | 55,8 / 16,3 / 12,3 / 7,2 / 8,4 ✘ |

Hay 6 de 20 mediciones dentro de ±3 en los 5 colores. Las otras 14 se pasan en algún color, por 0,3 puntos (rosa de Preguntas a 1440) a 14 puntos (rosa claro de Galería a 1440). Tras 3 ajustes seguidos sin converger, quedó registrado como residuo (regla de paradas). Las causas, medidas:

- **Galería a 1440:** la franja ancha no puede ser crema, porque Ranking, su vecina en el menú, ya lo es (no se repite color entre secciones seguidas).
- **Historia y Créditos:** son páginas largas de texto sobre crema, con poco espacio para amarillo y marrón sin romper las reglas de contraste.

### Contrastes

Pares de `tokens.test.ts`, calculados con L = 0,2126 R + 0,7152 G + 0,0722 B linealizados. Los títulos marrón (D110) solo van sobre crema y a ≥ 24 px reales: h2/h3 en Cormorant 600 no cuentan como negrita.

| Par | Exige | Estándar | Alto contraste |
|---|---|---|---|
| Negro sobre crema (`--text-primary` / `--bg-primary`) | 4,5 | 18,50 | 21,00 |
| Negro sobre rosa claro (`--text-on-accent` / `--bg-accent`) | 4,5 | 14,96 | 21,00 |
| Negro sobre amarillo (`--text-on-highlight` / `--bg-highlight`) | 4,5 | 14,36 | 21,00 |
| Negro sobre rosa (`--text-on-accent` / `--bg-strong`) | 4,5 | 11,22 | 21,00 |
| Éxito sobre superficie (`--state-success`) | 4,5 | 6,28 | 14,96 |
| Aviso sobre superficie (`--state-warning`) | 4,5 | 6,44 | 12,45 |
| Error sobre superficie (`--state-error`) | 4,5 | 7,32 | 11,06 |
| CTA crema sobre marrón, 19 px Inter 700 | 3 (grande) | 3,56 | 21,00 |
| Pie: crema sobre banda marrón (texto grande) | 3 (grande) | 3,56 | 21,00 |
| Título marrón sobre crema (≥ 24 px) | 3 (grande) | 3,56 | 21,00 |

Nunca hay marrón como texto sobre rosa claro (2,88), rosa (2,16) ni amarillo (2,76). Los estados semánticos llevan siempre ícono y texto. Mini Marie nunca va sobre amarillo.

## 5. Maqueta 3D y mapas

### Qué hay en la maqueta

- **Edificios (carril edificios, merges 4b52212 y 621e0ce):** los 20 394 de TNT3 (20 381 de Catastro y 13 de OSM) en 48 teselas de 400 m armadas en un Web Worker (130 ms en escritorio, 137 ms en móvil emulado; respaldo en tandas de ≤ 1,3 ms). Se dibujan 20 296: los 98 restantes no asoman sobre el suelo (subterráneos o de 0 pisos en Catastro) y no se les inventa volumen. Material propio con ventanas por piso (de noche se encienden al azar y cambian despacio), cornisas, pretiles y techos; hover y clic por rayo (0 % de hover perdido entre teselas). La ficha muestra la placa oficial, el nombre si existe, pisos («sin dato» si la fuente no los da), lote y sector.
- **Calles y vida (carril calles, merge 18c7d7f):** calzadas con el ancho por tipo de vía, andenes, cebras (3 676), ciclorrutas, 50 semáforos reales, 494 faroles (decorativos, dicho en el código) y 1 926 árboles (670 de OSM). 520 carros por las vías reales con sus sentidos (más en avenidas), 760 personitas por andenes y parques y aviones cada 1–3 min, todo con InstancedMesh; la densidad baja con la calidad (0,6 y 0,3).
- **Mapas (carril mapas, merge 4ee6a45):** Mapa 3D y los 14 módulos en la maqueta a pantalla completa con un solo contexto WebGL; botón de tres rayas de ≥ 44 px siempre visible, panel izquierdo y ficha derecha de vidrio (D118). MapLibre sale del proyecto.
- **Arreglos tras integrar:** estrellas en puntos de ~3,7 px en vez de cuadrados de ~23 px (980651b); el «#» de las placas lo pone Georgia (934a956, D122); la ficha del Inicio cabe a 390 px sin bajar hasta el chat (301787f); los módulos densos solo donde se dibujan (a84408a, D121).

### Métricas D12

Sonda de `gran-tools/captura/captura.mjs` sobre el build de producción servido en local (Edge, una página): `renderer.info.render.triangles` y el intervalo entre cuadros.

| Escena | Triángulos | ms por cuadro |
|---|---|---|
| /mapa de día, 1440 × 900, solo con los edificios integrados | 220 589 | 6,95 |
| /mapa de noche, 1440 × 900, todo integrado | 598 016 | 6,95 |
| /mapa de día, 1440 × 900 a DPR 3 con CPU ×4 (`--movil`) | 542 582 | 10,01 |

6,95 ms es el tope de vsync del monitor (144 Hz): en escritorio la holgura real es mayor de lo que la sonda puede medir. Metas: ≥ 50 fps en escritorio (≤ 20 ms) y ≥ 30 fps en móvil emulado (≤ 33 ms): cumplidas en las tres.

Capturas: `docs/capturas/gran/maqueta/` (`integrado-noche.png`, `integrado-dia-movil.png`, `integracion-edificios-dia-1440.png`).

## 6. Rendimiento

### Lighthouse móvil

Lighthouse 12.8.2, Moto G Power emulado, red lenta y CPU ×4 simulados. Formato de cada celda: Perf · LCP · CLS · TBT · peso.

| Ruta | Antes (producción, 949b3a8) | Después (producción) |
|---|---|---|
| Inicio | 81 · 3,43 s · 0,033 · 192 ms · 2129 KB | no medido |
| Mapa 3D | 81 · 2,61 s · 0,001 · 439 ms · 1542 KB | no medido |
| Galería | 76 · 4,69 s · 0,000 · 119 ms · 1626 KB | no medido |
| Centros educativos | 80 · 3,48 s · 0,000 · 287 ms · 1108 KB | no medido |

Mediciones intermedias:

- **Vista previa de Cloudflare:** Inicio pasó de 67 a **93** (LCP 2,26 s, CLS 0, TBT 21 ms, 786 KB) con D111–D113. Esa vista previa no tiene `BACKEND_URL`, así que las otras rutas no son comparables: sus 44 llamadas a la API daban 503.
- **Local con la API real** (`vite preview` + proxy a Render):
  - CLS: 0,767 → 0,000 en Galería y módulos y → 0,001 en Mapa 3D (D114);
  - Galería: 38 → 66;
  - módulo: 33 → 57.

Archivos: `docs/capturas/gran/medidas/` (`lighthouse-antes.txt`, `lh-preview/`, `lh-local/`).

### Qué se cambió (con su medida)

- **D111, atlas de Mini Marie:** en el celular la carga baja un solo atlas a 1× (antes también el doble, 395 KB), y el pie no pide el suyo (306 KB) hasta estar a 300 px de verse.
- **D112, maqueta del Inicio:** se pide a tres pantallas de llegar al capítulo 3, sin sacar la pantalla de carga (antes: 443 KB de datos y ~225 KB de código en el arranque, con el manifiesto en pausa detrás).
- **D113, fotos del vuelo:** se piden tras el manifiesto, de dos en dos y en orden (antes ~1,8 MB en el arranque de un celular).
- **D114, CLS:** mientras llega el código de una página, `<main>` reserva una pantalla; el pie (1658 px en un celular) ya no salta.
- **D115, INP:** el menú se monta en una transición.
- **D116, LCP de Galería:** la primera fila de la rejilla va sin diferir y la primera foto con `fetchpriority="high"`.

### INP (laboratorio)

Lighthouse en modo navegación no mide INP. Se midió con Event Timing:

- **Montaje:** 390 × 844, DPR 3, CPU ×4 (`gran-tools/captura/inp-probe.mjs`).
- **Interacciones:** abrir y cerrar el menú, la cinta con flechas, clic en la maqueta, rueda y el panel de accesibilidad.

| Ruta | Antes de D115 | Después |
|---|---|---|
| Inicio | 192 ms | 64 ms |
| Mapa 3D | 224 ms | 56 ms |
| Galería | 200 ms | 56 ms |
| Centros educativos | 176 ms | 48 ms |

### JS por ruta (comprimido)

Antes, en producción:

| Ruta | Comprimido | Sin comprimir |
|---|---|---|
| Inicio y Mapa | 451 KB | 1,5 MB |
| Páginas de contenido | ~227 KB | ~661 KB |
| Módulos (MapLibre) | ~675 KB | 2,27 MB |

Después: no medido en este cierre (Martín pidió agilizar y subir); queda pendiente.

## 7. Verificación

```
npm run lint        → eslint . --max-warnings 0 (sin avisos)
npm run typecheck   → tsc --noEmit (sin errores)
npx vitest run      → Test Files 2 failed | 267 passed (269) · Tests 3 failed | 1512 passed | 1 skipped (1516)
                      (dos fallos eran el ancho de la sentada 29→26 px, ya corregido: SittingMarie 27/27;
                       queda 1: «carrera: el pie no se mueve más de 3 px», BLOQUEADO, ver §9)
node scripts/check_line_length.mjs → OK, 822 archivos de código, todos <= 100 líneas.
npm run build       → ✓ built
prod-check (producción, 1440 y 390) → errores: 0 en todas las rutas
```
Playwright + axe en la matriz completa, re-medición de paleta y métricas 3D: no corridas en este cierre (Martín pidió agilizar). D95: un solo navegador por vez, cerrado al terminar cada smoke.

## 8. Fuentes y licencias de datos

| Dato | Fuente | Licencia y atribución |
|---|---|---|
| Edificios (huella y pisos), lotes, placas domiciliarias (v. 10.26) y sectores | Catastro Bogotá, UAECD, por ArcGIS REST (conjuntos en datosabiertos.bogota.gov.co) | **CC BY 4.0**: «Catastro Bogotá (UAECD) – Datos Abiertos Bogotá» |
| Vías con sentido, cruces, semáforos, suelo, árboles, nombres y 13 edificios que faltan en Catastro | OpenStreetMap por Overpass | **ODbL 1.0**: «© colaboradores de OpenStreetMap»; lo derivado es base de datos derivada ODbL |
| Fotos del carrusel y del vuelo | Wikimedia Commons, con autor y licencia por foto (`carouselCredits.json`) | CC BY 4.0 o CC BY-SA 4.0 según la foto (todas en Créditos de fotos) |
| Fotos de los lugares | Wikimedia Commons y Mapillary | CC BY-SA 4.0 (Mapillary) y la de cada foto de Commons |
| Placa por código de lote | Unión Construcción `LOTECODIGO` = Lote `LOTCODIGO` = Placa `PDOCLOTE` | Ver D107 [PROPUESTA] |

Todo se descarga y procesa una vez, en el build (`npm run datos:3d`). El navegador del visitante no consulta servicios externos para la maqueta.

OSM no registra faroles en el barrio: los de la maqueta son decoración por regla y nunca se presentan como dato.

No se usó Google Maps, Street View, Geocoding API ni Places API, ni datos o imágenes suyos. Tampoco se descargó nada de thepromptsfactory.com.

## 9. Bloqueado o no hecho

- **Sentada de 32 cuadros (D109):** no queda fluida. El movimiento se concentra en saltos de un cuadro (2→3, 7→8, 16→17, 22→23, 30→31) que no se interpolan sin deformar la pierna y la falda. Hacen falta 2 o 3 poses dibujadas por Marie.
- **Contornos dentados (D109):** algunos intermedios de la carrera los tienen, por el giro con vecino más cercano. Propuesta: giro tipo RotSprite.
- **Reparto de paleta:** 14 de 20 mediciones quedan fuera de ±3 (tabla §4).
- **Pie de la carrera ≤ 3 px (BLOQUEADO):** con las hojas de Martín el pie apoyado salta entre cuadros (+18, −30, +18 px en 13→14, 17→18, 19→20); ningún avance uniforme lo cumple. Salida: `expected [ [ +0, 11.17… ], …(11) ] to deeply equal []`. Prueba y umbral sin tocar.
- **Carrera, cuadros 5–8 descartados:** sentadilla deforme (manos fundidas, cabeza 30 px abajo); en su lugar van los 29–32 de Martín.
- **Pendiente de medir:** matriz Playwright + axe, re-medición de paleta (D119), métricas 3D, Lighthouse e INP en producción, JS por ruta.
- **Worktrees no quitados:** `gran-wt/mapas` y el de deploy tienen trabajo sin comitear (ver §0).

## 10. [PROPUESTA] para que Martín confirme

- **`--texto-cuerpo` negro:** marrón sobre crema (3,56) no llega a 4,5:1 en texto normal. Se cambia en una línea.
- **Escenario de Galería:** crema #FCF0CF con rejilla de suelo marrón que se desvanece hacia crema.
- **Placa por código de lote en vez de por posición (D107):** el 86,7 % de las placas cae en su propio lote; la unión por código cubre el 99,8 % de los edificios.
- **Colores del ciclo día/noche (D106):** 27 colores propios en `map-palette.css`; edificios medianos en marrón ladrillo.
- **Atlas de Mini Marie (D109):** sus pesos (run_420 393 KB, wave_320 414 KB, wave_640 747 KB, idle_560 689 KB). El atlas es ilustración con miles de colores, así que sin pérdida pesaría 2–4 veces más; se queda con pérdida (calidad 90).
- **Logo de la cabecera (D109):** sigue estático.

## 11. Skills

- **Cargadas y aplicadas:**
  - «diseños» (Emil Kowalski): pantalla de carga, barra, bienvenida y pulido de movimiento;
  - «liquid-glass»: es de SwiftUI; sus principios se llevaron a CSS para los paneles de vidrio de los mapas.
- **frontend-design:** no existe en este entorno. En su lugar se usó «frontend-ui-engineering».
