const users = ["user_1", "user_2", "user_3"];
const storageKey = "aula_virtual_usuario";
const defaultModel = "https://cdn.aframe.io/test-models/models/boombox/boombox.glb";

const loginScreen = document.getElementById("login-screen");
const appScreen = document.getElementById("app-screen");
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");
const activeUserLabel = document.getElementById("active-user");
const logoutButton = document.getElementById("logout-button");
const teamList = document.getElementById("team-list");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const launchKahootButton = document.getElementById("launch-kahoot");
const startQuizButton = document.getElementById("start-quiz");
const quizContainer = document.getElementById("quiz-container");
const quizResult = document.getElementById("quiz-result");
const arStatus = document.getElementById("ar-status");
const arSceneContainer = document.getElementById("ar-scene-container");
const glbInput = document.getElementById("glb-input");
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebar = document.getElementById("sidebar");

let currentUser = null;
let currentTab = "kahoot-tab";
let arSceneCreated = false;
let modelEntity = null;

function init() {
    const savedUser = localStorage.getItem(storageKey);
    if (savedUser && users.includes(savedUser)) {
        openApp(savedUser);
    } else {
        showLogin();
    }
    attachEvents();
}

function attachEvents() {
    loginForm.addEventListener("submit", handleLogin);
    logoutButton.addEventListener("click", handleLogout);
    tabButtons.forEach((button) => button.addEventListener("click", handleTabChange));
    launchKahootButton.addEventListener("click", () => window.open("https://kahoot.it", "_blank"));
    startQuizButton.addEventListener("click", toggleQuiz);
    glbInput.addEventListener("change", handleModelUpload);
    sidebarToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
    window.addEventListener("resize", closeSidebarOnResize);
    document.querySelectorAll(".quiz-option").forEach((button) => {
        button.addEventListener("click", handleQuizAnswer);
    });
}

function handleLogin(event) {
    event.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    if (!users.includes(username) || password !== username) {
        loginError.textContent = "Usuario o contraseña inválidos.";
        loginError.classList.remove("hidden");
        return;
    }
    loginError.classList.add("hidden");
    localStorage.setItem(storageKey, username);
    openApp(username);
}

function openApp(user) {
    currentUser = user;
    loginScreen.classList.add("hidden");
    appScreen.classList.remove("hidden");
    activeUserLabel.textContent = user;
    renderTeamList(user);
    setActiveTab(currentTab);
}

function showLogin() {
    loginScreen.classList.remove("hidden");
    appScreen.classList.add("hidden");
    usernameInput.focus();
}

function handleLogout() {
    localStorage.removeItem(storageKey);
    currentUser = null;
    arSceneContainer.innerHTML = `
        <div class="ar-placeholder">
            <div class="placeholder-icon">🎯</div>
            <p>Carga un modelo para ver la realidad aumentada</p>
        </div>
    `;
    arSceneCreated = false;
    modelEntity = null;
    showLogin();
}

function renderTeamList(user) {
    teamList.innerHTML = "";
    users.filter((item) => item !== user).forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        li.className = "team-item";
        teamList.appendChild(li);
    });
}

function handleTabChange(event) {
    const tabId = event.currentTarget.dataset.tab;
    setActiveTab(tabId);
}

function setActiveTab(tabId) {
    currentTab = tabId;
    tabButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.tab === tabId);
    });
    tabPanels.forEach((panel) => {
        panel.classList.toggle("hidden", panel.id !== tabId);
    });
    if (tabId === "ar-tab") {
        arStatus.textContent = arSceneCreated ? "Modelo cargado. Coloca el marcador Hiro frente a la cámara." : "Selecciona un modelo GLB para comenzar.";
    }
}

function toggleQuiz() {
    quizContainer.classList.toggle("hidden");
    quizResult.classList.add("hidden");
}

function handleModelUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension !== 'glb') {
        arStatus.textContent = 'Solo se permite archivo GLB.';
        return;
    }
    const url = URL.createObjectURL(file);
    loadModel(url);
    setActiveTab("ar-tab");
}

function createARScene() {
    arSceneContainer.innerHTML = `
        <a-scene embedded arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;">
            <a-marker preset="hiro">
                <a-entity id="model-entity" gltf-model="${defaultModel}" scale="0.4 0.4 0.4" position="0 0 0"></a-entity>
                <a-light type="ambient" intensity="0.8"></a-light>
                <a-light type="directional" position="0 1 0" intensity="0.5"></a-light>
            </a-marker>
            <a-camera position="0 0 0"></a-camera>
        </a-scene>
    `;
    arSceneCreated = true;
    arStatus.textContent = 'Modelo cargado. Coloca el marcador Hiro frente a la cámara.';
    modelEntity = document.getElementById('model-entity');
}

function loadModel(url) {
    if (!arSceneCreated) {
        createARScene();
    }
    if (!modelEntity) {
        modelEntity = document.getElementById('model-entity');
    }
    if (modelEntity) {
        modelEntity.setAttribute('gltf-model', url);
        arStatus.textContent = 'Modelo cargado. Mueve el marcador Hiro frente a la cámara.';
    }
}

function handleQuizAnswer(event) {
    quizResult.classList.remove("hidden");
    const answer = event.currentTarget.textContent;
    if (answer === "Mejorar la experiencia de aprendizaje") {
        quizResult.textContent = "Respuesta correcta. La realidad aumentada mejora la experiencia educativa.";
    } else {
        quizResult.textContent = "Respuesta incorrecta. Intenta de nuevo.";
    }
}

function closeSidebarOnResize() {
    if (window.innerWidth > 720) {
        sidebar.classList.remove("open");
    }
}

init();
