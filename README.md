# 🌐 WebAR - Prototipo de Realidad Aumentada para Aula Virtual

Sistema interactivo de Realidad Aumentada basado en WebAR que permite a los usuarios cargar avatares personalizados desde Ready Player Me y visualizarlos en entorno AR sobre marcadores de imagen.

## ✨ Características Principales

- 📱 **Acceso desde navegador móvil** - Sin necesidad de instalar aplicaciones
- 🎨 **Avatares personalizados** - Integración con Ready Player Me API
- 🔄 **Modelos 3D interactivos** - Carga de archivos GLB personalizados
- 🎮 **Controles intuitivos** - Zoom, rotación, animaciones
- 🎯 **Integración Kahoot** - Conexión con herramientas de gamificación
- ⚡ **Rendimiento optimizado** - 30+ FPS en dispositivos móviles
- 🔍 **Detección de marcadores** - Usando AR.js y A-Frame

## 🚀 Inicio Rápido

### Requisitos
- Navegador moderno con soporte WebGL (Chrome, Firefox, Safari)
- Cámara web/móvil habilitada
- Conexión a Internet
- Marcador "Hiro" impreso o visible en pantalla

### Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   git clone <repository-url>
   cd Proyecto_Innovaciones
   ```

2. **Servir localmente (requiere servidor HTTP)**
   ```bash
   # Con Python 3
   python -m http.server 8000
   
   # Con Python 2
   python -m SimpleHTTPServer 8000
   
   # Con Node.js (http-server)
   npx http-server
   ```

3. **Abrir en navegador**
   ```
   http://localhost:8000
   ```

4. **Permitir acceso a cámara** cuando se solicite

## 📖 Guía de Uso

### Paso 1: Mostrar Marcador
Imprime o muestra en pantalla el marcador "Hiro" que encontrarás en:
- Carpeta: `docs/marcadores/`
- O en línea: [Descarga marcador](https://ar-js-org.github.io/AR.js-Docs/marker-based/marker_training/)

### Paso 2: Cargar Avatar
Elige una opción:

**Opción A: Ready Player Me (Recomendado)**
- Click en botón "🎨 Ready Player Me"
- Se abrirá el editor en nueva ventana
- Personaliza tu avatar
- Click en "Export" cuando termines
- El avatar cargará automáticamente

**Opción B: Subir GLB Local**
- Click en "📤 Subir GLB"
- Selecciona un archivo GLB de tu computadora
- El avatar cargará en la escena

**Opción C: Avatar Preestablecido**
- Click en "⭐ Preestablecido"
- Carga un avatar de ejemplo

### Paso 3: Interactuar
- **Girar**: Botones ⬅️ ➡️
- **Zoom**: Botones 🔍+ 🔍-
- **Reset**: Botón 🔄
- **Toque directo**: En dispositivo móvil, toca y arrastra para rotar

### Paso 4: Gamificar
- Ingresa tu nombre de usuario
- Click en "🎯 Acceder a Kahoot"
- Participa en el quiz con tu avatar personalizado

## 🏗️ Estructura del Proyecto

```
Proyecto_Innovaciones/
├── index.html                 # Página principal
├── styles.css                 # Estilos CSS
├── script.js                  # Lógica principal (módulo ES6)
├── config.js                  # Configuración global
├── PROPUESTA_TECNICA.md       # Documento técnico completo
├── README.md                  # Este archivo
├── docs/
│   ├── ARQUITECTURA.md        # Diagrama de arquitectura
│   ├── GUIA_IMPLEMENTACION.md # Guía detallada de implementación
│   ├── MARCADORES.md          # Información sobre marcadores
│   └── marcadores/
│       └── hiro.png           # Marcador Hiro para pruebas
├── assets/
│   ├── markers/               # Carpeta para marcadores NFT
│   └── models/                # Modelos 3D adicionales
└── exemplos/
    ├── robot-avatar.glb       # Ejemplo de avatar
    └── mascot-avatar.glb      # Otro ejemplo
```

## 🔧 Configuración

Edita `config.js` para personalizar:

```javascript
// Tamaño del marcador
MARKER_SIZE: 0.1

// Velocidad de rotación
ROTATION_SPEED: 0.01

// Rango de zoom
ZOOM_MIN: 0.5
ZOOM_MAX: 2.0

// URL de Ready Player Me
EDITOR_URL: 'https://rpm.me'
```

## 📚 Tecnologías

| Tecnología | Versión | Función |
|-----------|---------|---------|
| A-Frame | 1.4.2 | Framework AR/VR |
| AR.js | 3.4.5 | Detección de marcadores |
| Three.js | r128 | Motor 3D WebGL |
| GSAP | 3.12.2 | Animaciones |
| Ready Player Me API | v1 | Generación de avatares |

## 🎮 Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl+R` | Reiniciar avatar |
| `Ctrl+O` | Abrir archivo |
| `Ctrl+?` | Ayuda |

