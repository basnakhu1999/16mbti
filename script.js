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

function showQuestion() {
    questionElement.textContent = questions[currentQuestion];
}

function showResult() {
    const personalityType = calculatePersonalityType();
    personalityElement.textContent = personalityType;
    descriptionElement.textContent = mbtiTypes[personalityType];
    resultElement.classList.add('show');
}

function calculatePersonalityType() {
    // Simple logic to determine personality type based on answers
    // This is a simplified version and not a real MBTI test
    let type = "";
    type += answers[0] ? "E" : "I";
    type += answers[1] ? "S" : "N";
    type += answers[2] ? "T" : "F";
    type += answers[3] ? "J" : "P";
    return type;
}

yesBtn.addEventListener('click', () => {
    answers.push(true);
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
});

noBtn.addEventListener('click', () => {
    answers.push(false);
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
});

showQuestion();