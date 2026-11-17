# Interfaz elegante · Etapa 1 (tokens, tipografía base y Mini Marie) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cambiar la interfaz a la paleta noche/papel/ámbar y a la tipografía nueva, y adaptar primero a Mini Marie (bienvenida, loader, logo, avatar del chat y sentada) sin quitarla de ningún sitio.

**Architecture:** Los tokens semánticos de `styles/tokens.css` cambian de valor y el resto de la app hereda por ellos; los primitivos viejos `--palette-*` quedan como alias hasta la etapa 2. Mini Marie pasa a tamaños fijos por recurso (escala entera) generados por un script, y `SequenceSprite` elige el recurso por tamaño. La geometría de `welcomePeeks.ts` no se toca.

**Tech Stack:** React 18, TypeScript strict, Tailwind 4 (`@theme inline`), GSAP (ya en uso), sharp (devDependency, solo en el script), Vitest, Playwright + axe-core.

**Spec:** `docs/superpowers/specs/2026-11-16-interfaz-elegante-design.md` (§3, §5 y §8).

## Global Constraints

- Solo `barrio-frontend/`. Nunca `git push`. Un commit atómico por tarea verificada, terminado en `Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>`.
- Ningún `.ts .tsx .js .mjs .py .css` pasa de 100 líneas.
- Dependencias nuevas permitidas: solo `@fontsource/anton` y `@fontsource/cormorant-garamond` (anotar en `PLAN_MAESTRO.md`, D22). No se desinstala ni se borra nada.
- Paleta: noche `#283845`, papel `#e8d8c9`, ámbar `#ffa649`, acero `#4b607f`, naranja `#f3701e`; blanco y negro solo en alto contraste y sombras; estados `#86efac`, `#fdba74`, `#fca5a5`. Texto normal ≥ 4,5:1. Sobre ámbar solo texto noche. Acero nunca como texto sobre noche.
- `styles/map-palette.css` no se toca.
- `welcomePeeks.ts`: `SLOTS`, `ROTATION`, `VISIBLE = 0.46` y `placePeeks` no cambian.
- Animaciones: solo `transform` y `opacity`; `prefers-reduced-motion` y `.reduce-motion` respetados.
- Textos nuevos solo con claves i18n en es/en. `"MINI MARIE.png"` no se edita, mueve ni borra.
- Verificación de cada tarea (desde `barrio-frontend/`): `npm run lint`, `npm run typecheck`, `npx vitest run`, `node scripts/check_line_length.mjs`, `npm run build`.

## Review Focus

1. Zoom del sistema a 125 %/150 % (Windows): un sprite `pixelated` no debe temblar entre cuadros → celdas de ancho entero y paso de animación en px enteros (prueba en Task 2).
2. Modo alto contraste activo: los tokens nuevos no deben filtrarse (sigue todo en blanco y negro) → prueba de pares en modo `high` (Task 1).
3. Texto ámbar o papel sobre superficie papel (p. ej. un enlace dentro de una tarjeta clara) → prueba que prohíbe ámbar/papel como par de texto y exige noche sobre papel (Task 1).
4. Pantalla de 360 px de ancho: las 8 asomadas a 80 px no deben tapar letrero, botón ni chat → prueba de `placePeeks` con el sprite de 41×80 (Task 3).
5. `prefers-reduced-motion`: loader, bienvenida y sentada quedan en pose fija sin perder contenido → pruebas de pose en Task 2, 3 y 6.

---

### Task 1: Tokens V3, tipografía base y pruebas de contraste

**Files:**
- Modify: `package.json` (2 dependencias), `src/styles/fonts.ts`, `src/styles/tokens.css`, `src/styles/scale.css:6-9,30-32,49-52`, `src/styles/index.css` (regla de `h1–h3`), `src/styles/bands.css` y `src/styles/brick.css` (solo literales violeta), `src/components/avatar/welcome.css:5` (literal violeta)
- Test: `src/styles/tokens.test.ts` (reescribir), `src/styles/fonts.test.ts` (crear)

