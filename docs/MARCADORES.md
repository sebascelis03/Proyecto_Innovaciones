# 🎯 MARCADORES - Guía de Configuración y Uso

## 1. ¿QUÉ ES UN MARCADOR AR?

Un marcador AR es una imagen o patrón que el navegador detecta para posicionar objetos 3D en el espacio. El sistema WebAR utiliza marcadores para anclar avatares 3D en el mundo real capturado por la cámara.

### 1.1 Tipos de Marcadores

| Tipo | Descripción | Ventajas | Desventajas |
|------|-------------|----------|-------------|
| **HIRO** | Patrón 2D predefinido | Fácil de usar, universal | Limitado |
| **NFT** | Rastreo natural de características | Flexible, personalizable | Requiere calibración |
| **QR** | Código QR estándar | Robusto, fácil de generar | Menos versátil |
| **IMAGE** | Imagen cualquiera | Máxima libertad | Requiere buena iluminación |

---

## 2. MARCADOR HIRO (Predeterminado)

### 2.1 Descripción

El marcador "Hiro" es un patrón 2D estándar de A-Frame que viene preconfigurado en el sistema.

```
┌─────────────────────┐
│  ██   ██    ██ ██   │
│  ██   ██    ██ ██   │
│  ██   ██    ██      │
│              ██     │
│  ██   ██    ██ ██   │
│  ██   ██    ██ ██   │
└─────────────────────┘
```

### 2.2 Cómo Usarlo

