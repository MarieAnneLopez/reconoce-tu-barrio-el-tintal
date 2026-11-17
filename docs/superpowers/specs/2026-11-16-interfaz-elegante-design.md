# Interfaz elegante — diseño breve (2026-11-16)

Decisiones tomadas por Martín en la sesión de brainstorming; este documento las fija para planear
y ejecutar. **Supuesto** = propuesta de Claude que Martín pidió aplicar y anotar como tal.
Solo se trabaja en `barrio-frontend/`. Nunca `git push`. Ningún archivo de código pasa de 100 líneas.

## 1. Objetivo

Interfaz extremadamente limpia, minimalista, elegante y profesional. El Inicio es una película de
scroll a pantalla completa en 4 capítulos. La barra lateral pasa a ser un menú desplegable que se
adapta al fondo. Mini Marie no se quita de ningún sitio y se adapta **primero** (etapa 1).

## 2. Punto de partida (verificado en el código el 2026-11-16)

- Mapas: `styles/map-palette.css` es el tema único de los mapas. Desde el commit `c307f4e` (D83)
  son 8 colores medidos en la referencia (azules noche/acero y verdes), no la paleta verde de D82.
  **Se conserva tal cual**; solo se armonizan paneles, controles y bordes alrededor.
- La maqueta 3D vive en el shell (`ScenePortal` + `three/sceneHost.ts`): un solo lienzo que cada
  sección acoge en un recuadro. El Inicio nuevo la reutiliza; no se duplica el canvas.
- Fuentes instaladas: Inter, Space Grotesk, JetBrains Mono y Press Start 2P (@fontsource 5.3.0).
- Mini Marie: tiras de cuadros `wave` (7 × 327×640), `run` (8 × 196×420) y `sit` (8 × 116×192).
  Medido: los dibujos **no** siguen una rejilla de píxel regular (10–20 % de bordes alineados
  frente a 6–9 % al azar), así que no existe un «píxel nativo» al que escalar.

## 3. Sistema visual

### Paleta (D84) y reparto por área visible (supuesto)

| Token | Hex | Reparto | Uso |
|---|---|---|---|
| noche | `#283845` | ~55 % | fondo de página, superficies oscuras, texto sobre papel y sobre ámbar |
| papel | `#e8d8c9` | ~30 % | superficies claras, texto sobre noche |
| ámbar | `#ffa649` | ~10 % | acento: líneas, botón primario, foco, hover |
| acero | `#4b607f` | ~4 % | bordes de 1 px, estados secundarios, nunca texto sobre noche |
| naranja | `#f3701e` | ≤ 1 % | puntos e indicadores minúsculos |

Contrastes WCAG medidos por script (se fijan en `tokens.test.ts`): papel/noche 8,67 · ámbar/noche
6,20 · naranja/noche 4,10 (solo texto grande o detalle) · acero/noche 1,88 (solo decoración) ·
acero/papel 4,60 · noche/ámbar 6,20 · ámbar/papel 1,40 (nunca texto). Texto atenuado con alfa:
papel 90 % = 7,35 · papel 76 % ≥ 5,3 · noche 90 % sobre papel = 6,75 · noche 80 % = 5,22.
Estados semánticos (se conservan): `#86efac` 8,59 · `#fdba74` 7,15 · `#fca5a5` 6,35 sobre noche.
Violeta D79 fuera. Amarillo solo en el sprite. Foco doble: ámbar por fuera, noche por dentro.

### Tipografía (D85)

- Display: **Anton** (`@fontsource/anton`, OFL-1.1). Chorus no existe en el registro de paquetes
  (404 comprobado). Para usarla a mano: dejar `Chorus.woff2` en `public/fonts/` y declarar su
  `@font-face` antes de Anton en `--ff-display`; no cambia nada más.
- Elegante: **Cormorant Garamond** cursiva 500/600 (`@fontsource/cormorant-garamond`, OFL-1.1)
  para títulos de sección y de foto. Elegida sobre Fraunces por su cursiva clásica y contraste alto.
- Interfaz: Inter fina (300 base, 400–600 para énfasis).
- Press Start 2P, Space Grotesk y JetBrains Mono salen de los estilos (siguen instaladas).
- Forma: radio 4 px, líneas de 1 px, sin sombras duras, sin esquinas de píxel, mucho espacio negativo.

## 4. Shell (etapa 2)

