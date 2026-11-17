# Trazabilidad Modelio — Reconoce tu Barrio: El Tintal

Actor único: **Vecino** (en los documentos del proyecto aparece como «Visitante»). Los casos usan el prefijo `CU-` para no chocar con los `RF-01…RF-16` de `docs/MODELO_REQUERIMIENTOS.md` (§5).

| ID | Requerimiento original (archivo fuente) | Nombre del Caso de Uso en Modelio | Conexión |
|---|---|---|---|
| CU-01 | Centros Educativos (docs/MODELO_REQUERIMIENTOS.md (§3), fila 1) | CU-01: Centros Educativos | Vecino —— CU-01 |
| CU-02 | Escenarios Deportivos (docs/MODELO_REQUERIMIENTOS.md (§3), fila 2) | CU-02: Escenarios Deportivos | Vecino —— CU-02 |
| CU-03 | Sistemas de Cámaras de Seguridad (docs/MODELO_REQUERIMIENTOS.md (§3), fila 3) | CU-03: Sistemas de Cámaras de Seguridad | Vecino —— CU-03 |
| CU-04 | Zonas Verdes (docs/MODELO_REQUERIMIENTOS.md (§3), fila 4) | CU-04: Zonas Verdes | Vecino —— CU-04 |
| CU-05 | Datos Catastrales (docs/MODELO_REQUERIMIENTOS.md (§3), fila 5) | CU-05: Datos Catastrales | Vecino —— CU-05 |
| CU-06 | Estado de Calles (docs/MODELO_REQUERIMIENTOS.md (§3), fila 6) | CU-06: Estado de Calles | Vecino —— CU-06 |
| CU-07 | Estaciones del Sistema de Transporte (docs/MODELO_REQUERIMIENTOS.md (§3), fila 7) | CU-07: Estaciones del Sistema de Transporte | Vecino —— CU-07 |
| CU-08 | Sitios de Comida (docs/MODELO_REQUERIMIENTOS.md (§3), fila 8) | CU-08: Sitios de Comida | Vecino —— CU-08 |
| CU-09 | Librerías (docs/MODELO_REQUERIMIENTOS.md (§3), fila 9) | CU-09: Librerías | Vecino —— CU-09 |
| CU-10 | Datos sobre Robos (docs/MODELO_REQUERIMIENTOS.md (§3), fila 10) | CU-10: Datos sobre Robos | Vecino —— CU-10 |
| CU-11 | Información o Datos de la Localidad (docs/MODELO_REQUERIMIENTOS.md (§3), fila 11) | CU-11: Información o Datos de la Localidad | Vecino —— CU-11 |
| CU-12 | Centros de Atención Inmediata (docs/MODELO_REQUERIMIENTOS.md (§3), fila 12) | CU-12: Centros de Atención Inmediata | Vecino —— CU-12 |
| CU-13 | Veterinarias (docs/MODELO_REQUERIMIENTOS.md (§3), fila 13) | CU-13: Veterinarias | Vecino —— CU-13 |
| CU-14 | Barberías (docs/MODELO_REQUERIMIENTOS.md (§3), fila 14) | CU-14: Barberías | Vecino —— CU-14 |

## Cómo usarlo en Modelio (4 pasos)

**Opción A — importar el `.xmi`**
1. Abre o crea un proyecto en Modelio.
2. Menú *Archivo → Importar → XMI* y elige `diagrama_casos_uso.xmi`.
3. En el explorador de modelo, crea un *Use Case Diagram* en el paquete y arrastra el actor y los casos.
4. Guarda el proyecto.

**Opción B — script (dibuja el diagrama completo)**
1. Abre un proyecto en Modelio y selecciona su paquete raíz en el explorador.
2. Abre la consola de macros (Jython) y carga `generar_diagrama_modelio.py`.
3. Ejecútalo: crea paquete, actor, 14 casos, 14 asociaciones y el diagrama.
4. Abre el diagrama «Casos de uso» y guarda.

> Aviso: la importación XMI y la API de macros varían entre versiones de Modelio; no se probaron porque Modelio no está instalado en este equipo.
