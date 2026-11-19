# Diseño v3: «Interfaz elegante»

**Pedido:** Martín, 2026-11-16 · **Decisiones:** D96 (paleta; antes D84), D85 (tipografía y forma), D86 (Mini Marie) ·
**Reemplaza:** la paleta violeta D79 y el estilo «ladrillo y píxel» de `docs/DISENO-V2.md` (que se conserva como historia).
**Diseño completo y parámetros de cada etapa:** `docs/superpowers/specs/2026-11-16-interfaz-elegante-design.md`.

Este documento describe el sistema visual. Se aplica por etapas: lo marcado **E1** ya está hecho; lo
marcado E2, E3 o E4 es la regla que seguirán esas etapas.

## 1. Dirección visual

**En una frase:** una página limpia en crema, con texto negro, donde la tipografía es la protagonista;
rosa claro para lo que agrupa, rosa para lo que destaca, y amarillo y marrón como acentos medidos (D100).

- Mucho espacio negativo; nada compite con el título.
- Líneas de 1 px y radio de 4 px. Sin sombras. Degradado sutil solo en el hero y en la cabecera.
- Mini Marie sigue en todos sus sitios: es el único dibujo de píxel de la interfaz.
- Cada sección entra con el manifiesto del Inicio y su propio título (D101, `SectionIntro`).

## 2. Paleta y reparto (D100 de Martín, reemplaza a D96)

Martín fijó la paleta, el reparto y los roles el 2026-11-17. El reparto se mide por página, sin fotos,
lienzos WebGL ni mapas y sin el texto negro, y debe quedar a ±3 puntos.

| Token | Color | Reparto | Dónde va |
|---|---|---|---|
| `--c-crema` | #FCF0CF | 60 % | Fondo general, márgenes, espacio negativo |
| `--c-rosa-claro` | #F3D1DC | 18 % | Tarjetas, secciones alternas, testimonios, barras laterales y paneles; la franja del pie |
| `--c-rosa` | #F6A7C1 | 12 % | Banners destacados, badges, bordes activos, íconos ilustrativos, la cabecera (con degradado sutil) y la selección |
| `--c-amarillo` | #FDCF76 | 5 % | Botones secundarios, etiquetas de novedad, estrellas, subrayados clave, hover y foco |
| `--c-marron` | #B16E4B | 5 % | Títulos de alto impacto (solo sobre crema y grandes), botón CTA y banda del pie |
| `--c-negro` | #000000 | — | Texto del cuerpo (`--texto-cuerpo`, [PROPUESTA]) |

