# Informe de la etapa 1 de la «interfaz elegante»: tokens, tipografía base y Mini Marie

**Fecha:** 2026-11-16 · **Proyecto:** Reconoce tu Barrio: El Tintal · **Creadora:** Marie Anne Lopez Poveda
**Pedido de:** Martín · **Rama:** `interfaz-elegante` de `barrio-frontend` (10 commits `c307f4e..d98e9e2`, **sin push**)

**Estado:** la etapa 1 está terminada, verificada, aprobada y publicada (ver la actualización de abajo).
El backend no se tocó. No se borró ningún archivo. La web publicada sigue igual: nada de esto está en línea.

> **Actualización del mismo día (D88), después de este informe.** Martín dio el «OK» y pidió terminar
> todo sin esperar entre etapas, publicar en el sitio original y mover a Mini Marie del Mapa 3D arriba a
> la derecha. Respondió los 4 puntos de la sección 8: desinstalar las fuentes, quitar el parpadeo,
> adaptar la sexta Mini Marie y subir los enlaces de créditos. Hecho en 5 commits (`074ab95..96ac012`):
> - la sentada está sobre el borde superior del recuadro, a 12 px de la esquina derecha (ya no hay repisa
>   abajo) y se ve sin desplazar la página;
> - el HUD de la maqueta ya no se solapa (0 solapes a 390, 768 y 1440 px; antes la leyenda tapaba la pista);
> - la sentada usa 7 cuadros y no parpadea; el confeti respeta el alto contraste; las 3 fuentes salieron.
>
> Verificado: 363 pruebas, E2E 5/5, axe sin violaciones críticas. **Publicado** en
> https://reconoce-el-tintal.pages.dev y comprobado allí a 1440 y 390 px. No se hizo `git push`.
> Las secciones 3, 6, 8 y 9 describen el estado anterior a esta actualización; las capturas de
> `docs/capturas/e1/` ya muestran el estado nuevo.

## 1. Qué cambió

| Entregable | Qué quedó | Commit |
|---|---|---|
| Paleta (D84) | Noche, papel, ámbar, acero y naranja en `tokens.css`; toda la app hereda por los tokens. Violeta fuera de los estilos. Alto contraste intacto. | `f0710e3` |
| Tipografía (D85) | Anton en `h1` y titulares, Cormorant Garamond cursiva en `h2` y `h3`, Inter 300 de base. Radio 4 px y sin sombras duras en los tokens. | `f0710e3` |
| Mini Marie a escala entera (D86) | Tamaños fijos por recurso; cada pantalla recibe el doble o el cuádruple exactos. Las 9 tiras suman 651 KB y cada pantalla descarga solo la suya. | `edafa1f`, `d303406` |
| Bienvenida | 8 asomadas (160 px; 80 px en pantallas de menos de 640 px), «HOLA» en Anton, botón ámbar, sin sombras. | `b405bbc` |
| Pantalla de carga | Fondo noche, Mini Marie corriendo (420 px; 210 px en pantallas pequeñas), suelo de 1 px. | `862b341` |
| Logo, favicon y avatar del chat | Rostro de Mini Marie en círculo papel con línea de 1 px; favicon y `theme-color` en la paleta nueva. | `99858c0`, `d98e9e2` |
| Mini Marie sentada | En una repisa de 1 px sobre el borde inferior de la maqueta, en Inicio y Mapa 3D. | `4d12d41` |
| Arreglo que apareció al medir | `/historia` desbordaba 44 px a 768 px (ya pasaba). El E2E ahora recorre también 768 px y revisa el desborde. | `b4cb929` |
| Arreglos de la revisión | Ver la sección 4. | `7922993`, `d98e9e2` |

Documentos: `docs/DISENO-V3.md` (sistema visual; la V2 se conserva), regla de paleta en `CLAUDE.md` y
decisiones D83–D87 en `PLAN_MAESTRO.md`.

**Lo que todavía verás con el estilo anterior:** el menú lateral, el marco grueso y la sombra del
recuadro 3D, las tarjetas y los botones con forma de ladrillo. Ya tienen los colores nuevos, pero su
forma se rehace en las etapas 2 y 3, como dice el diseño.

## 2. Capturas (`docs/capturas/e1/`)

28 capturas a 390, 768 y 1440 px, y a 1440 px con movimiento reducido:
`carga-*`, `bienvenida-*`, `inicio-*`, `sentada-inicio-*`, `sentada-mapa-*`, `chat-*` y `tipografia-*`.

