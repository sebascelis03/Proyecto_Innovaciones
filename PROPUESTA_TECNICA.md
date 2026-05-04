# PROPUESTA TÉCNICA: Prototipo de Realidad Aumentada para Aula Virtual

## 1. RESUMEN EJECUTIVO

**Proyecto:** Sistema WebAR interactivo con avatares personalizados para educación virtual  
**Tecnologías:** A-Frame, AR.js, Ready Player Me API  
**Objetivo:** Crear una experiencia inmersiva de realidad aumentada accesible desde navegadores móviles, permitiendo que estudiantes carguen avatares 3D personalizados sobre marcadores físicos.

---

## 2. OBJETIVOS PRINCIPALES

### 2.1 Objetivos Funcionales
- ✅ Captura y reconocimiento de marcadores de imagen mediante AR.js
- ✅ Renderizado estable de modelos 3D en formato GLB
- ✅ Integración de avatares personalizados desde Ready Player Me
- ✅ Interfaz de carga de modelos 3D personalizados
- ✅ Integración con herramientas de gamificación (Kahoot)
- ✅ Interactividad visual (rotación, zoom, animaciones)

### 2.2 Objetivos No Funcionales
- 📱 Optimización para navegadores móviles (iOS/Android)
- ⚡ Renderizado fluido (mínimo 30 FPS)
- 🔒 Gestión segura de URLs de modelos 3D
- 📊 Bajo uso de bandwidth y procesamiento
- ♿ Accesibilidad desde navegadores estándar sin instalación

---

## 3. ARQUITECTURA TÉCNICA

### 3.1 Stack Tecnológico

| Componente | Tecnología | Función |
|-----------|-----------|---------|
| **Framework AR** | A-Frame + AR.js | Renderizado 3D y detección de marcadores |
| **Avatares** | Ready Player Me API | Generación personalizada de avatares |
| **Formatos 3D** | GLB/GLTF | Carga de modelos comprimidos |
| **Interfaz** | HTML5 + CSS3 | UI responsiva para móvil |
| **Lógica** | Vanilla JavaScript | Sin dependencias adicionales |
| **Gamificación** | Kahoot API | Integración de quizzes |

### 3.2 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│         NAVEGADOR MÓVIL (HTML5 + WebGL)                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  INTERFAZ DE USUARIO (HTML + CSS + JS)          │   │
│  │  ├── Panel de Control                           │   │
│  │  ├── Selector de Avatares                       │   │
│  │  └── Botones de Interacción                     │   │
│  └─────────────────────────────────────────────────┘   │
│                       ↓                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │  A-FRAME + AR.JS (Motor de Renderizado)         │   │
│  │  ├── Detección de Marcadores                    │   │
│  │  ├── Gestión de Cámaras                         │   │
│  │  └── Renderizado de Entidades 3D                │   │
│  └─────────────────────────────────────────────────┘   │
│           ↑                         ↓                   │
│           │                         │                   │
│  ┌────────┴──────┐         ┌────────┴──────────┐       │
│  │   Cámara +    │         │   Modelo 3D GLB   │       │
│  │   Marcador    │         │   (Avatar RPM)    │       │
│  │   Detector    │         │   (Personalizado) │       │
│  └───────────────┘         └───────────────────┘       │
│                                                         │
└─────────────────────────────────────────────────────────┘
         ↕                              ↕
  ┌─────────────────┐        ┌──────────────────────┐
  │  Almacenamiento │        │  APIs Externas       │
  │  Local (Caché)  │        │  ├── Ready Player Me │
  │                 │        │  ├── Kahoot          │
  │                 │        │  └── CDN (modelos)   │
  └─────────────────┘        └──────────────────────┘
