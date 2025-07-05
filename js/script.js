// DOM Elements
const scenarioDisplay = document.getElementById('scenarioDisplay');
const legitBtn = document.getElementById('legitBtn');
const scamBtn = document.getElementById('scamBtn');
const feedbackContainer = document.getElementById('feedbackContainer');
const quizProgress = document.getElementById('quizProgress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const scoreDisplay = document.getElementById('scoreDisplay');
const quickTrainBtn = document.getElementById('quickTrainBtn');
const quizModeBtn = document.getElementById('quizModeBtn');
const dashboardBtn = document.getElementById('dashboardBtn');

// User state
let currentScenario = null;
let userStats = {
    correct: 0,
    incorrect: 0,
    streak: 0,
    maxStreak: 0,
    quizScores: [],
    scenariosCompleted: []
};

// Quiz mode state
let quizMode = false;
let quizScenarios = [];
let currentQuizIndex = 0;
let quizScore = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    loadRandomScenario();
    
    // Event listeners
    legitBtn.addEventListener('click', () => handleDecision(false));
    scamBtn.addEventListener('click', () => handleDecision(true));
    
    quickTrainBtn.addEventListener('click', () => {
        quizMode = false;
        quizProgress.style.display = 'none';
        quickTrainBtn.classList.add('active');
        quizModeBtn.classList.remove('active');
        loadRandomScenario();
    });
    
    quizModeBtn.addEventListener('click', startQuizMode);
    dashboardBtn.addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });
});

function loadRandomScenario() {
    // Clear previous feedback and highlights
    feedbackContainer.innerHTML = '';
    document.querySelectorAll('.clue-highlight').forEach(el => el.remove());
    
    // Get random scenario
    const randomIndex = Math.floor(Math.random() * scenarios.length);
    currentScenario = scenarios[randomIndex];
    renderScenario(currentScenario);
}

function renderScenario(scenario) {
    scenarioDisplay.innerHTML = '';
    
    if (scenario.type === 'email') {
        renderEmailScenario(scenario);
    } else if (scenario.type === 'website') {
        renderWebsiteScenario(scenario);
    } else if (scenario.type === 'sms') {
        renderSmsScenario(scenario);
    }
}

function renderEmailScenario(scenario) {
    const emailHTML = `
        <div class="email-header">
            <div class="email-sender">From: ${scenario.content.sender}</div>
            <div class="email-date">${new Date().toLocaleDateString()}</div>
        </div>
        <div class="email-subject">${scenario.content.subject}</div>
        <div class="email-body">${scenario.content.body.replace(/\n/g, '<br>')}</div>
    `;
    scenarioDisplay.innerHTML = emailHTML;
    
    // Add logo if available
    if (scenario.content.logo) {
        const logoImg = document.createElement('img');
        logoImg.src = `images/email-icons/${scenario.content.logo}.png`;
        logoImg.alt = "Company Logo";
        logoImg.style.maxHeight = "40px";
        scenarioDisplay.prepend(logoImg);
    }
}

function renderWebsiteScenario(scenario) {
    const websiteHTML = `
        <div class="website-display">
            <div class="url-bar">${scenario.content.url}</div>
            <div class="website-content">
                <h3>${scenario.content.title}</h3>
                <p>${scenario.content.content}</p>
                ${scenario.content.loginForm ? 
                    '<div class="login-form"><input type="text" placeholder="Email or Phone"><input type="password" placeholder="Password"><button>Log In</button></div>' : ''}
            </div>
        </div>
    `;
    scenarioDisplay.innerHTML = websiteHTML;
}

function renderSmsScenario(scenario) {
    const smsHTML = `
        <div class="sms-display">
            <div class="sms-sender">${scenario.content.sender}</div>
            <div class="sms-message">${scenario.content.message}</div>
        </div>
    `;
    scenarioDisplay.innerHTML = smsHTML;
}

function handleDecision(userSaidPhishing) {
    const isCorrect = userSaidPhishing === currentScenario.isPhishing;
    
    // Update stats
    if (isCorrect) {
        userStats.correct++;
        userStats.streak++;
        if (userStats.streak > userStats.maxStreak) {
            userStats.maxStreak = userStats.streak;
        }
        if (quizMode) quizScore++;
    } else {
        userStats.incorrect++;
        userStats.streak = 0;
    }
    
    userStats.scenariosCompleted.push({
        id: currentScenario.id,
        correct: isCorrect,
        timestamp: new Date().toISOString()
    });
    
    showFeedback(isCorrect);
    saveProgress();
    
    if (quizMode) {
        currentQuizIndex++;
        updateQuizProgress();
        
        if (currentQuizIndex < quizScenarios.length) {
            setTimeout(() => {
                currentScenario = quizScenarios[currentQuizIndex];
                renderScenario(currentScenario);
                feedbackContainer.innerHTML = '';
            }, 2500);
        } else {
            setTimeout(() => {
                finishQuiz();
            }, 2500);
        }
    } else {
        setTimeout(loadRandomScenario, 2500);
    }
}

