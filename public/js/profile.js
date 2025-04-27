const username = localStorage.getItem('userName');
const email = localStorage.getItem('userEmail');

const usernameEl = document.querySelector('.username');
const profileInfoEl = document.querySelector('.profile-info');
const loginBtn = document.querySelector('.login-button');
const logoutBtn = document.querySelector('.logout-button');

// Selecting the edit form and its elements
const editForm = document.querySelector('.edit-profile-form');
const cancelEditButton = document.getElementById('cancel-edit');
const editProfileForm = document.getElementById('edit-profile-form');
const newNameInput = document.getElementById('new-name');

// Set the default profile if the user is not logged in
if (!username || !email) {
    usernameEl.textContent = 'Guest';
    profileInfoEl.innerHTML = `
        <p><strong>Full Name:</strong> Guest</p>
        <p><strong>Email:</strong> guest@example.com</p>
    `;
    logoutBtn.style.display = 'none';
    loginBtn.style.display = 'inline-block';
} else {
    // Display the logged-in user's profile
    usernameEl.textContent = username;
    profileInfoEl.innerHTML = `
        <p><strong>Full Name:</strong> <span id="profile-name">${username}</span></p>
        <p><strong>Email:</strong> ${email}</p>
    `;
    logoutBtn.style.display = 'inline-block';
    loginBtn.style.display = 'none';

    // Create "Edit Profile" button dynamically
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit Profile';
    editBtn.className = 'login-button';
    document.querySelector('.profile-actions').appendChild(editBtn);

    // When the "Edit Profile" button is clicked
    editBtn.addEventListener('click', () => {
        // Show the edit form and pre-fill the current name
        editForm.style.display = 'block';
        newNameInput.value = username; // Pre-fill input with current username
    });
}

// When the "Cancel" button is clicked in the form
cancelEditButton.addEventListener('click', () => {
    editForm.style.display = 'none'; // Hide the edit form without saving changes
});

// When the form is submitted (save new name)
editProfileForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form from refreshing the page
    const newName = newNameInput.value;

    if (newName) {
        // Update username in localStorage and on the page
        localStorage.setItem('userName', newName);
        document.getElementById('profile-name').textContent = newName;
        usernameEl.textContent = newName;

        // Hide the edit form
        editForm.style.display = 'none';
    }
});

// Handle Logout functionality
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.replace('/signin.html');
});

// Manage sign-in/sign-out button based on user state
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

// Handle sign-in/sign-out toggle
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
