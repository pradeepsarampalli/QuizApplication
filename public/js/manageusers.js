function loadUsers() {
    fetch('/users')
        .then(response => response.json())
        .then(users => {
            const list = document.getElementById('user-list');
            list.innerHTML = '';
            users.forEach((user, index) => {
                const item = document.createElement('div');
                item.className = 'quiz-item';
                item.innerHTML = `
                    <span><strong>${user.username}</strong> (${user.email})</span>
                    <div>
                        <button class="delete-btn" onclick="deleteUser(${index})">Delete</button>
                    </div>
                `;
                list.appendChild(item);
            });
        })
        .catch(err => console.error('Error loading users:', err));
}

function deleteUser(index) {
    fetch(`/delete-user/${index}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadUsers(); 
        } else {
            alert('Error deleting user');
        }
    })
    .catch(err => console.error('Error deleting user:', err));
}

window.onload = loadUsers;

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
