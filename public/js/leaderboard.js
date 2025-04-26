async function loadLeaderboard() {
    try {
        const response = await fetch('/scores.json');
        const allScores = await response.json();
        const currentUser = localStorage.getItem('userName');

        
        const quizGroups = {};

        allScores.forEach(entry => {
            if (!quizGroups[entry.quiz]) {
                quizGroups[entry.quiz] = [];
            }
            quizGroups[entry.quiz].push(entry);
        });

        const leaderboardTable = document.querySelector('.leaderboard-table tbody');
        leaderboardTable.innerHTML = ""; 

        for (const quizName in quizGroups) {
 
            const headingRow = document.createElement('tr');
            headingRow.innerHTML = `
                <td colspan="4" style="font-weight:bold; background-color:#f0f0f0;">${quizName}</td>
            `;
            leaderboardTable.appendChild(headingRow);

            const sortedUsers = quizGroups[quizName].sort((a, b) => b.score - a.score);

            sortedUsers.forEach((user, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${user.name}</td>
                    <td>${user.quiz}</td>
                    <td>${user.score}</td>
                `;
                leaderboardTable.appendChild(row);
            });
        }

        const userName = document.getElementById("user-name");
        const userRank = document.getElementById('user-rank');
        const userScore = document.getElementById('user-score');
        const current = allScores.find(u => u.name?.toLowerCase() === currentUser?.toLowerCase());

        if (current) {
            userName.textContent=currentUser;
            userRank.textContent = allScores.indexOf(current) + 1;
            userScore.textContent = current.score;
        } else {
            userName.textContent='Guest'
            userRank.textContent = 'N/A';
            userScore.textContent = '0';
        }

    } catch (error) {
       // console.error('Error loading leaderboard:', error);
    }
}

window.onload = loadLeaderboard;

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
