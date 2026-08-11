const QUESTION_BANK_SIZE = 200;
const totalQuestions = 20;
const questionsPerGroup = 5;
const groupNames = ['Grupo 1', 'Grupo 2', 'Grupo 3', 'Grupo 4'];
const rewardPerQuestion = 100000;
const storageKey = 'jogoDaSalvacaoHistorico';
const leaderboardKey = 'jogoDaSalvacaoRanking';

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const levelTransitionScreen = document.getElementById('level-transition-screen');
const endScreen = document.getElementById('end-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const continueBtn = document.getElementById('continue-btn');
const playerNameInput = document.getElementById('player-name');
const questionNumber = document.getElementById('question-number');
const questionText = document.getElementById('question-text');
const questionIllustration = document.getElementById('question-illustration');
const bibleText = document.getElementById('bible-text');
const optionsContainer = document.getElementById('options');
const feedback = document.getElementById('feedback');
const timerEl = document.getElementById('timer');
const starsEl = document.getElementById('stars');
const levelBanner = document.getElementById('level-banner');
const progressBar = document.getElementById('progress-bar');
const resultTitle = document.getElementById('result-title');
const resultText = document.getElementById('result-text');
const levelTransitionTitle = document.getElementById('level-transition-title');
const levelTransitionText = document.getElementById('level-transition-text');
const leaderboardList = document.getElementById('leaderboard-list');
const finalLeaderboard = document.getElementById('final-leaderboard');

const questionTemplates = [
  {
    category: 'Velho Testamento',
    prompt: 'Qual livro bíblico é mencionado na lição',
    answer: 'Gênesis',
    options: ['Gênesis', 'Êxodo', 'Leviticus', 'Juízes'],
    bibleClue: 'Gênesis 1:1 — No princípio criou Deus os céus e a terra.'
  },
  {
    category: 'Velho Testamento',
    prompt: 'Quem venceu o gigante Golias na história bíblica',
    answer: 'Davi',
    options: ['Saul', 'Davi', 'Salomão', 'Elias'],
    bibleClue: '1 Samuel 17:45 — Davi confiou no Senhor.'
  },
  {
    category: 'Velho Testamento',
    prompt: 'Qual personagem entrou na arca com sua família',
    answer: 'Noé',
    options: ['Noé', 'Abraão', 'Moisés', 'Davi'],
    bibleClue: 'Gênesis 7:7 — Noé entrou na arca com a sua família.'
  },
  {
    category: 'Velho Testamento',
    prompt: 'Quem recebeu as Tábuas da Lei no monte Sinai',
    answer: 'Moisés',
    options: ['Moisés', 'Josué', 'Aarão', 'Elias'],
    bibleClue: 'Êxodo 20:1-2 — Deus deu a lei a Moisés no monte Sinai.'
  },
  {
    category: 'Velho Testamento',
    prompt: 'Qual profeta anunciou o nascimento do Messias em Belém',
    answer: 'Miqueias',
    options: ['Miqueias', 'Jeremias', 'Isaías', 'Habacuque'],
    bibleClue: 'Miqueias 5:2 — De Belém sairá o que há de reinar em Israel.'
  },
  {
    category: 'Novo Testamento',
    prompt: 'Qual discípulo negou a Jesus três vezes',
    answer: 'Pedro',
    options: ['Pedro', 'João', 'Tiago', 'André'],
    bibleClue: 'Mateus 26:75 — Pedro se lembrou das palavras de Jesus.'
  },
  {
    category: 'Novo Testamento',
    prompt: 'Qual virtude é destacada em 1 Coríntios 13',
    answer: 'Caridade',
    options: ['Fé', 'Esperança', 'Caridade', 'Paciência'],
    bibleClue: '1 Coríntios 13:1 — O amor é paciente e bondoso.'
  },
  {
    category: 'Novo Testamento',
    prompt: 'Qual foi o primeiro milagre de Jesus',
    answer: 'Transformar água em vinho',
    options: ['Andar sobre as águas', 'Multiplicar pães', 'Transformar água em vinho', 'Curar um cego'],
    bibleClue: 'João 2:1-11 — Jesus transformou a água em vinho.'
  },
  {
    category: 'Novo Testamento',
    prompt: 'Quem escreveu o livro de Atos',
    answer: 'Lucas',
    options: ['Paulo', 'Tiago', 'Lucas', 'João'],
    bibleClue: 'Atos 1:1-2 — Lucas escreveu sobre tudo o que Jesus começou a fazer e ensinar.'
  },
  {
    category: 'Novo Testamento',
    prompt: 'Qual foi a última palavra de Jesus na cruz',
    answer: 'Pai, em tuas mãos entrego o meu espírito',
    options: ['Vai-te embora', 'Amanhã será outro dia', 'Já está consumado', 'Pai, em tuas mãos entrego o meu espírito'],
    bibleClue: 'Lucas 23:46 — Pai, em tuas mãos entrego o meu espírito.'
  }
];

let questionBank = [];
let questionOrder = [];
let usedQuestionIds = [];
let currentQuestion = null;
let currentIndex = 0;
let currentGroup = 1;
let stars = 0;
let correctAnswers = 0;
let timeLeft = 50;
let timerId = null;
let playerName = '';

function formatStars(value) {
  return value.toLocaleString('pt-BR');
}

function shuffle(array) {
  const copy = [...array];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function buildQuestionBank(size = QUESTION_BANK_SIZE) {
  const bank = [];

  for (let index = 0; index < size; index += 1) {
    const template = questionTemplates[index % questionTemplates.length];
    const suffix = ` ${index + 1}`;
    const correctAnswer = `${template.answer}${suffix}`;
    const distractors = template.options
      .filter((option) => option !== template.answer)
      .map((option) => `${option}${suffix}`);
    const options = shuffle([correctAnswer, ...distractors.slice(0, 3)]);
    const correctIndex = options.indexOf(correctAnswer);

    bank.push({
      id: `q-${String(index + 1).padStart(5, '0')}`,
      category: template.category,
      prompt: `${template.prompt}${suffix}`,
      options,
      correct: correctIndex,
      illustration: template.category === 'Velho Testamento' ? '🕯️' : '✨',
      bibleClue: template.bibleClue
    });
  }

  return bank;
}

function buildQuestionOrder(playerNameToUse = playerName, count = totalQuestions) {
  const usedIds = loadPlayerHistory(playerNameToUse);
  const available = questionBank.filter((question) => !usedIds.includes(question.id));

  if (available.length < count) {
    savePlayerHistory(playerNameToUse, []);
    return buildQuestionOrder(playerNameToUse, count);
  }

  return shuffle(available).slice(0, count);
}

function speak(text) {
  if (!('speechSynthesis' in window)) return;

  const speakNow = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;
    utterance.pitch = 0.7;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((voice) => /pt|brazil|portuguese/i.test(voice.lang)) || voices[0];
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onerror = (event) => {
      console.warn('Erro de leitura:', event.error);
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn('Falha ao iniciar leitura:', error);
    }
  };

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = speakNow;
    setTimeout(speakNow, 400);
    return;
  }

  speakNow();
}