Mira sobre todo estas tres, porque muestran decisiones que son tuyas:
- `tipografia-1440.png`: los títulos pequeños («Navegar por el barrio») salen en cursiva serif de 20 px.
- `sentada-inicio-1440.png` y `sentada-mapa-390.png`: la repisa y dónde queda sentada.
- `bienvenida-1440.png`: «HOLA» en mayúsculas y las 8 asomadas.

## 3. Verificación (salidas reales, sobre `d98e9e2`)

```
$ npm run lint            → eslint . --max-warnings 0        (sin avisos)
$ npm run typecheck       → tsc --noEmit                     (sin errores)
$ npx vitest run          → Test Files  70 passed (70) · Tests  361 passed (361) · Duration 21.94s
$ node scripts/check_line_length.mjs
                          → check_line_length: OK, 313 archivos de código, todos <= 100 líneas.
$ npm run build           → ✓ built in 4.68s
$ npx playwright test     → 5 passed (2.0m)
   es-1440, en-1440, es-768, es-390 y en-390: «todas las rutas: entrar, salir, recargar y volver sin errores»
```

El build avisa de un trozo de más de 500 kB (la escena 3D y el mapa); ya lo hacía antes de esta etapa.

**axe (WCAG A y AA) en 14 rutas, sobre el build:**
```
TOTALES {"390":{"critical":0,"serious":1,"desbordes":0,"erroresDeConsola":0},
         "768":{"critical":0,"serious":2,"desbordes":0,"erroresDeConsola":0},
         "1440":{"critical":0,"serious":0,"desbordes":0,"erroresDeConsola":0},
         "1440 alto contraste":{"critical":0,"serious":0,"desbordes":0,"erroresDeConsola":0}}
```
Los 3 avisos «serious» son la misma regla (`target-size`, WCAG 2.2): los enlaces de los créditos de las
fotos miden 18 px de alto, en `/creditos-fotos` y `/galeria`. Ya existían. Ninguno es de contraste.

**Medido en el navegador (una corrida sobre el build):**

| | 390 × 844 | 768 × 1024 | 1440 × 900 | 1440 con movimiento reducido |
|---|---|---|---|---|
| Carga | 98 × 210 px, corre | 196 × 420 px, corre | 196 × 420 px, corre | 196 × 420 px, pose fija |
| Bienvenida | 8 de 41 × 80 px, 0 choques, 3,77 % de la pantalla | 8 de 82 × 160 px, 0 choques, 6,38 % | 8 de 82 × 160 px, 0 choques, 3,87 % | 8 visibles, 0 animadas |
| Logo | dibujo de 32 × 32 px | 48 × 48 px | 48 × 48 px | 48 × 48 px |
| Avatar del chat | círculo de 48 px, Mini Marie de 41 × 80 px | igual | igual | igual |
| Sentada | 29 × 48 px: 29 px sobre la maqueta y 19 por debajo; repisa de 72 × 1 px | igual | igual | igual, sin mover la pierna |
| Controles que tapa la sentada | 0 | 0 | 0 | 0 |
| axe en Inicio, chat, Mapa, Ayuda y bienvenida | 0 violaciones | 0 | 0 | 0 |
| Errores de consola y desborde horizontal | 0 | 0 | 0 | 0 |

- Anton ya está cargada cuando aparece «HOLA» en las cuatro vistas: no hay destello de otra fuente.
- **Dos lecturas que repetí.** La primera pasada de axe sobre la bienvenida se tomó a mitad del
  fundido del botón y marcó contraste en 390 y 1440 px; con la entrada terminada da 0 violaciones en
  los tres tamaños. Y en `/mapa` la primera cuenta dio 2 controles tapados por la sentada a 390 px:
  eran ítems de la leyenda ocultos por su propio desplazamiento; contando solo lo visible son 0.
- **La sentada no se ve sin desplazar la página** en Inicio ni en Mapa 3D, en ninguno de los tres
  tamaños: está en el borde inferior de la maqueta, que queda bajo el pliegue. Es el supuesto del
  diseño, pensado para el capítulo 3 del Inicio (etapa 3).
- **Tu pantalla está al 125 %.** Medido con la animación en marcha: a 125 % y a 150 % Mini Marie no
  cambia de nitidez entre cuadros ni se le cuela el cuadro vecino. A 175 % asoma un hilo tenue de 8 px
  en un cuadro de la sentada. La corredora de 420 px se ve suavizada al 125 %, porque no existe un
  dibujo más grande.

## 4. Revisión independiente de toda la rama

Un revisor con contexto nuevo leyó los 8 commits que había entonces: **0 fallos críticos, 3 importantes
y 11 menores.** Arreglé los importantes en una sola pasada, cada uno con su prueba en rojo antes:

