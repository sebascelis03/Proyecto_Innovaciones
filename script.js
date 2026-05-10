// ========== CAMERA INTERCEPTOR (HACK FOR AR.JS) ==========
window.activeARStreams = [];
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(constraints) {
        return origGetUserMedia(constraints).then(stream => {
            window.activeARStreams.push(stream);
            return stream;
        });
    };
}

// ========== STATE ==========
const STORAGE_KEY = 'aulara_username';

// ========== DOM ==========
const loginScreen   = document.getElementById('login-screen');
const appScreen     = document.getElementById('app-screen');
const loginForm     = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const appBg         = document.getElementById('app-bg');
const displayUsername = document.getElementById('display-username');
const miniInitial   = document.getElementById('mini-avatar-initial');
const logoutBtn     = document.getElementById('logout-btn');
const navItems      = document.querySelectorAll('.nav-item');
const sectionPanels = document.querySelectorAll('.section-panel');

// ========== LOGIN ==========
function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) enterApp(saved);
}

loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const user = usernameInput.value.trim();
    if (user.length > 1) {
        localStorage.setItem(STORAGE_KEY, user);
        enterApp(user);
    }
});

function enterApp(username) {
    displayUsername.textContent = username;
    miniInitial.textContent = username.charAt(0).toUpperCase();
    loginScreen.classList.remove('active');
    appScreen.classList.add('active');
    appBg.classList.add('active');
    usernameInput.value = '';
}

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    appScreen.classList.remove('active');
    loginScreen.classList.add('active');
    appBg.classList.remove('active');
});

// ========== SPA NAV ==========
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        sectionPanels.forEach(p => p.classList.remove('active'));
        const target = document.getElementById(item.getAttribute('data-target'));
        if (target) target.classList.add('active');
    });
});

// ================================================================
//  LAB RA — Inyección dinámica, Vista Previa y Tabs Internas
// ================================================================

// Tabs internas
const labTabs = document.querySelectorAll('.lab-tab');
const labPanels = document.querySelectorAll('.lab-subpanel');

labTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        labTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        labPanels.forEach(p => p.classList.remove('active'));
        const target = document.getElementById(tab.getAttribute('data-target'));
        if (target) target.classList.add('active');
    });
});

const startArBtn   = document.getElementById('start-ar-btn');
const arViewport   = document.getElementById('ar-viewport');
const arPlaceholder = document.getElementById('ar-placeholder');
const modelUpload  = document.getElementById('model-upload');
const uploadStatus = document.getElementById('upload-status');

// Contenedores
const previewModelViewer = document.getElementById('preview-model-viewer');
const previewPlaceholder = document.getElementById('preview-placeholder');
let arContainer = null;  // se setea cuando arranca AR
let userBlobURL = null;

if (modelUpload) {
    modelUpload.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const ext = file.name.split('.').pop().toLowerCase();
        if (ext !== 'glb' && ext !== 'gltf') {
            if (uploadStatus) {
                uploadStatus.textContent = '❌ Error: Solo .glb o .gltf';
                uploadStatus.style.color = '#ef4444';
            }
            return;
        }

        if (userBlobURL) URL.revokeObjectURL(userBlobURL);
        userBlobURL = URL.createObjectURL(file);

        if (uploadStatus) {
            uploadStatus.textContent = '✅ Cargado: ' + file.name;
            uploadStatus.style.color = '#10b981';
        }

        // 1. Inyectar siempre en el Preview 3D (Usando model-viewer)
        if (previewModelViewer && previewPlaceholder) {
            previewModelViewer.src = userBlobURL;
            previewModelViewer.style.display = 'block';
            previewPlaceholder.style.display = 'none';
        }

        // 2. Inyectar en el AR si ya está activo
        if (arContainer) {
            injectModelToContainer(arContainer, 'loaded-ar-model', 'default-box', 0.5);
        }
    });
}

