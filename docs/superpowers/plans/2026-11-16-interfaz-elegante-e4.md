# Interfaz elegante · Etapa 4 (Galería General y pulido) — plan de ejecución

**Objetivo:** la Galería General pasa a un escenario de 3 columnas con apertura animada, y se hace el
pulido final de todas las páginas, con la medición del reparto de color.
**Diseño:** `docs/superpowers/specs/2026-11-16-interfaz-elegante-design.md` §7 y §10.
**Pedido vigente:** D88. **Rama:** `interfaz-elegante`. Sin dependencias nuevas, sin `git push`, sin borrar archivos.

## Reparto

| Tramo | Carpeta | Quién |
|---|---|---|
| Galería: escenario, columnas, apertura y cierre | `src/features/gallery/stage/` y `GalleryPage.tsx` | un agente |
| Pulido de páginas, medición de color, revisión final, informe y publicación | resto | Claude (sesión principal) |

## Galería (parámetros del diseño, §7)

- Las fotos existentes, en su orden y con sus etiquetas (las de los lugares, de `GET /fotos`, y luego las
  vistas del barrio), en 3 columnas; cada foto es un `<button>` con marco 3:4; columnas de 24vw en
  escritorio. Fondo papel (la página declara tono papel: el header y el menú se adaptan).
- Solo el encabezado «GALERÍA» en display gigante, blanco con `mix-blend-mode: difference`, sobre el
  borde inferior del escenario.
- Escenario `sticky` de 100vh en un recorrido de la altura de una columna. Por cuadro:
  `smooth += (scrollReal − smooth)(1 − (1 − 0,13)^(60·dt))`. La columna central sube con `smooth`; las
  laterales se anclan abajo y bajan lo mismo. Hover o foco: recorte a `scale(0,88, 0,95)` y la imagen a
  la inversa con un pequeño zoom.
- Abrir: 1400 ms con ease exponencial in-out. La foto va al centro a `min(62 % del alto, 86 % del
  ancho)`; las visibles pasan a una fila de miniaturas abajo con escalonado de 30 ms; las de fuera se
  desvanecen; el encabezado baja 300 % de su alto con `scaleY 4`; el título (serif cursiva) entra desde
  `translateY −100 %` y `scaleY 3` al 20 % de la línea de tiempo. Scroll bloqueado mientras está abierta.
  Volver o Escape reproducen lo mismo al revés y restauran geometría y scroll. Foco en Volver al abrir y
  de vuelta a la foto al cerrar. Solo transform y opacity.
- Móvil estrecho: 3 columnas, límite por ancho, miniaturas dentro del viewport. Resize con el detalle
  abierto: cierre inmediato y recálculo. Movimiento reducido: sin suavizado y estados inmediatos. Se
  cancelan rAF y oyentes al desmontar.

**Supuestos de Claude:** la atribución de cada foto (autor, licencia y fuente, que piden CC BY y CC BY-SA)
se muestra en el detalle abierto, junto al título y al enlace a su módulo; la página enlaza además a
«Créditos de fotos». Los estados de carga, error y «sin fotos» se conservan.

## Pulido y cierre (sesión principal)

1. Repaso de todas las rutas a 390, 768 y 1440 px: restos de estilo anterior, alineaciones, tamaños de
   toque, foco visible, alto contraste y movimiento reducido.
2. Menores aplazados de las etapas 1 a 3 que sigan vigentes.
3. Medición del reparto de color por área visible (noche, papel, ámbar, acero, naranja) en las páginas
   principales, y ajuste si se aleja del objetivo (55 / 30 / 10 / 4 / 1).
4. Criterios de éxito del diseño (§10), uno por uno, con su evidencia.
5. Una revisión independiente de toda la rama desde la etapa 2, y una sola pasada de arreglos.
6. `docs/INFORME_E4_interfaz_elegante.md`, `PLAN_MAESTRO.md`, `DISENO-V3.md`, lista final de candidatos
   a borrar y publicación.
