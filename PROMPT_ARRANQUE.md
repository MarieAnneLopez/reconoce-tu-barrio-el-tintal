<fuentes>
Si algo se contradice, este es el orden de autoridad:
1. docs/origen/ESPECIFICACION_ORIGINAL_v4.md — requisitos del curso (conversión literal del .docx).
2. Este mensaje — correcciones y reglas de ejecución.
3. docs/origen/PROMPT_MAESTRO.md — diseño, stack, estructura y fases (35% → 70% → 100%).
Reglas permanentes: CLAUDE.md. Capturas de referencia visual: docs/referencias/.
</fuentes>

<estado_inicial>
Carpeta raíz "Mini Marie/" (tiene espacio: cita las rutas). Existen "MINI MARIE.png", CLAUDE.md, docs/origen/ y docs/referencias/. Aún no hay repos, código ni PLAN_MAESTRO.md.
</estado_inicial>

<tarea_de_esta_sesion>
Solo el checkpoint 1: preparar y planificar, sin escribir código de aplicación. Empieza en modo plan.
1. Lee las tres fuentes y lista toda contradicción o ambigüedad entre ellas, además de las ya conocidas en <correcciones_al_prompt_maestro>.
2. Reporta el entorno sin instalar nada: sistema operativo y shell, versiones de node, python, git, docker y docker compose. Si falta Docker, dímelo y propón alternativas antes de seguir (el .docx permite PostGIS, MySQL o Spatialite; el PROMPT_MAESTRO fija PostGIS).
3. Comprueba el formato real de "MINI MARIE.png" (por ejemplo con sharp metadata): formato, dimensiones y canal alfa. Si es un JPEG con extensión .png, avísame y diseña la limpieza del fondo con tolerancia de color.
4. Lista los skills realmente disponibles y mapea los nombres de PROMPT_MAESTRO §3 a los reales. Los que no existan van a una tabla "no disponible → práctica equivalente"; eso no es un bloqueo.
5. Escribe PLAN_MAESTRO.md con las 3 fases divididas en hitos pequeños. Cada hito lleva su comando de verificación, su commit propio y los skills que cargarás al empezar ese hito. Incluye un Hito 0 de tooling: scripts check_line_length (mjs y py); un hook PostToolUse sobre Edit|Write que ejecute el chequeo de 100 líneas y devuelva el aviso por stderr con exit 2; un hook Stop que impida cerrar el turno con archivos de más de 100 líneas; y una regla deny de Edit sobre "MINI MARIE.png". Escribe los hooks en Node para que funcionen igual en Windows, macOS y Linux.
6. Si hay capturas o REFERENCIAS_VISUALES.md en docs/referencias/, léelas y resume, por cada referencia, 5 reglas visuales abstractas (composición, luz, ritmo, tipografía, movimiento) traducidas a la paleta oficial. No copies código, texto ni marca.
7. Presenta el resumen del plan, la tabla de skills y, como máximo, 5 preguntas abiertas. Detente y espera mi respuesta.
</tarea_de_esta_sesion>

<correcciones_al_prompt_maestro>
- Nombre del personaje: el muñeco de píxeles se llama **Mini Marie** en toda la app y en la documentación: chatbot, bienvenida con 8 avatares, animación de carga y los 6 frames del spritesheet. No lo llames avatar, mascota ni muñeco genérico en la UI ni en los documentos.
- Documentos: el "8" de §6, §9 y §15 mezcla conteos. Son 7 documentos técnicos en docs/ (los enumerados) más CHECKLIST_SOLID y 3 informes de fase; el README.md va en la raíz.
- Los 14 módulos: el .docx solo da los nombres. La tabla de campos, geometrías y emojis de §11.3 es una propuesta del PROMPT_MAESTRO. Impleméntala, pero en MODELO_REQUERIMIENTOS marca esos campos como "propuestos". Si el curso definió otros atributos, pregúntame.
- Bienvenida: el .docx pide avatares "desde todas las esquinas, laterales y centro". Se mantienen los 8 puntos de §11.4 (4 esquinas, 2 laterales, centro-superior y centro-inferior) con el letrero "Hola" en el centro. Registra esta interpretación en MODELO_REQUERIMIENTOS.
- Footer: el .docx dice "sección inferior fija" y el PROMPT_MAESTRO no aclara si es fija. Pregúntame en el checkpoint si debe ser sticky o ir al final de cada página.
- Spritesheet (§11.4): (a) el fondo puede no ser #FF00FF exacto; usa distancia de color con tolerancia. (b) Recorta con la máscara del componente conectado de cada pose, no con rectángulos: en la hoja que medí, las cajas de las poses 4 y 5 se solapan unos 11 px en horizontal. (c) Usa una línea base común para las 6 poses y guarda en atlas.json, por frame, footX (punto medio de los pies) y offsetY. No centres por caja, porque el brazo de wave la descentra; y un anclaje inferior por frame haría perder la altura de jump, cuyos pies quedan unos 38 px sobre el suelo de las otras poses en la hoja que medí. (d) Verifica estas medidas sobre el archivo real antes de fijar el script.
- Datos: toda semilla inventada lleva source_type "seed" y verified false, y la UI la muestra como "dato de ejemplo". Nada de datos personales reales en catastro ni robos. Fotos: solo Wikimedia Commons con licencia libre o fotos mías; guarda autor, licencia y URL de origen en la tabla fotos.
- Verificación visual: propón Playwright como devDependency del frontend para capturas y pide mi autorización en el checkpoint. Presupuesto 3D: mide con renderer.info.render.triangles. Para FPS reporta el frame time medido en un navegador real; no afirmes "60 FPS" sin esa medida.
- Skills: carga cada skill al empezar el hito que lo necesita, no todos al inicio.
</correcciones_al_prompt_maestro>

<reglas_de_ejecucion>
Permitido sin preguntar: crear y editar archivos dentro de "Mini Marie/"; correr los comandos de build, test y lint del proyecto y docker compose; hacer commits locales atómicos en cada repo.
Pregúntame antes de: agregar dependencias fuera del stack de §8, borrar archivos, cambiar un esquema ya migrado, tocar algo fuera de "Mini Marie/", o hacer peticiones de red fuera de Overpass, Nominatim, datos.gov.co, Wikimedia y registros de paquetes.
Prohibido: editar, mover o borrar "MINI MARIE.png"; git push o force; instalaciones globales; credenciales reales en el repo (solo .env.example); mezclar el historial de los dos repos.
Detente y reporta cuando: la misma verificación falla 3 veces seguidas; un hito exige tocar más de 15 archivos no planeados; falta un recurso externo; dos fuentes se contradicen.
Evidencia: no digas "hecho" sin pegar el comando ejecutado y su salida real (pytest, vitest, check_line_length, axe, build).
Entre fases: deja en PLAN_MAESTRO.md qué está hecho, qué falta y qué decisiones se tomaron; yo haré /clear antes de la siguiente.
</reglas_de_ejecucion>
