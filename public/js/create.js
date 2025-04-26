let editIndex = null;

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function generateQuestions(quiz = null) {
    let container = document.getElementById('questions-container');
    container.innerHTML = '';
    let numQuestions = quiz ? quiz.questions.length : document.getElementById('num-questions').value;

    for (let i = 1; i <= numQuestions; i++) {
        let questionDiv = document.createElement('div');
        questionDiv.classList.add('form-group');
        let questionText = quiz ? quiz.questions[i - 1].question : '';
        let options = quiz ? quiz.questions[i - 1].options : ['', '', '', ''];
        let answer = quiz ? quiz.questions[i - 1].answer : '';

        questionDiv.innerHTML = `
            <label for="question${i}">Question ${i}:</label>
            <textarea id="question${i}" name="question${i}" rows="3" required>${questionText}</textarea>
            <label>Options:</label>
            <input type="text" name="option${i}_1" placeholder="Option 1" required value="${options[0] || ''}">
            <input type="text" name="option${i}_2" placeholder="Option 2" required value="${options[1] || ''}">
            <input type="text" name="option${i}_3" placeholder="Option 3" value="${options[2] || ''}">
            <input type="text" name="option${i}_4" placeholder="Option 4" value="${options[3] || ''}">
            <label for="correct${i}">Correct Answer (1-${options.length}):</label>
            <input type="number" id="correct${i}" name="correct${i}" min="1" max="${options.length}" required value="${answer}">
        `;
        container.appendChild(questionDiv);
    }
}
function saveQuizToServer(event) {
    event.preventDefault();
    const title = document.getElementById('quiz-title').value;
    const numQuestions = document.getElementById('num-questions').value;
    const questions = [];
    
    for (let i = 1; i <= numQuestions; i++) {
        const questionText = document.getElementById(`question${i}`).value;
        const answer = parseInt(document.getElementById(`correct${i}`).value);
        const options = [];
    
        for (let j = 1; j <= 4; j++) {
            const optionInput = document.querySelector(`input[name="option${i}_${j}"]`);
            if (optionInput && optionInput.value.trim() !== '') {
                options.push(optionInput.value.trim());
            }
        }
        if (answer < 1 || answer > options.length) {
            alert(`Question ${i}: Correct answer must be between 1 and ${options.length}`);
            return;
        }
    
        questions.push({ 
            question: questionText, 
            options, 
            answer: options[answer - 1] 
        });
        
    }
    
    const quiz = { title, questions };

    // Send the quiz data to the server
    fetch('/save-quiz', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(quiz)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        const userName = localStorage.getItem('userName');
        if (userName === 'admin') {
            window.location.href="admin.html";
        }
        else
        window.location.href = 'index.html'; 
    })
    .catch(error => {
        alert('Error saving quiz!');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName');
    if (userName === 'admin') {
      const homeLink = document.getElementById('home-link');
      if (homeLink) {
        homeLink.href = 'admin.html';
      }
    }

  });


  function toggleSignInSignOut() {
    const userName = localStorage.getItem('userName');
    if (userName) {
        localStorage.removeItem('userName');
        document.getElementById('status-change').textContent = 'Sign In';
        window.location.href = "signin.html";
    } else {
        window.location.href = "signin.html";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName');
    if (userName) {
        document.getElementById('status-change').textContent = 'Sign Out';

        if (userName === 'admin') {
            const homeLink = document.getElementById('home-link');
            if (homeLink) {
                homeLink.href = 'admin.html';
            }
        }
    }
});
