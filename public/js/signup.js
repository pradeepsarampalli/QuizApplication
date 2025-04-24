const form = document.getElementById('signup-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();  // Prevent default form submission

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Create user data object
    const userData = { username, email, password, confirmPassword };

    // Send POST request to backend
    fetch('/signup', {  
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Sign-up successful') {
            alert('Sign-up successful!');
            window.location.href = 'signin.html';  // Redirect to sign-in page
        } else {
            alert(data.message);  // Show error message
        }
    })
    .catch(error => alert('Error: ' + error.message));
});


