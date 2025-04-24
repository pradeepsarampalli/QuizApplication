// Fetch quizzes from server
function loadQuizzes() {
    fetch('/quizzes')
        .then(response => response.json())
        .then(quizzes => {
            const list = document.getElementById('quiz-list');
            list.innerHTML = '';  // Clear existing list
            quizzes.forEach((quiz, index) => {
                const item = document.createElement('div');
                item.className = 'quiz-item';
                item.innerHTML = `
                    <span><strong>${quiz.title}</strong></span>
                    <div>
                        <button class="edit-btn" onclick="editQuiz(${index})">Edit</button>
                        <button class="delete-btn" onclick="deleteQuiz(${index})">Delete</button>
                    </div>
                `;
                list.appendChild(item);
            });
        })
        .catch(err => console.error('Error loading quizzes:', err));
}

// Delete quiz
function deleteQuiz(index) {
    fetch(`/delete-quiz/${index}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadQuizzes();  // Reload quizzes after delete
        } else {
            alert('Error deleting quiz');
        }
    })
    .catch(err => console.error('Error deleting quiz:', err));
}

// Edit quiz (redirect to quiz editing page)
/*<!-- function editQuiz(index) {
   // window.location.href = `create.html?edit=${index}`;
   window.location.href = `create.html`;
}*/
function editQuiz(index) {
    window.location.href = `/editquiz.html?index=${index}`;
  }
  

window.onload = loadQuizzes;

document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName');
    if (userName === 'admin') {
      const homeLink = document.getElementById('home-link');
      if (homeLink) {
        homeLink.href = 'admin.html';
      }
    }
  });