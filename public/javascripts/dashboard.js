const btnLogout = document.getElementById('btn-logout');

btnLogout.addEventListener('click', () => {
    console.log('clicked')
    fetch('/cms/auth/logout', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(result => result.json())
        .then(() => {
            window.location.href = '/cms/auth/login';
        })
        .catch(error => console.log(error));
});