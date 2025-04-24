function loadQuizzes() {
  fetch('/quizzes')
    .then(res => res.json())
    .then(quizzes => {
      const container = document.getElementById('quiz-container');

      // Clear only the dynamic quizzes, keep built-in ones
      container.innerHTML = `
        <div class="card">
          <h3>ADSJ Quiz</h3>
          <p>Sharpen your math skills</p>
          <button><a href="attempt.html?quiz=ADSJ">Attempt</a></button>
        </div>
        <div class="card">
          <h3>DAA Quiz</h3>
          <p>Explore the world of science</p>
          <button><a href="attempt.html?quiz=DAA">Attempt</a></button>
        </div>
        <div class="card">
          <h3>DBMS Quiz</h3>
          <p>Test your intelligence</p>
          <button><a href="attempt.html?quiz=DBMS">Attempt</a></button>
        </div>
        <div class="card">
          <h3>OS Quiz</h3>
          <p>Test your coding skills</p>
          <button><a href="attempt.html?quiz=OS">Attempt</a></button>
        </div>
      `;

      // Append dynamic quizzes
      quizzes.forEach(quiz => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h3>${quiz.title}</h3>
          <p>${quiz.description || "No description"}</p>
          <button><a href="attempt.html?quiz=${quiz.title}">Attempt</a></button>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => console.error("Failed to load quizzes", err));
}

function updateUserInterface() {
  const user = localStorage.getItem('userName');
  const usernameDisplay = document.getElementById('un');
  const authLink = document.getElementById('auth-link');

  if (user) {
    usernameDisplay.textContent = user;
    authLink.textContent = "Sign Out";
    authLink.href = "#";
    authLink.onclick = (e) => {
      e.preventDefault();
      localStorage.clear();
      updateUserInterface();
      loadQuizzes(); // ensure quizzes reload properly
    };
  } else {
    usernameDisplay.textContent = "Guest";
    authLink.textContent = "Sign In";
    authLink.href = "signin.html";
    authLink.onclick = null;
    window.location.href="signin.html"
  }
}

window.onload = () => {
  updateUserInterface();
  loadQuizzes();
};

document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName');
    if (userName === 'admin') {
      const homeLink = document.getElementById('home-link');
      if (homeLink) {
        homeLink.href = 'admin.html';
      }
    }
  });