/**
 * SCRIPT PRINCIPAL DEL SISTEMA WebAR
 * Gestión de avatares 3D, marcadores AR y gamificación
 */

import { CONFIG, getQualityLevel, isMobileDevice, getCapabilities } from './config.js';

// ========== ESTADO GLOBAL ==========

const STATE = {
    currentModel: null,
    currentModelUrl: null,
    isLoading: false,
    markerDetected: false,
    fps: 0,
    lastTime: Date.now(),
    frameCount: 0,
    avatarContainer: null,
    marker: null,
    userNickname: 'Usuario',
};

// ========== ELEMENTOS DEL DOM ==========

const DOM = {
    container: document.getElementById('avatar-container'),
    placeholder: document.getElementById('placeholder'),
    btnRpm: document.getElementById('btn-rpm'),
    btnUpload: document.getElementById('btn-upload'),
    btnPreset: document.getElementById('btn-preset'),
    btnLoadUrl: document.getElementById('btn-load-url'),
    btnRotateLeft: document.getElementById('btn-rotate-left'),
    btnRotateRight: document.getElementById('btn-rotate-right'),
    btnZoomIn: document.getElementById('btn-zoom-in'),
    btnZoomOut: document.getElementById('btn-zoom-out'),
    btnReset: document.getElementById('btn-reset'),
    btnKahoot: document.getElementById('btn-kahoot'),
    btnInfo: document.getElementById('btn-info'),
    avatarUrl: document.getElementById('avatar-url'),
    fileInput: document.getElementById('file-input'),
    userNickname: document.getElementById('user-nickname'),
    statusMessage: document.getElementById('status-message'),
    infoText: document.getElementById('info-text'),
    loadingSpinner: document.getElementById('loading-spinner'),
    loadingText: document.getElementById('loading-text'),
    infoModal: document.getElementById('info-modal'),
    modalClose: document.querySelector('.modal-close'),
    markerStatus: document.getElementById('marker-status'),
    performanceInfo: document.getElementById('performance-info'),
    statusIndicator: document.getElementById('status-indicator'),
};

// ========== INICIALIZACIÓN ==========

function init() {
    console.log('🚀 Inicializando WebAR System...');
    
    // Verificar capacidades del navegador
    const capabilities = getCapabilities();
    if (!capabilities.webgl) {
        showError('Tu navegador no soporta WebGL. Por favor usa Chrome, Firefox o Safari.');
        return;
    }
    
    // Configurar elementos AR
    STATE.avatarContainer = document.getElementById('avatar-container');
    STATE.marker = document.getElementById('marker');
    
    // Configurar event listeners
    setupEventListeners();
    
    // Cargar preferencias guardadas
    loadStoredPreferences();
    
    // Iniciar monitoreo de rendimiento
    startPerformanceMonitoring();
    
    // Monitorear detección de marcadores
    monitorMarkerDetection();
    
    console.log('✅ Sistema inicializado correctamente');
    showMessage('Sistema listo. Coloca el marcador frente a la cámara.', 'info');
}

// ========== EVENT LISTENERS ==========

function setupEventListeners() {
    // Botones de carga
    DOM.btnRpm.addEventListener('click', loadFromRPM);
    DOM.btnUpload.addEventListener('click', () => DOM.fileInput.click());
    DOM.btnPreset.addEventListener('click', loadPreset);
    DOM.btnLoadUrl.addEventListener('click', loadFromUrl);
    
    // Controles de interactividad
    DOM.btnRotateLeft.addEventListener('click', () => rotateModel(-45));
    DOM.btnRotateRight.addEventListener('click', () => rotateModel(45));
    DOM.btnZoomIn.addEventListener('click', () => zoomModel(1.2));
    DOM.btnZoomOut.addEventListener('click', () => zoomModel(0.8));
    DOM.btnReset.addEventListener('click', resetModelTransform);
    
    // Gamificación
    DOM.btnKahoot.addEventListener('click', launchKahoot);
    
    // Información
    DOM.btnInfo.addEventListener('click', showInfoModal);
    DOM.modalClose.addEventListener('click', hideInfoModal);
    
    // Upload de archivo
    DOM.fileInput.addEventListener('change', handleFileUpload);
    
    // Teclas de acceso rápido
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Detectar cambios en nickname
    DOM.userNickname.addEventListener('change', savePreferences);
    DOM.avatarUrl.addEventListener('change', savePreferences);
}

// ========== CARGAS DE MODELOS ==========

/**
 * Cargar avatar desde Ready Player Me
 */
