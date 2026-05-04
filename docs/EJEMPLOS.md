# 📖 EJEMPLOS DE CÓDIGO

Ejemplos de código comunes y casos de uso para el sistema WebAR.

---

## 1. CARGAR AVATAR DESDE URL

```javascript
// Cargar avatar desde URL
const avatarUrl = 'https://models.readyplayer.me/12345.glb'
WebARDebug.loadModel(avatarUrl)

// Guardar la URL para el futuro
localStorage.setItem('lastAvatarUrl', avatarUrl)
```

---

## 2. CREAR BOTÓN PERSONALIZADO PARA CARGAR MODELO

```javascript
// HTML
<button id="btn-custom" class="btn btn-secondary">
    🎨 Cargar Mi Modelo
</button>

// JavaScript
document.getElementById('btn-custom').addEventListener('click', async () => {
    const customUrl = 'https://mi-servidor.com/mi-modelo.glb'
    try {
        showLoadingSpinner(true)
        WebARDebug.loadModel(customUrl)
    } catch (error) {
        showError('Error al cargar: ' + error.message)
    }
})
```

---

## 3. ANIMACIÓN PERSONALIZADA DE AVATAR

```javascript
// Hacer que el avatar responda a clicks
document.addEventListener('click', () => {
    if (STATE.currentModel) {
        // Saltar
        gsap.to(STATE.currentModel.object3D.position, {
            y: 0.5,
            duration: 0.5,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut'
        })
        
        // Girar al mismo tiempo
        gsap.to(STATE.currentModel.object3D.rotation, {
            z: Math.PI * 2,
            duration: 0.5,
            ease: 'power1.inOut'
        })
    }
})
```

---

## 4. EFECTOS DE SONIDO (Agregar interactividad)

```javascript
// Agregar sonido cuando se carga avatar
function playSuccessSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    
    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    
    gain.gain.setValueAtTime(0.3, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
}

// Reproducir cuando avatar carga
STATE.currentModel.addEventListener('model-loaded', playSuccessSound)
```

---

## 5. CAMBIAR TAMAÑO DINÁMICAMENTE

```javascript
// Función para cambiar escala dinámicamente
function setModelScale(scale) {
    if (!STATE.currentModel) return
    
    gsap.to(STATE.currentModel.object3D.scale, {
        x: scale,
        y: scale,
        z: scale,
        duration: 0.5,
        ease: 'power2.out'
    })
}

// Usar la función
setModelScale(1.5)  // 50% más grande
setModelScale(0.5)  // 50% más pequeño
```

---

## 6. SISTEMA DE TURNOS PARA MÚLTIPLES USUARIOS

```javascript
// Gestionar avatares de múltiples usuarios
const users = [
    { name: 'Juan', avatarUrl: '...' },
    { name: 'María', avatarUrl: '...' },
    { name: 'Pedro', avatarUrl: '...' }
]

let currentUserIndex = 0

function nextUser() {
    currentUserIndex = (currentUserIndex + 1) % users.length
    const user = users[currentUserIndex]
    
    // Mostrar nombre
    document.getElementById('current-user').textContent = 
        `Turno de: ${user.name}`
    
    // Cargar avatar
    WebARDebug.loadModel(user.avatarUrl)
}

// Botón para siguiente usuario
document.getElementById('btn-next-user').addEventListener('click', nextUser)
```

---

## 7. GUARDAR PREFERENCIAS DEL USUARIO

```javascript
// Guardar datos del usuario
function saveUserData(userData) {
    const data = {
        nickname: userData.nickname,
        avatarUrl: userData.avatarUrl,
        lastModified: new Date().toISOString(),
        preferences: {
            autoRotate: userData.autoRotate,
            theme: userData.theme
        }
    }
    
    localStorage.setItem('userData', JSON.stringify(data))
}

// Cargar datos guardados
function loadUserData() {
    const stored = localStorage.getItem('userData')
    return stored ? JSON.parse(stored) : null
}

// Usar
saveUserData({
    nickname: 'Juan',
    avatarUrl: 'https://...',
    autoRotate: true,
    theme: 'dark'
})
```

---

## 8. VALIDAR ARCHIVO GLB ANTES DE CARGAR

```javascript
// Validar archivo GLB
function validateGLBFile(file) {
    // Verificar extensión
    if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
        return { valid: false, error: 'Debe ser GLB o GLTF' }
    }
    
    // Verificar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
        return { valid: false, error: `Archivo muy grande (${file.size / (1024*1024)}MB)` }
    }
    
    // Verificar que sea binario (GLB)
    const minSize = 20  // Mínimo 20 bytes
    if (file.size < minSize) {
        return { valid: false, error: 'Archivo corrupto o demasiado pequeño' }
    }
    
    return { valid: true, error: null }
}

// Usar en carga
DOM.fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0]
    const validation = validateGLBFile(file)
    
    if (!validation.valid) {
        showError(validation.error)
        return
    }
    
    handleFileUpload(e)
})
```

---

## 9. CREAR LISTA DE AVATARES DISPONIBLES

```html
<!-- HTML para selector de avatares -->
<select id="avatar-selector" class="input">
    <option value="">Seleccionar avatar...</option>
    <option value="https://models.readyplayer.me/avatar1.glb">Avatar Profesional</option>
    <option value="https://models.readyplayer.me/avatar2.glb">Avatar Casual</option>
    <option value="https://models.readyplayer.me/avatar3.glb">Avatar Deportivo</option>
</select>
<button id="btn-load-selected" class="btn btn-small">Cargar</button>
```

