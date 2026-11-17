# Informe de la etapa 2 de la «interfaz elegante»: el shell

**Fecha:** 2026-11-16 · **Proyecto:** Reconoce tu Barrio: El Tintal · **Creadora:** Marie Anne Lopez Poveda
**Pedido de:** Martín (D88: terminar todo sin esperar «OK» entre etapas y publicar cada bloque)
**Rama:** `interfaz-elegante` de `barrio-frontend`, commits `e861f21..4867d4d` · **sin `git push`**

**Estado:** terminada, verificada y **publicada** en https://reconoce-el-tintal.pages.dev (despliegue `91c5239a`).
El backend no se tocó. No se borró ningún archivo.

## 1. Qué cambió

| Entregable | Qué quedó | Commit |
|---|---|---|
| Sale el estilo «ladrillo y píxel» | `index.css` ya no importa `pixel.css`, `brick.css` ni `bands.css`. Ningún componente usa sus clases. | `2be5973` |
| Tonos y superficies | `tone.css` (`.tone-papel` y `.tone-noche` reescopan texto y líneas, también en alto contraste) y `surfaces.css` (`.ui-card`, `.ui-panel`, `.ui-eyebrow`, `.ui-prose`, `.ui-rule`). | `2be5973` |
| Encabezado de página editorial | Regla ámbar de 1 px, etiqueta en versalitas, título en display y descripción en serif cursiva. El texto de las páginas va directo sobre noche, sin cajas. | `2be5973` |
| Header y menú desplegable | Header fijo de 64 px y panel a todo el ancho con las rutas de `lib/navigation.ts` y las 14 categorías. Ya no hay barra lateral. | `3ae4fef` |
| Líneas de 1 px | Fuera los bordes de 2 px, el marco de 12 px y la sombra dura del mapa 3D. Botón secundario de contorno. | `f3fbe8e` |
| Pie | Banda papel a todo el ancho, alineada con la columna de contenido. | `f3fbe8e` |
| Sexta Mini Marie (D88) | La del perfil de la creadora va a escala entera: 64 × 140 px, con su recurso doble o cuádruple. | `e861f21` |
| Enlaces de créditos (D88) | 24 px de alto mínimo (antes 18 px). | `f3fbe8e` |

## 2. Capturas (`docs/capturas/e2/`)

28 capturas a 390, 768 y 1440 px, y a 1440 px con movimiento reducido:
`inicio-*`, `menu-*`, `mapa-*`, `historia-*`, `modulo-*`, `acceso-*` y `pie-*`.

## 3. Verificación (salidas reales, sobre `4867d4d`)

```
$ npm run lint            → eslint . --max-warnings 0        (sin avisos)
$ npm run typecheck       → tsc --noEmit                     (sin errores)
$ npx vitest run          → Test Files  74 passed (74) · Tests  384 passed (384)
$ node scripts/check_line_length.mjs
                          → check_line_length: OK, 325 archivos de código, todos <= 100 líneas.
$ npm run build           → ✓ built in 836ms
$ npx playwright test     → 5 passed (2.0m)   (es/en a 390 y 1440 px, es a 768 px)
```

El recorrido E2E ahora también abre el menú, comprueba sus 23 enlaces, navega a Ayuda y ve que se cierra.

**axe (WCAG A y AA, con las reglas de 2.2) en 14 rutas, sobre el build:**
```
TOTALES {"390":{"critical":0,"serious":0,"moderate":0,"minor":0,"desbordes":0,"erroresDeConsola":0},
         "768":{"critical":0,"serious":0,"moderate":0,"minor":0,"desbordes":0,"erroresDeConsola":0},
         "1440":{"critical":0,"serious":0,"moderate":0,"minor":0,"desbordes":0,"erroresDeConsola":0},
         "1440 alto contraste":{"critical":0,"serious":0,"moderate":0,"minor":0,"desbordes":0,"erroresDeConsola":0}}
```
Es la primera vez que el barrido sale sin ningún aviso: desaparecieron los tres de los enlaces de créditos.

