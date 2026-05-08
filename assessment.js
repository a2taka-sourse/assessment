'use strict';

// 状態
const state = {
    userName: 'あなた',
    currentIndex: 0,
    answers: [],
    topAxis: null,
    selectedProject: null,
};

// DOM
const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen = document.getElementById('result-screen');

const userNameInput = document.getElementById('user-name');
const startButton = document.getElementById('start-button');

const progressFill = document.getElementById('progress-fill');
const progressCurrent = document.getElementById('progress-current');
const progressTotal = document.getElementById('progress-total');
const questionText = document.getElementById('question-text');
const choicesDiv = document.getElementById('choices');

const goodPointTitle = document.getElementById('good-point-title');
const goodPointDescription = document.getElementById('good-point-description');
const projectText = document.getElementById('project-text');
const axisName = document.getElementById('axis-name');
const rerollButton = document.getElementById('reroll-button');
const restartButton = document.getElementById('restart-button');
const tweetArea = document.getElementById('tweet-area');

// 画面切替
function showScreen(screen) {
    [startScreen, questionScreen, resultScreen].forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

// スタート
function pad2(n) {
    return String(n).padStart(2, '0');
}

startButton.addEventListener('click', () => {
    const inputName = userNameInput.value.trim();
    state.userName = inputName.length > 0 ? inputName : 'あなた';
    state.currentIndex = 0;
    state.answers = [];
    progressTotal.textContent = pad2(QUESTIONS.length);
    showScreen(questionScreen);
    renderQuestion();
});

userNameInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        startButton.click();
    }
});

// 質問描画
function renderQuestion() {
    const q = QUESTIONS[state.currentIndex];
    progressCurrent.textContent = pad2(state.currentIndex + 1);
    progressFill.style.width = `${((state.currentIndex) / QUESTIONS.length) * 100}%`;

    questionText.textContent = q.text;
    questionText.classList.remove('fade-in');
    void questionText.offsetWidth;
    questionText.classList.add('fade-in');

    choicesDiv.innerHTML = '';
    q.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'choice-button';
        btn.textContent = choice.label;
        btn.addEventListener('click', () => handleAnswer(choice.score));
        choicesDiv.appendChild(btn);
    });
}

// 回答処理
function handleAnswer(score) {
    const q = QUESTIONS[state.currentIndex];
    state.answers.push({ axis: q.axis, score });
    state.currentIndex += 1;

    if (state.currentIndex < QUESTIONS.length) {
        renderQuestion();
    } else {
        progressFill.style.width = '100%';
        finalize();
        showScreen(resultScreen);
    }
}

// スコア集計と最高軸特定
function calcAxisScores(answers) {
    const scores = {};
    answers.forEach(a => {
        scores[a.axis] = (scores[a.axis] || 0) + a.score;
    });
    return scores;
}

function pickTopAxis(scores) {
    const max = Math.max(...Object.values(scores));
    const tops = Object.keys(scores).filter(k => scores[k] === max);
    return tops[Math.floor(Math.random() * tops.length)];
}

function pickRandomProject(axis) {
    const projects = RESULTS[axis].projects;
    return projects[Math.floor(Math.random() * projects.length)];
}

// 結果確定と描画
function finalize() {
    const scores = calcAxisScores(state.answers);
    state.topAxis = pickTopAxis(scores);
    state.selectedProject = pickRandomProject(state.topAxis);
    renderResult();
    submitResult(scores);
}

const API_BASE = 'http://localhost:8000';

function submitResult(axisScores) {
    const axis = state.topAxis;
    const payload = {
        answers: state.answers,
        axis_scores: axisScores,
        top_axis: axis,
        recommended_project: state.selectedProject,
        good_point: RESULTS[axis].goodPoint.title,
        user_name: state.userName,
    };
    fetch(`${API_BASE}/api/diagnosis/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }).catch(() => {}); // fire-and-forget; no UI impact on failure
}

function renderResult() {
    const axis = state.topAxis;
    const data = RESULTS[axis];
    const goodPoint = data.goodPoint;
    const description = goodPoint.description.replaceAll('{userName}', state.userName);

    goodPointTitle.textContent = goodPoint.title;
    goodPointDescription.textContent = description;
    projectText.textContent = state.selectedProject;
    axisName.textContent = `軸${axis}：${data.axisName}`;

    renderTweetButton();
}

function renderTweetButton() {
    tweetArea.innerHTML = '';
    const tweetText = `${state.userName}のいいところは「${RESULTS[state.topAxis].goodPoint.title}」、おすすめの企画は「${state.selectedProject}」でした。`;
    const anchor = document.createElement('a');
    const hrefValue = 'https://twitter.com/intent/tweet?text=' +
        encodeURIComponent(tweetText) +
        '&hashtags=' + encodeURIComponent('Haircut1000診断');
    anchor.setAttribute('href', hrefValue);
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('rel', 'noopener');
    anchor.className = 'tweet-button';
    anchor.textContent = 'Xでシェアする';
    tweetArea.appendChild(anchor);
}

// 企画再抽選
rerollButton.addEventListener('click', () => {
    state.selectedProject = pickRandomProject(state.topAxis);
    projectText.classList.remove('fade-in');
    void projectText.offsetWidth;
    projectText.classList.add('fade-in');
    projectText.textContent = state.selectedProject;
    renderTweetButton();
});

// やり直し
restartButton.addEventListener('click', () => {
    userNameInput.value = '';
    showScreen(startScreen);
});