async function loadFromRPM() {
    console.log('📥 Abriendo Ready Player Me...');
    
    // Abrir en nueva ventana/pestaña
    const rpmWindow = window.open(
        `${CONFIG.RPM.EDITOR_URL}?frameApi`,
        'RPM_EDITOR',
        'width=1200,height=800'
    );
    
    if (!rpmWindow) {
        showError('No se pudo abrir Ready Player Me. Verifica que no hayas bloqueado pop-ups.');
        return;
    }
    
    // Escuchar mensajes desde RPM
    const messageHandler = (event) => {
        if (event.origin !== CONFIG.RPM.API_URL && event.origin !== CONFIG.RPM.EDITOR_URL.split('/').slice(0, 3).join('/')) {
            return;
        }
        
        if (event.data.eventType === 'subscribe') {
            console.log('✅ RPM conectado');
        }
        
        if (event.data.eventType === 'avatarExported') {
            const avatarUrl = event.data.data.url;
            console.log('🎨 Avatar exportado:', avatarUrl);
            rpmWindow.close();
            loadModel(avatarUrl);
        }
    };
    
    window.addEventListener('message', messageHandler);
    
    // Limpiar listener después de 10 minutos
    setTimeout(() => {
        window.removeEventListener('message', messageHandler);
    }, 10 * 60 * 1000);
    
    showMessage('Abre Ready Player Me en la ventana emergente. Cuando termines, el avatar cargará automáticamente.', 'info');
}

/**
 * Cargar avatar desde URL
 */
async function loadFromUrl() {
    const url = DOM.avatarUrl.value.trim();
    
    if (!url) {
        showError('Por favor ingresa una URL válida');
        return;
    }
    
    // Si es una URL de Ready Player Me, convertir al formato GLB
    if (url.includes('readyplayer.me')) {
        if (!url.includes('.glb')) {
            const glbUrl = url.replace(/\?.*$/, '') + '.glb';
            loadModel(glbUrl);
        } else {
            loadModel(url);
        }
    } else {
        loadModel(url);
    }
}

/**
 * Cargar avatar preestablecido
 */
function loadPreset() {
    if (CONFIG.MODELS.PREDEFINED.length === 0) {
        showError('No hay avatares preestablecidos disponibles');
        return;
    }
    
    // Cargar el primer avatar preestablecido
    const preset = CONFIG.MODELS.PREDEFINED[0];
    loadModel(preset.url);
    showMessage(`Avatar cargado: ${preset.name}`, 'success');
}

/**
 * Manejar carga de archivo
 */
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        console.log('ℹ️ No se seleccionó archivo');
        return;
    }
    
    console.log('📁 Archivo seleccionado:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`);
    
    // Validar archivo
    const ext = file.name.split('.').pop().toLowerCase();
    if (!CONFIG.VALIDATION.ALLOWED_EXTENSIONS.includes(ext)) {
        showError(`❌ Formato no soportado. Usa: ${CONFIG.VALIDATION.ALLOWED_EXTENSIONS.join(', ')}`);
        return;
    }
    
    if (file.size > CONFIG.VALIDATION.MAX_FILE_SIZE) {
        showError(`❌ Archivo muy grande (${(file.size / (1024 * 1024)).toFixed(2)}MB). Máximo: ${CONFIG.VALIDATION.MAX_FILE_SIZE / (1024 * 1024)}MB`);
        return;
    }
    
    // Crear URL local
    const objectUrl = URL.createObjectURL(file);
    console.log('✓ URL local creada:', objectUrl.substring(0, 50) + '...');
    
    // Guardar nombre del archivo antes de cargar
    STATE.currentModelUrl = file.name;
    
    // Cargar modelo
    loadModel(objectUrl);
    
    // Limpiar input
    DOM.fileInput.value = '';
}

/**
 * Cargar modelo 3D GLB
 */
