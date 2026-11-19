# Informe: recursos, paleta, Soria y pantalla de carga

**Para:** Martín · **Fecha:** 2026-11-17 · **Rama:** `interfaz-elegante` de `barrio-frontend` (sin push)
**Decisiones:** D95 (recursos), D96 (paleta), D97 (carga), D98 (Soria) en `PLAN_MAESTRO.md`.

| Commit | Qué |
|---|---|
| `1f08555` | Recursos: Playwright con un proceso y servidor propio que se cierra; Vitest con 2 procesos |
| `114c006` | Carga: Mini Marie cruza la pantalla hacia la derecha sin patinar |
| `1cf9b72` | Paleta D96: crema, rosa claro, rosa, amarillo y marrón con texto negro |
| `81de700` | Tipografía D98: Soria para el texto que no es título |
| `bb0d688` | Paleta D96: reparto de color (header rosa, encabezado amarillo, pie marrón) |
| `9fe7d1e` | Paleta D96: el pie en dos bandas, rosa arriba y marrón abajo |
| `949b3a8` | Soria: ningún texto por debajo de 16 px fuera de los mapas |

## 1. Recursos (paso 0)

| | RAM libre | Navegadores de Playwright | Servidores del proyecto |
|---|---|---|---|
| Antes del paso 0 | 3.484 MB de 16.011 | Edge de Playwright abierto | vista previa en 4176, API en 8000 |
| Después del paso 0 | 3.613 MB | 0 | ninguno (4173–4176, 5173 y 8000 libres) |
| Al cerrar este tramo | **6.618 MB** | 0 | ninguno (4173, 4179, 5173, 5179 y 8000 libres) |

Cerré lo que había abierto yo: la vista previa del 4176 (PID 20404 y su lanzador 13032), el Edge de
Playwright y la API local. Los procesos que no inicié se listaron y no se cerraron. Al cerrar este tramo
quedan 5 procesos `node`, ninguno mío: servidores MCP de Playwright, un runtime de Codex y dos de Node sin
relación con el proyecto. Docker Desktop no está corriendo, así que esta vez no arranqué la base de datos:
las capturas leyeron los datos del sitio publicado (solo peticiones GET).

Configuración que evita que vuelva a pasar (D95): `workers: 1`, headless, `reuseExistingServer: false`,
`e2e/globalTeardown.ts` comprueba que el puerto quedó libre y cada spec cierra su página; Vitest con
`maxWorkers: 2`. La regla de 1 navegador y 2 páginas está en `CLAUDE.md`.

## 2. Pantalla de carga (D97)

**Diagnóstico, antes de corregir.** Los 8 cuadros de «corriendo» miran a la derecha (leídos uno por uno).
Ella no se desplazaba: corría en su sitio, 8 cuadros a 90 ms (720 ms por ciclo), mientras el suelo pasaba
hacia la izquierda a 89 px/s. Ese suelo iba entre 2,5 y 5 veces más lento que el retroceso de su pie
apoyado, así que el pie patinaba contra él y el ojo leía que ella iba hacia atrás.

**Corrección.** Avanza hacia la derecha con `translate3d` en pasos enteros, uno por cuadro (`steps()`), así
cuadro y desplazamiento cambian juntos. **10 fps** (dentro de 8–12) y **38 px por cuadro** a 420 px de alto
(19 a 210), que es lo que retrocede el pie apoyado en el dibujo. Con el paso fijado así, el pie no patina a
ningún fps; los fps solo deciden la velocidad: a 10 fps son 380 px/s y cruza 1440 px en unos 4 s. Elegí 10,
el centro del rango, sin comparar en pantalla contra 8 y 12. Entra entera por la izquierda y sale entera por la derecha, en bucle. El suelo es una
línea marrón quieta de 1 px sobre crema. Con movimiento reducido: un cuadro de pie, quieta y centrada.
Escala entera y `image-rendering: pixelated` (de antes, D86). Una sola animación CSS; la salida conserva su
fundido.

