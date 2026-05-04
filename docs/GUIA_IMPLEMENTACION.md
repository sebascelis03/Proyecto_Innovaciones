# 📋 GUÍA DE IMPLEMENTACIÓN - Sistema WebAR

## 1. INTRODUCCIÓN

Esta guía proporciona instrucciones paso a paso para implementar y personalizar el sistema WebAR en un entorno educativo.

---

## 2. REQUISITOS PREVIOS

### 2.1 Hardware
- Computadora con navegador moderno
- Cámara web (para desarrollo)
- Dispositivo móvil (para pruebas)
- Marcador impreso o pantalla para mostrar marcador

### 2.2 Software
- Navegador: Chrome 90+, Firefox 88+, Safari 14+
- Editor de código: VS Code, Sublime, etc.
- Herramientas: git, npm (opcional)
- Servidor HTTP: Python, Node.js, o similar

### 2.3 Conocimientos
- HTML5 básico
- CSS3 básico
- JavaScript ES6+ fundamental
- Conceptos de Realidad Aumentada (básico)

---

## 3. INSTALACIÓN Y CONFIGURACIÓN

### 3.1 Opción 1: Descarga Manual

```bash
# 1. Descargar proyecto
# (Descargar ZIP del repositorio)

# 2. Extraer en directorio del proyecto
unzip Proyecto_Innovaciones-main.zip
cd Proyecto_Innovaciones

# 3. Servir localmente
python -m http.server 8000

# 4. Acceder en navegador
# http://localhost:8000
```

### 3.2 Opción 2: Clonar con Git

```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/Proyecto_Innovaciones.git
cd Proyecto_Innovaciones

# 2. Servir con Node.js
npx http-server

# 3. Acceder en navegador
# http://localhost:8080
```

### 3.3 Opción 3: Docker (Avanzado)

```dockerfile
# Dockerfile
FROM node:16
WORKDIR /app
COPY . .
RUN npm install -g http-server
EXPOSE 8080
CMD ["http-server", "-p", "8080"]
```

```bash
# Construir y ejecutar
docker build -t webarx .
docker run -p 8080:8080 webarx
```

---

## 4. CONFIGURACIÓN INICIAL

### 4.1 Editar config.js

```javascript
// config.js - Personalizar según necesidad

export const CONFIG = {
    // Cambiar marcador
    MARKER_SIZE: 0.1,  // Tamaño del marcador (metros)
    
    // Personalizar colores
    UI: {
        PRIMARY_COLOR: '#6366f1',      // Azul (cambiar si deseas)
        SECONDARY_COLOR: '#ec4899',    // Rosa
    },
    
    // Modelos predefinidos
    MODELS: {
        PREDEFINED: [
            {
                name: 'Mi Avatar Especial',
                url: './exemplos/robot-avatar.glb',
            }
        ]
    },
};
```

### 4.2 Actualizar HTML

```html
<!-- index.html - Personalizar título -->
<title>WebAR - Mi Aula Virtual</title>

<!-- Cambiar nombre del proyecto en header -->
<h1 class="title">🌐 Mi Plataforma de RA</h1>
```

### 4.3 Personalizar CSS

```css
/* styles.css - Cambiar tema de colores */

:root {
    --primary: #6366f1;       /* Azul principal */
    --secondary: #ec4899;     /* Secundario */
    --background: #0a0f23;    /* Fondo oscuro */
}
```

---

## 5. INTEGRACIÓN DE MARCADORES

### 5.1 Usar Marcador Hiro (Predefinido)

El sistema viene configurado con el marcador "Hiro" de A-Frame.

```html
<!-- index.html -->
<a-marker preset="hiro">
    <!-- Avatar aquí -->
</a-marker>
```

### 5.2 Crear Marcador NFT Personalizado

#### Paso 1: Generar Marcador