function playSound(isCorrect) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  if (isCorrect) {
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(784, context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1318, context.currentTime + 0.25);
    gain.gain.setValueAtTime(0.1, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(context.destination);
    osc.start();
    osc.stop(context.currentTime + 0.4);
  } else {
    const noiseBuffer = context.createBuffer(1, context.sampleRate * 0.35, context.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) {
      data[index] = (Math.random() * 2 - 1) * 0.7;
    }
    const noiseSource = context.createBufferSource();
    const gain = context.createGain();
    noiseSource.buffer = noiseBuffer;
    noiseSource.connect(gain);
    gain.connect(context.destination);
    gain.gain.setValueAtTime(0.25, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.35);
    noiseSource.start();
    noiseSource.stop(context.currentTime + 0.35);
  }
}

function resetTimer() {
  clearInterval(timerId);
  timeLeft = 50;
  timerEl.textContent = `${timeLeft}s`;
}

function startTimer() {
  resetTimer();
  timerId = setInterval(() => {
    timeLeft -= 1;
    timerEl.textContent = `${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      handleAnswer(null, true);
    }
  }, 1000);
}

function showScreen(screen) {
  [startScreen, gameScreen, levelTransitionScreen, endScreen].forEach((element) => {
    element.classList.remove('active');
  });
  screen.classList.add('active');
}

function loadPlayerHistory(name) {
  const normalizedName = (name || '').trim().toLowerCase();
  const raw = localStorage.getItem(storageKey);
  if (!raw) return [];

  try {
    const data = JSON.parse(raw);
    return Array.isArray(data[normalizedName]) ? data[normalizedName] : [];
  } catch (error) {
    console.warn('Erro ao carregar histórico:', error);
    return [];
  }
}

function savePlayerHistory(name, history = usedQuestionIds) {
  const normalizedName = (name || '').trim().toLowerCase();
  const raw = localStorage.getItem(storageKey);
  const data = raw ? JSON.parse(raw) : {};
  data[normalizedName] = history;
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function loadLeaderboard() {
  const raw = localStorage.getItem(leaderboardKey);
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Erro ao carregar ranking:', error);
    return [];
  }
}

function saveLeaderboard(entry) {
  const ranking = loadLeaderboard().filter((item) => item.playerName.toLowerCase() !== entry.playerName.toLowerCase());
  ranking.push(entry);
  ranking.sort((a, b) => b.score - a.score);
  const top10 = ranking.slice(0, 10);
  localStorage.setItem(leaderboardKey, JSON.stringify(top10));
  renderLeaderboard();
}

function renderLeaderboard() {
  const ranking = loadLeaderboard();
  const renderList = (target) => {
    if (!target) return;
    target.innerHTML = '';

    if (ranking.length === 0) {
      const item = document.createElement('li');
      item.textContent = 'Ainda não há pontuações registradas.';
      target.appendChild(item);
      return;
    }

    ranking.slice(0, 10).forEach((entry, index) => {
      const item = document.createElement('li');
      item.innerHTML = `<strong>#${index + 1}</strong> ${entry.playerName} — ${entry.score.toLocaleString('pt-BR')} pts`;
      target.appendChild(item);
    });
  };

  renderList(leaderboardList);
  renderList(finalLeaderboard);
}

