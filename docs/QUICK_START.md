# 🚀 QUICK START - Guía Rápida de 5 Minutos

## Inicio Rápido desde Cero

### 1️⃣ Descargar el Proyecto (1 min)

```bash
# Opción A: Clonar con Git
git clone https://github.com/tu-usuario/Proyecto_Innovaciones.git
cd Proyecto_Innovaciones

# Opción B: Descargar ZIP y extraer
# Luego abrir terminal en la carpeta
```

### 2️⃣ Ejecutar Servidor Local (1 min)

```bash
# Python 3
python -m http.server 8000

# O Node.js
npx http-server

# O PHP
php -S localhost:8000
```

### 3️⃣ Abrir en Navegador (30 seg)

```
http://localhost:8000
```

### 4️⃣ Configurar Cámara (30 seg)

- ✅ Permitir acceso a cámara cuando se solicite
- ✅ Asegurar buena iluminación
- ✅ Mostrar marcador Hiro a la cámara

### 5️⃣ Cargar Avatar (2 min)

**Opción 1: Ready Player Me (Recomendado)**
1. Click en botón "🎨 Ready Player Me"
2. Se abre editor de RPM
3. Personaliza tu avatar (2-3 min)
4. Click en "Export"
5. Avatar carga automáticamente

**Opción 2: Subir GLB Local**
1. Click en "📤 Subir GLB"
2. Selecciona un archivo GLB
3. Avatar carga en segundos

**Opción 3: Preestablecido**
1. Click en "⭐ Preestablecido"
2. Avatar de ejemplo carga de inmediato

---

## Comandos Útiles

```javascript
// En consola del navegador (F12)

// Ver estado actual
WebARDebug.state

// Cargar modelo manualmente
WebARDebug.loadModel('url-aqui')

// Rotar 45 grados
WebARDebug.rotateModel(45)

// Zoom x1.5
WebARDebug.zoomModel(1.5)

// Reset
WebARDebug.resetModelTransform()

// Mostrar mensaje
WebARDebug.showMessage('Hola!', 'success')

// Mostrar error
WebARDebug.showError('Algo salió mal')
```

---

## Primeros Pasos de Personalización

### A. Cambiar Título

```html
<!-- En index.html -->
<title>Mi Plataforma de RA</title>
<h1 class="title">🌐 Mi Aula AR</h1>
```

### B. Cambiar Colores

```javascript
// En config.js
UI: {
    PRIMARY_COLOR: '#0066ff',    // Tu color azul
    SECONDARY_COLOR: '#ff0066',  // Tu color rosa
}
```

### C. Agregar Logo

```html
<!-- En header de index.html -->
<img src="./assets/logo.png" style="height: 40px; margin-right: 10px;">
```

### D. Cambiar Botón Kahoot

```javascript
// En script.js - dentro de init()
DOM.btnKahoot.textContent = '📊 Mi Evaluación Personalizada'
```

---

## Problemas Comunes y Soluciones Rápidas

### ❌ "Marcador no se detecta"
✅ **Solución:** Mejora iluminación, acerca más el marcador a cámara

### ❌ "Avatar parpadea"
✅ **Solución:** En config.js, cambia `MARKER_SIZE: 0.1` a `0.12`

### ❌ "Bajo rendimiento/FPS bajo"
✅ **Solución:** Usa avatar más simple o desactiva rotación automática

```javascript
// En config.js
INTERACTION: {
    AUTO_ROTATE: false  // Desactivar
}
```

### ❌ "CORS error"
✅ **Solución:** Asegúrate de usar HTTPS o localhost

### ❌ "Avatar no carga desde URL"
✅ **Solución:** Valida que sea URL válida de GLB con CORS habilitado

---

## URLs Útiles

| Recurso | URL |
|---------|-----|
| Ready Player Me | https://rpm.me |
| Kahoot | https://kahoot.it |
| Generador de Marcadores | https://carnaux.github.io/NFT-Marker-Creator/ |
| Documentación A-Frame | https://aframe.io/docs/ |
| Documentación AR.js | https://ar-js-org.github.io/AR.js-Docs/ |

