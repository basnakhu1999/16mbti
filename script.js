const QUESTIONS = [
  { text: 'I gain energy from social interaction and active environments.', dimension: 'EI', positive: 'E' },
  { text: 'I naturally start conversations in new groups.', dimension: 'EI', positive: 'E' },
  { text: 'I prefer reflecting quietly before speaking my ideas out loud.', dimension: 'EI', positive: 'I' },
  { text: 'My ideal recharge time is calm, private, and low stimulation.', dimension: 'EI', positive: 'I' },

  { text: 'I trust concrete facts more than abstract possibilities.', dimension: 'SN', positive: 'S' },
  { text: 'I prefer methods that are proven and practical.', dimension: 'SN', positive: 'S' },
  { text: 'I enjoy exploring patterns, concepts, and future scenarios.', dimension: 'SN', positive: 'N' },
  { text: 'I often think in big-picture terms more than details.', dimension: 'SN', positive: 'N' },

  { text: 'I prioritize logic and objective criteria in decisions.', dimension: 'TF', positive: 'T' },
  { text: 'I can separate personal emotion from performance discussions.', dimension: 'TF', positive: 'T' },
  { text: 'I evaluate choices by their impact on people first.', dimension: 'TF', positive: 'F' },
  { text: 'I value harmony and empathy during conflict resolution.', dimension: 'TF', positive: 'F' },

  { text: 'I prefer planning early and sticking to clear schedules.', dimension: 'JP', positive: 'J' },
  { text: 'I like closing tasks before deadlines whenever possible.', dimension: 'JP', positive: 'J' },
  { text: 'I adapt quickly and prefer leaving options open.', dimension: 'JP', positive: 'P' },
  { text: 'I work better in flexible structures than fixed routines.', dimension: 'JP', positive: 'P' }
];