function getNextQuestion() {
  if (currentIndex >= questionOrder.length) {
    finishGame(true);
    return;
  }

  const nextQuestion = questionOrder[currentIndex];
  usedQuestionIds.push(nextQuestion.id);
  currentQuestion = nextQuestion;
  currentIndex += 1;
  savePlayerHistory(playerName, usedQuestionIds);
  renderQuestion();
}

function renderQuestion() {
  const activeGroupName = groupNames[Math.min(currentGroup - 1, groupNames.length - 1)];
  const isOldTestament = currentQuestion.category === 'Velho Testamento';
  const illustrationIcon = isOldTestament ? '🕯️' : '✨';
  const illustrationTitle = isOldTestament ? 'Cena do Antigo Testamento' : 'Mensagem do Novo Testamento';
  const illustrationCaption = isOldTestament ? 'Uma imagem que lembra a história antiga da fé' : 'Uma mensagem luminosa para refletir e responder';

  levelBanner.textContent = `${activeGroupName} • Pergunta ${currentIndex}`;
  questionNumber.textContent = `${activeGroupName} • Pergunta ${currentIndex}`;
  questionText.textContent = currentQuestion.prompt;
  questionIllustration.innerHTML = `
    <div class="illustration-icon">${illustrationIcon}</div>
    <div class="illustration-copy">
      <strong>${illustrationTitle}</strong>
      <span>${illustrationCaption}</span>
    </div>
  `;
  bibleText.textContent = `Texto bíblico: ${currentQuestion.bibleClue || 'A Palavra de Deus ilumina a resposta.'}`;
  optionsContainer.innerHTML = '';

  currentQuestion.options.forEach((option, optionIndex) => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.textContent = option;
    button.addEventListener('click', () => handleAnswer(optionIndex));
    optionsContainer.appendChild(button);
  });

  feedback.textContent = '';
  feedback.className = 'feedback';
  starsEl.textContent = `Estrelas: ${formatStars(stars)}`;
  const progressPercent = (currentIndex / totalQuestions) * 100;
  progressBar.style.width = `${progressPercent}%`;
  startTimer();
  speak(currentQuestion.prompt);
}