async function loadModel(url) {
    if (STATE.isLoading) {
        showMessage('Esperando a que se termine de cargar el modelo anterior...', 'warning');
        return;
    }
    
    STATE.isLoading = true;
    showLoadingSpinner(true, 'Cargando avatar...');
    
    try {
        console.log('🔄 Cargando modelo:', url);
        
        // Validar URL (permitir blob URLs también)
        const isValidModelUrl = url.startsWith('blob:') || isValidUrl(url);
        if (!isValidModelUrl) {
            throw new Error('URL no válida: ' + url);
        }
        
        console.log('✓ URL válida, iniciando carga...');
        
        // Crear entidad para cargar el modelo
        const tempEntity = document.createElement('a-entity');
        tempEntity.setAttribute('id', 'loading-model');
        tempEntity.setAttribute('scale', '1 1 1');
        tempEntity.setAttribute('position', '0 0 0');
        
        // Agregar a contenedor ANTES de configurar gltf-model
        STATE.avatarContainer.appendChild(tempEntity);
        
        console.log('✓ Entidad agregada al DOM, cargando GLB...');
        
        // Flag para evitar listener duplicado
        let modelLoaded = false;
        let timeoutId = null;
        
        // Handler para carga exitosa
        const handleSuccess = () => {
            if (modelLoaded) return;
            modelLoaded = true;
            clearTimeout(timeoutId);
            
            console.log('✅ Modelo cargado exitosamente');
            
            // Remover placeholder
            DOM.placeholder.style.display = 'none';
            
            // Remover modelo anterior si existe
            const oldModel = document.getElementById('current-model');
            if (oldModel) oldModel.remove();
            
            // Renombrar entidad
            tempEntity.setAttribute('id', 'current-model');
            
            // Configurar animaciones
            if (CONFIG.INTERACTION.AUTO_ROTATE) {
                tempEntity.setAttribute('animation', 
                    `property: rotation; to: 0 360 0; dur: 4000; easing: linear; loop: true`
                );
            }
            
            // Guardar referencia
            STATE.currentModel = tempEntity;
            STATE.currentModelUrl = url;
            
            // Actualizar info
            updateAvatarInfo(url);
            
            // Guardar preferencias
            savePreferences();
            
            showMessage('Avatar cargado correctamente ✨', 'success');
            STATE.isLoading = false;
            showLoadingSpinner(false);
            
            // Limpiar listeners
            tempEntity.removeEventListener('model-loaded', handleSuccess);
            tempEntity.removeEventListener('model-error', handleError);
        };
        
        // Handler para errores
        const handleError = (error) => {
            if (modelLoaded) return;
            modelLoaded = true;
            clearTimeout(timeoutId);
            
            console.error('❌ Error al cargar modelo:', error);
            
            // Remover entidad del DOM
            if (tempEntity.parentNode) {
                tempEntity.remove();
            }
            
            showError('❌ No se pudo cargar el modelo. Verifica que sea un archivo GLB válido.');
            STATE.isLoading = false;
            showLoadingSpinner(false);
            
            // Limpiar listeners
            tempEntity.removeEventListener('model-loaded', handleSuccess);
            tempEntity.removeEventListener('model-error', handleError);
        };
        
        // Agregar listeners
        tempEntity.addEventListener('model-loaded', handleSuccess);
        tempEntity.addEventListener('model-error', handleError);
        
        // Timeout de seguridad (15 segundos)
        timeoutId = setTimeout(() => {
            if (!modelLoaded) {
                modelLoaded = true;
                console.error('❌ Timeout al cargar modelo');
                
                // Remover entidad del DOM
                if (tempEntity.parentNode) {
                    tempEntity.remove();
                }
                
                showError('⏱️ Tiempo agotado. El archivo tarda demasiado en cargar. Verifica que sea un GLB válido.');
                STATE.isLoading = false;
                showLoadingSpinner(false);
                
                // Limpiar listeners
                tempEntity.removeEventListener('model-loaded', handleSuccess);
                tempEntity.removeEventListener('model-error', handleError);
            }
        }, 15000); // 15 segundos timeout
        
        // IMPORTANTE: Establecer gltf-model al final para disparar la carga
        console.log('✓ Iniciando descarga de GLB...');
        tempEntity.setAttribute('gltf-model', url);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        showError('❌ Error al cargar el modelo: ' + error.message);
        STATE.isLoading = false;
        showLoadingSpinner(false);
    }
}

// ========== INTERACTIVIDAD ==========

/**
 * Rotar modelo
 */
function rotateModel(angle) {
    if (!STATE.currentModel) return;
    
    const current = STATE.currentModel.getAttribute('rotation');
    const newRotation = {
        x: current.x,
        y: current.y + angle,
        z: current.z
    };
    
    // Animar rotación
    gsap.to(STATE.currentModel.object3D.rotation, {
        y: newRotation.y * Math.PI / 180,
        duration: 0.5,
        ease: 'power2.out'
    });
}

/**
 * Zoom del modelo
 */
