# Diseño v2: «Ladrillo y píxel»

**Hito:** H32 (mejora B) · **Decisión:** D68 · **Reemplaza:** la paleta azul de la v1 (PROMPT_MAESTRO §10, D3)

## 1. Dirección visual

**En una frase:** el ladrillo a la vista de los conjuntos de vivienda de Kennedy y El Tintal (se ve en las fotos de la Galería) pone el color de fondo, y la cuadrícula de píxeles de Mini Marie pone las esquinas escalonadas, las sombras duras y las etiquetas; el resultado es una interfaz de barrio, cálida y hecha a mano, que no parece plantilla.

Rasgos que la hacen propia:
- **Aparejo de ladrillo:** las bandas grandes (inicio, pie de página) llevan un patrón suave de hiladas, hecho con CSS (sin imágenes).
- **Esquinas de píxel:** las fotos tienen esquinas escalonadas de 4 px; tarjetas y botones llevan esquinas casi rectas (2 px) con sombra dura.
- **Sombras duras:** desplazadas 4 px y sin desenfoque, como ladrillos apilados.
- **Mini Marie como guía:** las etiquetas superiores de cada sección usan la letra de píxel, la misma voz visual del personaje.

## 2. Paleta y proporción (D79, reemplaza a D68)

Como proporción de la superficie de interfaz (fondos, bandas, tarjetas y botones; no cuentan fotos, mapas ni la maqueta 3D):

| Token primitivo | Color | Objetivo | Medido (Inicio 1440×900) | Dónde va |
|---|---|---|---|---|
| `--palette-principal` | #AF50E5 | ~40 % | 37,1 % | Fondo de las páginas y del menú lateral; marcos. **Sin texto normal encima.** |
| `--palette-lavanda` | #E2CEF6 | ~30 % | 24,7 % | Placas de título, bandas de texto (`.band-text`), botones, ítem activo |
| `--palette-oscuro` | #5B0672 | ~15 % | 16,8 % | Encabezado, tarjetas, ventanas, chat y pie |
| `--palette-intenso` | #8A0BD2 | ~10 % | 15,8 % | Banda de cada ítem del menú lateral |
| `--palette-claro` | #D980F9 | ~5 % | 5,7 % | Barra de accesibilidad, campos, botón al pasar el puntero, insignias |

Blanco y negro solo como texto o ícono, no como superficie. Además, colores semánticos de estado (sobre oscuro). Los colores se definen una sola vez, en `src/styles/tokens.css`; el alto contraste sigue en blanco y negro (`contrast.css`).

### Pares de texto (medidos, WCAG 2.x)

| Texto sobre fondo | Contraste | Uso |
|---|---|---|
| blanco / oscuro | 12,25 | texto normal |
| blanco al 90 % / oscuro | 10,07 | texto secundario |
| blanco / intenso | 6,86 | texto normal (menú) |
| oscuro / lavanda | 8,40 | texto normal |
| oscuro / claro | 4,90 | texto normal |
| claro / oscuro | 4,90 | texto normal (realces en tarjetas) |
| lavanda / intenso | 4,70 | permitido (no usado) |
| negro / principal | 5,10 | permitido (no usado) |
| blanco / principal | 4,12 | **solo texto grande (≥ 24 px o ≥ 18,66 px en negrita), íconos y bordes** |

**Prohibidos para texto normal:** lavanda/principal (2,82), oscuro/principal (2,98), claro/principal (1,65), intenso/principal (1,67), blanco/claro (2,50), blanco/lavanda (1,46) y principal como color de texto (4,12 sobre blanco; 2,82 sobre lavanda). Consecuencia: el texto suelto de las páginas va en `.band-text` (lavanda con texto oscuro) y cada ítem del menú en su banda intensa (`src/styles/bands.css`). La prueba `tokens.test.ts` mide cada par en cada cambio.

## 3. Tipografía

Se usan las fuentes que ya tiene el proyecto (`@fontsource`, sin dependencias nuevas):

| Rol | Fuente | Uso |
|---|---|---|
| Display | Space Grotesk 700, tracking −0,02 em | Títulos y cifras grandes |
| Texto | Inter 400/500/600 | Párrafos, controles y menú |
| Píxel | Press Start 2P, 0,75 rem, en mayúsculas | Etiquetas de sección («eyebrows»); nunca en párrafos |
| Datos | JetBrains Mono 400 | Créditos, fuentes, coordenadas y códigos |

