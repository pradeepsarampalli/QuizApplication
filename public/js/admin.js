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
                    <button><a href="attempt.html?quiz=${quiz.title}">Attempt</a></button>
                `;
                container.appendChild(card);
            });
        })
        .catch(err => console.error("Failed to load quizzes", err));
}


function toggleSignInSignOut() {
    const userName = localStorage.getItem('userName');
    if (userName) {
        localStorage.removeItem('userName');
        document.getElementById('status-change').textContent = 'Sign In';
        document.getElementById('un').textContent = 'Guest';
        window.location.href = "signin.html";
    } else {
        window.location.href = "signin.html";
    }
}


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