Header mínimo: logo sonriente + nombre, botón «Menú», idioma, cuenta y repetir bienvenida. Menú en
panel con las rutas y el orden de `lib/navigation.ts` (es/en): `aria-expanded`/`aria-controls`,
foco atrapado, Escape cierra, se cierra al navegar, sin animación con movimiento reducido.
Tono: en el Inicio el header y el menú son transparentes y cambian claro/oscuro según el capítulo
visible (IntersectionObserver que fija `data-tone`); en las demás páginas, noche o papel según la
página. Se conservan AccessibilityRail, ChatWidget, WhatsAppFloat, Footer, LoginModal y los roles.
`pixel.css`, `brick.css` y `bands.css` dejan de importarse (no se borran: se listan en el informe).

## 5. Mini Marie (etapa 1)

Se conserva en: las 8 asomadas de la bienvenida, SittingMarie, el logo, LoadingScreen y el avatar
del chat. `welcomePeeks.ts` no cambia: ranuras, `ROTATION`, `VISIBLE = 0.46` y posiciones.

- **Escala entera (supuesto de implementación):** como no hay rejilla de píxel, cada secuencia se
  sirve en tamaños fijos generados una vez (`wave` 80/160/320/640, `run` 210/420, `sit` 48/96/192)
  con celdas de ancho entero; en pantalla va 1:1 (o 2:1 exacto en pantallas 2×), con
  `image-rendering: pixelated`. Nunca un tamaño intermedio ni `clamp()`.
- Tamaños: asomadas 160 px (80 px si el ancho es < 640 px); loader 420 px (210 px en pantallas
  pequeñas); sentada 48 px; avatar del chat 80 px dentro de un círculo de 48 px; logo 32/48 px.
- Sin sombras duras (como máximo `drop-shadow` suave). Loader en noche + ámbar. Transiciones solo
  con transform/opacity. Se reutilizan las secuencias existentes.
- **Repisa (supuesto):** SittingMarie se sienta sobre el borde inferior de la maqueta (capítulo 3
  del Inicio y Mapa 3D), en una repisa mínima: línea ámbar de 1 px y 72 px de ancho, a
  `clamp(96px, 22vw, 320px)` del borde derecho. El asiento (60 % de su altura) queda en la línea:
  el cuerpo sobre la maqueta y las piernas colgando por debajo. No tapa controles.

## 6. Inicio: película de 4 capítulos (etapa 3)

Scroll nativo siempre: ningún `preventDefault` en rueda ni toque, ni bloqueo del body. Un rAF por
efecto, pausado fuera de pantalla y con el documento oculto; limpieza completa al desmontar. Máximo
2 contextos WebGL vivos (maqueta + reel), en pausa el que no se ve. Enlace discreto «Créditos»
fuera de la escena (los créditos ya están en `carouselCredits.json`).

**Altura total: 1100 svh** = 100 (cap. 1) + 500 (cap. 2, fija por su fórmula con N = 4) + 200
(cap. 3: una pantalla de permanencia y otra de paso) + 300 (cap. 4: una pantalla fija y 200 svh de
recorrido para 14 módulos). Con movimiento reducido el cap. 2 y el 4 no tienen recorrido.

### Cap. 1 — Manifiesto elástico
- Texto (supuesto): «RECONOCE TU» / «BARRIO» / «EL TINTAL.» en 3 líneas; sangría línea 2 = 33 %,
  línea 3 = 6 % (móvil 26 % / 4 %). Display a 16,5 % del ancho de la sección (móvil 16,2 %),
  interlineado 0,96 (móvil 1,16), tracking −0,035em. 5 palabras, cada una en una máscara
  `overflow:hidden` con padding 0,02em horizontal y 0,08em abajo. Un `h1` con nombre accesible
  «Reconoce tu barrio. El Tintal.» y fragmentos `aria-hidden`.
- Palabra i, t en segundos: `raw = clamp((t − 0,088·i)/0,875, 0, 1)`;
  `E(raw) = 0` en 0, `1` en 1, si no `2^(−10·raw)·sin((raw − 0,72/4)·2π/0,72) + 1`; `p = E(raw)` sin
  limitar (el rebote se queda). `transform: translate(40(1−p)%, −10(1−p)%) scale(0,85+0,15p,
  0,1+0,9p) rotate(8(1−p)deg)`, origen arriba-izquierda. Opacidad `clamp(5·raw, 0, 1)`.