**Escala fluida:** `--step--1` 13–14 px, `--step-0` 16–17 px, `--step-1` 19–22, `--step-2` 23–30, `--step-3` 28–42, `--step-4` 34–56 y `--step-5` 44–72 (portada). El interlineado es 1,5 en el texto y 1,05–1,15 en los títulos. La escala sigue ligada a `--font-scale` (de 90 a 125 %).

## 4. Espaciado, radios y sombras

- **Espaciado:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 px. Los márgenes laterales son de 16 px en móvil, 40 px en tableta y 56 px en escritorio.
- **Radios:** 2 / 4 / 8 px. Las fotos usan además `.px-corners`, unas esquinas escalonadas de 4 px hechas con `clip-path`. No se usan en tarjetas ni botones, porque `clip-path` también recorta la sombra dura.
- **Sombras:** `--shadow-brick: 4px 4px 0 vino` sobre el ladrillo y `--shadow-deep: 4px 4px 0 negro al 35 %` sobre el vino. Ninguna lleva desenfoque ni se anima.

## 5. Componentes

| Componente | Reposo | Hover (solo con puntero fino) | Activo | Foco | Deshabilitado / cargando |
|---|---|---|---|---|---|
| Botón principal | rosa, texto vino, sombra de ladrillo | mezcla rosa-piedra | se hunde 2 px (solo `transform`) y la sombra baja a 2 px | anillo doble: blanco 2 px y vino 4 px | opacidad 0,45 / spinner y `aria-busy` |
| Botón secundario | piedra, texto vino, borde vino | rosa | igual que el principal | igual | igual |
| Botón fantasma | transparente, texto blanco | fondo blanco al 10 % | igual | igual | igual |
| Tarjeta | vino, texto blanco, esquinas de píxel, sombra dura | se eleva 2 px (`transform`) si es enlace | — | anillo doble | — |
| Campo | piedra, texto vino, borde vino de 2 px | borde negro al 60 % | — | anillo doble | opacidad 0,45 |
| Ítem del menú | texto blanco sobre vino | fondo blanco al 10 % | activo: rosa con texto vino y marca de píxel | anillo doble | — |
| Etiqueta Oficial / Prensa / Por verificar / Dato de ejemplo | piedra o rosa, texto vino, con ícono y texto (nunca solo color) | — | — | — | — |
| Aviso de error o de éxito | panel vino, ícono y texto en tono claro del estado | — | — | — | — |

**Estados semánticos**, en tonos claros para leerse sobre vino: éxito #86EFAC, aviso #FDBA74 y error #FCA5A5. No se usa amarillo: sigue reservado al sprite.

## 6. Movimiento

- **Solo `transform` y `opacity`.** Las duraciones van de 120 a 480 ms. Las curvas son `--ease-emphasis` para entradas y `--ease-drawer` para el cajón móvil.
- **Animaciones de entrada:** las tarjetas y los hitos entran con un escalonado de 40–60 ms (GSAP ScrollTrigger, una sola vez).
- **Botones:** al pulsarlos se hunden 2 px, como un ladrillo que se acomoda.
- **Movimiento reducido** (sistema o barra de accesibilidad): sin desplazamientos ni escalas; quedan fundidos cortos de opacidad.

## 7. Responsive

| Ancho | Navegación | Contenido |
|---|---|---|
| 390 px | menú en cajón, encabezado de 64 px | una columna, márgenes de 16 px, botones de al menos 44 px de alto |
| 768 px | menú lateral fijo y plegable | dos columnas en tarjetas y galería |
| 1440 px | menú lateral de 260 px y barra de accesibilidad | contenido de 1200 px como máximo, tres columnas |

## 8. Accesibilidad

- **Alto contraste:** sigue siendo negro y blanco, con bordes sólidos. Es una ayuda que pide el visitante y manda sobre la paleta.
- **Foco visible en cualquier fondo:** el anillo doble blanco + vino mide 5,45 sobre ladrillo y 11,44 sobre vino; sobre rosa, el anillo vino mide 5,16.
- **Destino táctil:** al menos 44 × 44 px.
- **El color nunca va solo:** cada etiqueta lleva texto y cada estado lleva ícono.

## 9. Mapas y escena 3D

No cuentan para la proporción, pero usan la misma familia de colores:
- **suelo:** piedra;
- **manzanas:** vino al 70 %;
- **vías:** blanco;
- **parques:** rosa al 60 %;
- **polígono de El Tintal:** borde de ladrillo;
- **marcadores:** emoji sobre una placa piedra con borde vino.