```

---

## 4. ESPECIFICACIONES DETALLADAS

### 4.1 Módulos Principales

#### 4.1.1 Módulo de Detección de Marcadores
- **Tecnología:** AR.js (basado en Three.js)
- **Métodos:**
  - Detección de patrones NFT (Natural Feature Tracking)
  - Detección de patrones QR (alternativa)
  - Calibración automática de luminosidad
- **Rendimiento:** Detección en < 500ms

#### 4.1.2 Módulo de Carga de Modelos 3D
- **Formatos:** GLB (preferido), GLTF, OBJ
- **Métodos de carga:**
  - URL directa (CORS habilitado)
  - Archivo local (input file)
  - API de Ready Player Me
- **Validación:** Chequeo de peso máximo (10 MB)

#### 4.1.3 Módulo de Ready Player Me
- **Flujo:**
  1. Usuario genera avatar en rpm.me
  2. Obtiene URL de descarga en formato GLB
  3. Carga URL en el sistema
  4. Avatar aparece sobre el marcador
- **Customización:**
  - Editor web de RPM
  - Parámetros URL de RPM

#### 4.1.4 Módulo de Interactividad
- **Gestos soportados:**
  - Toque único: Girar modelo
  - Dos dedos: Zoom (pinch)
  - Doble toque: Reset de posición
- **Animaciones:**
  - Rotación continua opcional
  - Transiciones suave de escala
  - Parpadeo/movimiento de avatares

#### 4.1.5 Módulo de Gamificación
- **Integración Kahoot:**
  - Botón de acceso directo a quiz
  - Parámetros de usuario (nombre, ID grupo)
  - Redirección segura a kahoot.it

---

## 5. FLUJO DE USUARIO

### 5.1 Caso de Uso Principal: "Estudiante carga su avatar personalizado"

```
1. Estudiante abre el sitio en móvil
   ↓
2. Otorga permisos de cámara
   ↓
3. Sistema detecta marcador
   ↓
4. Selecciona origen del avatar:
   a) Generar en Ready Player Me (→ obtiene URL)
   b) Cargar archivo GLB local
   c) Usar avatar predefinido
   ↓
5. Avatar carga y aparece sobre marcador
   ↓
6. Interactúa: rotación, zoom, animaciones
   ↓
7. Acciona botón de gamificación (Kahoot)
   ↓
