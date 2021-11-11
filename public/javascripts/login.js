const formLogin = document.getElementById('form-login');
const formWrapper = document.getElementById('form-wrapper')
const email = document.getElementById("email");
const password = document.getElementById('password');

const resetForm = () => {
    email.value = "";
    password.value = "";
}

formLogin.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = { email: email.value, password: password.value }

    fetch('/cms/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(result => result.json())
        .then(response => {
            console.log(response);
            if (response.status === 200) {
                resetForm();
                window.location.href = '/cms/app/dashboard';
            } else {
                const existingAlert = document.getElementsByClassName('alert');
                if (existingAlert.length > 0) existingAlert[0].remove();

                var new_div = document.createElement('div');
                new_div.className = 'alert alert-danger';
                const message = document.createTextNode(response.message);
                new_div.appendChild(message);
                formWrapper.insertBefore(new_div, formLogin);
            }
        })
        .catch(error => console.log(error));
});