# 🧪 AulaRA - Laboratorio de Realidad Aumentada Educativa

AulaRA es una plataforma de educación inmersiva (SPA) diseñada para transformar el aprendizaje mediante el uso de **Realidad Aumentada (WebAR)** y **Gamificación**. Permite a estudiantes y docentes visualizar conceptos complejos en 3D y poner a prueba sus conocimientos a través de misiones interactivas.

## ✨ Características Principales

- 🔬 **Laboratorio RA Profesional**: Sistema de dos fases para la gestión de modelos 3D.
  - **Vista Previa**: Previsualización instantánea de archivos `.glb` y `.gltf` sin activar la cámara.
  - **Proyector RA**: Inyección dinámica del modelo en el mundo real usando marcadores.
- 🎮 **Misiones Gamificadas (Estilo Kahoot)**: Sistema de evaluación interno con temporizador, feedback visual y puntuaciones en tiempo real (Biología, Matemáticas, Ética).
- 📸 **Control de Privacidad**: Sistema de encendido/apagado forzoso de cámara web para mayor seguridad del usuario.
- 🎨 **Diseño Moderno (Glassmorphism)**: Interfaz estética con efectos de desenfoque, degradados neón y animaciones fluidas.
- 📱 **Web-Based**: Funciona directamente en el navegador sin instalaciones (requiere HTTPS o localhost).

## 🚀 Inicio Rápido

### Requisitos
- Navegador moderno (Chrome, Edge, Safari o Firefox).
- Cámara web operativa.
- Un marcador **Hiro** (impreso o en otra pantalla).

### Instalación Local
1. Descarga o clona el repositorio.
2. Abre la carpeta en tu terminal.
3. Sirve el proyecto usando un servidor local (obligatorio para la cámara):
   ```bash
   # Opción con Python
   python -m http.server 3000
   
   # Opción con Node.js
   npx http-server -p 3000
   ```
4. Accede a `http://localhost:3000`.

## 📖 Guía de Uso

### 1. Acceso
Ingresa un nombre de usuario (ej: `estudiante1`) para entrar al dashboard principal.

### 2. Laboratorio RA
- **Pestaña Modelo 3D**: Haz clic en "Subir Archivo" y selecciona un modelo `.glb`. Verás una vista previa 3D interactiva de inmediato.
- **Pestaña Cámara RA**: Haz clic en "Activar Cámara". Cuando veas el video, apunta al **Marcador Hiro** para proyectar tu modelo. 
- **Apagar**: Usa el botón "🛑 Apagar Cámara" para desconectar el hardware de video en cualquier momento.

### 3. Misiones
- Ve a la sección **Misiones**.
- Elige una materia (Biología, Matemáticas o Ética).
- Responde las preguntas antes de que se agote el tiempo (15 segundos por pregunta).

## 🛠️ Tecnologías Utilizadas

- **A-Frame (1.4.2)**: Motor para la escena de Realidad Aumentada.
- **AR.js**: Detección de marcadores y seguimiento de cámara.
- **Google Model-Viewer**: Previsualización 3D optimizada y ligera.
- **Vanilla JavaScript (ES6+)**: Lógica de la aplicación y sistema de SPA.
- **CSS3 Moderno**: Diseño responsivo y efectos visuales de alta gama.

## 🎯 Marcadores
Para proyectar los modelos, utiliza el marcador estándar **Hiro**. Puedes encontrarlo aquí:
[Descargar Marcador Hiro](https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png)

## 🛡️ Seguridad y Privacidad
El sistema incluye un **Interceptor de Hardware** que garantiza que el flujo de video se detenga físicamente cuando el usuario cierra la sesión de RA, protegiendo la privacidad del estudiante.

---
**Versión:** 2.0 (Edición Laboratorio)  
**Última actualización:** Mayo 2026  
**Desarrollado para:** Innovación Educativa AulaRA
