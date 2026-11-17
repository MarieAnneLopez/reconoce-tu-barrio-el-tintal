<!-- Conversión literal de Especificaciones_Proyecto_Reconocimiento_Barrio-v4.docx (pandoc). No editar: es la fuente de verdad de los requisitos del curso. -->
<!-- Nota de proyecto (añadida, fuera del texto original): el muñeco de píxeles de este proyecto se llama Mini Marie. -->

# Aplicación Web de Reconocimiento de Barrio

**Estudiante: Marie Anne Lopez Poveda**

## 1. Conceptos Teóricos Vistos en Clase

Durante las sesiones se establecieron las siguientes bases teóricas:

- Modelo: Programa que define una estructura de red neuronal artificial para, dada una entrada general, generar una salida conforme a su entrenamiento.

- Tipos de Modelos: Generativos, Analíticos y Mixture of Experts (MOE).

- Ambientes de Ejecución: Nube, Local e Híbrido.

- Agentes: Conceptos fundamentales y su rol dentro de los sistemas.

## 2. Objetivo del Proyecto

Desarrollar una aplicación web de tres capas orientada a reconocer de manera detallada el barrio asignado.

## 3. Entregables y Requisitos Estrictos

El proyecto debe incluir estrictamente los siguientes componentes:

- Modelo de Requerimientos: Acorde a los 14 casos de uso definidos e implementados en clase.

- Arquitectura de la Solución: Diseño claro y documentado.

- Código Fuente: Implementación completa de la solución.

- Pruebas Automatizadas: Contar con una estrategia de pruebas definida (por ejemplo, mediante PyTest para el entorno Python).

**Componentes del Sistema (cada uno debe contar con su propio diseño):**

1.  Frontend

2.  API

3.  Backend

4.  Base de Datos

## 4. Recomendaciones y Normas de Desarrollo

- Principios SOLID: Es de carácter obligatorio aplicar la programación orientada a objetos cumpliendo con los principios SOLID en toda la estructura del código.

- Gestión de Repositorios: Se deben manejar dos repositorios independientes: uno exclusivo para el Frontend y otro para la API y el Backend.

- Modularidad Restringida: Todos los sistemas deben ser modulares. Ningún archivo de código puede superar las 100 líneas.

- Motor de Base de Datos: Para manejar la información geoespacial, se debe utilizar PostGIS, MySQL o Spatialite.

- Fuentes de Datos: Los datos del barrio deben extraerse usualmente de las APIs de Datos Abiertos de Bogotá o mediante OpenStreetMap.

## 5. Especificaciones de Diseño y Funcionalidad (Frontend)

La interfaz de usuario debe integrar los siguientes elementos y características visuales para asegurar una experiencia interactiva, accesible y moderna:

### 5.1. Estilo Visual y Paleta de Colores

- Diseño Futurista y Realista: La estética general debe tener un enfoque futurista, incorporando detalles altamente realistas y estéticamente atractivos.

- Paleta de Colores Oficial (Hexadecimales): El diseño visual de la interfaz se estructurará estrictamente utilizando la siguiente paleta:

\#0B131E (Fondo oscuro principal)

\#0B1E38 (Fondo secundario / Contenedores)

\#8AB4F8 (Acentos y textos claros)

\#1D4ED8 (Elementos interactivos / Botones)

\#3B82F6 (Resaltados y elementos activos)

### 5.2. Componentes Visuales Principales

- Animación Principal: En la parte superior (inicio) de la página, se ubicará un rectángulo grande que proyecte una animación representativa del barrio.

- Carrusel de Imágenes: El inicio contará con fotografías en movimiento que muestren el entorno del barrio.

- Pie de Página (Footer) y Perfil: Una sección inferior fija que incluirá un apartado de "Preguntas Frecuentes" y una sección de "Perfil de la Creadora". Allí se destacará la información de Marie Anne Lopez Poveda, bachiller con énfasis agroindustrial y estudiante de Ingeniería Catastral y Geodesia, residente de Funza.

### 5.3. Navegación y Accesibilidad

- Barra Lateral (Sidebar): Menú lateral para acceder a secciones comunes como ayudas, inicio de sesión y otros enlaces.

- Selector de Idioma: Opción visible para cambiar el idioma de la plataforma.

- Barra de Accesibilidad: Una barra en miniatura ubicada en el costado derecho que permita al usuario ajustar el contraste de la pantalla y aumentar o reducir el tamaño de la letra de manera dinámica.

- Contacto Directo (WhatsApp): Un botón o símbolo flotante de WhatsApp situado permanentemente en la esquina inferior derecha de la pantalla para facilitar el contacto directo con la creadora de la página.

### 5.4. Contenido Temático y Mapas (14 Casos de Uso)

- Sección de Historia Local: Un apartado dedicado exclusivamente a la historia del barrio, que incluya símbolos representativos como la bandera de la localidad.

- Mapa Principal 3D: La pantalla de inicio integrará un mapa principal renderizado en 3D para la exploración general del barrio.

- Listado de los 14 Casos de Uso (CRUDs): La aplicación se estructurará e implementará en torno a los siguientes 14 módulos de gestión y consulta geoespacial:

1\. CRUD CENTROS EDUCATIVOS

2\. CRUD ESCENARIOS DEPORTIVOS

3\. CRUD SISTEMAS DE CAMARAS DE SEGURIDAD

4\. CRUD ZONAS VERDES

5\. CRUD DATOS CATASTRALES

6\. CRUD ESTADO DE CALLES

7\. CRUD ESTACIONES DEL SISTEMA DE TRANSPORTE

8\. CRUD SITIOS DE COMIDA

9\. CRUD LIBRERIAS

10\. CRUD DATOS SOBRE ROBOS

11\. CRUD INFORMACION O DATOS DE LA LOCALIDAD

12\. CRUD CENTROS DE ATENCION INMEDIATA

13\. CRUD VETERINARIAS

14\. CRUD BARBERIAS

- Mapas Temáticos Interactivos: Cada uno de los 14 casos de uso contará con su propio mapa interactivo.

- Iconografía Dinámica (Emojis): Los elementos dentro de cada mapa temático estarán representados por iconos o emojis específicos según la temática (ej. un icono de chef en el mapa para la sección de sitios de comida).

- Galerías Contextuales: Cada apartado de consulta mostrará fotografías reales y detalladas de los establecimientos o lugares que se están revisando.

- Sistema de Calificación: Se implementará una lista o ranking visible con la calificación en estrellas de los restaurantes y demás establecimientos del barrio.

### 5.5. Asistencia Virtual y Animaciones (Chatbot)

- Animación de Bienvenida: Al ingresar a la página por primera vez, el usuario será recibido por múltiples versiones del avatar de píxeles emergiendo desde todas las esquinas, laterales y centro de la pantalla, saludando efusivamente junto con un gran letrero que diga "Hola".

- Chatbot Interactivo: Integración de un asistente virtual principal cuyo avatar será un "muñeco de píxeles" (pixel art). Este personaje cambiará sus expresiones y reacciones en tiempo real dependiendo de las acciones y navegación del usuario.

- Animación de Carga (Loading): Al hacer clic en enlaces o secciones que requieran tiempo de procesamiento, aparecerá una barra de carga interactiva acompañada por el muñeco de píxeles corriendo animadamente sobre dicha barra mientras avanza el progreso.