- Fondo noche; papel se revela desde abajo-derecha: `b = 1 − (1 − clamp(t/1,1, 0, 1))³`,
  `clip-path: ellipse((20+130b)% (150b)% at 100% 100%)`. Todo termina antes de 1,5 s, se dispara
  una vez al entrar en vista (replay local opcional). Arriba: logo y `t('app.location')`; abajo:
  `t('app.tagline')` y una flecha grande. El texto nunca queda noche sobre noche. El rebote no se
  recorta a 390 ni a 1440. Movimiento reducido: estado final inmediato.

### Cap. 2 — Vuelo entre fotos
- Fotos reales de `carouselPhotos`, en su orden, N = 4 (mínimo 3), desde `public/assets`. Fondo
  estático: una de ellas con `brightness(.62)`, fuera del subárbol de cámara. Solo fotografía.
- Sección `relative` de `(N+1)·100svh`; hijo `sticky top:0` de `100svh` con `overflow:hidden`
  (ningún ancestro con overflow). Cámara `absolute inset:0`, `perspective:30px`, origen 50 % 50 %.
  Dentro, espacio de imágenes `left:5%`, `width:90%`, `height:100%`, `preserve-3d` (sin opacity,
  filter ni clip). Tarjetas `absolute top:50%`, ancho 45 %, pares a la izquierda e impares a la
  derecha, proporciones `[1.15, .82, 1.45, .82]` cíclicas, `object-fit:cover`, radio 4 px, sin
  sombra, `backface-visibility:hidden`.
- `clamp(t)=min(1,max(0,t))`; `smooth(t)=clamp(t)²(3−2·clamp(t))`.
  `D = outer.offsetHeight − sticky.clientHeight`; `p = D>0 ? clamp(−outer.top/D) : 0`;
  `cameraZ = 30 + 100·N·p`; espacio: `translate3d(0,0,cameraZ px)`. Tarjeta i (desde 0):
  `imageZ = −100(i+1)`; `translate3d(0,−50%,imageZ px)`; `z = cameraZ + imageZ`;
  `opacity = smooth((z+240)/100)·(1 − smooth((z−20)/8))`; `visibility:hidden` si `z ≥ 29` u
  `opacity ≤ .001`. Se recalcula todo cada vez (el scroll hacia arriba revierte exacto), sin easing
  ni autoplay. Scroll pasivo → un rAF pendiente como máximo; también resize, orientationchange y
  ResizeObserver. Imágenes decodificadas antes de mostrarse. Alt significativo; fondo con alt vacío.
- Movimiento reducido: sin recorrido, sin sticky, sin perspectiva: rejilla estática 2×2 sobre el fondo.

### Cap. 3 — Maqueta 3D a pantalla completa
Recuadro `sticky` de `100svh` sin marco, borde ni sombra, que acoge el lienzo de `ScenePortal`.
HeroHud sobrio (coordenadas, Recentrar/Pausar, ficha de lugar). La escena dibuja solo si se ve.
SittingMarie en la repisa del borde inferior. **Supuesto:** en el Inicio la rueda nunca acerca la
maqueta (desplaza la página); se acerca con Ctrl/⌘ + rueda o con dos dedos.

### Cap. 4 — Reel curvo de módulos
- Los 14 módulos en un único array editable. Cada textura es una portada tipográfica generada en
  canvas 2D (nombre + número, paleta nueva). Fondo papel con grano de puntos de 6 px. Titular en
  display parcialmente tapado por las tarjetas, con texto de `t('app.*')`. Única copy nueva: pista
  inferior «Desplaza o arrastra para explorar» (es/en). Sin leyendas, contadores ni flechas.
- Un canvas WebGL transparente con three directo (no r3f). Cámara: fov 65,7, z 8,1, near 0,1, far
  40. Plano 2,38 × 1,5771 con 48 × 24 segmentos. Curvado: `halfWidth = 1,19`;
  `angle = (x/halfWidth)·bend`; `radius = halfWidth/bend`; `x = sin(angle)·radius`;
  `z += (cos(angle) − 1)·radius`; bend 0,30 (hasta 0,42 con entrada rápida). Ondulación vertical
  0,006. Esquinas redondeadas por SDF con antialias y sombreado sutil de curvatura.
- `phase` = índice flotante amortiguado; `relative` envuelto a `[−N/2, N/2)`; `theta = relative·0,73`;
  `x = sin(theta)·trackRadius`; `y = relative·pitch` (`pitch = 0,52·escala`);
  `z = cos(theta)·trackDepth − 0,28`; `rotationY = atan2(trackDepth·sin(theta), trackRadius·cos(theta))`;
  `rotateX = −0,01·relative` más una inclinación leve por velocidad. Caras traseras ocultas.
  Tarjeta central ≈ 37 % del ancho en escritorio y 77 % en teléfono; se ven 3 a la vez en escritorio.