const TYPE_INFO = {
  ISTJ: {
    name: 'Logistician',
    summary: 'Reliable, structured, and highly committed to high standards.',
    strengths: ['Dependable execution', 'Strong discipline', 'Clear process thinking'],
    blindSpots: ['Can resist sudden change', 'May appear rigid under pressure', 'Can over-focus on rules'],
    careers: ['Operations Manager', 'Quality Analyst', 'Compliance Specialist'],
    relationship: 'Shows care through consistency, loyalty, and practical support.'
  },
  ISFJ: {
    name: 'Defender',
    summary: 'Warm, dependable, and attentive to practical needs of others.',
    strengths: ['Supportive teamwork', 'Strong memory for details', 'Responsible follow-through'],
    blindSpots: ['Can overextend for others', 'May avoid conflict too long', 'Can understate own needs'],
    careers: ['HR Coordinator', 'Nurse', 'Customer Success Specialist'],
    relationship: 'Builds trust through thoughtful gestures and dependable presence.'
  },
  INFJ: {
    name: 'Advocate',
    summary: 'Purpose-driven, insightful, and deeply values meaningful impact.',
    strengths: ['Deep empathy', 'Long-range vision', 'Value-based leadership'],
    blindSpots: ['Can internalize stress', 'May become perfectionistic', 'Can struggle with superficial settings'],
    careers: ['Counselor', 'UX Researcher', 'Organizational Coach'],
    relationship: 'Seeks emotional depth, honest communication, and shared purpose.'
  },
  INTJ: {
    name: 'Architect',
    summary: 'Strategic, independent, and focused on long-term optimization.',
    strengths: ['System-level thinking', 'High standards', 'Decisive planning'],
    blindSpots: ['May sound blunt', 'Can dismiss emotional signals', 'Can overanalyze before acting'],
    careers: ['Strategy Lead', 'Product Architect', 'Data Scientist'],
    relationship: 'Shows commitment through reliability, planning, and future-oriented support.'
  },
  ISTP: {
    name: 'Virtuoso',
    summary: 'Calm problem-solver who thrives in practical, real-time situations.',
    strengths: ['Hands-on troubleshooting', 'Composure under pressure', 'Fast tactical decisions'],
    blindSpots: ['Can seem detached', 'May dislike routine maintenance', 'Can delay emotional conversations'],
    careers: ['Engineer', 'Technical Specialist', 'Emergency Responder'],
    relationship: 'Values independence, direct communication, and practical trust.'
  },
  ISFP: {
    name: 'Adventurer',
    summary: 'Gentle, authentic, and driven by personal values and aesthetics.',
    strengths: ['Empathetic presence', 'Creative expression', 'Adaptable style'],
    blindSpots: ['May avoid hard confrontation', 'Can delay long-term planning', 'Can hide stress internally'],
    careers: ['Designer', 'Content Creator', 'Wellness Specialist'],
    relationship: 'Expresses affection through sincere attention and shared experiences.'
  },
  INFP: {
    name: 'Mediator',
    summary: 'Idealistic and compassionate, motivated by meaning and integrity.',
    strengths: ['High empathy', 'Value-driven decisions', 'Creative ideation'],
    blindSpots: ['Can overthink choices', 'May avoid practical constraints', 'Can feel overwhelmed by criticism'],
    careers: ['Writer', 'Therapist', 'Brand Story Strategist'],
    relationship: 'Seeks emotional authenticity, respect, and shared values.'
  },
  INTP: {
    name: 'Logician',
    summary: 'Analytical, curious, and motivated by understanding complex systems.',
    strengths: ['Conceptual depth', 'Independent thinking', 'Problem decomposition'],
    blindSpots: ['May postpone decisions', 'Can appear distant', 'Can underestimate emotional context'],
    careers: ['Researcher', 'Software Engineer', 'Systems Analyst'],
    relationship: 'Connects through thoughtful dialogue, ideas, and intellectual trust.'
  },
  ESTP: {
    name: 'Entrepreneur',
    summary: 'Energetic, practical, and quick to act in dynamic environments.',
    strengths: ['Action orientation', 'Crisis adaptability', 'Persuasive communication'],
    blindSpots: ['Can be impulsive', 'May overlook long-term planning', 'Can get bored with routine'],
    careers: ['Sales Lead', 'Founder', 'Business Development Manager'],
    relationship: 'Brings excitement and directness, values freedom and honesty.'
  },
  ESFP: {
    name: 'Entertainer',
    summary: 'Expressive, optimistic, and great at creating engaging experiences.',
    strengths: ['Social awareness', 'Team energy', 'Flexible execution'],
    blindSpots: ['Can avoid difficult tradeoffs', 'May struggle with delayed rewards', 'Can overcommit socially'],
    careers: ['Event Manager', 'Marketing Specialist', 'Community Lead'],
    relationship: 'Shows care through warmth, enthusiasm, and quality time.'
  },
  ENFP: {
    name: 'Campaigner',
    summary: 'Imaginative and enthusiastic, strong at opening new possibilities.',
    strengths: ['Creative ideation', 'Inspirational communication', 'Human-centered vision'],
    blindSpots: ['Can lose focus', 'May overpromise', 'Can avoid repetitive execution'],
    careers: ['Creative Director', 'Product Evangelist', 'Innovation Consultant'],
    relationship: 'Needs emotional connection, novelty, and growth-oriented partnership.'
  },
  ENTP: {
    name: 'Debater',
    summary: 'Inventive, energetic thinker who loves challenge and experimentation.',
    strengths: ['Rapid ideation', 'Strategic debate', 'Opportunity spotting'],
    blindSpots: ['Can challenge too aggressively', 'May skip implementation details', 'Can resist constraints'],
    careers: ['Entrepreneur', 'Product Strategist', 'Consultant'],
    relationship: 'Values mental stimulation, openness, and dynamic conversations.'
  },
  ESTJ: {
    name: 'Executive',
    summary: 'Structured, decisive, and excellent at operational leadership.',
    strengths: ['Organization', 'Accountability', 'Execution discipline'],
    blindSpots: ['Can be overly directive', 'May undervalue emotional nuance', 'Can push pace too hard'],
    careers: ['Project Manager', 'Operations Director', 'Team Lead'],
    relationship: 'Supports loved ones through reliability, planning, and tangible action.'
  },
  ESFJ: {
    name: 'Consul',
    summary: 'People-focused organizer who builds harmony and social stability.',
    strengths: ['High empathy', 'Group coordination', 'Service mindset'],
    blindSpots: ['Can seek too much approval', 'May personalize criticism', 'Can avoid difficult boundaries'],
    careers: ['People Operations', 'Teacher', 'Client Relationship Manager'],
    relationship: 'Invests deeply in care, tradition, and emotional consistency.'
  },
  ENFJ: {
    name: 'Protagonist',
    summary: 'Purposeful leader who develops people and aligns teams around values.',
    strengths: ['Coaching leadership', 'Big-picture empathy', 'Motivational communication'],
    blindSpots: ['Can over-identify with others problems', 'May neglect own limits', 'Can become idealistic under pressure'],
    careers: ['Leadership Coach', 'Program Manager', 'People Development Lead'],
    relationship: 'Thrives on mutual growth, emotional honesty, and shared goals.'
  },
  ENTJ: {
    name: 'Commander',
    summary: 'Strategic and assertive builder focused on measurable outcomes.',
    strengths: ['Vision-to-execution alignment', 'Decisive leadership', 'Performance mindset'],
    blindSpots: ['Can appear intense', 'May move faster than team readiness', 'Can underweight emotional signals'],
    careers: ['General Manager', 'Founder', 'Strategy Consultant'],
    relationship: 'Demonstrates commitment by building a strong future together.'
  }
};

const state = {
  current: 0,
  answers: Array(QUESTIONS.length).fill(null),
  latestType: null
};

const questionText = document.getElementById('questionText');
const stepLabel = document.getElementById('stepLabel');
const dimensionLabel = document.getElementById('dimensionLabel');
const progressFill = document.getElementById('progressFill');
const scaleButtons = document.getElementById('scaleButtons');
const backBtn = document.getElementById('backBtn');
const resultPanel = document.getElementById('resultPanel');
const resultType = document.getElementById('resultType');
const resultName = document.getElementById('resultName');
const resultSummary = document.getElementById('resultSummary');
const traitScores = document.getElementById('traitScores');
const strengthsList = document.getElementById('strengthsList');
const blindSpotsList = document.getElementById('blindSpotsList');
const careerFitList = document.getElementById('careerFitList');
const relationshipStyle = document.getElementById('relationshipStyle');
const restartBtn = document.getElementById('restartBtn');
const typeDirectory = document.getElementById('typeDirectory');

