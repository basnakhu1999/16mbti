const questions = [
    "Do you enjoy being the center of attention?",
    "Are you more of a planner than a spontaneous person?",
    "Do you prefer working in a team rather than alone?",
    "Do you often feel overwhelmed in social situations?",
    "Are you more logical than emotional?",
    "Do you enjoy taking risks?",
    "Do you prefer routine over change?",
    "Are you more of a thinker than a feeler?",
    "Do you enjoy deep conversations?",
    "Are you more introverted than extroverted?",
    "Do you often trust your gut feeling?",
    "Are you more of a leader than a follower?",
    "Do you enjoy helping others?",
    "Are you more creative than analytical?",
    "Do you often feel stressed?"
];

const mbtiTypes = {
    "ISTJ": "The Inspector - Responsible and organized.",
    "ISFJ": "The Protector - Warm-hearted and dedicated.",
    "INFJ": "The Counselor - Insightful and principled.",
    "INTJ": "The Mastermind - Strategic and logical.",
    "ISTP": "The Craftsman - Practical and analytical.",
    "ISFP": "The Composer - Gentle and flexible.",
    "INFP": "The Healer - Idealistic and empathetic.",
    "INTP": "The Architect - Logical and abstract.",
    "ESTP": "The Dynamo - Energetic and action-oriented.",
    "ESFP": "The Performer - Spontaneous and lively.",
    "ENFP": "The Champion - Enthusiastic and creative.",
    "ENTP": "The Debater - Innovative and curious.",
    "ESTJ": "The Executive - Efficient and outgoing.",
    "ESFJ": "The Consul - Caring and sociable.",
    "ENFJ": "The Mentor - Charismatic and altruistic.",
    "ENTJ": "The Commander - Assertive and strategic."
};

let currentQuestion = 0;
let answers = [];

const questionElement = document.getElementById('question');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const resultElement = document.getElementById('result');
const personalityElement = document.getElementById('personality');
const descriptionElement = document.getElementById('description');
const startBtn = document.getElementById('startBtn');
const container = document.querySelector('.container');
const restartBtn = document.getElementById('restartBtn');

function showQuestion() {
    if (currentQuestion < questions.length) {
        questionElement.textContent = questions[currentQuestion];
    } else {
        showResult();
    }
}

function showResult() {
    const personalityType = calculatePersonalityType();
    personalityElement.textContent = personalityType;
    descriptionElement.textContent = mbtiTypes[personalityType];
    resultElement.classList.remove('hidden');
    resultElement.classList.add('show');
}

function calculatePersonalityType() {
    let type = "";
    type += answers[0] ? "E" : "I";
    type += answers[1] ? "S" : "N";
    type += answers[2] ? "T" : "F";
    type += answers[3] ? "J" : "P";
    return type;
}

function startGame() {
    container.classList.remove('hidden');
    startBtn.classList.add('hidden');
    showQuestion();
}

function restartGame() {
    currentQuestion = 0;
    answers = [];
    resultElement.classList.remove('show');
    resultElement.classList.add('hidden');
    showQuestion();
}

startBtn.addEventListener('click', startGame);
yesBtn.addEventListener('click', () => {
    answers.push(true);
    currentQuestion++;
    showQuestion();
});
noBtn.addEventListener('click', () => {
    answers.push(false);
    currentQuestion++;
    showQuestion();
});
restartBtn.addEventListener('click', restartGame);