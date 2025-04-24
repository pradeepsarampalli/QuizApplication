
    const userName = document.getElementById("user-name");
    const currentUser = localStorage.getItem('userName');
    userName.textContent = currentUser;

    async function loadLeaderboard() {
        try {
            const response = await fetch('/scores.json');
            const allScores = await response.json();
            console.log(allScores)

           // const quizToShow = "DAA"; // Change this as needed
           // const filtered = allScores.filter(entry => entry.quiz === quizToShow && entry.name);

            // Sort by score (descending)
            const sorted = allScores.sort((a, b) => b.score - a.score);

            const leaderboardTable = document.querySelector('.leaderboard-table tbody');
            leaderboardTable.innerHTML = ""; // Clear existing rows

            sorted.forEach((user, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${user.name}</td>
                    <td>${user.quiz}</td>
                    <td>${user.score}</td>
                `;
                leaderboardTable.appendChild(row);
            });

            // Set current user score and rank
            const userRank = document.getElementById('user-rank');
            const userScore = document.getElementById('user-score');
            const current = sorted.find(u => u.name?.toLowerCase() === currentUser?.toLowerCase());

            if (current) {
                userRank.textContent = sorted.indexOf(current) + 1;
                userScore.textContent = current.score;
            } else {
                userRank.textContent = 'N/A';
                userScore.textContent = '0';
            }

        } catch (error) {
            console.error('Error loading leaderboard:', error);
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