**Interfaces:**
- Produces (CSS): primitivos `--c-noche`, `--c-papel`, `--c-ambar`, `--c-acero`, `--c-naranja`; alias `--palette-principal|intenso|oscuro → noche`, `--palette-lavanda|claro → papel`; semánticos existentes con valores nuevos; `--ff-display` (Anton), `--ff-serif` (Cormorant Garamond), `--ff-body` (Inter), `--ff-mono` y `--ff-pixel` como alias de body y display; `--r-sm|md|lg: 4px`; `--shadow-deep` suave; `--shadow-brick*: none`.
- Produces (Tailwind): `font-serif` (`--font-serif: var(--ff-serif)`).

- [ ] **Step 1: Instalar las dos tipografías**

Run: `npm install --save-exact @fontsource/anton@5.3.0 @fontsource/cormorant-garamond@5.3.0`
Expected: `package.json` gana exactamente esas 2 líneas en `dependencies`.

- [ ] **Step 2: Escribir las pruebas que fallan** (`tokens.test.ts`, `fonts.test.ts`)

`tokens.test.ts` conserva la lectura directa de CSS y `colorMath`, con estas aserciones:
```ts
const ALLOWED = new Set(['283845', 'e8d8c9', 'ffa649', '4b607f', 'f3701e', 'ffffff', '000000', '86efac', 'fdba74', 'fca5a5']);
// 1. todo hex de 6 dígitos y todo rgb() de los .css (menos map-palette.css) ∈ ALLOWED
// 2. ningún .tsx escribe un hex suelto
const TEXT_PAIRS = [
  ['--text-primary', '--bg-primary'], ['--text-primary', '--bg-surface'], ['--text-primary', '--bg-nav'],
  ['--text-secondary', '--bg-primary'], ['--text-secondary', '--bg-surface'],
  ['--text-muted', '--bg-primary'], ['--text-muted', '--bg-surface'],
  ['--text-on-accent', '--bg-accent'], ['--text-on-soft', '--bg-soft'],
  ['--text-on-interactive', '--interactive-primary'], ['--text-on-interactive', '--interactive-hover'],
  ['--text-on-interactive', '--interactive-active'], ['--text-highlight', '--bg-surface'],
  ['--accent-soft', '--bg-primary'], ['--accent-soft', '--bg-surface'],
  ['--state-success', '--bg-surface'], ['--state-warning', '--bg-surface'], ['--state-error', '--bg-surface'],
]; // cada par ≥ 4.5 en modo estándar y en alto contraste
// 3. medidos del diseño (±0.02): papel/noche 8.67, ámbar/noche 6.20, naranja/noche 4.10, acero/noche 1.88, acero/papel 4.60
// 4. ámbar sobre papel < 3 (nunca texto) y noche sobre ámbar ≥ 4.5 (único texto sobre ámbar)
// 5. foco doble: max(contraste(--focus-ring), contraste(--focus-ring-inner)) ≥ 3 sobre --bg-primary, --bg-accent e --interactive-primary
```
`fonts.test.ts` lee `fonts.ts` y `scale.css`: importa `@fontsource/anton/latin-400.css`, `@fontsource/cormorant-garamond/latin-500-italic.css` y `latin-600-italic.css`, `@fontsource/inter/latin-300.css`; **no** importa `press-start-2p`, `space-grotesk` ni `jetbrains-mono`; `--ff-display` empieza por `'Anton'` y `--ff-serif` por `'Cormorant Garamond'`.

- [ ] **Step 3: Verificar que fallan**

Run: `npx vitest run src/styles`
Expected: FAIL (hex violeta fuera de `ALLOWED`, pares y fuentes).

- [ ] **Step 4: Implementar**