**Reglas que salen de los contrastes:** títulos marrón solo sobre crema y en texto grande (≥ 24 px, o
≥ 18,66 px en negrita); nunca marrón como texto sobre rosa claro, rosa ni amarillo. El CTA va en marrón
con texto crema de 19 px en Inter 700, que `ui.css` fuerza a todo `.ui-btn--primary` (texto grande, 3:1).
El pie es una franja rosa claro con texto negro y una banda marrón con el nombre del sitio en crema grande.
[PROPUESTA] El cuerpo sigue en negro porque marrón sobre crema (3,56) no llega a 4,5:1: está en
`--texto-cuerpo` para cambiarlo en una línea. Estados semánticos oscuros sobre crema (éxito #166534,
aviso #9A3412, error #991B1B), siempre con ícono y texto; en alto contraste vuelven a los claros
(#86EFAC, #FDBA74, #FCA5A5). Mini Marie nunca va sobre amarillo. Dentro de los mapas manda
`src/styles/map-palette.css` (D83): los avisos que caen sobre el mapa van en una caja crema.

Los colores se definen una sola vez, en `src/styles/tokens.css`. Los componentes usan los tokens
semánticos (`--bg-*`, `--text-*`, `--interactive-*`, `--border-*`), que en alto contraste pasan a blanco
y negro (`contrast.css`). Las clases `.tone-noche` y `.tone-papel` conservan su nombre: «noche» es ahora
la superficie crema y «papel» la rosa claro.

### Pares medidos (WCAG 2.x, reverificados en tokens.test.ts)

| Texto sobre fondo | Contraste | Uso |
|---|---|---|
| negro / crema | 18,50 | texto normal |
| negro / rosa claro | 14,96 | texto normal |
| negro / rosa | 11,22 | texto sobre la cabecera, banners, badges y la selección |
| negro / amarillo | 14,36 | texto de los botones secundarios y del hover |
| negro / marrón | 5,20 | texto normal sobre bandas marrones |
| marrón / crema | 3,56 | **solo títulos grandes, íconos y líneas** |
| crema / marrón | 3,56 | **solo texto grande**: CTA (19 px, Inter 700) y banda del pie |
| marrón / rosa claro · amarillo · rosa | 2,88 · 2,76 · 2,16 | **nunca como texto** |
| blanco / marrón | 4,04 | **solo texto grande** |
| éxito, aviso, error / crema | 6,28 · 6,44 · 7,32 | mensajes de estado |

**Líneas:** marrón sobre crema 3,56 (sirve de borde de un control); sobre rosa claro mide 2,88, así que
dentro de `.tone-papel` la línea fuerte pasa a negro y el marrón queda solo como separador decorativo.
**Foco:** doble anillo, amarillo por fuera y negro por dentro (≥ 3:1 sobre cualquier fondo de la paleta).

Las pruebas `src/styles/tokens.test.ts` fijan la paleta permitida, 18 pares de texto en modo normal y
en alto contraste, el foco doble y los pares de esta tabla. `src/styles/consumers.test.ts` mide lo que
los componentes combinan de verdad: cada fondo y texto escritos en una misma cadena de clases y cada
hover de `ui.css`, en los dos modos. Se añadió tras la revisión de la etapa 1, que encontró el ícono de
WhatsApp en ámbar sobre ámbar con todos los pares de tokens en verde.

## 3. Tipografía (D85)

| Rol | Fuente | Uso |
|---|---|---|
| Display | **Anton** 400 (condensada pesada) | `h1`, titulares, letrero de la bienvenida. Sin negrita falsa. |
| Elegante | **Cormorant Garamond** cursiva 500 y 600 | `h2`, `h3`, títulos de sección y de foto |
| Texto | **Soria** Regular (único estilo), D98 | Párrafos, listas, enlaces, menú, botones, etiquetas, formularios, tablas, HUD, controles de mapa, chat, pie, carga y créditos |
| Subtítulos | **Inter** 400–600 | Solo `h4`–`h6` (los títulos conservan su fuente) |
| Cifras | Soria (sin números tabulares) | Coordenadas, conteos y códigos |

- **Soria** (D98): de By Dani (Daniel Iglesias), 2016, versión 001.000, licencia **SIL OFL 1.1**,
  descargada de Font Squirrel (`fontsquirrel.com/fonts/soria`) por pedido de Martín. Se sirve en local:
  `barrio-frontend/public/assets/fonts/soria/soria.ttf` con su `OFL.txt`, `@font-face` en
  `src/styles/soria.css` con `font-display: swap`. Respaldo sin red: `Soria, Georgia, "Times New Roman",
  serif`. Un solo estilo: `font-synthesis: none`, peso 400, interlineado 1,6; ningún texto baja de 16 px fuera de los mapas; la
  jerarquía va con tamaño, espaciado y color. Los metadatos de la fuente traen además un texto de
  atribución («You must give appropriate credit…»): se cumple citando autor y licencia aquí y en el
  plan maestro.
- **Glifos que le faltan:** `¡ « » ‘ % ° - – — … ·` (comprobado sobre su tabla cmap; tiene 142). El
  navegador los toma de Georgia, carácter por carácter.

- **Chorus**, la display que pidió Martín, no está en el registro de paquetes (404 comprobado), así que
  se usa Anton (`@fontsource/anton`, OFL-1.1). Para usar Chorus a mano: dejar `Chorus.woff2` en
  `barrio-frontend/public/fonts/`, declarar su `@font-face` y anteponerla a Anton en `--ff-display`
  (`src/styles/scale.css`). No hay que cambiar nada más.
- Cormorant Garamond (`@fontsource/cormorant-garamond`, OFL-1.1) se eligió sobre Fraunces por su cursiva
  clásica y su contraste alto.
- Press Start 2P, Space Grotesk y JetBrains Mono ya no se cargan y se desinstalaron (D88).
- La escala fluida (`--step--1` a `--step-5`) y el control de tamaño de la barra de accesibilidad no cambian.

## 4. Espaciado, radios y sombras

- **Espaciado:** la misma escala de 4 a 96 px, con más aire entre bloques.
- **Radio:** 4 px en todo (`--r-sm`, `--r-md`, `--r-lg`). Los círculos (logo, avatar) son la excepción.
- **Líneas:** 1 px.
- **Sombras:** ninguna dura. Queda una sola sombra suave para lo que flota
  (`--shadow-deep: 0 8px 24px` negro al 18 %) y un aro ámbar de 1 px para lo activo (`--glow-active`).

## 5. Componentes

| Componente | Regla | Etapa |
|---|---|---|
| Botón principal | ámbar con texto noche; hover y activo en papel; foco doble | E1 (color) · E2 (forma) |
| Hover de los botones | el que cambia el fondo fija también el texto (secundario: ámbar con texto noche); el «ghost» se tiñe con un 14 % del color de su propio texto, así nunca lo iguala | **E1** |
| Bienvenida | velo noche, «HOLA» en display papel, botón principal, confeti de puntos ámbar, papel y acero | **E1** |
| Pantalla de carga | fondo noche, Mini Marie corriendo, suelo de 1 px con trazos ámbar, texto en mayúsculas espaciadas | **E1** |
| Logo y avatar del chat | Mini Marie en un círculo papel con línea de 1 px | **E1** |
| Header | fijo, 64 px: logo, nombre, repetir bienvenida, cuenta, idioma y «Menú». Bajo 640 px los tres controles van dentro del menú. Rosa sobre secciones crema y crema sobre las rosa claro (D96) | **E2** · D96 |
| Menú desplegable | panel a todo el ancho con las rutas de `lib/navigation.ts` y las 14 categorías; foco atrapado, Escape, cierre al navegar; página activa subrayada | **E2** |
| Tono | `.tone-papel` / `.tone-noche` reescopan texto y líneas; el header toma el tono de la sección que pasa bajo él (`data-tone`) y puede flotar (`data-header-float`). Solo flota sobre fondos lisos: en el Inicio, los capítulos 1 y 4; sobre fotos o mapas va sólido (D92) | **E2** · E3 |
| Superficies | `.ui-card` (noche + línea), `.ui-card--paper`, `.ui-panel` (flotantes), `.ui-eyebrow`, `.ui-prose`, `.ui-rule` | **E2** |
| Encabezado de página | banda amarilla de resalte (D96) con regla de 1 px, etiqueta en versalitas, `h1` en display y descripción en serif cursiva | **E2** · D96 |
| Botones y campos | primario rosa con texto negro; secundario de contorno; ghost con tinte del propio texto; campos rosa claro con caja de 1 px | **E2** · D96 |
| Pie | dos bandas a todo el ancho: rosa (contacto, perfil, preguntas) y marrón (módulos, ubicación, créditos); texto negro | **E2** · D96 |
| Inicio en 4 capítulos | manifiesto, vuelo entre fotos, maqueta a pantalla completa y reel de los 14 módulos; 11 pantallas (5 con movimiento reducido). Detalle en el diseño, §6, y en `INFORME_E3_interfaz_elegante.md` | **E3** |
| Marcadores de mapa | MapLibre los coloca con `position: absolute`; `.maplibregl-marker.map-marker` lo asegura sea cual sea el orden de carga de las hojas (D93) | **E3** |
| Galería | ver el diseño, §7 | E4 |

Desde la etapa 2 ningún componente usa las clases del estilo anterior (`brick-*`, `px-corners`, `band-*`,
`pixel-*`, `glass`); lo vigila `src/styles/legacy.test.ts`. Sus hojas siguen en disco, sin importarse.

## 6. Movimiento

- **Solo `transform` y `opacity`.**
- **Movimiento reducido** (sistema o barra de accesibilidad): poses fijas y fundidos cortos; no se pierde contenido.
- Mini Marie anima con `steps()` sobre una tira de cuadros: el paso entre cuadros es un número entero de píxeles.

## 7. Accesibilidad

- **Alto contraste:** blanco y negro, con bordes sólidos. Es una ayuda que pide el visitante y manda sobre la paleta.
- **Foco doble:** ámbar por fuera y noche por dentro; se distingue sobre noche, papel y ámbar (≥ 3:1).
- **Destino táctil:** al menos 44 × 44 px. **El color nunca va solo:** cada estado lleva texto o ícono.

## 8. Mini Marie (D86)

Sus dibujos no siguen una rejilla de píxel regular (medido: 10–20 % de bordes alineados, frente a 6–9 % al
azar), así que la «escala entera» se resuelve con **tamaños fijos**: cada secuencia se genera una vez en
sus tamaños de uso, con celdas de ancho entero, y se muestra sin escalar. Nunca un tamaño intermedio.

| Sitio | Tamaño en pantalla | Recursos (1× · 2× · 4×) |
|---|---|---|
| Bienvenida (8 asomadas) | 160 px de alto; 80 px si la pantalla mide menos de 640 px | `wave_160` · `wave_320` · `wave_640`; `wave_80` · `wave_160` · `wave_320` |
| Pantalla de carga | 420 px; 210 px si la pantalla mide menos de 640 × 700 | `run_420`; `run_210` · `run_420` |
| Sentada | 48 px | `sit_48` · `sit_96` · `sit_192` |
| Avatar del chat | 80 px dentro de un círculo de 44 o 48 px | `wave_80` · `wave_160` · `wave_320` |
| Perfil de la creadora (D88) | 140 px de alto (64 px de ancho), de pie | `idle_140` · `idle_280` · `idle_560` |
| Logo | 32 px; 48 px desde 640 px de ancho (el círculo mide 34 o 50 px: la línea va por fuera) | `marie-logo-32` · `-64` · `-96`; `marie-logo-48` · `-96` |

- **Recurso según la pantalla:** `<picture>` elige el doble exacto por encima de 1× y el cuádruple por encima
  de 2×. No se usa `srcset`: a 125 % de escala (muy común en Windows) el navegador se quedaba con el
  recurso pequeño y lo estiraba.
- **`image-rendering: pixelated`** solo a 1× y 2×, donde un píxel del dibujo cae en píxeles enteros de
  pantalla. Con escalas intermedias y en las 4 asomadas giradas a 45° suaviza el navegador.
- **Cajas en px, no en rem:** el control de tamaño de letra no escala a Mini Marie (el logo llegó a
  pintarse a 58 px con la letra al 125 %; corregido en la revisión de la etapa 1).
- **Escalas intermedias, medido** (animación en marcha, Edge): a 125 % y 150 % la nitidez no cambia entre
  cuadros y no se cuela el cuadro vecino; a 175 % asoma un hilo tenue de 8 px en un cuadro de la sentada.
  Si hiciera falta: celdas a múltiplos de 4 px (41 → 44, 98 → 100, 29 → 32).
- **Peso:** WebP al 90 %. Medido: a 4 aumentos se ve igual que sin pérdida y pesa 3,8 veces menos. Las 9
  tiras suman 651 KB y cada pantalla descarga solo la que necesita.
- **Dónde se sienta (D88, pedido de Martín):** sobre el borde superior del recuadro del mapa 3D, a 12 px
  de su esquina derecha. El asiento (60 % de su alto) queda en el borde: 29 px de cuerpo por encima y
  19 px de piernas hacia el mapa. Se ve sin desplazar la página. Anula el supuesto de la repisa inferior.
- **Sin parpadeo:** la sentada usa 7 de los 8 cuadros del dibujo; el tercero viene corrido en
  «Mini marie sentada.jpeg» y el generador lo salta, sin tocar el original.
- **Scripts:** `node scripts/build_sprite_scales.mjs` (tiras) y `node scripts/build_brand_assets.mjs` (logo y
  favicon). Leen las copias de `public/assets/avatar`; `"MINI MARIE.png"` no se toca.

## 9. Mapas y escena 3D

Sin cambios: el tema de `styles/map-palette.css` (D83) con sus 8 colores medidos. Solo se armonizan con la
paleta nueva los paneles, controles y bordes que los rodean (E2 y E3).
