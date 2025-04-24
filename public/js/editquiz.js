const index = new URLSearchParams(location.search).get('index');
const container = document.getElementById('questionsContainer');

function createQuestionBlock(question = {}, idx = '') {
  const block = document.createElement('div');
  block.className = 'question-block';
  block.innerHTML = `
    <textarea placeholder="Question" name="question" required>${question.question || ''}</textarea>
    <input type="text" placeholder="Option 1" name="option1" value="${question.options?.[0] || ''}">
    <input type="text" placeholder="Option 2" name="option2" value="${question.options?.[1] || ''}">
    <input type="text" placeholder="Option 3" name="option3" value="${question.options?.[2] || ''}">
    <input type="text" placeholder="Option 4" name="option4" value="${question.options?.[3] || ''}">
    <input type="text" placeholder="Answer" name="answer" value="${question.answer || ''}">
  `;
  container.appendChild(block);
}

function addQuestionBlock() {
  createQuestionBlock();
}

fetch(`/quiz/${index}`)
  .then(res => res.json())
  .then(({ quiz }) => {
    document.getElementById('title').value = quiz.title;
    quiz.questions.forEach((q, i) => createQuestionBlock(q, i));
  });

document.getElementById('editForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const questionBlocks = container.querySelectorAll('.question-block');

  const questions = Array.from(questionBlocks).map(block => {
    const inputs = block.querySelectorAll('input');
    const textarea = block.querySelector('textarea');
    return {
      question: textarea.value,
      options: Array.from(inputs).slice(0, 4).map(input => input.value).filter(opt => opt.trim() !== ''),
      answer: inputs[4].value
    };
  });

  const updatedQuiz = { title, questions };

  const res = await fetch(`/editquiz/${index}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedQuiz)
  });

  const result = await res.json();
  alert(result.message);
  window.location.href = '/managequiz.html';
});