`tokens.css` (valores exactos):
```css
--bg-primary: var(--c-noche);      --bg-surface: var(--c-noche);   --bg-nav: var(--c-noche);
--bg-accent: var(--c-papel);       --bg-soft: var(--c-papel);
--text-primary: var(--c-papel);    --text-secondary: rgb(232 216 201 / 0.9);  --text-muted: rgb(232 216 201 / 0.76);
--text-on-accent: var(--c-noche);  --text-on-soft: var(--c-noche);  --text-highlight: var(--c-ambar);
--accent-soft: var(--c-ambar);
--interactive-primary: var(--c-ambar); --interactive-hover: var(--c-papel); --interactive-active: var(--c-papel);
--text-on-interactive: var(--c-noche);
--border-subtle: rgb(232 216 201 / 0.2); --border-strong: rgb(232 216 201 / 0.55); --border-ink: var(--c-acero);
--glass-fill: var(--c-noche); --hairline: rgb(232 216 201 / 0.14);
--focus-ring: var(--c-ambar); --focus-ring-inner: var(--c-noche);
--overlay: rgb(40 56 69 / 0.86); --skeleton-base: rgb(232 216 201 / 0.1); --skeleton-shine: rgb(232 216 201 / 0.2);
```
`scale.css`: `--ff-display: 'Anton', 'Arial Narrow', sans-serif; --ff-serif: 'Cormorant Garamond', Georgia, serif; --ff-mono: var(--ff-body); --ff-pixel: var(--ff-display); --shadow-deep: 0 8px 24px rgb(0 0 0 / 0.18); --shadow-brick: none; --shadow-brick-pressed: none; --glow-active: 0 0 0 1px var(--c-ambar);` y los tres radios a `4px`.
`index.css`: `body { font-weight: 300 }`; `h1 { font-family: var(--ff-display); font-weight: 400; letter-spacing: 0.01em; line-height: 1.02 }`; `h2, h3 { font-family: var(--ff-serif); font-style: italic; font-weight: 600; letter-spacing: 0 }`; `font-synthesis: none` en los tres.

- [ ] **Step 5: Verificación completa de la tarea** (los 5 comandos de Global Constraints). Expected: todo en verde.

- [ ] **Step 6: Commit** — `Interfaz elegante E1: tokens noche/papel/ámbar y tipografía base`

### Task 2: Escala entera de Mini Marie

**Files:**
- Create: `scripts/build_sprite_scales.mjs`, `public/assets/avatar/wave/wave_{80,160,320,640}.webp`, `public/assets/avatar/run/run_{210,420}.webp`, `public/assets/avatar/sit/sit_{48,96,192}.webp`, `scripts/sprite_scales.test.mjs`
- Modify: `src/components/avatar/sequences.ts`, `src/components/avatar/SequenceSprite.tsx`, `src/components/avatar/sequence.css`
- Test: `src/components/avatar/SequenceSprite.test.tsx` (crear)

**Interfaces:**
- Produces: `SPRITE_SIZES: { wave: readonly [80, 160, 320, 640]; run: readonly [210, 420]; sit: readonly [48, 96, 192] }`; `cellWidth(name: SequenceName, size: number): number` (wave 41/82/164/328 · run 98/196 · sit 29/58/116); `<SequenceSprite name size pose? playing? phase? className? />` donde `size` es uno de los tamaños de esa secuencia (la prop `height` desaparece).
- El script lee las tiras existentes (`*_strip.webp`), nunca `"MINI MARIE.png"`; rellena la celda de `wave` de 327 a 328 px con una columna transparente; reduce con `kernel: 'lanczos3'`; escribe WebP sin pérdida.

- [ ] **Step 1: Pruebas que fallan**

`scripts/sprite_scales.test.mjs` (entorno node, con sharp): para cada secuencia y tamaño, el archivo existe y mide `frames × cellWidth` por `size`.
`SequenceSprite.test.tsx`:
```tsx
render(<SequenceSprite name="wave" size={160} />);
const img = document.querySelector('.sequence__strip') as HTMLImageElement;
expect(img.getAttribute('src')).toBe('/assets/avatar/wave/wave_160.webp');
expect(img.getAttribute('srcset')).toBe('/assets/avatar/wave/wave_160.webp 1x, /assets/avatar/wave/wave_320.webp 2x');
expect(document.querySelector('.sequence')).toHaveStyle({ width: '82px', height: '160px' });
expect(img).toHaveStyle({ width: '574px', height: '160px' }); // 7 × 82: el paso de la animación es entero
// tamaño mayor sin 2×: solo src (wave 640, run 420, sit 192)
// movimiento reducido: sin data-playing y transform translateX(-164px) para pose={2} a 160 px
```

