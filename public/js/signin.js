document.getElementById('login').addEventListener('click', async (e) => {
    e.preventDefault(); 

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert("Email and password are required");
        return;
    }

    try {
        const response = await fetch('/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            //alert(data.message); 
            localStorage.setItem('userName', data.username);
            localStorage.setItem('userEmail', data.email);
            if(data.username==='admin' && data.email==='admin@gmail.com')
            window.location.href='/admin.html'
            else
            window.location.href = '/index.html'; 
        } else {
            alert(data.message ); 
        }
    } catch (error) {
        alert('Something went wrong');
    }

const token = localStorage.getItem('userName');

fetch('api/userdata', {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({ token })
})
.then(res => res.json())
.then(data => {
console.log('Server response:', data);
})
.catch(err => {
console.error('Error:', err);
});

});
 