function handleAnswer(selectedIndex, timedOut = false) {
  clearInterval(timerId);

  if (selectedIndex === null || timedOut) {
    playSound(false);
    feedback.textContent = 'Tempo esgotado! A jornada chegou ao fim.';
    feedback.className = 'feedback bad';
    setTimeout(() => finishGame(false), 1400);
    return;
  }

  const isCorrect = selectedIndex === currentQuestion.correct;
  if (isCorrect) {
    correctAnswers += 1;
    stars += rewardPerQuestion;
    playSound(true);
    feedback.textContent = 'Acerto! O clarim soou com vitória.';
    feedback.className = 'feedback good';
    starsEl.textContent = `Estrelas: ${formatStars(stars)}`;
  } else {
    playSound(false);
    feedback.textContent = 'Erro! A explosão marcou a queda.';
    feedback.className = 'feedback bad';
  }

  if (currentIndex >= totalQuestions) {
    setTimeout(() => finishGame(true), 1400);
    return;
  }

  if (!isCorrect) {
    setTimeout(() => finishGame(false), 1400);
    return;
  }

  if (currentIndex % questionsPerGroup === 0 && currentIndex < totalQuestions) {
    setTimeout(() => showLevelTransition(), 1400);
    return;
  }

  setTimeout(() => {
    getNextQuestion();
  }, 1400);
}

function showLevelTransition() {
  clearInterval(timerId);
  const completedGroupName = groupNames[Math.min(currentGroup - 1, groupNames.length - 1)];
  const nextGroupName = groupNames[Math.min(currentGroup, groupNames.length - 1)];
  levelTransitionTitle.textContent = `Parabéns! Você passou de ${completedGroupName}`;
  levelTransitionText.textContent = `Prepare-se para ${nextGroupName}.`;
  showScreen(levelTransitionScreen);
}

function continueToNextLevel() {
  currentGroup += 1;
  getNextQuestion();
  showScreen(gameScreen);
}

function finishGame(victory) {
  clearInterval(timerId);
  const finalScore = stars + correctAnswers * 5000;
  saveLeaderboard({ playerName: playerName || 'Jogador', score: finalScore });
  showScreen(endScreen);

  if (victory) {
    resultTitle.textContent = 'Vitória espiritual!';
    resultText.textContent = `${playerName || 'Jogador'} concluiu as 20 perguntas e alcançou ${formatStars(finalScore)} estrelas.`;
  } else {
    resultTitle.textContent = 'A jornada terminou';
    resultText.textContent = `${playerName || 'Jogador'} acumulou ${formatStars(finalScore)} estrelas. Continue tentando.`;
  }
}

function startGame() {
  playerName = playerNameInput.value.trim() || 'Jogador';
  stars = 0;
  correctAnswers = 0;
  currentIndex = 0;
  currentGroup = 1;
  usedQuestionIds = loadPlayerHistory(playerName);
  questionBank = buildQuestionBank();
  questionOrder = buildQuestionOrder(playerName, totalQuestions);
  showScreen(gameScreen);
  getNextQuestion();
}

startBtn.addEventListener('click', startGame);
continueBtn.addEventListener('click', continueToNextLevel);
restartBtn.addEventListener('click', () => {
  showScreen(startScreen);
  playerNameInput.value = '';
  feedback.textContent = '';
  starsEl.textContent = `Estrelas: ${formatStars(0)}`;
});

if (typeof window !== 'undefined') {
  questionBank = buildQuestionBank();
  renderLeaderboard();
}

if (typeof module !== 'undefined') {
  module.exports = {
    buildQuestionBank,
    buildQuestionOrder,
    loadLeaderboard,
    saveLeaderboard
  };
}
