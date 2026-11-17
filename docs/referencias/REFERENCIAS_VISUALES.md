# Referencias visuales — Reconoce tu Barrio: El Tintal

Uso: inspiración de lenguaje visual, composición, ritmo y movimiento. Prohibido copiar código, HTML/CSS, textos, activos o identidad de marca. Todo patrón se traduce a la paleta oficial (#0B131E, #0B1E38, #8AB4F8, #1D4ED8, #3B82F6) y a la estética futurista de El Tintal.

**Nota de método:** estas referencias salen de la sección 17 del PROMPT_MAESTRO. No pude abrir ninguna de las dos URLs desde mi entorno, así que este documento no describe lo que hoy se ve en esas páginas. Si quieres evidencia visual real, agrega capturas en esta misma carpeta (PNG o JPG).

## 1. Maqueta urbana 3D

- **URL:** https://open-sbs.brig.ht/city
- **Patrones a abstraer:**
  - Maqueta urbana 3D isométrica o en perspectiva como protagonista del espacio.
  - Paneles HUD translúcidos sobre el lienzo 3D, sin tapar la ciudad.
  - Resaltado luminoso sutil al pasar el cursor sobre manzanas y edificios.
  - Transiciones suaves de cámara (fly-to) hacia el punto seleccionado.
  - Micro-etiquetas técnicas limpias.
- **Traducción al proyecto:** escena 3D del Hero con extrusiones en degradado #0B1E38 → #1D4ED8, aristas #8AB4F8, hover en #3B82F6 y HUD en vidrio oscuro.

## 2. Puesta en escena editorial

- **URL:** https://www.cartier.com/en-ro/watchesandwonders#/
- **Patrones a abstraer:**
  - Escena oscura de alta precisión con iluminación de contorno (rim light) sobre el objeto central.
  - Líneas divisorias finas (hairline grids) y marco editorial.
  - Ritmo de scroll pausado: cada sección revela información con profundidad y aire.
  - Contraste entre tipografía display geométrica y datos técnicos monoespaciados.
- **Traducción al proyecto:** rim light #8AB4F8 en el Hero, retícula fina de fondo, Space Grotesk para títulos y JetBrains Mono para coordenadas, áreas y matrículas (PROMPT_MAESTRO §10).

## Qué debe hacer Claude Code con esta carpeta

1. Para cada referencia, resume 5 reglas visuales: composición, luz, ritmo, tipografía y movimiento.
2. Traduce cada regla a la paleta oficial; no introduzcas colores nuevos.
3. Registra qué patrón se usó y dónde en `docs/DISENO_FRONTEND.md`.
4. No copies texto, imágenes, marcas ni código de las páginas de origen.
