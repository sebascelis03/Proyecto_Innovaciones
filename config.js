/**
 * CONFIGURACIÓN GLOBAL DEL SISTEMA WebAR
 * Sistema de Realidad Aumentada para Aula Virtual
 */

export const CONFIG = {
  // ========== A-Frame & AR.js ==========
  AR: {
    // Tamaño del marcador (en metros)
    MARKER_SIZE: 0.1,
    
    // Ruta de los marcadores
    MARKER_PATH: './assets/markers/',
    
    // Tipo de tracking: 'nft' o 'pattern'
    TRACKING_TYPE: 'nft',
    
    // Distancia de renderizado (clipping planes)
    NEAR_PLANE: 0.001,
    FAR_PLANE: 1000,
  },

  // ========== Ready Player Me API ==========
  RPM: {
    // URL base de la API
    API_URL: 'https://api.readyplayer.me',
    
    // Formato de descarga del avatar
    FORMAT: 'glb',
    
    // Editor web de RPM
    EDITOR_URL: 'https://rpm.me',
    
    // Parámetros de customización del avatar
    CUSTOM_PARAMS: {
      bodyType: 'fullbody', // 'fullbody' o 'halfbody'
      morphTargets: true,
      useDefaultMorphTargets: true,
    },
    
    // Timeout para descargar avatar
    DOWNLOAD_TIMEOUT: 30000, // 30 segundos
  },

  // ========== Modelos 3D ==========
  MODELS: {
    // Peso máximo de modelo (en bytes)
    MAX_SIZE: 10 * 1024 * 1024, // 10 MB
    
    // Formatos soportados
    SUPPORTED_FORMATS: ['glb', 'gltf', 'obj', 'fbx'],
    
    // Compresión Draco habilitada
    USE_DRACO: true,
    
    // Ruta de modelos de ejemplo
    EXAMPLES_PATH: './exemplos/',
    
    // Modelos predefinidos
    PREDEFINED: [
      {
        name: 'Avatar Robot',
        url: './exemplos/robot-avatar.glb',
        description: 'Avatar futurista'
      },
      {
        name: 'Avatar Mascota',
        url: './exemplos/mascot-avatar.glb',
        description: 'Avatar de mascota'
      }
    ],
  },

  // ========== Interactividad ==========
  INTERACTION: {
    // Velocidad de rotación (radios por frame)
    ROTATION_SPEED: 0.01,
    
    // Rango de zoom
    ZOOM_MIN: 0.5,
    ZOOM_MAX: 2.0,
    ZOOM_DEFAULT: 1.0,
    
    // Velocidad de zoom (factor por frame)
    ZOOM_SPEED: 0.05,
    
    // Rotación automática
    AUTO_ROTATE: true,
    AUTO_ROTATE_SPEED: 0.003,
    
    // Sensibilidad del touch
    TOUCH_SENSITIVITY: 0.01,
    
    // Duración de animaciones (ms)
    ANIMATION_DURATION: 300,
  },

  // ========== Interfaz de Usuario ==========
  UI: {
    // Tema de color
    PRIMARY_COLOR: '#6366f1',
    SECONDARY_COLOR: '#ec4899',
    DANGER_COLOR: '#ef4444',
    
    // Opacidad de paneles
    PANEL_OPACITY: 0.95,
    
    // Animación de botones
    BUTTON_ANIMATION: true,
  },

  // ========== Gamificación - Kahoot ==========
  GAMIFICATION: {
    // URL base de Kahoot
    KAHOOT_URL: 'https://kahoot.it/',
    
    // Parámetros de usuario
    USER_PARAMS: {
      includeNickname: true,
      includeGroupId: true,
      trackingEnabled: false,
    }
  },

  // ========== Almacenamiento Local ==========
  STORAGE: {
    // Prefijo para keys en localStorage
    PREFIX: 'webarx_',
    
    // Tiempo de vida de caché (en ms)
    CACHE_TTL: 24 * 60 * 60 * 1000, // 24 horas
    
    // Items a guardar en caché
    CACHE_ITEMS: [
      'lastAvatar',
      'userNickname',
      'markerCalibration',
      'userPreferences'
    ],
  },

  // ========== Seguridad ==========
  SECURITY: {
    // Requerir HTTPS
    REQUIRE_HTTPS: window.location.protocol === 'https:',
    
    // Dominios autorizados para CORS
    ALLOWED_DOMAINS: [
      'readyplayer.me',
      'api.readyplayer.me',
      'cdn.readyplayer.me',
      'kahoot.it',
      'localhost',
      '127.0.0.1'
    ],
    
    // Validar origen de URLs
    VALIDATE_ORIGINS: true,
    
    // Timeout para requests
    REQUEST_TIMEOUT: 15000,
  },

  // ========== Rendimiento ==========
  PERFORMANCE: {
    // Limitar FPS
    TARGET_FPS: 60,
    
    // Detección automática de dispositivo
    AUTO_QUALITY_DETECTION: true,
    
    // Calidades predefinidas
    QUALITY_LEVELS: {
      LOW: {
        textureSize: 1024,
        shadowMap: false,
        antialias: false,
        dpi: 1.0,
      },
      MEDIUM: {
        textureSize: 2048,
        shadowMap: true,
        antialias: true,
        dpi: 1.5,
      },
      HIGH: {
        textureSize: 4096,
        shadowMap: true,
        antialias: true,
        dpi: 2.0,
      }
    },
    
    // Umbral de memoria para cambiar calidad (MB)
    MEMORY_THRESHOLD: 150,
  },

  // ========== Logging ==========
  LOGGING: {
    // Habilitar logs en consola
    ENABLED: true,
    
    // Nivel de logs: 'debug', 'info', 'warn', 'error'
    LEVEL: 'info',
    
    // Guardar logs en localStorage
    SAVE_LOGS: false,
    
    // Máximo número de logs almacenados
    MAX_LOGS: 100,
  },

  // ========== Validación ==========
  VALIDATION: {
    // Extensiones de archivo permitidas
    ALLOWED_EXTENSIONS: ['glb', 'gltf', 'obj', 'fbx', 'png', 'jpg', 'jpeg'],
    
    // Tamaño máximo de archivo (en bytes)
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50 MB
    
    // Validar modelo al cargarlo
    VALIDATE_ON_LOAD: true,
  },
};