**Opción A: Imprimir**
1. Descargar imagen: [Hiro Marker PNG](https://ar-js-org.github.io/AR.js-Docs/marker-based/marker_training/)
2. Imprimir a tamaño mínimo 10x10 cm
3. Mostrar a cámara

**Opción B: Mostrar en Pantalla**
1. Abrir imagen en navegador/tablet
2. Usar como referencia para cámara
3. Asegurar buena iluminación

### 2.3 Configuración en Código

```html
<!-- Ya configurado en index.html -->
<a-marker preset="hiro">
    <a-entity id="avatar-container">
        <!-- Avatar aparece aquí -->
    </a-entity>
</a-marker>
```

### 2.4 Ventajas del Hiro
✅ Funciona sin calibración  
✅ Rápido de detectar  
✅ Compatible con todos los navegadores  
✅ Ideal para pruebas rápidas  

### 2.5 Limitaciones
❌ Solo un patrón disponible  
❌ No personalizable  
❌ Fijo en tamaño  

---

## 3. MARCADORES NFT (Personalizado)

NFT = Natural Feature Tracking (Rastreo Natural de Características)

### 3.1 ¿Cuándo Usar?

- Quieres usar un logo o imagen personalizada
- Necesitas múltiples marcadores diferentes
- Tu institución tiene identidad visual específica

### 3.2 Crear Marcador NFT

#### Paso 1: Preparar Imagen

```
Requisitos:
- Formato: PNG o JPG
- Tamaño: 512x512 px (mínimo)
- Características: Imagen con patrones/texturas complejas
- NO usar: Imágenes lisas, degradados, colores sólidos

Ejemplos buenos:
✅ Logos con detalles
✅ Fotos de naturaleza
✅ Textos con variaciones
✅ Patrones geométricos complejos

Ejemplos malos:
❌ Gradientes suaves
❌ Colores sólidos
❌ Imágenes borrosas
❌ Patrones repetitivos simples
```

#### Paso 2: Procesar en AR.js Creator

1. Ir a: [AR.js Marker Creator](https://carnaux.github.io/NFT-Marker-Creator/)

2. Seleccionar imagen de tu computadora

3. Esperar procesamiento (2-5 minutos)

4. Descargar archivos:
   - `miMarcador.fset` (Feature Set)
   - `miMarcador.iset` (Image Set)
   - `miMarcador.f3d` (3D Features)

#### Paso 3: Agregar al Proyecto

```bash
# Crear carpeta
mkdir -p assets/markers/miMarcador

# Copiar archivos descargados
cp miMarcador.* assets/markers/miMarcador/
```

#### Paso 4: Actualizar HTML

```html
<!-- index.html -->
<!-- ANTES: -->
<a-marker preset="hiro">

<!-- DESPUÉS: -->
<a-nft type="nft" url="./assets/markers/miMarcador/miMarcador">
    <a-entity id="avatar-container">
        <!-- Avatar aquí -->
    </a-entity>
</a-nft>
```

#### Paso 5: Actualizar config.js

```javascript
// config.js
export const CONFIG = {
    AR: {
        TRACKING_TYPE: 'nft',
        MARKER_PATH: './assets/markers/miMarcador',
        MARKER_SIZE: 0.1,
    }
};
```

### 3.3 Ventajas NFT
✅ Usa cualquier imagen  
✅ Múltiples marcadores posibles  
✅ Más robusto que patrones 2D  
✅ Mejor rendimiento en mobiles  

### 3.4 Desventajas NFT
❌ Requiere calibración inicial  
❌ Más lento de procesar  
❌ Necesita buena iluminación  

### 3.5 Solucionar Problemas de Detección

```javascript
// En config.js, aumentar debug
LOGGING: {
    ENABLED: true,
    LEVEL: 'debug'
}

// En index.html
<a-scene arjs="debugUIEnabled: true;">
```

---

## 4. MARCADORES QR (Alternativa)

### 4.1 Usar QR en lugar de Hiro

```html
<!-- Agregar soporte QR -->
<a-marker preset="qr" type="qr">
    <a-entity id="avatar-container">
        <!-- Avatar aquí -->
    </a-entity>
</a-marker>
```

### 4.2 Generar QR

```bash
# Usar servicio online:
# https://www.qr-code-generator.com/
# https://qr.io/

# Hacer QR de tu URL:
https://www.qr-code-generator.com/
```

### 4.3 Ventajas/Desventajas

**Ventajas:**
✅ Fácil de generar  
✅ Universal  
✅ Reconocido por muchos dispositivos  

**Desventajas:**
❌ Menos estético  
❌ Requiere imagen más clara  

---

## 5. MÚLTIPLES MARCADORES

### 5.1 Usar Varios Marcadores en Una Escena

```html
<a-scene embedded arjs="trackingMethod: best;">
    <!-- Marcador 1: Hiro -->
    <a-marker preset="hiro" id="marker-hiro">
        <a-sphere color="red"></a-sphere>
    </a-marker>
    
    <!-- Marcador 2: NFT Personalizado -->
    <a-nft type="nft" url="./assets/markers/marcador1/marcador1">
        <a-sphere color="blue"></a-sphere>
    </a-nft>
    
    <!-- Marcador 3: Otro NFT -->
    <a-nft type="nft" url="./assets/markers/marcador2/marcador2">
        <a-sphere color="green"></a-sphere>
    </a-nft>
    
    <a-camera></a-camera>
</a-scene>
```

### 5.2 Cambiar Entre Marcadores Dinámicamente

```javascript
// script.js - Agregar selector de marcador
function selectMarker(markerType) {
    const allMarkers = document.querySelectorAll('a-marker, a-nft')
    
    allMarkers.forEach(marker => {
        marker.style.display = 'none'
    })
    
    const selected = document.getElementById(`marker-${markerType}`)
    if (selected) selected.style.display = 'block'
}
```

---

## 6. OPTIMIZACIÓN DE MARCADORES

### 6.1 Mejores Prácticas

```
✅ HACER:
- Usar imágenes de alta calidad (300+ DPI)
- Mantener buena iluminación
- Evitar reflejos
- Usar marcador por lo menos 10x10 cm
- Posicionar perpendicular a cámara
- Usar fondo limpio detrás del marcador

❌ NO HACER:
- Usar imágenes oscuras o borrosas
- Colocar marcador en ángulo extremo
- Usar luz trasera (backlight)
- Cruzar marcador con dedos/objetos
- Cambiar rápidamente de marcador
```

### 6.2 Calibración de Tamaño

```javascript
// Si el avatar parece muy grande/pequeño:
CONFIG.AR.MARKER_SIZE = 0.1  // Por defecto

// Aumentar si muy pequeño:
CONFIG.AR.MARKER_SIZE = 0.15

// Disminuir si muy grande:
CONFIG.AR.MARKER_SIZE = 0.08
```

### 6.3 Distancia Óptima

```
- Mínimo: 20 cm del marcador
- Óptimo: 30-50 cm
- Máximo: 1 metro (depende de tamaño)

┌─────────────────────────────────┐
│  Cámara                          │
│                                 │
│  30-50 cm ideal                │
│         ↓                        │
│     ┌────────┐                  │
│     │MARCADOR│                  │
│     └────────┘                  │
│         ↑                        │
│  Avatar aparece aquí            │
└─────────────────────────────────┘
```

---

## 7. MARCADORES PARA EDUCACIÓN

### 7.1 Logo de Institución como Marcador

```bash
# Paso 1: Obtener logo institucional en alta res
# Ejemplo: logo-universidad.png (512x512+)

# Paso 2: Procesar en AR.js Creator
# (Ver sección 3.2)

# Paso 3: Usar en aulas
# Imprimir con tamaño 20x20 cm en cartulina
```

### 7.2 Tarjetas de Estudiante

```
Idea: Usar tarjeta de estudiante como marcador

┌────────────────────┐
│   UNIVERSIDAD XYZ  │
│                    │
│  [Foto/Patrón]     │
│                    │
│ Nombre: Juan       │
│ ID: 12345          │
└────────────────────┘

Beneficios:
✅ Utilidad práctica
✅ Identificación única
✅ Personalizable
```

### 7.3 Pósters Educativos

```
Idea: Usar imagen educativa como marcador

Ejemplo: Póster de anatomía
- Imagen con características complejas ✅
- Al detectar, avatar explica conceptos
- Estudiantes interactúan

Ejemplo: Mapa histórico
- Usa imagen del mapa como marcador
- Avatar aparece para contar historia
```

---

## 8. TROUBLESHOOTING DE MARCADORES

### Problema: "Marcador no se detecta"

| Causa | Solución |
|-------|----------|
| Iluminación pobre | Aumentar luz ambiental |
| Marcador sucio/dañado | Limpiar o reimprimir |
| Demasiado cerca | Alejar cámara 30+ cm |
| Ángulo extremo | Posicionar perpendicular |
| Imagen de mala calidad | Usar resolución 512x512+ |

### Problema: "Detección lenta"

```javascript
// Aumentar velocidad en config.js
AR: {
    TRACKING_METHOD: 'best'  // O 'auto'
}
```

### Problema: "Avatar desaparece frecuentemente"

```javascript
// Aumentar rango de detección
NEAR_PLANE: 0.001,
FAR_PLANE: 1000,

// O ajustar tamaño del marcador
MARKER_SIZE: 0.12  // Aumentar un poco
```

---

## 9. RECURSOS DESCARGABLES

### 9.1 Marcadores de Prueba

Descargar desde carpeta `docs/marcadores/`:

1. **hiro.png** - Marcador Hiro estándar
2. **qr-example.png** - Código QR de ejemplo
3. **university-logo.png** - Logo para personalizar

### 9.2 Generadores Online

| Herramienta | URL | Uso |
|-----------|-----|-----|
| AR.js Creator | https://carnaux.github.io/NFT-Marker-Creator/ | NFT markers |
| QR Generator | https://www.qr-code-generator.com/ | QR codes |
| Marker Training | https://ar-js-org.github.io/AR.js-Docs/marker-based/ | Patrones 2D |

---

## 10. MEJORES PRÁCTICAS FINALES

### 10.1 Para Educadores

```
1. Diseñar marcadores con identidad institucional
2. Imprimir en cartulina resistente
3. Plastificar para durabilidad
4. Crear kit de marcadores para cada aula
5. Entrenar a estudiantes en uso correcto
```

### 10.2 Para Desarrolladores

```
1. Validar marcadores en múltiples dispositivos
2. Crear fallback con segundo marcador
3. Loguear problemas de detección
4. Mantener biblioteca de marcadores testeados
5. Documentar configuración usada
```

### 10.3 Para Usuarios

```
1. Limpiar lente de cámara
2. Usar marcador impreso (mejor que pantalla)
3. Mantener iluminación adecuada
4. Evitar sombras sobre marcador
5. Posicionar paralelo a cámara
```

---

## 11. CONFIGURACIÓN RECOMENDADA POR ENTORNO

### Aula Virtual Básica
```javascript
TRACKING_TYPE: 'hiro'      // Fácil setup
MARKER_SIZE: 0.1
AUTO_QUALITY: true         // Adaptar a dispositivos
```

### Institución Educativa
```javascript
TRACKING_TYPE: 'nft'       // Logo personalizado
MARKER_SIZE: 0.15          // Más grande para niños
MULTIPLE_MARKERS: true     // Varios escenarios
```

### Entorno Corporativo
```javascript
TRACKING_TYPE: 'nft'       // Branding
MARKER_SIZE: 0.12
PROFESSIONAL_UI: true      // Estilos corporativos
```

---

**Guía de Marcadores - WebAR v1.0**  
**Última actualización: Mayo 2026**

Para preguntas sobre marcadores, consultar [documentación oficial de AR.js](https://ar-js-org.github.io/AR.js-Docs/).