- [ ] **Step 2: Verificar que fallan** — Run: `npx vitest run scripts src/components/avatar/SequenceSprite.test.tsx` → FAIL.

- [ ] **Step 3: Implementar el script y generar** — Run: `node scripts/build_sprite_scales.mjs` → imprime una línea por archivo con su tamaño.

- [ ] **Step 4: Implementar `sequences.ts`, `SequenceSprite.tsx` y `sequence.css`**

`.sequence__strip { image-rendering: pixelated; }`. La pose fija usa `translateX(-<pose × cellWidth>px)`. La animación sigue siendo `sequence-play` con `steps(frames)`.

- [ ] **Step 5: Actualizar los 4 usos de `height`** con el tamaño fijo más cercano (se afinan en las tareas 3–6): `LoadingScreen` 420, `WelcomeChoreography` 160, `ChatAvatar` 80, `SittingMarie` 48.

- [ ] **Step 6: Verificación completa** y **Step 7: Commit** — `Mini Marie a escala entera: tamaños fijos por recurso e image-rendering pixelated`

### Task 3: Bienvenida adaptada (las 8 asomadas)

**Files:**
- Modify: `src/components/avatar/welcome.css`, `src/components/avatar/WelcomeChoreography.tsx`
- Test: `src/components/avatar/WelcomeChoreography.test.tsx`, `src/components/avatar/welcomePeeks.test.ts`

**Interfaces:**
- Consumes: `SequenceSprite size`, `cellWidth` (Task 2); `placePeeks`, `VISIBLE` (sin cambios).

- [ ] **Step 1: Pruebas que fallan**
  - Escritorio (`setViewport(true)`): las 8 `.sequence` miden `82px × 160px`; móvil (`setViewport(false)`): `41px × 80px`.
  - `welcomePeeks.test.ts`: `spriteFor` pasa a `{ w: 82, h: 160 }` si `view.w >= 640`, si no `{ w: 41, h: 80 }`; añadir el caso `{ w: 360, h: 640 }`; las 3 aserciones existentes (8, sin choques, ≤ 12 %) siguen.
- [ ] **Step 2: Verificar que fallan.**
- [ ] **Step 3: Implementar**
  - Tamaño: `useMediaQuery('(min-width: 640px)', true) ? 160 : 80`; cada `.welcome-peek` recibe `--peek-h` en px en línea; el cuerpo usa `top: calc(var(--peek-h) * -0.46)`.
  - `welcome.css`: velo `background: var(--overlay)` con `backdrop-filter: blur(6px)` (sin degradado violeta); `.welcome-sign` en `var(--ff-display)`, color `var(--text-primary)`, sin `text-shadow`; confeti en `--c-ambar`, `--c-papel` y `--c-acero`; como máximo `filter: drop-shadow(0 2px 6px rgb(0 0 0 / 0.25))` en `.welcome-peek__body`.
- [ ] **Step 4: Verificación completa** y **Step 5: Commit** — `Bienvenida en la interfaz nueva: 8 asomadas a escala entera, sin sombras duras`

### Task 4: Pantalla de carga en noche + ámbar

**Files:**
- Modify: `src/components/avatar/loading-screen.css`, `src/components/avatar/LoadingScreen.tsx`
- Test: `src/components/avatar/LoadingScreen.test.tsx`

- [ ] **Step 1: Prueba que falla** — el corredor es `.sequence[data-sequence="run"]` de `196px × 420px` en escritorio y `98px × 210px` con `setViewport(false)`; el contenedor ya no lleva las clases `brick-bond` ni `px-corners`.
- [ ] **Step 2: Verificar que falla.**
- [ ] **Step 3: Implementar** — fondo `var(--c-noche)`; suelo: línea de 1 px `var(--c-ambar)` con trazos que pasan (misma animación `loading-ground`, 720 ms, solo `transform`); texto en `var(--ff-body)`, mayúsculas con `letter-spacing: 0.16em`, color `var(--text-primary)`, sin caja. Tamaño: `useMediaQuery('(min-width: 640px) and (min-height: 700px)', true) ? 420 : 210`.
- [ ] **Step 4: Verificación completa** y **Step 5: Commit** — `Pantalla de carga en noche y ámbar`