**Medido en el navegador, sobre el build:**

| | 390 × 844 | 768 × 1024 | 1440 × 900 | 1440 con movimiento reducido |
|---|---|---|---|---|
| Header | 64 px, fijo, tono noche | igual | igual | igual |
| Nombre del sitio cortado | no | no | no | no |
| Botón «Menú» | 100 × 44 px | 101 × 44 px | 103 × 44 px | 103 × 44 px |
| Idioma, cuenta y repetir bienvenida | dentro del menú | en la barra | en la barra | en la barra |
| Menú abierto | 23 enlaces, animado | 23, animado | 23, animado | 23, sin animación |
| axe con el menú abierto | 0 violaciones | 0 | 0 | 0 (y 0 en alto contraste) |
| Foco | entra en «Inicio», no sale del panel, Escape lo devuelve al botón | igual | igual | igual |
| Barra lateral | no existe | no existe | no existe | no existe |
| Errores de consola y desborde horizontal | 0 | 0 | 0 | 0 |

**En producción** (1440 y 390 px, con la API despierta): versión servida igual al build local, menú con
23 enlaces, Mini Marie a 12 px de la esquina superior derecha del mapa, 0 errores de consola.

## 4. Supuestos aplicados (decisiones de Claude)

1. Sin barra lateral: contenido en una columna centrada de 1200 px bajo el header fijo.
2. Por debajo de 640 px, idioma, cuenta y repetir bienvenida van dentro del menú; así el nombre no se corta.
3. El menú es un panel a todo el ancho con tres bloques; los enlaces principales van en display.
4. El foco queda atrapado en el panel (no en el header); Escape y el clic fuera cierran.
5. El texto suelto deja las cajas papel; el papel pasa al pie, a los campos y a las etapas 3 y 4.
6. Botón secundario de contorno; insignias de verificación de contorno; línea de tiempo con trazo fino.
7. El tono del header lo decide la sección que pasa bajo él; sin secciones marcadas es noche y sólido.
8. La Mini Marie del perfil usa una secuencia nueva de un cuadro (`idle`), copia de `frame_1.png`.

## 5. Candidatos a borrar (no borré nada)

| Archivo | Por qué sobra |
|---|---|
| `src/styles/pixel.css`, `brick.css`, `bands.css` | Ya no se importan. |
| `src/components/layout/Sidebar.tsx`, `SidebarLink.tsx`, `CategoryMenu.tsx`, `Sidebar.test.tsx` | La barra lateral ya no se usa; su prueba solo comprueba el componente suelto. |
| `src/hooks/usePersistentFlag.ts` | Solo lo usaba la barra lateral. |
| `public/assets/avatar/frame_1.png` | El perfil usa ahora `idle_140/280/560.webp`. |
| De la etapa 1: `wave_strip.webp`, `run_strip.webp`, `src/components/avatar/sequences.json` | Siguen sin uso. |

**No son candidatos:** `sit_strip.webp`, los `wave_N.png`, `run_N.png` e `idle/idle_1.png` (de ellos salen las tiras).

## 6. Observaciones

- **Producción, API dormida.** En los dos despliegues de hoy, la API de Render estaba dormida y las
  peticiones que pasan por el proxy de Pages no la despertaron en varios minutos (respondían 502 a los
  ~79 s); una petición directa a Render la despertó en 63–67 s y desde ahí todo funcionó. No es del
  rediseño ni toqué el backend ni el proxy. Queda por diagnosticar; mientras tanto, abrir
  `https://barrio-backend-ghc3.onrender.com/api/v1/health` despierta la API.
- `npm` avisa de vulnerabilidades en dependencias de desarrollo al instalar o desinstalar; ya estaban
  y no las toqué.
- Los títulos pequeños siguen en cursiva serif y el texto en Inter 300, como en la etapa 1.

## 7. Siguiente

Etapa 3: el Inicio como película de scroll en 4 capítulos.