8. Participa en quiz con su avatar personalizado
```

---

## 6. CONFIGURACIÓN Y PARÁMETROS

### 6.1 Variables de Entorno
```javascript
// config.js
export const CONFIG = {
  // A-Frame & AR.js
  MARKER_PATH: './assets/markers/',
  MARKER_SIZE: 0.1,
  
  // Ready Player Me
  RPM_API_URL: 'https://api.readyplayer.me',
  RPM_AVATAR_FORMAT: 'glb',
  
  // Modelos 3D
  MAX_MODEL_SIZE: 10 * 1024 * 1024, // 10 MB
  SUPPORTED_FORMATS: ['glb', 'gltf', 'obj'],
  
  // Interactividad
  ROTATION_SPEED: 0.01,
  ZOOM_MIN: 0.5,
  ZOOM_MAX: 2.0,
  
  // Kahoot
  KAHOOT_URL: 'https://kahoot.it/',
  
  // Cache
  CACHE_TTL: 24 * 60 * 60 * 1000 // 24 horas
};
```

---

## 7. REQUISITOS DE HARDWARE

### 7.1 Dispositivos Móviles Soportados

| Aspecto | Requisito |
|--------|----------|
| **SO Mínimo** | iOS 13+ o Android 8+ |
| **Navegador** | Chrome, Firefox, Safari (con WebGL) |
| **Cámara** | Cámara trasera (mínimo 5MP) |
| **RAM** | 2 GB mínimo (4 GB recomendado) |
| **Memoria** | 100 MB libres |
| **Conexión** | 4G/WiFi (5+ Mbps recomendado) |

---

## 8. SEGURIDAD Y PRIVACIDAD

### 8.1 Medidas Implementadas
- ✅ HTTPS requerido para todas las conexiones
- ✅ CORS configurado para dominios autorizados
- ✅ Validación de URLs de modelos 3D
- ✅ Caché local de permiso de cámara (sin almacenamiento de video)
- ✅ Sanitización de parámetros URL
- ✅ Sin almacenamiento de datos personales en servidor

---

## 9. PLAN DE IMPLEMENTACIÓN

### 9.1 Fases

**Fase 1: Estructura Base (Semana 1)**
- Configurar proyecto con A-Frame y AR.js
- Crear marcadores de prueba
- Interfaz HTML básica

**Fase 2: Integración 3D (Semana 2)**
- Integrar carga de modelos GLB
- Implementar interactividad (zoom, rotación)
- Optimizar renderizado

**Fase 3: Avatar Ready Player Me (Semana 3)**
- Integrar API de RPM
- Crear flujo de selección/carga de avatares
- Validar renderizado de avatares personalizados

**Fase 4: Gamificación (Semana 4)**
- Integrar botones de Kahoot
- Pruebas en dispositivos reales
- Optimización de rendimiento

### 9.2 Hitos de Validación
- [ ] AR.js detecta marcadores correctamente
- [ ] Modelos GLB cargan sin errores
- [ ] Avatares RPM se personalizan
- [ ] Interactividad responde sin lag
- [ ] Compatibilidad en iOS y Android
- [ ] Rendimiento > 30 FPS
- [ ] Integración Kahoot funcional

---

## 10. CONSIDERACIONES DE RENDIMIENTO

### 10.1 Optimizaciones Implementadas
- 📦 Compresión de modelos GLB (Draco compression)
- 🎯 LoD (Level of Detail) para modelos complejos
- 💾 Caché de modelos cargados
- ⚡ Detección de dispositivo para calidad adaptativa
- 🔄 Reuso de shaders y materiales

### 10.2 Métricas de Rendimiento
| Métrica | Objetivo |
|---------|----------|
| FPS | ≥ 30 |
| Tiempo de carga inicial | ≤ 3 segundos |
| Tiempo de carga de avatar | ≤ 2 segundos |
| Uso de memoria | ≤ 150 MB |
| Consumo de batería | ≤ 2% por minuto |

---

## 11. SOLUCIÓN DE PROBLEMAS COMUNES

| Problema | Solución |
|----------|----------|
| Marcador no detectado | Mejorar iluminación, usar surface NFT plana |
| Modelo parpadea | Aumentar clipping planes de cámara |
| Bajo rendimiento | Reducir calidad del modelo, usar LoD |
| CORS error | Configurar headers en servidor |
| Avatar no carga | Validar URL de RPM, verificar formato GLB |

---

## 12. VENTAJAS Y DIFERENCIALES

✅ **Acceso desde navegador** - Sin instalación de apps  
✅ **Avatares personalizados** - Cada estudiante su propio avatar  
✅ **Integración educativa** - Conexión con Kahoot  
✅ **Bajo costo** - Uso de APIs gratuitas  
✅ **Rendimiento optimizado** - Fluido en móviles de gama media  
✅ **Código modular** - Fácil de mantener y extender  

---

## 13. ROADMAP FUTURO

- 🔄 Soporte para múltiples avatares simultáneos
- 🎤 Sincronización de audio/video en tiempo real
- 🗺️ Mapeo de espacios (SLAM mejorado)
- 🎨 Editor 3D integrado en navegador
- 📊 Analytics de uso educativo
- 🤖 IA para recomendaciones de contenido

---

## 14. RECURSOS Y REFERENCIAS

### 14.1 Documentación Oficial
- [A-Frame Documentation](https://aframe.io/docs/)
- [AR.js Documentation](https://ar-js-org.github.io/AR.js-Docs/)
- [Ready Player Me API](https://docs.readyplayer.me/)
- [THREE.js GLB Loader](https://threejs.org/docs/index.html#examples/en/loaders/GLTFLoader)

### 14.2 Herramientas Recomendadas
- **Generador de Marcadores:** [AR.js Marker Training](https://carnaux.github.io/NFT-Marker-Creator/)
- **Editor de Avatares:** [Ready Player Me Editor](https://rpm.me)
- **Validador GLB:** [glTF Validator](https://www.khronos.org/gltf/validators/dev/)
- **Debugger AR:** [Chrome DevTools ARCore support](https://developer.chrome.com/docs/devtools/)

---

**Versión:** 1.0  
**Fecha:** Mayo 2026  
**Estado:** Prototipo Funcional