**Evidencia.** `src/components/avatar/loadingRun.test.ts` fija sentido +1, mirada a la derecha, 10 fps y el
paso. Secuencia de 6 capturas cada 300 ms en Edge: x = −196, −44, 108, 222, 336, 488 px (crece en todas).
Revisadas con la vista: mira a la derecha en las seis y se distingue bien sobre la crema.
Capturas: `docs/capturas/d96/carga-1.png` … `carga-6.png`.

## 3. Paleta (D96)

Roles: crema de fondo y tarjetas; rosa claro en paneles secundarios, tarjetas de lugares y hover; rosa en el
botón primario, la selección y el header; amarillo en el foco y en la banda del encabezado de página; marrón
en líneas, íconos y el pie. Todo el texto en negro. Sin sombras ni degradados. Ningún estilo usa ya los
tokens de la paleta anterior (búsqueda: 0 coincidencias de `--c-noche|papel|ambar|acero|naranja`).

**Contrastes reverificados** (script en `tokens.test.ts`; coinciden con tus cálculos):

| Par | Contraste | Uso |
|---|---|---|
| negro / crema | 18,50 | texto normal |
| negro / rosa claro | 14,96 | texto normal |
| negro / amarillo | 14,36 | encabezado de página |
| negro / rosa | 11,22 | botón primario, header |
| negro / marrón | 5,20 | pie |
| marrón / crema | 3,56 | solo texto grande, íconos y líneas |
| marrón / rosa claro | 2,88 | **no llega a 3:1**: ahí las líneas de los controles van en negro |
| blanco / marrón | 4,04 | solo texto grande |
| éxito, aviso, error / crema | 6,28 · 6,44 · 7,32 | estados, siempre con ícono y texto |

En alto contraste los estados vuelven a los tonos claros sobre negro.

**Mini Marie:** nunca va sobre amarillo. Logo y chat sobre rosa o crema; la sentada del Mapa 3D queda sobre
crema, debajo de la banda amarilla; la del perfil, sobre la tarjeta crema dentro del pie marrón. En todas
las capturas se distingue (vestido amarillo con contorno oscuro).

**Arreglo de paso.** El aviso «No se pudo cargar el mapa base» quedaba negro sobre el fondo oscuro del mapa
(tema D83, que no se toca): ahora va en una caja crema.

### Reparto medido

Por píxeles de la captura, asignando cada píxel al color de la paleta más cercano (distancia < 30 por
canal); «otros» son fotos, mapas y antialias. Página completa, con el pie.

Tras tu «sí, ajústalo» hubo dos ajustes: (1) header rosa, encabezado de página en banda amarilla, pie
marrón y tarjetas de lugares en rosa claro; (2) el pie en dos bandas, rosa arriba (contacto, perfil y
preguntas) y marrón abajo (módulos, ubicación y créditos), porque el marrón pesaba 28–38 % en páginas
cortas y el rosa no pasaba del 3 %.

| Página (ancho) | crema | rosa claro | rosa | amarillo | marrón |
|---|---|---|---|---|---|
| Módulo (1440) | 33,6 | 10,3 | 17,9 | 6,9 | 16,1 |
| Módulo (390) | 22,4 | 19,7 | 15,7 | 5,9 | 23,6 |
| Historia (1440) | 78,2 | 3,1 | 6,9 | 2,9 | 6,3 |
| Mapa 3D (1440) | 42,3 | 2,1 | 16,7 | 6,9 | 15,4 |
| Mapa 3D (390) | 44,0 | 3,6 | 15,1 | 5,0 | 23,4 |
| Objetivo | 50 | 12,5 | 12,5 | 12,5 | 12,5 |

Mucho más cerca que al principio (acentos < 3 %), pero no dentro de ±4 en todas las páginas: el amarillo
se queda en 3–7 % (solo es la banda del encabezado y el foco) y el reparto depende de lo larga que sea cada
página (Historia es casi toda texto sobre crema). El Inicio va aparte, porque cada capítulo es una pantalla
completa con su propio fondo.