function zoomModel(factor) {
    if (!STATE.currentModel) return;
    
    const currentScale = STATE.currentModel.getAttribute('scale');
    const newScale = {
        x: Math.max(CONFIG.INTERACTION.ZOOM_MIN, Math.min(CONFIG.INTERACTION.ZOOM_MAX, currentScale.x * factor)),
        y: Math.max(CONFIG.INTERACTION.ZOOM_MIN, Math.min(CONFIG.INTERACTION.ZOOM_MAX, currentScale.y * factor)),
        z: Math.max(CONFIG.INTERACTION.ZOOM_MIN, Math.min(CONFIG.INTERACTION.ZOOM_MAX, currentScale.z * factor))
    };
    
    gsap.to(STATE.currentModel.object3D.scale, {
        x: newScale.x,
        y: newScale.y,
        z: newScale.z,
        duration: 0.3,
        ease: 'power2.out'
    });
    
    STATE.currentModel.setAttribute('scale', newScale);
}

/**
 * Reiniciar transformaciones del modelo
 */
function resetModelTransform() {
    if (!STATE.currentModel) return;
    
    gsap.to(STATE.currentModel.object3D.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.5,
        ease: 'power2.out'
    });
    
    gsap.to(STATE.currentModel.object3D.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.5,
        ease: 'power2.out'
    });
    
    STATE.currentModel.setAttribute('rotation', '0 0 0');
    STATE.currentModel.setAttribute('scale', '1 1 1');
    
    showMessage('Avatar reiniciado', 'success');
}

// ========== GAMIFICACIÓN ==========

/**
 * Lanzar Kahoot
 */
function launchKahoot() {
    const nickname = DOM.userNickname.value.trim() || 'Usuario';
    
    // Guardar nickname
    STATE.userNickname = nickname;
    savePreferences();
    
    // Construir URL de Kahoot
    let kahootUrl = CONFIG.GAMIFICATION.KAHOOT_URL;
    
    // Parámetros opcionales
    const params = new URLSearchParams();
    if (nickname) {
        params.append('username', nickname);
    }
    
    if (params.toString()) {
        kahootUrl += '?' + params.toString();
    }
    
    console.log('🎯 Abriendo Kahoot:', kahootUrl);
    window.open(kahootUrl, '_blank');
    
    showMessage(`Abriendo Kahoot para ${nickname}...`, 'success');
}

// ========== MONITOREO DE MARCADORES ==========

/**
 * Monitorear detección de marcadores
 */
function monitorMarkerDetection() {
    setInterval(() => {
        const marker = document.getElementById('marker');
        if (!marker) return;
        
        // Verificar si el marcador está visible
        const visible = marker.getAttribute('visible') !== false;
        
        // Actualizar estado
        if (visible !== STATE.markerDetected) {
            STATE.markerDetected = visible;
            updateMarkerStatus();
        }
    }, 100);
}

/**
 * Actualizar estado del marcador en UI
 */
function updateMarkerStatus() {
    if (STATE.markerDetected) {
        DOM.markerStatus.textContent = '🟢 Marcador detectado';
        DOM.statusIndicator.classList.remove('warning', 'error');
    } else {
        DOM.markerStatus.textContent = '🔴 Sin marcador';
        DOM.statusIndicator.classList.add('warning');
    }
}

// ========== MONITOREO DE RENDIMIENTO ==========

/**
 * Iniciar monitoreo de FPS
 */
function startPerformanceMonitoring() {
    setInterval(() => {
        // Calcular FPS (aproximado)
        const now = Date.now();
        const deltaTime = now - STATE.lastTime;
        STATE.frameCount++;
        
        if (deltaTime >= 1000) {
            STATE.fps = STATE.frameCount;
            STATE.frameCount = 0;
            STATE.lastTime = now;
            
            // Actualizar UI
            DOM.performanceInfo.textContent = `FPS: ${STATE.fps}`;
            
            // Cambiar color según FPS
            if (STATE.fps >= 50) {
                DOM.statusIndicator.classList.remove('warning', 'error');
            } else if (STATE.fps >= 30) {
                DOM.statusIndicator.classList.add('warning');
                DOM.statusIndicator.classList.remove('error');
            } else {
                DOM.statusIndicator.classList.add('error');
            }
        }
    }, 100);
}

// ========== UTILIDADES DE INFORMACIÓN ==========

/**
 * Actualizar información del avatar
 */
function updateAvatarInfo(url) {
    // Obtener nombre del modelo
    let modelName = url.split('/').pop().substring(0, 30);
    if (modelName.startsWith('blob:')) {
        // Para blob URLs, usar el nombre guardado en STATE
        modelName = STATE.currentModelUrl || 'Modelo Local';
    }
    
    const scale = STATE.currentModel ? STATE.currentModel.getAttribute('scale').x.toFixed(2) : '1.00';
    
    const info = `
        <strong>📦 Modelo:</strong> ${modelName}<br>
        <strong>📏 Escala:</strong> ${scale}<br>
        <strong>🎨 Formato:</strong> GLB/GLTF<br>
        <strong>✓ Estado:</strong> Cargado
    `;
    DOM.infoText.innerHTML = info;
}