function injectModelToContainer(container, entityId, defaultBoxId, scale) {
    if (!container || !userBlobURL) return;

    // Quitar caja por defecto
    const box = document.getElementById(defaultBoxId);
    if (box) box.setAttribute('visible', 'false');

    // Quitar modelo anterior
    const prev = document.getElementById(entityId);
    if (prev) prev.parentNode.removeChild(prev);

    // Añadir nuevo
    const model = document.createElement('a-entity');
    model.setAttribute('id', entityId);
    model.setAttribute('gltf-model', userBlobURL);
    model.setAttribute('scale', `${scale} ${scale} ${scale}`);
    
    // Centrarlo un poco mejor
    model.setAttribute('position', '0 0 0');
    container.appendChild(model);
}

// Botón de inicio: crear la escena AR
let arInterval = null;

if (startArBtn) {
    startArBtn.addEventListener('click', () => {
        startArBtn.textContent = '⏳ Iniciando cámara...';
        startArBtn.disabled = true;
        
        if (arPlaceholder) arPlaceholder.style.display = 'none';

        const sceneHTML = `
            <div id="ar-wrapper" style="width: 100%; height: 100%; position: absolute; top:0; left:0; z-index: 5;">
                <a-scene embedded
                         arjs="sourceType: webcam; debugUIEnabled: false;"
                         vr-mode-ui="enabled: false"
                         renderer="logarithmicDepthBuffer: true;"
                         style="width:100%; height:100%; position: absolute; top:0; left:0; z-index: 2;">
                    <a-marker preset="hiro">
                        <a-entity id="ar-model-container"
                                  position="0 0 0"
                                  rotation="-90 0 0"
                                  animation="property: rotation; to: -90 360 0; loop: true; dur: 10000; easing: linear;">
                            <a-box id="default-box" color="#10b981" material="wireframe: true; opacity: 0.8" scale="0.5 0.5 0.5"></a-box>
                        </a-entity>
                    </a-marker>
                    <a-entity camera></a-entity>
                </a-scene>
                <div class="ar-overlay" id="ar-overlay" style="z-index: 10;">
                    <p>Muestra el <strong>Marcador Hiro</strong> a la cámara para ver el modelo.</p>
                    <br>
                    <button class="btn-primary" id="stop-ar-btn" style="margin-top:12px; background:#ef4444; padding:8px 20px; width:auto; font-size:0.95rem; display:inline-block; box-shadow:0 4px 10px rgba(239,68,68,0.4); pointer-events: auto;">🛑 Apagar Cámara</button>
                </div>
            </div>
        `;

        arViewport.insertAdjacentHTML('beforeend', sceneHTML);
        const arScene = document.querySelector('#ar-wrapper a-scene');

        // Atar el evento de apagado INMEDIATAMENTE
        document.getElementById('stop-ar-btn').addEventListener('click', () => {
            clearInterval(arInterval);
            const wrapper = document.getElementById('ar-wrapper');
            if (wrapper) wrapper.parentNode.removeChild(wrapper);
            
            // Buscar y apagar TODOS los videos en DOM
            const videos = document.querySelectorAll('video');
            videos.forEach(v => {
                if (v.srcObject) v.srcObject.getTracks().forEach(t => t.stop());
                v.parentNode.removeChild(v);
            });

            // Usar el interceptor maestro para matar todo rastro de cámara en hardware
            if (window.activeARStreams && window.activeARStreams.length > 0) {
                window.activeARStreams.forEach(stream => {
                    stream.getTracks().forEach(track => track.stop());
                });
                window.activeARStreams = []; // Limpiar la lista
            }

            // Hack extra para Safari/iOS por si acaso
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
                    stream.getTracks().forEach(t => t.stop());
                }).catch(e => {});
            }

            // Restaurar estado visual
            arPlaceholder.style.display = 'flex';
            startArBtn.textContent = 'Activar Cámara RA';
            startArBtn.disabled = false;
            document.body.style.overflow = ''; // Restaurar overflow
        });

        // Loop agresivo para forzar a que el video de AR.js se mueva a nuestro wrapper
        arInterval = setInterval(() => {
            const video = document.querySelector('video');
            const wrapper = document.getElementById('ar-wrapper');
            if (video && wrapper && video.parentElement !== wrapper) {
                wrapper.prepend(video);
            }
        }, 300);

        // Cuando la escena cargue, inyectar el modelo
        arScene.addEventListener('loaded', () => {
            arContainer = document.getElementById('ar-model-container');
            if (userBlobURL) {
                injectModelToContainer(arContainer, 'loaded-ar-model', 'default-box', 0.5);
            }
        });
    });
}