---

## Estructura de Carpetas

```
Proyecto_Innovaciones/
├── index.html          ← Página principal
├── styles.css          ← Estilos
├── script.js           ← Lógica (EDITAR AQUÍ para cambios lógicos)
├── config.js           ← Configuración (EDITAR AQUÍ para personalizar)
├── README.md           ← Documentación
├── docs/               ← Guías detalladas
│   ├── ARQUITECTURA.md
│   ├── GUIA_IMPLEMENTACION.md
│   └── MARCADORES.md
└── assets/
    └── markers/        ← Tus marcadores personalizados aquí
```

---

## Próximos Pasos Después de Setup Básico

1. **Crear tu propio marcador NFT**
   → Ver `docs/MARCADORES.md`

2. **Integrar con tu institución**
   → Cambiar colores, logo, textos

3. **Preparar avatares para tus estudiantes**
   → Guiar a estudiantes en ready player me

4. **Configurar Kahoot**
   → Crear quiz en kahoot.it
   → Linkar desde la plataforma

5. **Desplegar en producción**
   → Ver `docs/GUIA_IMPLEMENTACION.md` sección 11

---

## Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl+R` | Reiniciar avatar |
| `Ctrl+O` | Abrir archivo |
| `Ctrl+?` | Mostrar ayuda |
| `F12` | Abrir consola |

---

## Primer Avatar - Paso a Paso

### Minuto 1-2: Preparar
- ✅ Abre navegador
- ✅ Ve a Ready Player Me (https://rpm.me)

### Minuto 2-4: Crear
- ✅ Elige género y tipo de cuerpo
- ✅ Personaliza rasgos faciales
- ✅ Elige ropa/accesorios

### Minuto 4-5: Exportar y Cargar
- ✅ Click en "Export"
- ✅ Copia URL de descarga
- ✅ Regresa a tu plataforma
- ✅ Pega URL en campo de avatar
- ✅ Click en botón de cargar
- ✅ ¡Listo! Avatar aparece en AR

---

## FAQ Rápido

**P: ¿Qué navegadores funcionan?**
R: Chrome, Firefox, Safari (versiones modernas). Requiere WebGL.

**P: ¿Necesito servidor especial?**
R: No. Cualquier servidor HTTP funciona (Python, Node.js, etc.)

**P: ¿Puedo usar en dispositivo móvil sin servidor?**
R: No, requiere HTTPS o servidor local.

**P: ¿Puedo cambiar el marcador?**
R: Sí. Ver sección de Marcadores en documentación.

**P: ¿Puedo subir mis propios modelos 3D?**
R: Sí. En formato GLB desde Blender/Maya.

**P: ¿Funciona sin conexión a Internet?**
R: Los avatares sí (si ya están cargados). RPM requiere conexión.

---

## Recursos Descargables

Dentro de la carpeta `docs/`:

- 📄 PROPUESTA_TECNICA.md - Documento técnico completo
- 📄 ARQUITECTURA.md - Explicación técnica del sistema
- 📄 GUIA_IMPLEMENTACION.md - Guía detallada
- 📄 MARCADORES.md - Guía de marcadores
- 📄 QUICK_START.md - **ESTE ARCHIVO**

---

## ¿Necesitas Ayuda?

### Nivel Principiante
→ Lee `README.md`

### Nivel Intermedio  
→ Lee `docs/GUIA_IMPLEMENTACION.md`

### Nivel Avanzado
→ Lee `docs/ARQUITECTURA.md` y `config.js`

### Problemas Específicos
→ Ver sección de troubleshooting en documentación

---

**Quick Start - WebAR v1.0**

---

## 🎯 Tu Meta: En 5 Minutos

```
Inicio
  ↓
 ✅ Descargar
  ↓
 ✅ Ejecutar servidor
  ↓
 ✅ Abrir en navegador
  ↓
 ✅ Permitir cámara
  ↓
 ✅ Mostrar marcador
  ↓
 ✅ Cargar avatar
  ↓
🎉 ¡LISTO! Avatar en AR funcionando
```

**¡Mucha suerte! 🚀**