| Fallo | Antes | Ahora |
|---|---|---|
| Ícono de WhatsApp: quedó ámbar sobre ámbar al cambiar los colores | 1,00:1 | 6,20:1 |
| Enlaces a mapas temáticos con el puntero encima: papel sobre ámbar | 1,40:1 | 6,20:1 |
| Indicador de carga dentro de los campos: ámbar sobre papel (hoy ninguna página lo muestra) | 1,40:1 | 8,67:1 |
| Botones «ghost» con el puntero en alto contraste: blanco sobre blanco (ya pasaba) | 1,00:1 | 15,58:1 |
| Logo: el dibujo se pintaba a 30 o 46 px, y a 58 px con la letra al 125 % | no entero | 32 o 48 px exactos |

Las pruebas no habían visto estos fallos porque medían pares de colores sueltos, no lo que cada
componente combina. Hay una prueba nueva que sí lo mide (`src/styles/consumers.test.ts`), en modo normal
y en alto contraste. Por eso las pruebas pasaron de 351 a 361.

## 5. Supuestos aplicados (propuestas mías que pediste anotar)

1. **Reparto de color por área** (55 / 30 / 10 / 4 / 1 %): se mide al cerrar la etapa 4.
2. **«Escala entera» con tamaños fijos:** los dibujos de Mini Marie no siguen una rejilla de píxel
   regular, así que no hay un «píxel nativo»; cada tamaño es un recurso propio.
3. **Tamaños de Mini Marie:** asomadas 160/80 px, carga 420/210 px, sentada 48 px, avatar 80 px, logo 32/48 px.
4. **Repisa de la sentada:** línea ámbar de 1 px y 72 px de ancho en el borde inferior de la maqueta.
5. **Cormorant Garamond** en vez de Fraunces, por su cursiva clásica.
6. **Cursiva serif en todos los `h2` y `h3`** como regla base; la etapa 2 decide título por título.
7. **«HOLA» en mayúsculas** y confeti de puntos de 6 px en ámbar, papel y acero.
8. **Favicon y `theme-color`** en la paleta nueva (no estaban en la lista, pero llevaban violeta).

**Chorus:** no está en el registro de paquetes (404 comprobado), así que la display es Anton. Para
usar Chorus, deja `Chorus.woff2` en `barrio-frontend/public/fonts/` y avísame: se declara su
`@font-face` y se antepone a Anton en `--ff-display` (`DISENO-V3.md`, §3).

## 6. Decisiones que tomé por ti (si alguna está mal, dímelo)

**Durante la ejecución:**
- Trabajé en la misma copia, en una rama, sin árbol aparte: el equipo va justo de memoria.
- La etapa cierra con este informe y la espera de tu «OK»; la rama queda abierta para las etapas 2 a 4.
- Tiras en WebP al 90 % y no sin pérdida: pesaban 2,7 MB; a 4 aumentos no se distinguen.
- `<picture>` por densidad en vez de `srcset`, y `pixelated` solo a 1× y 2×: con `srcset`, en tu pantalla al 125 % el navegador estiraba el recurso pequeño.
- Volvieron `wave_640` y `sit_192` (los había quitado): ahora son el cuádruple exacto.
- Lo que asoma cada Mini Marie va en píxeles enteros (74 o 37 px), no en 73,6.
- Asomadas sin `drop-shadow`: el velo ya las separa. Las 4 giradas a 45° se suavizan.
- «HOLA» en mayúsculas a un cuerpo mayor y confeti de puntos de 6 px: la display condensada lo pedía.
- Favicon y `theme-color` regenerados en la paleta nueva, aunque el plan no los listaba.
- Carga, logo y avatar usan tokens semánticos en vez de colores fijos: así cambian en alto contraste.
- Un solo `<img>` con 4 fuentes para el logo, y un script aparte para logo y favicon.
- Los dos paneles de abajo de la maqueta subieron 24 px para no rozar la cabeza de la sentada.
- Corregí en esta etapa el desborde de `/historia` a 768 px, aunque ya existía.

**Al cerrar la revisión:**
- El círculo del logo mide 34 o 50 px por fuera: lo que debe ser entero es el dibujo (32 o 48 px).
- No añadí aún la prueba que prohíbe colores primitivos fuera de `tokens.css`: va primera en la etapa 2.
- Dejé como está, para sus etapas: el estilo heredado del menú, tarjetas y marco 3D; el blanco puro en dos hojas viejas; las tarjetas poco separadas del fondo; el menú lateral sin realce al pasar el puntero.
- Unifiqué una frase en `CLAUDE.md` y `DISENO-V3.md`: el negro también va, translúcido, en la única sombra suave.
- No toqué el cuadro 3 de la sentada (punto 2 de la sección 8).
- Mantengo Inter 300 y la cursiva serif en títulos pequeños hasta que las veas en las capturas.
- La sentada se queda en el borde inferior de la maqueta, aunque hoy quede bajo el pliegue (sección 3).
- No cambié que la pantalla de carga cubra todo en cada petición de datos: ya era así.
- Arreglé el indicador de carga de los campos como si fuera importante; después comprobé que hoy
  ninguna página lo muestra. El arreglo es correcto, pero era un fallo latente, no visible.

