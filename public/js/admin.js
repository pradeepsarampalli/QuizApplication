function loadQuizzes() {
    fetch('/quizzes')
        .then(res => res.json())
        .then(quizzes => {
            const container = document.querySelector('.featured-quizzes');
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

// Change greeting and handle sign in / sign out dynamically
function toggleSignInSignOut() {
    const userName = localStorage.getItem('userName');
    if (userName) {
        localStorage.removeItem('userName');
        document.getElementById('status-change').textContent = 'Sign In';
        document.getElementById('un').textContent = 'Guest';
        window.location.href = "index.html";
    } else {
        window.location.href = "signin.html";
    }
}

// Update user name display if logged in
document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName');
    if (userName) {
        document.getElementById('un').textContent = userName;
        document.getElementById('status-change').textContent = 'Sign Out';

        if (userName === 'admin') {
            const homeLink = document.getElementById('home-link');
            if (homeLink) {
                homeLink.href = 'admin.html';
            }
        }
    }
    loadQuizzes();
});
