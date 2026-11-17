# Interfaz elegante · Etapa 2 (shell) — plan de ejecución

**Objetivo:** quitar el estilo «ladrillo y píxel» de toda la app y poner el shell nuevo: header mínimo con
menú desplegable que cambia de tono, pie, botones, tarjetas, formularios, modales, chat y WhatsApp.

**Diseño:** `docs/superpowers/specs/2026-11-16-interfaz-elegante-design.md` §3 y §4 · `docs/DISENO-V3.md`.
**Pedido vigente:** D88 (terminar todo sin esperar «OK» entre etapas; publicar cada bloque verificado).
**Rama:** `interfaz-elegante` de `barrio-frontend`. Ejecución en esta sesión, con prueba en rojo antes de cada cambio.

## Restricciones (las de siempre)

- Ningún archivo de código pasa de 100 líneas. Solo `transform` y `opacity` en animaciones; movimiento reducido respetado.
- Sin dependencias nuevas. Textos nuevos solo con claves i18n en es y en. No se borra ningún archivo:
  lo que deja de usarse se lista en el informe. Nunca `git push`.
- Paleta D84; texto ≥ 4,5:1; sobre ámbar solo noche. `map-palette.css` y `contrast.css` no se tocan
  (los tokens nuevos deben seguir funcionando en alto contraste).
- Verificación por tarea: pruebas de lo tocado y `tsc`; por commit: `npm run lint`, `npm run typecheck`,
  `npx vitest run`, `node scripts/check_line_length.mjs`, `npm run build`. Al cerrar: E2E, axe a
  390/768/1440 y alto contraste, capturas, informe y publicación.

## Decisiones de diseño (supuestos de Claude salvo donde se indica)

1. **Sin barra lateral.** El contenido va centrado (`max-w` 1200 px) bajo un header fijo de 64 px.
2. **Header:** logo + nombre a la izquierda; a la derecha repetir bienvenida, cuenta, idioma y el botón
   «Menú» (texto visible + ícono). Por debajo de 640 px solo quedan logo, nombre y «Menú»; los otros tres
   pasan al panel del menú, para que el nombre no se corte (hoy sale «El Tin…»).
3. **Menú:** panel bajo el header, a todo el ancho, con tres bloques en el orden de `lib/navigation.ts`:
   Inicio/Mapa 3D/Historia · Categorías (14) · Ranking/Galería/Preguntas/Perfil/Ayuda/Acceso. Enlaces
   principales en display; categorías en Inter con su emoji. `aria-expanded` + `aria-controls`, foco
   atrapado en header + panel, Escape y clic fuera cierran, navegar cierra, sin animación con movimiento
   reducido. La página activa lleva `aria-current` y un punto ámbar.
4. **Tono:** `data-tone="noche|papel"` en el header. `.tone-papel` y `.tone-noche` reescopan los tokens de
   texto y borde (como hacía `bands.css`), así cualquier componente se lee sobre los dos fondos. Un
   IntersectionObserver elige el tono de la sección `[data-tone]` que pasa bajo el header; sin secciones
   marcadas, tono noche y fondo sólido. Con `data-float` el header es transparente (lo usa el Inicio en E3).
5. **Superficies:** `.ui-card` (noche con línea de 1 px), `.ui-card--paper` (papel con texto noche),
   `.ui-panel` (flotantes: modal, tooltip, HUD), `.ui-eyebrow`, `.ui-prose`. Radio 4 px, línea de 1 px,
   sin sombras duras. El texto suelto de las páginas deja las cajas papel y va directo sobre noche.
6. **PageHeader editorial:** sin placa: regla ámbar de 1 px, etiqueta en versalitas, `h1` en display y
   descripción en serif cursiva.
7. **Botones:** borde de 1 px, sin sombra. Primario ámbar/noche; secundario de contorno (vale sobre noche y
   papel); ghost con tinte del propio texto. **Campos:** caja de 1 px, fondo transparente.
8. **Pie:** banda papel a todo el ancho con el mismo contenido (contacto, perfil, preguntas, módulos,
   ubicación, créditos).
9. **Sexta Mini Marie (D88):** el perfil de la creadora usa `SequenceSprite` con una secuencia nueva de un
   cuadro (`idle`, 64 × 140 px; recursos 140/280/560) hecha con una copia de `frame_1.png`.
10. **Enlaces de créditos (D88):** alto mínimo de 24 px.

## Tareas

- [ ] **T1 Superficies y limpieza.** `styles/surfaces.css` y `styles/tone.css` nuevos; `index.css` deja de
      importar `pixel.css`, `brick.css` y `bands.css`; se reemplazan sus clases en toda la app; fuera los
      alias `--palette-*`, `--px`, `--shadow-brick*` y `--ff-pixel`; `stars.css` y `maps-preview.css` con
      tokens semánticos. Pruebas: guarda de hojas y clases heredadas, guarda de primitivos fuera de
      `tokens.css`/`scale.css`, tonos (pares ≥ 4,5:1 en `.tone-papel`, también en alto contraste).
- [ ] **T2 Header y menú.** `Header`, `SiteMenu`, `useHeaderTone` (+ `pickTone` puro), `AppShell` sin
      barra lateral. Pruebas: abre/cierra, `aria-*`, Escape, cierre al navegar, orden de `navigation.ts`,
      14 categorías, foco atrapado, tono por defecto, `pickTone`. E2E adaptado al menú.
- [ ] **T3 PageHeader, botones, campos, tarjetas, modal, tooltip y acordeón.**
- [ ] **T4 Pie, perfil de la creadora (Mini Marie `idle`), contacto, créditos a 24 px, barra de
      accesibilidad, chat y WhatsApp.**
- [ ] **T5 Cierre:** verificación completa, E2E, axe, capturas a 390/768/1440 y con movimiento reducido,
      `docs/INFORME_E2_interfaz_elegante.md`, `PLAN_MAESTRO.md`, `DISENO-V3.md`, publicación.

## Candidatos a borrar que deja esta etapa (no se borran)

`src/styles/pixel.css`, `brick.css`, `bands.css`; `Sidebar.tsx`, `SidebarLink.tsx`, `CategoryMenu.tsx` y
sus pruebas; `frame_1.png` si el perfil pasa a la tira `idle`. Se confirman en el informe.