## 7. Candidatos a borrar (no borré nada)

| Archivo | Por qué sobra |
|---|---|
| `public/assets/avatar/wave/wave_strip.webp` (215 KB) | Era la tira en uso; ahora van `wave_80…640`. Se regenera con `scripts/slice_sequences.mjs`. |
| `public/assets/avatar/run/run_strip.webp` (142 KB) | Igual, con `run_210` y `run_420`. |
| `src/components/avatar/sequences.json` | Ya no lo importa nadie; lo reemplaza `spriteScales.json`. |

**No son candidatos:** `sit_strip.webp` (es la única fuente de la sentada; ningún script la regenera),
los `wave_N.png` y `run_N.png` (de ellos salen las tiras) y `frame_1.png` (perfil de la creadora).
Ya estaba sin uso antes de esta etapa la función `paletteColor()` de `src/lib/cssToken.ts`.
`pixel.css`, `brick.css` y `bands.css` siguen importados: dejan de estarlo en la etapa 2.

## 8. Lo que necesito que decidas

1. **¿Desinstalo Press Start 2P, Space Grotesk y JetBrains Mono?** Ya no se cargan; siguen instaladas.
2. **Cuadro 3 de la sentada.** El dibujo original (`Mini marie sentada.jpeg`) trae ese cuadro con la
   falda y el brazo corridos; a 48 px se ve como un parpadeo una vez por segundo. Ya pasaba. Opciones:
   saltar ese cuadro (quedan 7) o que Marie lo redibuje. No lo toqué.
3. **Sexta Mini Marie.** La del perfil de la creadora, al pie de casi todas las páginas, no estaba en la
   lista y sigue a escala no entera. Propongo adaptarla en la etapa 2, junto con el pie.
4. **Enlaces de créditos de 18 px de alto.** Propongo subirlos a 24 px en la etapa 2 (créditos) y en la 4 (Galería).

## 9. Menores que quedaron anotados, sin arreglar

- En `/mapa`, la leyenda abierta tapa entre el 82 % y el 91 % del panel de pista de abajo a la izquierda
  (se ve en `sentada-mapa-390.png`). El solape ya existía: antes asomaban 16 px del panel bajo la
  leyenda (por cálculo, no lo medí antes) y, al subir los paneles, ya solo asoma un borde a la derecha.
  Se resuelve al rehacer ese panel en la etapa 3; si lo prefieres antes, es un cambio pequeño.
- En alto contraste conservan color de paleta el confeti, las estrellas y la vista previa de mapas.
- El esqueleto de carga no se distingue sobre las bandas claras (casi igual que antes).
- La línea de la repisa se pinta por delante de la sentada (1 px sobre la falda).
- Medio píxel en la bienvenida móvil; las asomadas no se recolocan si se cruza 640 px con ella abierta.
- En 390 px el nombre del sitio sale cortado en el encabezado («El Tin…»); ya pasaba y se rehace en la etapa 2.
- Varias pruebas son frágiles (leen comentarios o fijan el orden de las declaraciones).
- Falta la nota de procedencia de la sentada en el código y dos entradas `npm run` para los generadores.
- Detalles de código: un comentario desfasado en `bands.css`, el escáner de paleta no ve `#fff` ni
  `hsl()`, `font-serif` solo carga cursivas, y un tamaño de Mini Marie mal escrito falla al pintar
  en vez de al compilar.
- A 175 % de escala asoma un hilo tenue en un cuadro de la sentada (sección 3). Remedio anotado en
  `DISENO-V3.md`, §8: celdas con margen.
- Zoom de página en Safari: no comprobado (no hay Safari en este equipo).

## 10. Incidencia del entorno

El sistema detuvo la API local (puerto 8000) por falta de memoria mientras la sesión estaba en pausa.
No la reinicié por mi cuenta; la encendí cuando escribiste «si, enciendela». Las capturas, axe y el E2E
de este informe se hicieron después, con la API encendida. Sigue encendida.

## 11. Siguiente etapa (cuando des el «OK»)

Etapa 2, el shell: header mínimo, menú desplegable que cambia de tono, pie, botones, tarjetas,
formularios, modales, chat y WhatsApp. `pixel.css`, `brick.css` y `bands.css` dejan de importarse.
