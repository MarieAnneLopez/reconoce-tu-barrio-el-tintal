# H35 — revisión de fotografías pendientes

Fecha: 20 de noviembre de 2026. Alcance: 267 fichas publicadas, no marcadas como datos de ejemplo y sin entrada de fotografía en las semillas al momento de preparar `.git/e4-audit/missing.json`. El inventario procede de los nueve módulos incluidos en `.git/e4-audit/photos.py`; no representa todas las fichas del proyecto.

## Resultado

En el conjunto guardado de resultados de Wikimedia Commons no se encontró una correspondencia identificada con certeza entre fotografía y ficha que permita recomendar una incorporación. Las 267 quedan **sin foto identificada en esta revisión**, con el aviso previsto por D78. Esto no demuestra que no existan fotografías en otras fuentes ni constituye una inspección visual individual de 267 lugares. No se ha descargado ni integrado ninguna imagen para estas fichas.

[Inventario de fichas](H35-fichas-sin-foto.csv) conserva módulo, nombre, referencia de la ficha, geometría, enlace a la candidata georreferenciada más cercana y distancia aproximada. Para polígonos se usa la media de los vértices, no la distancia a su límite; es solo una pista de revisión y no identifica el objeto fotografiado. El mismo enlace puede aparecer en varias fichas. [Metadatos de candidatas](H35-candidatas-commons.csv) conserva títulos, descripciones, autores, licencias y enlaces tal como fueron devueltos por Commons; algunos valores contienen marcado HTML y campos vacíos. La existencia de licencia y autor por sí sola no prueba la correspondencia geográfica ni la adecuación de una imagen.

## Excepciones y límites

- Los resultados geográficos guardados abarcan 15 archivos; los resultados por texto cubren seis consultas concretas sobre Tintal, Tintal Plaza, CAI y Manuel Cepeda Vargas. El archivo de metadatos contiene 23 resultados combinados, entre ellos imágenes de biblioteca, fauna, campus, atardeceres y otros asuntos no identificados como alguna de las fichas pendientes.
- La vista de Tintal Plaza identifica el centro comercial, pero no identifica los locales individuales que figuran en sus fichas. Las imágenes de biblioteca identifican la biblioteca, no los puntos cercanos por mera proximidad. Una imagen titulada «Tintala» no demuestra que muestre una parada específica de transporte.
- Esta conclusión procede de nombres, descripciones, coordenadas y metadatos guardados, no de una verificación fotográfica exhaustiva. Antes de incorporar cualquier candidata se debe confirmar que representa el lugar preciso, revisar visualmente la imagen y comprobar condiciones y atribución en su página de Commons.
- La consulta obligatoria al Segundo Cerebro no se pudo ejecutar: el archivo `cerebro_core/buscar.py` no existe en la ruta indicada en las instrucciones del proyecto. No se infirió contenido de esa fuente.

## Medición de paleta pendiente

Se preparó `.git/e4-audit/palette.mjs`; `node --check .git/e4-audit/palette.mjs` terminó con código 0. Aún no se han capturado las 20 combinaciones ni se ha determinado cumplimiento. Para ejecutarlo, con el servidor disponible y previa coordinación del único navegador permitido: `node .git/e4-audit/palette.mjs`. Puede indicarse la dirección con `PALETTE_URL`; por defecto usa `http://localhost:4173`. Escribe capturas y resultados en `.git/e4-audit/palette/`, abre un solo navegador y cierra cada página.

Las capturas enmascaran imágenes, vídeo, canvas, mapas MapLibre y elementos con imágenes de fondo. Clasifican colores por distancia RGB máxima 30 a los cinco tonos D100, y declaran por separado píxeles excluidos y no clasificados; los porcentajes usan solo los clasificados. Esto es una aproximación que requiere inspeccionar las máscaras y los no clasificados antes de comparar con 60/18/12/5/5 ±3 puntos: el texto, degradados, sombras y elementos sin clasificar pueden afectar la interpretación. El mapa debe revisarse visualmente para comprobar que todos sus componentes quedaron excluidos. Las capturas representan el estado cargado en el momento de la prueba.