// ================================================================
//  MISIONES — Sistema tipo Kahoot
// ================================================================

// Banco de preguntas por materia
const quizBank = {
    biologia: [
        { q: '¿Cuál es la unidad básica de la vida?', opts: ['Átomo', 'Célula', 'Molécula', 'Tejido'], answer: 1 },
        { q: '¿Qué organelo realiza la fotosíntesis?', opts: ['Mitocondria', 'Ribosoma', 'Cloroplasto', 'Lisosoma'], answer: 2 },
        { q: '¿El ADN se encuentra principalmente en…?', opts: ['Citoplasma', 'Membrana', 'Núcleo', 'Pared celular'], answer: 2 },
        { q: '¿Qué tipo de célula NO tiene núcleo definido?', opts: ['Eucariota', 'Procariota', 'Animal', 'Vegetal'], answer: 1 },
        { q: '¿Cuál es la molécula energética de la célula?', opts: ['ADN', 'ARN', 'ATP', 'Glucosa'], answer: 2 },
    ],
    matematicas: [
        { q: '¿Cuánto es 15 × 12?', opts: ['170', '180', '190', '200'], answer: 1 },
        { q: '¿Cuál es la raíz cuadrada de 144?', opts: ['10', '11', '12', '14'], answer: 2 },
        { q: 'Si x + 5 = 12, ¿cuánto vale x?', opts: ['5', '6', '7', '8'], answer: 2 },
        { q: '¿Cuántos grados tiene un triángulo?', opts: ['90°', '180°', '270°', '360°'], answer: 1 },
        { q: '¿Cuánto es 2³?', opts: ['4', '6', '8', '16'], answer: 2 },
    ],
    etica: [
        { q: '¿Qué estudia la ética?', opts: ['La naturaleza', 'La moral y valores', 'Los números', 'El universo'], answer: 1 },
        { q: '¿Quién es el autor de "La República"?', opts: ['Aristóteles', 'Platón', 'Sócrates', 'Kant'], answer: 1 },
        { q: '¿Qué es un dilema ético?', opts: ['Un problema matemático', 'Un conflicto entre valores', 'Una ley física', 'Un tipo de arte'], answer: 1 },
        { q: '¿Qué principio dice "no hagas a otros lo que no quieres para ti"?', opts: ['Justicia', 'Regla de oro', 'Autonomía', 'Beneficencia'], answer: 1 },
        { q: '¿Qué valor implica decir la verdad?', opts: ['Lealtad', 'Honestidad', 'Respeto', 'Tolerancia'], answer: 1 },
    ],
};

// Estado del quiz
let currentQuiz     = null;  // array de preguntas actuales
let currentIndex    = 0;
let score           = 0;
let timerInterval   = null;
let timeLeft        = 0;
const QUESTION_TIME = 15; // segundos por pregunta

// DOM del quiz
const quizLobby     = document.getElementById('quiz-lobby');
const quizArena     = document.getElementById('quiz-arena');
const quizResults   = document.getElementById('quiz-results');
const subjectBtns   = document.querySelectorAll('.subject-btn');
const questionText  = document.getElementById('question-text');
const answersGrid   = document.getElementById('answers-grid');
const timerBar      = document.getElementById('timer-bar');
const timerText     = document.getElementById('timer-text');
const qCounter      = document.getElementById('question-counter');
const scoreDisplay  = document.getElementById('score-display');
const finalScore    = document.getElementById('final-score');
const finalTotal    = document.getElementById('final-total');
const finalMsg      = document.getElementById('final-message');
const restartBtn    = document.getElementById('restart-quiz');