/**
 * Validar URL (acepta URL normales, blob URLs, y rutas relativas)
 */
function isValidUrl(url) {
    if (!url || typeof url !== 'string') return false;
    
    // Blob URLs (locales)
    if (url.startsWith('blob:')) return true;
    
    // Rutas relativas
    if (url.startsWith('./') || url.startsWith('../') || url.startsWith('/')) return true;
    
    // URLs absolutas
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// ========== ALMACENAMIENTO LOCAL ==========

/**
 * Guardar preferencias
 */
function savePreferences() {
    const preferences = {
        lastAvatar: STATE.currentModelUrl,
        userNickname: DOM.userNickname.value,
        lastAvatarUrl: DOM.avatarUrl.value,
    };
    
    localStorage.setItem(CONFIG.STORAGE.PREFIX + 'preferences', JSON.stringify(preferences));
    console.log('💾 Preferencias guardadas');
}

/**
 * Cargar preferencias guardadas
 */
function loadStoredPreferences() {
    try {
        const stored = localStorage.getItem(CONFIG.STORAGE.PREFIX + 'preferences');
        if (stored) {
            const preferences = JSON.parse(stored);
            
            if (preferences.userNickname) {
                DOM.userNickname.value = preferences.userNickname;
                STATE.userNickname = preferences.userNickname;
            }
            
            if (preferences.lastAvatarUrl) {
                DOM.avatarUrl.value = preferences.lastAvatarUrl;
            }
            
            console.log('📂 Preferencias cargadas');
        }
    } catch (error) {
        console.warn('⚠️ No se pudieron cargar preferencias:', error);
    }
}

// ========== MENSAJES Y ALERTAS ==========

/**
 * Mostrar mensaje
 */
function showMessage(text, type = 'info') {
    DOM.statusMessage.textContent = text;
    DOM.statusMessage.className = 'status-message ' + type;
    DOM.statusMessage.style.display = 'block';
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        DOM.statusMessage.style.display = 'none';
    }, 5000);
}

/**
 * Mostrar error
 */
function showError(text) {
    showMessage(text, 'error');
    console.error('❌', text);
}

/**
 * Mostrar spinner de carga
 */
function showLoadingSpinner(show, text = 'Cargando...') {
    DOM.loadingSpinner.style.display = show ? 'block' : 'none';
    if (text) DOM.loadingText.textContent = text;
}

// ========== MODAL DE INFORMACIÓN ==========

/**
 * Mostrar modal de información
 */
function showInfoModal() {
    DOM.infoModal.style.display = 'flex';
}

/**
 * Ocultar modal de información
 */
function hideInfoModal() {
    DOM.infoModal.style.display = 'none';
}

// Cerrar modal al hacer click fuera
document.addEventListener('click', (e) => {
    if (e.target === DOM.infoModal) {
        hideInfoModal();
    }
});

// ========== ATAJOS DE TECLADO ==========

/**
 * Manejar atajos de teclado
 */
function handleKeyboardShortcuts(event) {
    if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
            case 'r':
                event.preventDefault();
                resetModelTransform();
                break;
            case 'o':
                event.preventDefault();
                DOM.fileInput.click();
                break;
            case '?':
                event.preventDefault();
                showInfoModal();
                break;
        }
    }
}

// ========== VERIFICACIÓN DE PERMISOS ==========

/**
 * Solicitar permisos de cámara
 */
async function requestCameraPermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        console.log('✅ Permiso de cámara concedido');
        return true;
    } catch (error) {
        console.error('❌ Permiso de cámara denegado:', error);
        showError('Necesitas permitir el acceso a la cámara para usar AR.');
        return false;
    }
}

// ========== PUNTO DE ENTRADA ==========

// Verificar permisos al cargar
window.addEventListener('load', async () => {
    // Verificar si es en HTTPS o localhost
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        console.warn('⚠️ Se recomienda usar HTTPS para acceso a cámara');
    }
    
    // Inicializar
    init();
    
    // Pedir permiso de cámara
    await requestCameraPermission();
});

// Limpiar al descargar
window.addEventListener('beforeunload', () => {
    // Guardar preferencias
    savePreferences();
});

// Exportar para debugging en consola
window.WebARDebug = {
    state: STATE,
    loadModel,
    rotateModel,
    zoomModel,
    resetModelTransform,
    showMessage,
    showError,
    launchKahoot,
};

console.log('✅ Script de WebAR cargado. Accede a WebARDebug en consola para debugging.');
