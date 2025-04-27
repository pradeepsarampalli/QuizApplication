function loadLeaderboard() {
    fetch('/leaderboard')
        .then(response => response.json())
        .then(entries => {
            const list = document.getElementById('leaderboard-list');
            list.innerHTML = '';
            entries.forEach((entry, index) => {
                const item = document.createElement('div');
                item.className = 'quiz-item';
                item.innerHTML = `
                    <span><strong>${entry.name}</strong> - ${entry.quiz} (Score: ${entry.score})</span>
                    <div>
                        <button class="delete-btn" onclick="deleteEntry(${index})">Delete</button>
                    </div>
                `;
                list.appendChild(item);
            });
        })
        .catch(err => console.error('Error loading leaderboard:', err));
}

function deleteEntry(index) {
    fetch(`/delete-leaderboard-entry/${index}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadLeaderboard();
        } else {
            alert('Error deleting entry');
        }
    })
    .catch(err => console.error('Error deleting entry:', err));
}

window.onload = loadLeaderboard;

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