## 4. Tipografía (D98)

**Soria** de By Dani (Daniel Iglesias), 2016, v001.000, SIL OFL 1.1, descargada de Font Squirrel por tu
pedido («búscalo en internet»). Autor comprobado en la tabla `name` de la fuente («Bydani»). Se sirve en
local (`public/assets/fonts/soria/soria.ttf` + `OFL.txt`), `font-display: swap`, respaldo
`Soria, Georgia, "Times New Roman", serif`. `font-synthesis: none`, peso 400, interlineado 1,6, cuerpo de
16–17 px. Los títulos no cambian: `h1` en Anton, `h2`–`h3` en Cormorant Garamond cursiva y `h4`–`h6` en
Inter. Pasan a Soria párrafos, menú, botones, etiquetas, formularios, tablas, HUD, controles de mapa, chat,
pie, la pantalla de carga y la pista del reel.

**Glifos que faltan** (cmap de 142): `¡ « » ‘ % ° - – — … ·`. Los pone Georgia, carácter por carácter: el
guion y el «%» se verán en otra letra.

**Licencia, aviso.** Font Squirrel la publica con OFL 1.1 e incluye su texto, pero los metadatos de la fuente
traen además un texto de atribución del estilo CC BY («You must give appropriate credit…»). Las dos permiten
usarla en la web; se cumplen ambas citando autor, fuente y licencia en `DISENO-V3.md` y en el plan maestro.

**Legibilidad.** Las etiquetas de 12–14 px se leían mal (Soria es de aire display, con trazos finos). Por tu
«sí», ningún texto baja de 16 px fuera de los mapas: `--step--1` y `--text-step--2` valen 1rem, y las
etiquetas superiores, la pista del reel, la vista previa del mapa, la insignia de verificado, el HUD, la
leyenda y la barra de accesibilidad usan ese tamaño. La etiqueta de los marcadores es del tema del mapa
(D83) y sigue en 12 px. Una prueba en `soria.test.ts` lo vigila. Revisado a 390 y 1440 px: nada se sale de
su caja.

## 5. Verificación

```
npm run lint            → eslint . --max-warnings 0 (sin avisos)
npm run typecheck       → tsc --noEmit (sin errores)
npx vitest run          → Test Files 119 passed (119) · Tests 700 passed (700)
node scripts/check_line_length.mjs → OK, 426 archivos de código, todos <= 100 líneas.
npm run build           → ✓ built
```

**axe** (axe-core 4.14 inyectado, 11 vistas a 1440, 768 y 390 px): 0 críticas, 0 graves y 0 de contraste.
Quedan dos moderadas que no vienen de este tramo: `region` (el botón flotante de WhatsApp está fuera de los
landmarks) y `landmark-unique` en Galería (33 secciones de fotos de «Estado de Calles» con la misma etiqueta,
con los datos de producción). Pasada con movimiento reducido: ver §7. Las E2E de Playwright (`npm run e2e`)
no se corrieron: necesitan la API local, y Docker Desktop estaba apagado.

Capturas a 390, 768 y 1440 px en `docs/capturas/d96/`: Inicio (cap1 a cap4), menú abierto, Galería, módulo
con formulario y lista, Mapa 2D (Zonas Verdes), Mapa 3D y pie.

## 6. Candidatos a borrar (no borré nada)

Siguen los de las etapas 1 a 3: `src/styles/pixel.css`, `brick.css` y `bands.css` (ya no se importan) y el
carrusel antiguo del Inicio (`NeighborhoodCarousel.tsx` y sus piezas). Nuevo: nada.

## 7. Pendiente

- La Galería de la etapa 4 sigue guardada en un `git stash` hasta que des el «OK» a este tramo.
- Movimiento reducido: comprobado a 1440 px en las 11 vistas. El vuelo de fotos pasa a la rejilla 2×2, la
  maqueta no orbita y la carga queda quieta en el centro. axe: los mismos dos avisos moderados, nada más.
  No repetí esta pasada a 390 y 768.