// Iniciar quiz al elegir materia
subjectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const subject = btn.getAttribute('data-subject');
        startQuiz(subject);
    });
});

function startQuiz(subject) {
    currentQuiz  = shuffleArray([...quizBank[subject]]);
    currentIndex = 0;
    score        = 0;
    scoreDisplay.textContent = '0';

    quizLobby.classList.add('hidden');
    quizResults.classList.add('hidden');
    quizArena.classList.remove('hidden');

    loadQuestion();
}

function loadQuestion() {
    if (currentIndex >= currentQuiz.length) {
        endQuiz();
        return;
    }

    const q = currentQuiz[currentIndex];
    questionText.textContent = q.q;
    qCounter.textContent = `${currentIndex + 1} / ${currentQuiz.length}`;

    // Colores Kahoot clásicos
    const colors = ['#e21b3c', '#1368ce', '#d89e00', '#26890c'];
    const icons  = ['▲', '◆', '●', '■'];

    answersGrid.innerHTML = '';
    q.opts.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.style.background = colors[i];
        btn.innerHTML = `<span class="answer-icon">${icons[i]}</span><span>${opt}</span>`;
        btn.addEventListener('click', () => selectAnswer(i, btn));
        answersGrid.appendChild(btn);
    });

    // Timer
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = QUESTION_TIME;
    timerText.textContent = timeLeft;
    timerBar.style.width = '100%';

    timerInterval = setInterval(() => {
        timeLeft--;
        timerText.textContent = timeLeft;
        timerBar.style.width = ((timeLeft / QUESTION_TIME) * 100) + '%';

        if (timeLeft <= 5) timerBar.style.background = '#ef4444';
        else timerBar.style.background = 'linear-gradient(90deg, #6366f1, #06b6d4)';

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            revealAnswer(-1); // Tiempo agotado
        }
    }, 1000);
}

function selectAnswer(idx, btn) {
    clearInterval(timerInterval);
    revealAnswer(idx);
}

function revealAnswer(chosen) {
    const q = currentQuiz[currentIndex];
    const btns = answersGrid.querySelectorAll('.answer-btn');

    btns.forEach((btn, i) => {
        btn.style.pointerEvents = 'none';
        if (i === q.answer) {
            btn.classList.add('correct');
        } else if (i === chosen && chosen !== q.answer) {
            btn.classList.add('wrong');
        } else {
            btn.style.opacity = '0.4';
        }
    });

    if (chosen === q.answer) {
        score++;
        scoreDisplay.textContent = score;
    }

    currentIndex++;
    setTimeout(loadQuestion, 1500);
}

function endQuiz() {
    quizArena.classList.add('hidden');
    quizResults.classList.remove('hidden');

    finalScore.textContent = score;
    finalTotal.textContent = currentQuiz.length;

    const pct = (score / currentQuiz.length) * 100;
    if (pct === 100) {
        finalMsg.textContent = '🏆 ¡Perfecto! ¡Eres un genio!';
        finalMsg.style.color = '#fbbf24';
    } else if (pct >= 60) {
        finalMsg.textContent = '🎉 ¡Buen trabajo! Sigue así.';
        finalMsg.style.color = '#10b981';
    } else {
        finalMsg.textContent = '💪 ¡No te rindas! Inténtalo de nuevo.';
        finalMsg.style.color = '#ef4444';
    }
}

restartBtn?.addEventListener('click', () => {
    quizResults.classList.add('hidden');
    quizLobby.classList.remove('hidden');
});

// Utilidad
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ========== START ==========
init();