function initScaleButtons() {
  ['1', '2', '3', '4', '5'].forEach((label, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'scale-btn';
    button.dataset.value = String(index + 1);
    button.textContent = label;
    button.addEventListener('click', () => handleAnswer(index + 1));
    scaleButtons.appendChild(button);
  });
}

function initDirectory() {
  Object.entries(TYPE_INFO).forEach(([type, info]) => {
    const card = document.createElement('article');
    card.className = 'type-card';
    card.id = `card-${type}`;
    card.innerHTML = `<h3>${type} · ${info.name}</h3><p>${info.summary}</p>`;
    typeDirectory.appendChild(card);
  });
}

function renderQuestion() {
  const question = QUESTIONS[state.current];
  questionText.textContent = question.text;
  stepLabel.textContent = `Question ${state.current + 1} / ${QUESTIONS.length}`;
  dimensionLabel.textContent = `Dimension ${question.dimension.slice(0, 1)} / ${question.dimension.slice(1, 2)}`;

  const progress = (state.current / QUESTIONS.length) * 100;
  progressFill.style.width = `${progress}%`;
  document.querySelector('.progress-bar').setAttribute('aria-valuenow', String(Math.round(progress)));

  [...scaleButtons.children].forEach((btn) => {
    btn.classList.remove('active');
    if (Number(btn.dataset.value) === state.answers[state.current]) {
      btn.classList.add('active');
    }
  });

  backBtn.disabled = state.current === 0;
}

function dimensionScore(dimension, positiveLetter) {
  const bucket = QUESTIONS.map((q, index) => ({ ...q, index })).filter((q) => q.dimension === dimension);
  let positiveTotal = 0;

  bucket.forEach((q) => {
    const answer = state.answers[q.index] ?? 3;
    const normalized = q.positive === positiveLetter ? answer : 6 - answer;
    positiveTotal += normalized;
  });

  return positiveTotal / (bucket.length * 5);
}

function renderList(element, items) {
  element.innerHTML = '';
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    element.appendChild(li);
  });
}

function highlightDirectory(type) {
  document.querySelectorAll('.type-card').forEach((card) => card.classList.remove('active'));
  const activeCard = document.getElementById(`card-${type}`);
  if (activeCard) {
    activeCard.classList.add('active');
  }
}

function showResult() {
  const e = dimensionScore('EI', 'E');
  const s = dimensionScore('SN', 'S');
  const t = dimensionScore('TF', 'T');
  const j = dimensionScore('JP', 'J');

  const type = `${e >= 0.5 ? 'E' : 'I'}${s >= 0.5 ? 'S' : 'N'}${t >= 0.5 ? 'T' : 'F'}${j >= 0.5 ? 'J' : 'P'}`;
  const info = TYPE_INFO[type];

  state.latestType = type;

  resultType.textContent = type;
  resultName.textContent = info.name;
  resultSummary.textContent = info.summary;

  renderList(strengthsList, info.strengths);
  renderList(blindSpotsList, info.blindSpots);
  renderList(careerFitList, info.careers);
  relationshipStyle.textContent = info.relationship;

  const rows = [
    { label: 'Energy (Extraversion)', value: e },
    { label: 'Information (Sensing)', value: s },
    { label: 'Decision (Thinking)', value: t },
    { label: 'Lifestyle (Judging)', value: j }
  ];

  traitScores.innerHTML = '';
  rows.forEach((row) => {
    const percentage = Math.round(row.value * 100);
    const item = document.createElement('div');
    item.className = 'trait-row';
    item.innerHTML = `
      <div class="trait-row-head">
        <span>${row.label}</span>
        <span>${percentage}%</span>
      </div>
      <div class="trait-meter">
        <div class="trait-meter-fill" style="width:${percentage}%"></div>
      </div>
    `;
    traitScores.appendChild(item);
  });

  highlightDirectory(type);
  progressFill.style.width = '100%';
  document.querySelector('.progress-bar').setAttribute('aria-valuenow', '100');
  resultPanel.classList.remove('hidden');
}

function handleAnswer(value) {
  state.answers[state.current] = value;
  if (state.current < QUESTIONS.length - 1) {
    state.current += 1;
    renderQuestion();
    return;
  }
  showResult();
}

function restart() {
  state.current = 0;
  state.answers = Array(QUESTIONS.length).fill(null);
  state.latestType = null;
  resultPanel.classList.add('hidden');
  document.querySelectorAll('.type-card').forEach((card) => card.classList.remove('active'));
  renderQuestion();
}

backBtn.addEventListener('click', () => {
  if (state.current > 0) {
    state.current -= 1;
    renderQuestion();
  }
});

restartBtn.addEventListener('click', restart);

initScaleButtons();
initDirectory();
renderQuestion();