// ========== UTILIDADES DE CONFIGURACIÓN ==========

/**
 * Obtener configuración de calidad según dispositivo
 */
export function getQualityLevel() {
  const memory = (performance.memory?.jsHeapSizeLimit || 536870912) / (1024 * 1024);
  
  if (memory < CONFIG.PERFORMANCE.MEMORY_THRESHOLD) {
    return 'LOW';
  } else if (memory < CONFIG.PERFORMANCE.MEMORY_THRESHOLD * 1.5) {
    return 'MEDIUM';
  }
  return 'HIGH';
}

/**
 * Validar si es dispositivo móvil
 */
export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Obtener información del navegador
 */
export function getBrowserInfo() {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    maxTouchPoints: navigator.maxTouchPoints,
    deviceMemory: navigator.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
  };
}

/**
 * Validar soporte de WebGL
 */
export function isWebGLSupported() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
  return gl !== null;
}

/**
 * Validar soporte de WebXR
 */
export function isWebXRSupported() {
  return 'xr' in navigator;
}

/**
 * Obtener información de soporte del navegador
 */
export function getCapabilities() {
  return {
    webgl: isWebGLSupported(),
    webxr: isWebXRSupported(),
    mobile: isMobileDevice(),
    https: CONFIG.SECURITY.REQUIRE_HTTPS,
    browser: getBrowserInfo(),
  };
}

// Exportar estado de configuración
export const STARTUP_INFO = {
  timestamp: new Date().toISOString(),
  config: CONFIG,
  capabilities: getCapabilities(),
  quality: CONFIG.PERFORMANCE.AUTO_QUALITY_DETECTION ? getQualityLevel() : 'MEDIUM',
};

console.log('🚀 WebAR System Initialized', STARTUP_INFO);
