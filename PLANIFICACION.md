# Proyecto AulaRA - Planificación y Diseño

## 1. Requerimientos del Sistema

### Requerimientos Funcionales
1. **Autenticación Básica:** Un sistema de ingreso por nombre de usuario para identificar al estudiante.
2. **Dashboard / Home:** Una vista principal que muestre el resumen del perfil del estudiante y acceso a las diferentes secciones.
3. **Perfil y Avatar (Estilo Mii):**
   - Visualización 3D del avatar del usuario en su perfil.
   - Perfil visible (simulado) donde se vea la lista de otros compañeros y sus avatares.
   - Capacidad de personalizar características simples del avatar (ej. color de ropa, expresión) utilizando A-Frame.
4. **Laboratorio de Realidad Aumentada (RA):**
   - Una sección dedicada donde el estudiante pueda cargar sus propios modelos 3D (formato `.glb`).
   - Visualización en el navegador y capacidad de proyectarlo en el mundo real usando marcadores (Hiro) mediante AR.js.
5. **Gamificación y Misiones:**
   - Un sistema de preguntas interactivas, estéticamente integrado.
   - Progreso visual: experiencia y desbloqueo de medallas.

### Requerimientos No Funcionales
1. **Estética y UI/UX:** Diseño premium con temática futurista, *glassmorphism* (efecto cristal), modo oscuro y acentos de color neón (índigo/cian).
2. **Tecnologías:** HTML5, CSS3, JavaScript Vanilla, A-Frame, AR.js.
3. **Estructura:** Single Page Application (SPA) simulada con JavaScript para transiciones fluidas sin recargar la página.

---

## 2. Diseño de la Interfaz (UI/UX)

### Temática Visual: "Aula del Futuro"
- **Paleta de Colores:** Fondo oscuro (`#0f172a`), paneles semi-transparentes (`rgba(30, 41, 59, 0.7)`), acentos en índigo (`#6366f1`) y cian (`#06b6d4`).
- **Tipografía:** *Outfit* (Google Fonts) para un aspecto moderno y limpio.
- **Interacciones:** Hover states brillantes, transiciones suaves (fade-in), diseño responsivo.

### Estructura de Secciones
1. **Login:** Tarjeta flotante centrada sobre el fondo del aula.
2. **Navegación (Sidebar):** Menú lateral para cambiar entre las secciones principales.
3. **Vista de Perfil:**
   - Panel izquierdo: Renderizado 3D del avatar con controles de personalización (colores).
   - Panel derecho: Lista de "Compañeros Conectados".
4. **Laboratorio RA:**
   - Área de carga de archivos (Drag & Drop o botón elegante).
   - Botón de "Iniciar Proyección (Cámara)" para lanzar la escena de AR.js.
5. **Misiones:**
   - Tarjetas interactivas con preguntas estilo trivia.
   - Feedback visual inmediato (correcto/incorrecto) con partículas o colores.

---

## 3. Plan de Tareas (Roadmap)

### Fase 1: Fundamentos (Estructura y Estilos)
- [ ] Configurar archivos base: `index.html`, `styles.css`, `script.js`.
- [ ] Implementar el sistema de diseño CSS (Variables, utilidades de *Glassmorphism*).
- [ ] Construir la pantalla de Login y el esqueleto de la aplicación (Sidebar + Contenido).
- [ ] Crear el gestor de estado en JS para cambiar de pestañas (Tabs).

### Fase 2: Módulo de Perfil y Avatar 3D
- [ ] Incluir librería A-Frame en el proyecto.
- [ ] Crear la escena 3D dentro del perfil para mostrar un avatar base (un modelo `.glb` sencillo).
- [ ] Añadir controles de UI para cambiar colores de materiales del avatar usando eventos de A-Frame en JS.

### Fase 3: Laboratorio de Realidad Aumentada
- [ ] Diseñar el componente UI para seleccionar archivos `.glb` locales.
- [ ] Configurar la escena de AR.js oculta por defecto.
- [ ] Escribir la lógica JS para cargar la URL del objeto (`URL.createObjectURL`) dentro del componente `<a-gltf-model>` de la escena AR.

### Fase 4: Módulo de Gamificación
- [ ] Maquetar la sección de Misiones/Retos con preguntas predefinidas.
- [ ] Lógica para validar respuestas y sumar puntos.
- [ ] Ajustar detalles estéticos (animaciones de acierto/error).