- `phase += (target − phase)(1 − e^(−13·dt))`, `dt ≤ 0,05 s`, impulso de rueda limitado. Arrastre
  horizontal a la izquierda o vertical hacia abajo avanza; al soltar asienta en el índice más
  cercano. Flechas = un módulo, Home = primero. Se libera la captura de puntero al cancelar.
  **Supuestos:** clic o Enter en la tarjeta central navega a la ruta del módulo; la rueda no se
  intercepta: un oyente pasivo suma impulso mientras el recorrido del capítulo convierte el scroll
  nativo en fase. Descripción accesible del canvas según el índice.
- Pausa con `document.hidden` e IntersectionObserver, sin acumular tiempo. Sin WebGL: rejilla
  estática accesible de enlaces. Movimiento reducido: sin movimiento autónomo; la navegación
  explícita responde al instante. Se liberan geometrías, materiales, texturas, observer y renderer.

## 7. Galería General (etapa 4)

- Las fotos existentes (cantidad, orden y etiquetas) en 3 columnas; cada foto es un `<button>` con
  marco 3:4; columnas de 24vw en escritorio. Fondo papel. Solo el encabezado «GALERÍA» en display
  gigante, blanco con `mix-blend-mode:difference`, sobre el borde inferior del escenario.
- Escenario `sticky` de 100vh en un recorrido de la altura de una columna. Por cuadro:
  `smooth += (scrollReal − smooth)(1 − (1 − 0,13)^(60·dt))`. La columna central sube con `smooth`;
  las laterales se anclan abajo y bajan lo mismo. Hover o foco: recorte a `scale(0,88, 0,95)` y la
  imagen a la inversa con un pequeño zoom.
- Abrir: 1400 ms con ease exponencial in-out. La foto va al centro a `min(62 % del alto, 86 % del
  ancho)`; las visibles pasan a una fila de miniaturas abajo con escalonado de 30 ms; las de fuera
  se desvanecen; el encabezado baja 300 % de su alto con `scaleY 4`; el título (serif cursiva)
  entra desde `translateY −100 %` y `scaleY 3` al 20 % de la línea de tiempo. Scroll bloqueado
  mientras está abierta. Volver o Escape reproducen lo mismo al revés y restauran geometría y
  scroll. Foco en Volver al abrir y de vuelta a la foto al cerrar. Solo transform y opacity.
- Móvil estrecho: 3 columnas, límite por ancho, miniaturas dentro del viewport. Resize con el
  detalle abierto: cierre inmediato y recálculo. Movimiento reducido: sin suavizado y estados
  inmediatos. Se cancelan rAF y oyentes al desmontar.

## 8. Etapas, verificación y paradas

| Etapa | Contenido | Entrega |
|---|---|---|
| E1 | Tokens, tipografía base y Mini Marie adaptada | informe en `docs/` + capturas, esperar «OK» |
| E2 | Shell: header, menú, footer, botones, tarjetas, formularios, modales, chat, WhatsApp | commits |
| E3 | Inicio de 4 capítulos | informe en `docs/`, esperar «OK» |
| E4 | Galería General y pulido de todas las páginas | informe en `docs/`, esperar «OK» |

Cada etapa tiene su propio plan en `docs/superpowers/plans/`. Verificación de cada tarea:
`npm run lint`, `npm run typecheck`, `npx vitest run`, `node scripts/check_line_length.mjs`,
`npm run build`; por etapa, Playwright + axe a 390/768/1440 y con `prefers-reduced-motion`.
Parada si una verificación falla 3 veces seguidas o dos fuentes se contradicen.
Se pregunta antes de borrar archivos, agregar dependencias que no sean tipografías `@fontsource`,
cambiar esquemas o hacer red fuera de lo permitido.

## 9. Fuera de alcance

Backend, datos y módulos CRUD, datos IGAC, fotos de lugares (H35) y la versión demo del 30 %.

## 10. Criterios de éxito

Verificación completa con salida pegada · contraste ≥ 4,5:1 en texto normal y axe sin
violaciones críticas a 390/768/1440 · movimiento reducido funcional en los 4 capítulos y en la
Galería · sin fugas de rAF ni oyentes y sin desborde horizontal · Mini Marie visible en sus 5
lugares · ningún archivo de código de más de 100 líneas · sin violeta, píxel ni sombras duras.
