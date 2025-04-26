const form = document.getElementById('signup-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();  

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;


    const userData = { username, email, password, confirmPassword };

  
    fetch('/signup', {  
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Sign-up successful') {
            alert('Sign-up successful!');
            window.location.href = 'signin.html'; 
        } else {
            alert(data.message); 
        }
    })
    .catch(error => alert('Error: ' + error.message));
});


