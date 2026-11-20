# Informe E4 — Galería, pulido y entrega académica

20 de noviembre de 2026 · Reconoce tu Barrio: El Tintal · Marie Anne Lopez Poveda

## Entregables del curso

- El [modelo de requerimientos](MODELO_REQUERIMIENTOS.md) presenta los 14 módulos CRUD y sus reglas. El [modelo UML en XMI](../modelio_export/diagrama_casos_uso.xmi) representa la consulta de esos módulos por el actor Vecino, llamado Visitante en el documento de requerimientos.
- La [arquitectura](ARQUITECTURA.md) describe las tres capas. Los diseños detallan [frontend](DISENO_FRONTEND.md), [API](DISENO_API.md), [backend](DISENO_BACKEND.md) y [base de datos](DISENO_BASE_DATOS.md).
- El [README](../README.md) reúne los repositorios de documentación, frontend y backend, con comandos para clonar, instalar y arrancar la aplicación en Windows.
- La [estrategia de pruebas](ESTRATEGIA_PRUEBAS.md) y la [lista de comprobación SOLID](CHECKLIST_SOLID.md) acompañan la entrega.

## Importación directa en Modelio

Modelio Open Source 5.4.1 abrió un proyecto de comprobación llamado E4. El comando por lotes ejecutó el importador nativo del complemento `org.modelio.app.xmi` mediante `XMIService.importXMIModel`, con los servicios del proyecto y su metamodelo. La lectura de la sesión posterior a la importación devolvió estos recuentos:

```text
ROOT e4
Actor 1
Vecino
UseCase 14
Association 14
```

Se cotejaron los nombres de Modelio con la [especificación original, §5.4](origen/ESPECIFICACION_ORIGINAL_v4.md), normalizando mayúsculas y tildes y conservando el número de cada caso. Una lectura de las asociaciones comprobó que cada caso tenía un extremo en Vecino. El contraste por consola confirmó **14/14 nombres y 14/14 asociaciones**, con esta correspondencia:

| Caso | Nombre importado | Actor asociado |
|---|---|---|
| CU-01 | Centros Educativos | Vecino |
| CU-02 | Escenarios Deportivos | Vecino |
| CU-03 | Sistemas de Cámaras de Seguridad | Vecino |
| CU-04 | Zonas Verdes | Vecino |
| CU-05 | Datos Catastrales | Vecino |
| CU-06 | Estado de Calles | Vecino |
| CU-07 | Estaciones del Sistema de Transporte | Vecino |
| CU-08 | Sitios de Comida | Vecino |
| CU-09 | Librerías | Vecino |
| CU-10 | Datos sobre Robos | Vecino |
| CU-11 | Información o Datos de la Localidad | Vecino |
| CU-12 | Centros de Atención Inmediata | Vecino |
| CU-13 | Veterinarias | Vecino |
| CU-14 | Barberías | Vecino |

`Get-FileHash "modelio_export/diagrama_casos_uso.xmi"` devolvió SHA-256 `065634de67d3d6c9128dc6c21c7009f433536d5839d523ba6a599f6fab9ddbb9`. La prueba usó el XMI como entrada y la API de importación de Modelio. El generador del diagrama queda disponible para reproducir su distribución gráfica desde la [guía de trazabilidad](../modelio_export/trazabilidad_modelio.md). La nota de esa guía sobre el XMI corresponde a la prueba del 16 de noviembre; la evidencia de esta sección es del 20 de noviembre.

## Pruebas de las ramas archivadas

| Referencia de frontend | Evidencia en la copia de trabajo de E4 |
|---|---|
| `gran/deploy-archivo` · `1313547` | El control E2E de foco sigue presente en `e2e/focus.spec.ts` para créditos de fotos y barberías. El E2E de Inicio conserva las comprobaciones de HUD, reel, desbordamiento y errores de consola. Su distribución esperada es ahora de 1, 10, 2 y 3 pantallas (D104). |
| `gran/deploy-archivo` · `1313547` | `e2e/map.spec.ts` conserva en la rama archivada los casos sobre ubicación de marcadores, fuente Inter y anillo de foco del antiguo MapLibre. Quedan como referencia histórica para esa implementación. El frontend actual tiene pruebas de `MapStage`, `MapPage`, la leyenda, la vista de cámara y la paleta. `vitest.clean.config.ts` era una configuración de la copia de prueba que permitía cargar dependencias enlazadas desde otra ruta. |
| `gran/escaner-estado` · `5433ff0` | `src/components/ui/stateScan.test.ts` y `src/test/stateScan.ts` están en la copia de trabajo de E4. El escáner prueba la presencia de iconos en mensajes semánticos y enumera regiones vivas neutras. Su resultado se registra en la verificación global del frontend. |

## Desviaciones y comprobaciones de E4

| Tema | Resultado |
|---|---|
| Especificación visual | La fuente del curso fija una paleta oscura en §5.1. El proyecto adoptó en D100 crema, rosa claro, rosa, amarillo y marrón para la interfaz. D83 define el tratamiento de los mapas. La [decisión de diseño](DISENO-V3.md) especifica la meta de reparto de 60/18/12/5/5 con tolerancia de ±3 puntos. El cumplimiento se determina con las mediciones de cierre. |
| Imágenes de lugares | La especificación pide fotografías contextuales. H35 revisó el inventario de 267 fichas sin foto de nueve módulos y encontró cero incorporaciones con correspondencia demostrada en la búsqueda guardada de Commons. Las fichas conservan el aviso de D78 y el [informe H35](INFORME_H35_fotografias.md) documenta la cobertura de la revisión. |
| Modelo UML | El XMI intercambia las entidades y enlaces del modelo. El alcance de la prueba directa fue la importación del modelo y el contraste de sus relaciones en la sesión de Modelio. |
| Maqueta y movimiento | En Edge con una RTX 4050 a 1440 × 900, la rueda y el primer arrastre movieron la posición y el objetivo de la cámara. Se observaron cielo nocturno, 6,94–7,06 ms por cuadro y cero errores de consola en esa ejecución. Las comparaciones de carrera, saludo y sentada están en [capturas E4](capturas/e4/). |

## Atribuciones

| Material | Crédito y respaldo |
|---|---|
| Edificios, huellas, placas y sectores catastrales | Catastro Bogotá (UAECD) y Datos Abiertos Bogotá. CC BY 4.0. Las capas, versiones, orígenes y fechas se conservan en `barrio-frontend/public/data/tintal/manifest.json`. |
| Red vial, suelo, cruces y complemento cartográfico | © colaboradores de OpenStreetMap. ODbL 1.0. El manifiesto 3D conserva el servicio y la versión. [OpenStreetMap](https://www.openstreetmap.org/copyright) |
| Fotos de Inicio y fichas | El catálogo `barrio-frontend/src/features/home/carouselCredits.json` conserva autor, licencia y enlace por foto de Commons. El ETL de fichas exige autor, licencia y página de origen en las semillas de Commons y Mapillary. [Inventario de fuentes de la gran actualización](INFORME-GRAN-ACTUALIZACION.md) |
| Tipografía Soria | SIL Open Font License 1.1, incluida en `barrio-frontend/public/assets/fonts/soria/OFL.txt`. |
| Mini Marie y cielo de la maqueta | El spritesheet original de Mini Marie está en la raíz del repositorio académico. E4 incorpora intermedios de carrera, saludo y sentada, y un WebP para la nube nocturna, generados con ImageGen. Las comparaciones documentan la integración con el material del proyecto. |
