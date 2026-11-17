# Interfaz elegante · Etapa 3 (Inicio en 4 capítulos) — plan de ejecución

**Objetivo:** el Inicio pasa a ser una película de scroll a pantalla completa en 4 capítulos (1100 svh).
**Diseño:** `docs/superpowers/specs/2026-11-16-interfaz-elegante-design.md` §6 (parámetros exactos).
**Pedido vigente:** D88. **Rama:** `interfaz-elegante`. Sin dependencias nuevas, sin `git push`, sin borrar archivos.

## Reparto

| Tramo | Carpeta | Quién |
|---|---|---|
| Cap. 1 Manifiesto elástico | `src/features/home/film/manifesto/` | agente A |
| Cap. 2 Vuelo entre fotos | `src/features/home/film/flight/` | agente A |
| Cap. 4 Reel curvo de módulos (three directo) | `src/features/home/film/reel/` | agente B |
| Cap. 3 Maqueta a pantalla completa, contenedor, ruta, pruebas del conjunto, informe y publicación | `film/stage/`, `film/HomeFilm.tsx`, `HeroSection`, `HeroHud`, `SittingMarie`, `routes.tsx` | Claude (sesión principal) |

Dos agentes a la vez como máximo (regla de Martín). Cada uno trabaja solo en su carpeta, con pruebas
antes del código, y se comprueba a ojo en un arnés aislado (`.superpowers/dev/*.html`, fuera de git).
Los commits y la verificación completa los hace la sesión principal al integrar.

## Reglas comunes de los 4 capítulos

- Scroll nativo siempre: ningún `preventDefault` en rueda ni toque, ni bloqueo del body.
- Un rAF por efecto, en pausa fuera de pantalla y con el documento oculto; limpieza completa al desmontar.
- Máximo 2 contextos WebGL vivos (maqueta y reel); el que no se ve no dibuja.
- Cada capítulo declara el tono del header: `data-tone` + `data-header-float` + `useToneSection`.
- Movimiento reducido: capítulos 2 y 4 sin recorrido; capítulo 1 en su estado final.
- Enlace discreto «Créditos» (`credits.link`) al final, fuera de la escena.

## Capítulo 3 (sesión principal)

- `HeroSection variant="stage"`: recuadro `sticky` de 100svh dentro de una sección de 200svh; sin
  marco, borde ni sombra; acoge el lienzo de `ScenePortal` (no se crea otro canvas).
- HUD sobrio: coordenadas, Recentrar/Pausar, ficha de lugar y la atribución de los datos. Sin
  leyenda ni texto de ayuda (el filtro completo sigue en `/mapa`).
- Mini Marie (D88): arriba a la derecha, a 12 px de la esquina, sentada en una repisa de 1 px bajo
  el header; la fila de botones le deja el sitio.
- **Supuesto:** en el Inicio la rueda desplaza la página y no acerca la maqueta; se acerca con
  Ctrl/⌘ + rueda (también el pellizco del panel táctil) o con dos dedos. Se logra con un oyente en
  fase de captura que detiene la rueda sin modificador antes de que llegue a los controles: sin
  `preventDefault`.

## Cierre

Pruebas del conjunto (4 capítulos en orden, un solo `h1`, enlace de créditos, título del documento),
verificación completa, E2E, axe a 390/768/1440 y alto contraste, capturas por capítulo y con
movimiento reducido, fugas (rAF y oyentes al salir del Inicio), `docs/INFORME_E3_interfaz_elegante.md`,
`PLAN_MAESTRO.md` y publicación.

## Candidatos a borrar que deja esta etapa (no se borran)

`NeighborhoodCarousel.tsx`, `CarouselSlide.tsx`, `carousel.css`, `useSwipe.ts` y sus pruebas, si el
capítulo 2 reemplaza al carrusel. Se confirman en el informe.