## 🛡️ Seguridad

- ✅ Todas las conexiones requieren HTTPS (excepto localhost)
- ✅ Validación de URLs y archivos
- ✅ CORS configurado para dominios autorizados
- ✅ Sin almacenamiento de datos personales en servidor
- ✅ Caché local seguro

## 📱 Compatibilidad

### Dispositivos Soportados

| Dispositivo | Navegador | Estado |
|-----------|-----------|--------|
| iPhone/iPad | Safari 13+ | ✅ Soportado |
| Android | Chrome 90+ | ✅ Soportado |
| Desktop | Chrome/Firefox | ✅ Soportado |
| Desktop | Safari | ✅ Soportado |

### Requisitos Mínimos

- **SO:** iOS 13+ o Android 8+
- **Cámara:** 5MP mínimo
- **RAM:** 2GB mínimo (4GB recomendado)
- **Almacenamiento:** 100MB libres
- **Conexión:** 4G/WiFi 5+ Mbps

## 🎨 Personalización

### Cambiar Colores

Edita las variables en `styles.css`:

```css
--primary: #6366f1;      /* Azul */
--secondary: #ec4899;     /* Rosa */
--danger: #ef4444;        /* Rojo */
```

### Agregar Marcadores Personalizados

1. Genera marcador NFT en [AR.js Marker Creator](https://carnaux.github.io/NFT-Marker-Creator/)
2. Coloca archivos `.fset`, `.iset`, `.f3d` en carpeta `assets/markers/`
3. Actualiza `config.js` con la ruta

### Usar Modelos Propios

1. Exporta modelo en formato GLB desde Blender/Maya/etc.
2. Coloca archivo en `exemplos/` o sube URL
3. Carga desde interfaz o URL

## 🐛 Solución de Problemas

### Marcador no se detecta
- Mejora la iluminación
- Aumenta el tamaño del marcador impreso
- Mantén la cámara perpendicular al marcador
- Prueba con el marcador Hiro de ejemplo

### Modelo parpadea o desaparece
- Aumentar clipping planes en config.js
- Reducir tamaño del marcador
- Mejorar iluminación ambiental

### Bajo rendimiento/FPS bajo
- Usar modelo 3D más simple
- Reducir calidad en config.js
- Desactivar rotación automática
- Usar dispositivo con más RAM

### CORS error
- Asegúrate de usar HTTPS
- Verifica que el servidor permita CORS
- Usa CDN de confianza para modelos

### Avatar no carga desde Ready Player Me
- Verifica que el formato sea GLB
- Comprueba que la URL sea válida
- Revisa la consola del navegador para errores

## 🤝 Integración con Kahoot

La integración con Kahoot permite:

1. Transferir nombre de usuario
2. Abrir sesión de quiz en nueva pestaña
3. Mantener contexto educativo

**Parámetros soportados:**
```javascript
username: "nombre_usuario"  // Nickname del estudiante
groupId: "grupo_id"         // ID del grupo (opcional)
```

## 📊 Monitoreo y Analytics

El sistema registra:
- FPS en tiempo real
- Detección de marcadores
- Modelos cargados
- Errores de carga

Accede a debug en consola:
```javascript
WebARDebug.state           // Estado global
WebARDebug.loadModel(url)  // Cargar modelo
WebARDebug.showMessage()   // Mostrar mensaje
```

## 🚀 Despliegue

### Servidor Local (Desarrollo)
```bash
python -m http.server 8000
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir .
```

### GitHub Pages
```bash
git push origin main
# Habilitar Pages en configuración del repo
```

### Servidor Propio
1. Copiar archivos a servidor web
2. Configurar HTTPS/SSL
3. Validar CORS headers
4. Probar en dispositivos móviles

## 📝 Licencia

Este proyecto es de código abierto. Consulta LICENSE.md para más detalles.

## 🙏 Agradecimientos

- **A-Frame Community** - Framework AR/VR
- **AR.js** - Detección de marcadores
- **Ready Player Me** - API de avatares
- **Three.js** - Motor 3D

## 📞 Soporte

Para reportar bugs o sugerencias:
1. Abre un issue en el repositorio
2. Describe el problema detalladamente
3. Adjunta capturas de pantalla si es posible
4. Incluye información del navegador/dispositivo

## 🔗 Enlaces Útiles

- [Documentación A-Frame](https://aframe.io/docs/)
- [Documentación AR.js](https://ar-js-org.github.io/AR.js-Docs/)
- [Ready Player Me](https://readyplayer.me/)
- [Kahoot](https://kahoot.it/)
- [Three.js Documentation](https://threejs.org/docs/)

---

**Versión:** 1.0  
**Última actualización:** Mayo 2026  
**Autor:** Equipo de Innovaciones Educativas

¡Disfruta creando experiencias educativas inmersivas con WebAR! 🎉