```javascript
// JavaScript para manejar selector
document.getElementById('btn-load-selected').addEventListener('click', () => {
    const selector = document.getElementById('avatar-selector')
    const selectedUrl = selector.value
    
    if (!selectedUrl) {
        showError('Selecciona un avatar')
        return
    }
    
    WebARDebug.loadModel(selectedUrl)
    showMessage(`Avatar cargado: ${selector.options[selector.selectedIndex].text}`, 'success')
})
```

---

## 10. INTEGRACIÓN CON API EXTERNA

```javascript
// Obtener lista de avatares desde servidor
async function fetchAvatarsList() {
    try {
        const response = await fetch('https://api.mi-servidor.com/avatars')
        
        if (!response.ok) {
            throw new Error('No se pudo obtener lista de avatares')
        }
        
        const avatars = await response.json()
        return avatars  // Array de objetos { name, url }
        
    } catch (error) {
        console.error('Error:', error)
        showError('Error al cargar avatares')
        return []
    }
}

// Usar
fetchAvatarsList().then(avatars => {
    avatars.forEach(avatar => {
        console.log(`${avatar.name}: ${avatar.url}`)
    })
})
```

---

## 11. MODO PROFESOR - MOSTRAR/OCULTAR CONTROLES

```javascript
// Variable para modo profesor
let isProfessorMode = false

function toggleProfessorMode() {
    isProfessorMode = !isProfessorMode
    
    const controlPanel = document.getElementById('control-panel')
    controlPanel.style.opacity = isProfessorMode ? '1' : '0.5'
    controlPanel.style.pointerEvents = isProfessorMode ? 'auto' : 'none'
    
    showMessage(
        isProfessorMode ? '👨‍🏫 Modo Profesor ACTIVO' : '👨‍🏫 Modo Profesor INACTIVO',
        'info'
    )
}

// Atajo: Ctrl+P para togglear
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault()
        toggleProfessorMode()
    }
})
```

---

## 12. CAPTURA DE PANTALLA DEL AVATAR

```javascript
// Capturar screenshot del avatar en AR
function captureScreenshot() {
    const canvas = document.querySelector('canvas')
    const link = document.createElement('a')
    
    link.href = canvas.toDataURL('image/png')
    link.download = `avatar-screenshot-${Date.now()}.png`
    link.click()
    
    showMessage('Captura guardada', 'success')
}

// Botón para captura
const btnCapture = document.createElement('button')
btnCapture.className = 'btn btn-secondary'
btnCapture.textContent = '📸 Captura'
btnCapture.addEventListener('click', captureScreenshot)
document.querySelector('.section').appendChild(btnCapture)
```

---

## 13. COMPARTIR AVATAR EN REDES SOCIALES

```javascript
// Compartir en Twitter
function shareOnTwitter() {
    const text = "¡Crea tu avatar personalizado en realidad aumentada! 🎨🌐"
    const url = window.location.href
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    
    window.open(twitterUrl, '_blank')
}

// Compartir en Facebook
function shareOnFacebook() {
    const url = window.location.href
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    
    window.open(facebookUrl, '_blank')
}

// Compartir enlace
function copyToClipboard() {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    showMessage('Enlace copiado al portapapeles', 'success')
}
```

---

## 14. SISTEMA DE TEMA (CLARO/OSCURO)

```javascript
// Cambiar tema
function setTheme(theme) {
    if (theme === 'light') {
        document.body.classList.remove('dark-theme')
        document.body.classList.add('light-theme')
        localStorage.setItem('theme', 'light')
    } else {
        document.body.classList.remove('light-theme')
        document.body.classList.add('dark-theme')
        localStorage.setItem('theme', 'dark')
    }
}

// Cargar tema guardado
function loadTheme() {
    const saved = localStorage.getItem('theme')
    setTheme(saved || 'dark')
}

// CSS adicional
const themeStyle = document.createElement('style')
themeStyle.innerHTML = `
    body.light-theme {
        background: linear-gradient(135deg, #ffffff, #f0f0f0);
        color: #000;
    }
    
    body.light-theme .control-panel {
        background: rgba(255, 255, 255, 0.95);
        color: #000;
    }
`
document.head.appendChild(themeStyle)

// Inicializar
loadTheme()
```

---

## 15. LOGGING Y DEBUGGING

```javascript
// Sistema de logging personalizado
const Logger = {
    log: (message, data = null) => {
        console.log(`[INFO] ${message}`, data)
        saveLogs('INFO', message, data)
    },
    
    error: (message, error = null) => {
        console.error(`[ERROR] ${message}`, error)
        saveLogs('ERROR', message, error)
    },
    
    warn: (message, data = null) => {
        console.warn(`[WARN] ${message}`, data)
        saveLogs('WARN', message, data)
    }
}

function saveLogs(level, message, data) {
    const logs = JSON.parse(localStorage.getItem('logs') || '[]')
    logs.push({
        timestamp: new Date().toISOString(),
        level,
        message,
        data
    })
    localStorage.setItem('logs', JSON.stringify(logs.slice(-100)))
}

// Usar
Logger.log('Avatar cargado', { url: 'https://...' })
Logger.error('Error en carga', new Error('CORS error'))
```

---

## Notas Importantes

- 🔒 Siempre validar entrada del usuario
- ⚡ Usar async/await para operaciones asincrónicas
- 💾 Guardar preferencias en localStorage
- 🐛 Probar en múltiples dispositivos
- 📊 Monitorear rendimiento con FPS
- 🔗 Verificar CORS en URLs externas
- 🎯 Usar try-catch para manejo de errores

---

**Ejemplos de Código - WebAR v1.0**
