let currentQuestionIndex = 0;
let currentQuiz = [];
let selectedAnswers = [];
let timerInterval;

function getQuizName() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('quiz');
}

async function loadQuiz() {
  const quizName = getQuizName();
  try {
    const response = await fetch('/api/questions');
    const data = await response.json();
    const quiz = data.find(q => q.title === quizName);
    if (quiz) {
      currentQuiz = quiz.questions;
      selectedAnswers = new Array(currentQuiz.length).fill(null);
      renderQuestion(currentQuiz[currentQuestionIndex]);
      startTimer(5 * 60); // 5 minutes
    } else {
      document.getElementById('quiz-content').innerHTML = 'Quiz not found.';
    }
  } catch (error) {
    console.error('Error loading quiz:', error);
    document.getElementById('quiz-content').innerHTML = 'Failed to load quiz.';
  }
}

function renderQuestion(questionObj) {
  const questionContainer = document.getElementById('quiz-content');
  questionContainer.innerHTML = `
    <h2 id="question">${questionObj.question}</h2>
    <div class="answer-options">
      ${questionObj.options.map((option, index) => `
        <label>
          <input type="radio" name="answer" value="${index}" ${selectedAnswers[currentQuestionIndex] === index ? 'checked' : ''}>
          ${String.fromCharCode(65 + index)}) ${option}
        </label>
      `).join('')}
    </div>
  `;

  document.querySelectorAll('input[name="answer"]').forEach(input => {
    input.addEventListener('change', () => {
      selectedAnswers[currentQuestionIndex] = parseInt(input.value);
      checkIfAllAnswered();
    });
  });
  updateNavigationButtons();

}
function updateNavigationButtons() {
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.disabled = currentQuestionIndex === currentQuiz.length - 1;
}

function checkIfAllAnswered() {
  const allAnswered = selectedAnswers.every(ans => ans !== null);
  document.querySelector('.submit-btn').disabled = !allAnswered;
}

document.querySelector('.prev-btn').addEventListener('click', () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion(currentQuiz[currentQuestionIndex]);
  }
});

document.querySelector('.next-btn').addEventListener('click', () => {
  if (currentQuestionIndex < currentQuiz.length - 1) {
    currentQuestionIndex++;
    renderQuestion(currentQuiz[currentQuestionIndex]);
  }
});

document.querySelector('.submit-btn').addEventListener('click', async () => {
  let score = 0;
  currentQuiz.forEach((q, index) => {
    if (selectedAnswers[index] === q.options.indexOf(q.answer)) score++;
  });

  const dataToSend = {
    name: localStorage.getItem('userName'),
    quiz: getQuizName(),
    score: score,
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch('/api/save-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend)
    });

    const result = await response.text();
    alert(`You scored ${score} out of ${currentQuiz.length}\n${result}`);
    clearInterval(timerInterval);
    document.getElementById('review-btn').style.display = 'inline-block';
  } catch (error) {
    console.error('Error sending score:', error);
    alert('Error saving your score.');
  }
});

document.getElementById('review-btn').addEventListener('click', () => {
  document.getElementById('quiz-box').style.display = 'none';
  document.getElementById('review-container').style.display = 'block';
  renderReview(currentQuiz, selectedAnswers);
});

function renderReview(quiz, answers) {
  const reviewContent = document.getElementById('review-content');
  reviewContent.innerHTML = quiz.map((q, i) => {
    const isCorrect = answers[i] === q.options.indexOf(q.answer);
    const yourAnswer = answers[i] !== null ? q.options[answers[i]] : 'Not Answered';
    return `
      <div style="margin-bottom: 20px; padding: 10px; border-left: 5px solid ${isCorrect ? 'green' : 'red'};">
        <h3>Q${i + 1}. ${q.question}</h3>
        <p><strong>Your Answer:</strong> ${yourAnswer}</p>
        <p><strong>Correct Answer:</strong> ${q.answer}</p>
      </div>
    `;
  }).join('');
}

function startTimer(duration) {
  let timer = duration;
  const timerDisplay = document.getElementById('timer');
  timerInterval = setInterval(() => {
    const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
    const seconds = String(timer % 60).padStart(2, '0');
    timerDisplay.textContent = `Time Left: ${minutes}:${seconds}`;

    if (--timer < 0) {
      clearInterval(timerInterval);
      alert("Time's up! Submitting your quiz automatically.");
      document.querySelector('.submit-btn').click();
    }
  }, 1000);
}

window.onload = loadQuiz;

