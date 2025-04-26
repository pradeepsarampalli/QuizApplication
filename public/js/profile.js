
const username = localStorage.getItem('userName');
const email = localStorage.getItem('userEmail');

const usernameEl = document.querySelector('.username');
const profileInfoEl = document.querySelector('.profile-info');
const loginBtn = document.querySelector('.login-button');
const logoutBtn = document.querySelector('.logout-button');

if (!username || !email) {
    usernameEl.textContent = 'Guest';
    profileInfoEl.innerHTML = `
        <p><strong>Full Name:</strong> Guest</p>
        <p><strong>Email:</strong> guest@example.com</p>
    `;
    logoutBtn.style.display = 'none';
    loginBtn.style.display = 'inline-block';
} else {
    usernameEl.textContent = username;
    profileInfoEl.innerHTML = `
        <p><strong>Full Name:</strong> <span id="profile-name">${username}</span></p>
        <p><strong>Email:</strong> ${email}</p>
    `;
    logoutBtn.style.display = 'inline-block';
    loginBtn.style.display = 'none';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit Profile';
    editBtn.className = 'login-button';
    document.querySelector('.profile-actions').appendChild(editBtn);

    editBtn.addEventListener('click', () => {
        const currentName = document.getElementById('profile-name').textContent;

        const newName = prompt('Enter new name:', currentName);

        if (newName) {
            localStorage.setItem('userName', newName);
            document.getElementById('profile-name').textContent = newName;
            document.querySelector('.username').textContent = newName;
        }

    });
}

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.replace('/signin.html');
});

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