### Task 5: Logo sonriente y avatar del chat

**Files:**
- Create: `public/assets/brand/marie-logo-32.png`, `public/assets/brand/marie-logo-48.png` (derivados de `wave_6.png`, mismo recorte que los de 64 y 96)
- Modify: `scripts/build_sprite_scales.mjs` (añade los 2 logos), `src/components/layout/BrandLogo.tsx`, `src/components/avatar/ChatAvatar.tsx`
- Test: `src/components/layout/BrandLogo.test.tsx`, `src/components/avatar/ChatAvatar.test.tsx` (crear)

- [ ] **Step 1: Pruebas que fallan**
  - Logo: dos `<img>` según tamaño, cada una 1:1 o 2:1 exacto: `srcset="…-32.png 1x, …-64.png 2x"` (móvil) y `srcset="…-48.png 1x, …-96.png 2x"` (desde `sm`); nombre accesible `Reconoce tu Barrio: El Tintal` sin cambios.
  - Avatar: `<ChatAvatar size={48} />` contiene una `.sequence` de `41px × 80px`.
- [ ] **Step 2: Verificar que fallan.**
- [ ] **Step 3: Implementar** — ambos en círculo `bg-[var(--c-papel)]` con `border border-[var(--c-acero)]` (1 px) e `image-rendering: pixelated`; sin sombra.
- [ ] **Step 4: Verificación completa** y **Step 5: Commit** — `Logo y avatar del chat a escala entera en la paleta nueva`

### Task 6: Mini Marie sentada en la repisa inferior

**Files:**
- Modify: `src/features/home/SittingMarie.tsx`, `src/features/home/sitting.css`
- Test: `src/features/home/SittingMarie.test.tsx`

- [ ] **Step 1: Prueba que falla** — además de «solo en `/` y `/mapa`», el nodo `[data-mascot="sentada"]` contiene `.sitting-marie__ledge` y una `.sequence` de `29px × 48px`.
- [ ] **Step 2: Verificar que falla.**
- [ ] **Step 3: Implementar** — `.sitting-marie { position: absolute; bottom: -19px; right: clamp(96px, 22vw, 320px); z-index: 10; pointer-events: none }` (48 × 0,4 = 19 px de piernas bajo el borde); `.sitting-marie__ledge`: 72 × 1 px, `var(--c-ambar)`, centrada bajo ella a la altura del borde. Animación: los 8 cuadros con `steps(8)` en 1,1 s y `animation-timing-function` por tramo no se toca aquí (la fluidez se pule en E4).
- [ ] **Step 4: Verificación completa** y **Step 5: Commit** — `Mini Marie sentada en la repisa inferior de la maqueta`

### Task 7: Documentos, capturas e informe de la etapa

**Files:**
- Create: `docs/DISENO-V3.md`, `docs/INFORME_E1_interfaz_elegante.md`, `docs/capturas/e1/*.png`
- Modify: `CLAUDE.md` (regla de paleta), `PLAN_MAESTRO.md` (D83 tema de mapas; D84 paleta; D85 tipografía y dependencias; D86 escala entera de Mini Marie)

- [ ] **Step 1: Capturas y medición** (una sola corrida de Playwright sobre el build, 390×844, 768×1024 y 1440×900, y 1440 con movimiento reducido): bienvenida (8 en el DOM, sin choques), loader, encabezado con logo, sentada en `/` y `/mapa`, avatar del chat; axe sin violaciones críticas; 0 errores de consola; sin desborde horizontal.
- [ ] **Step 2: Escribir los documentos** con las salidas reales y la lista de supuestos y de candidatos a borrar (ninguno en E1).
- [ ] **Step 3: Parar y esperar el «OK» de Martín.**