function showFeedback(isCorrect) {
    feedbackContainer.className = 'feedback-container';
    feedbackContainer.classList.add(isCorrect ? 'correct-feedback' : 'incorrect-feedback');
    
    const feedbackHTML = `
        <h3>${isCorrect ? '✅ Correct!' : '❌ Incorrect!'}</h3>
        <p>${currentScenario.isPhishing ? 'This was indeed a phishing attempt.' : 'This was a legitimate communication.'}</p>
        ${currentScenario.clues.length ? '<h4>Key things to look for:</h4>' : ''}
        <ul>
            ${currentScenario.clues.map(clue => `<li>${clue.explanation}</li>`).join('')}
        </ul>
    `;
    feedbackContainer.innerHTML = feedbackHTML;
    
    // Add visual highlights for clues
    currentScenario.clues.forEach(clue => {
        if (clue.element === 'sender') {
            highlightElement('.email-sender, .sms-sender', clue.explanation);
        } else if (clue.element === 'subject') {
            highlightElement('.email-subject', clue.explanation);
        } else if (clue.element === 'link' || clue.element === 'url') {
            highlightElement('a, .url-bar', clue.explanation);
        }
        // Additional element types would be handled here
    });
}

function highlightElement(selector, explanation) {
    const elements = scenarioDisplay.querySelectorAll(selector);
    elements.forEach(el => {
        const highlight = document.createElement('div');
        highlight.className = 'clue-highlight';
        highlight.style.left = `${el.offsetLeft}px`;
        highlight.style.top = `${el.offsetTop}px`;
        highlight.style.width = `${el.offsetWidth}px`;
        highlight.style.height = `${el.offsetHeight}px`;
        
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip';
        tooltip.textContent = explanation;
        highlight.appendChild(tooltip);
        
        scenarioDisplay.appendChild(highlight);
    });
}

function startQuizMode() {
    quizMode = true;
    quizModeBtn.classList.add('active');
    quickTrainBtn.classList.remove('active');
    quizProgress.style.display = 'flex';
    
    quizScenarios = getRandomScenarios(10);
    currentQuizIndex = 0;
    quizScore = 0;
    currentScenario = quizScenarios[currentQuizIndex];
    renderScenario(currentScenario);
    updateQuizProgress();
    feedbackContainer.innerHTML = '';
}

function updateQuizProgress() {
    const progressPercent = (currentQuizIndex / quizScenarios.length) * 100;
    progressFill.style.width = `${progressPercent}%`;
    progressText.textContent = `${currentQuizIndex}/${quizScenarios.length}`;
    scoreDisplay.textContent = `Score: ${Math.round((quizScore / currentQuizIndex) * 100 || 0}%`;
}

function finishQuiz() {
    const finalScore = Math.round((quizScore / quizScenarios.length) * 100);
    userStats.quizScores.push({
        score: finalScore,
        date: new Date().toISOString()
    });
    saveProgress();
    
    feedbackContainer.className = 'feedback-container';
    feedbackContainer.innerHTML = `
        <h2>Quiz Complete!</h2>
        <p>Your final score: <strong>${finalScore}%</strong></p>
        <p>You detected ${quizScore} out of ${quizScenarios.length} phishing attempts correctly.</p>
        ${finalScore >= 80 ? 
            '<p>🎉 Excellent job! You have a keen eye for phishing attempts.</p>' :
            finalScore >= 50 ?
            '<p>👍 Good effort! Review the clues to improve your detection skills.</p>' :
            '<p>🤔 Keep practicing! Phishing can be tricky—check out our training materials.</p>'}
        <button id="retryQuizBtn" class="btn">Try Another Quiz</button>
    `;
    
    document.getElementById('retryQuizBtn').addEventListener('click', startQuizMode);
    quizProgress.style.display = 'none';
}

function saveProgress() {
    localStorage.setItem('phishradarStats', JSON.stringify(userStats));
}

function loadProgress() {
    const savedStats = localStorage.getItem('phishradarStats');
    if (savedStats) {
        userStats = JSON.parse(savedStats);
    }
}