1. Ir a [AR.js Marker Creator](https://carnaux.github.io/NFT-Marker-Creator/)
2. Subir imagen con características visibles (>500x500px)
3. Esperar procesamiento (2-5 minutos)
4. Descargar archivos: `.fset`, `.iset`, `.f3d`

#### Paso 2: Agregar al Proyecto

```bash
# Crear carpeta para marcador
mkdir assets/markers/miMarcador

# Copiar archivos descargados
# - miMarcador.fset
# - miMarcador.iset
# - miMarcador.f3d
```

#### Paso 3: Actualizar HTML

```html
<!-- Cambiar preset a nft -->
<a-nft type="nft" url="./assets/markers/miMarcador">
    <a-entity id="avatar-container">
        <!-- Avatar aquí -->
    </a-entity>
</a-nft>
```

#### Paso 4: Actualizar config.js

```javascript
export const CONFIG = {
    AR: {
        TRACKING_TYPE: 'nft',
        MARKER_PATH: './assets/markers/miMarcador',
    }
};
```

### 5.3 Usar Marcador QR (Alternativa)

```html
<!-- Usar QR en lugar de NFT -->
<a-marker preset="qr" type="qr">
    <a-entity id="avatar-container">
    </a-entity>
</a-marker>
```

---

## 6. INTEGRACIÓN DE READY PLAYER ME

### 6.1 Obtener URL de Avatar

1. Ir a [Ready Player Me Editor](https://rpm.me)
2. Crear o personalizar avatar
3. Click en "Export"
4. Copiar URL de descarga GLB

**Formato URL:**
```
https://models.readyplayer.me/[USER_ID].glb
```

### 6.2 Validar Integración

```javascript
// En consola del navegador
WebARDebug.loadModel('https://models.readyplayer.me/[USER_ID].glb')
```

### 6.3 Personalizar Avatares

```javascript
// config.js
RPM: {
    // Parámetros de customización
    CUSTOM_PARAMS: {
        bodyType: 'fullbody',        // o 'halfbody'
        gender: 'male',              // Predefinir género
        skin_tone: 'medium',         // Tono de piel
    }
}
```

---

## 7. CARGA DE MODELOS 3D PERSONALIZADOS

### 7.1 Preparar Modelos en Blender

1. Crear/importar modelo 3D
2. Optimizar geometría (decimation)
3. Baking de texturas (si es necesario)
4. Exportar como GLB:
   - Archivo → Exportar → glTF Binary (.glb)
   - Seleccionar opciones:
     - ✅ Animation
     - ✅ Shape Keys
     - ✅ Armatures
     - ✅ Include Normals

### 7.2 Optimizar para Web

```bash
# Usar herramientas de compresión
# Opción 1: gltf-transform (Node.js)
npm install -g @gltf-transform/cli
gltf-transform optimize modelo.glb modelo-optimized.glb

# Opción 2: Babylon.js Playground
# Cargar GLB en https://playground.babylonjs.com/
# Exportar optimizado
```

### 7.3 Subir a CDN

```javascript
// Usar servicio gratuito como:
// - Dropbox
// - Google Drive (enlace público)
// - Netlify
// - Vercel
// - Firebase Storage

// Ejemplo con Dropbox
const modelUrl = 'https://dl.dropboxusercontent.com/s/xxxxx/modelo.glb?dl=1'
WebARDebug.loadModel(modelUrl)
```

### 7.4 Servir Localmente

```bash
# Crear carpeta assets
mkdir assets/models
# Copiar modelo GLB
cp mi-modelo.glb assets/models/

# Cargar en aplicación
const url = './assets/models/mi-modelo.glb'
loadModel(url)
```

---

## 8. CONFIGURACIÓN DE GAMIFICACIÓN

### 8.1 Integración con Kahoot

```javascript
// config.js - Personalizar URL
GAMIFICATION: {
    KAHOOT_URL: 'https://kahoot.it/',
    // Parámetros automáticos
    USER_PARAMS: {
        includeNickname: true,
        includeGroupId: true,
        trackingEnabled: false,
    }
}
```

### 8.2 Crear Quiz en Kahoot

1. Ir a [Kahoot.it](https://kahoot.it/)
2. Login o crear cuenta
3. Crear nuevo Kahoot
4. Agregar preguntas
5. Obtener PIN de sesión

### 8.3 Conectar Sesión

```javascript
// Cuando usuario hace click en botón Kahoot
const kahootPin = '123456'  // PIN del Kahoot
const userName = DOM.userNickname.value

// Se abre en nueva pestaña
window.open(`https://kahoot.it/?pin=${kahootPin}&username=${userName}`)
```

### 8.4 Alternativas de Gamificación

```javascript
// Integración con Quizziz
window.open('https://quizizz.com/admin')

// Integración con Microsoft Forms
window.open('https://forms.microsoft.com/')

// Integración con Google Forms
window.open('https://forms.google.com/')
```

---

## 9. PERSONALIZACIÓN DE INTERFAZ

### 9.1 Cambiar Colores Principales

```css
/* styles.css */
:root {
    --primary: #3b82f6;          /* Azul */
    --secondary: #8b5cf6;        /* Púrpura */
    --danger: #f87171;           /* Rojo */
    --success: #34d399;          /* Verde */
}

.btn-primary {
    background: linear-gradient(135deg, var(--primary), #4f46e5);
}
```

### 9.2 Agregar Logo de Institución

```html
<!-- index.html - En header -->
<img src="./assets/logo.png" class="institution-logo" alt="Logo">
```

```css
/* styles.css */
.institution-logo {
    height: 40px;
    margin-right: 16px;
    filter: brightness(0) invert(1);  /* Invertir para fondo oscuro */
}
```

### 9.3 Personalizar Textos

```javascript
// script.js - Cambiar mensajes
function init() {
    showMessage('Bienvenido a la plataforma educativa de RA', 'info')
}

// Cambiar botones
DOM.btnKahoot.textContent = '📊 Ir a Evaluación'
DOM.btnRpm.textContent = '👥 Crear Tu Avatar Único'
```

### 9.4 Agregar Secciones Adicionales

```html
<!-- Agregar nueva sección en panel -->
<div class="section">
    <h3 class="section-title">📚 Recursos</h3>
    <button class="btn btn-secondary">
        📖 Ver Materiales
    </button>
    <button class="btn btn-secondary">
        🎓 Tutorial
    </button>
</div>
```

---

## 10. OPTIMIZACIÓN DE RENDIMIENTO

### 10.1 Optimizar Modelos 3D

```javascript
// config.js - Activar Draco compression
MODELS: {
    USE_DRACO: true,          // Compresión
    EXAMPLES_PATH: './exemplos/',
}
```

### 10.2 Configurar Calidad Adaptativa

```javascript
// config.js
PERFORMANCE: {
    AUTO_QUALITY_DETECTION: true,
    QUALITY_LEVELS: {
        LOW: {
            textureSize: 1024,
            shadowMap: false,
            antialias: false,
        },
        // ...
    }
}
```

### 10.3 Habilitar Caché

```javascript
// config.js
STORAGE: {
    CACHE_TTL: 24 * 60 * 60 * 1000,  // 24 horas
    CACHE_ITEMS: ['lastAvatar', 'userNickname']
}
```

### 10.4 Monitorear Rendimiento

```javascript
// Acceder en consola
WebARDebug.state.fps        // FPS actual
WebARDebug.state.markerDetected  // Estado del marcador
```

---

## 11. DESPLIEGUE A PRODUCCIÓN

### 11.1 Servidor Apache/Nginx

```bash
# Copiar archivos
scp -r * usuario@servidor:/var/www/html/webarx/

# Configurar headers CORS en Nginx
add_header 'Access-Control-Allow-Origin' '*';
add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
```

### 11.2 Netlify Deployment

```bash
# 1. Instalar CLI
npm install -g netlify-cli

# 2. Deployar
netlify deploy --prod --dir .

# 3. Configurar dominio personalizado
# En dashboard de Netlify → Domain settings
```

### 11.3 Vercel Deployment

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Deployar
vercel --prod

# 3. El URL se genera automáticamente
```

### 11.4 GitHub Pages

```bash
# 1. Push a GitHub
git push origin main

# 2. Habilitar Pages
# Settings → Pages → Source: main branch

# 3. URL automática
# https://usuario.github.io/Proyecto_Innovaciones/
```

### 11.5 SSL/TLS Certificado

```bash
# Requerido para acceso a cámara
# Usar Let's Encrypt (gratuito)

sudo certbot certonly --webroot -w /var/www/html -d midominio.com
```

---

## 12. TESTING Y VALIDACIÓN

### 12.1 Pruebas en Navegador

```javascript
// Consola del navegador - Debugging
WebARDebug.state           // Ver estado actual
WebARDebug.loadModel(url)  // Cargar modelo
WebARDebug.rotateModel(45) // Rotar
WebARDebug.zoomModel(1.2)  // Zoom
WebARDebug.showMessage()   // Mostrar mensaje
```

### 12.2 Validar GLB

1. Ir a [glTF Validator](https://www.khronos.org/gltf/validators/dev/)
2. Subir archivo GLB
3. Verificar que no haya errores

### 12.3 Pruebas en Dispositivos Reales

```bash
# Obtener IP local
ipconfig getifaddr en0  # macOS
hostname -I             # Linux
ipconfig                # Windows

# Acceder desde móvil
# http://tu-ip:8000
```

### 12.4 Chrome DevTools para AR

```javascript
// Habilitar debugging AR en Chrome
// chrome://flags → Search "WebXR"
// Habilitar todos los flags de WebXR
```

---

## 13. SOLUCIÓN DE PROBLEMAS

### 13.1 Problema: "Marcador no detectado"

**Posibles causas:**
- Iluminación pobre
- Marcador muy pequeño
- Cámara sucia

**Soluciones:**
```javascript
// Aumentar debug en AR.js
<a-scene arjs="debugUIEnabled: true;">

// Aumentar tamaño de marcador
MARKER_SIZE: 0.15  // Aumentar de 0.1 a 0.15
```

### 13.2 Problema: "CORS error"

**Error:** 
```
Access to XMLHttpRequest at 'https://...' blocked by CORS policy
```

**Soluciones:**
1. Usar servidor local (http://localhost)
2. Usar HTTPS en producción
3. Verificar headers CORS en servidor

### 13.3 Problema: "Bajo rendimiento"

**Síntomas:** FPS bajo, parpadeos

**Soluciones:**
```javascript
// Reducir calidad en config.js
PERFORMANCE: {
    AUTO_QUALITY_DETECTION: true,
    // O forzar LOW
}

// Usar modelos más simples
// Desactivar animaciones automáticas
INTERACTION: {
    AUTO_ROTATE: false,
}
```

### 13.4 Problema: "Archivo GLB no carga"

**Causas:**
- Archivo corrupto
- Formato no compatible
- URL incorrecta

**Verificación:**
```javascript
// En consola
WebARDebug.loadModel('url-del-modelo')
// Ver errores en consola

// O validar en glTF Validator
```

---

## 14. MANTENIMIENTO

### 14.1 Actualizar Dependencias

```bash
# Verificar versiones nuevas
npm outdated

# Actualizar A-Frame
# Cambiar en index.html:
# <script src="https://aframe.io/releases/1.5.0/aframe.min.js"></script>

# Actualizar Three.js
# <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/three.min.js"></script>
```

### 14.2 Backup de Datos

```bash
# Respaldar proyecto
tar -czf webarx-backup-$(date +%Y%m%d).tar.gz .

# Respaldar preferencias de usuarios
# Exportar localStorage
# console.log(JSON.stringify(localStorage))
```

### 14.3 Monitoreo de Errores

```javascript
// Agregar reporte de errores
window.addEventListener('error', (e) => {
    console.error('Error:', e)
    // Enviar a servicio de logging
})
```

---

## 15. PRÓXIMOS PASOS

- [ ] Agregar múltiples usuarios simultáneos
- [ ] Implementar WebSockets para sincronización
- [ ] Crear editor 3D integrado
- [ ] Agregar análisis de uso
- [ ] Convertir a PWA
- [ ] Publicar versión móvil nativa

---

**Guía de Implementación - WebAR v1.0**  
**Última actualización: Mayo 2026**
