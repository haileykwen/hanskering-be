let size37 = document.getElementById("37");
let size38 = document.getElementById("38");
let size39 = document.getElementById("39");
let size40 = document.getElementById("40");
let size41 = document.getElementById("41");
let size42 = document.getElementById("42");
let size43 = document.getElementById("43");
let btnRestock = document.getElementById("btn-restock");

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const id = params.id;

btnRestock.addEventListener('click', () => {
    btnRestock.innerHTML = "Restock ...";

    const data = {
        id,
        size37: size37.value,
        size38: size38.value,
        size39: size39.value,
        size40: size40.value,
        size41: size41.value,
        size42: size42.value,
        size43: size43.value,
    }

    fetch('/api/product/restock', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then((res) => res.json())
        .then(response => {
            if (response.status === 200) {
                btnRestock.innerHTML = 'Restock';

                const formWrapper = document.getElementById("form-wrapper");
                const sizePart = document.getElementById("size-part");
                const existingAlert = document.getElementsByClassName('alert');
                if (existingAlert.length > 0) existingAlert[0].remove();

                var new_div = document.createElement('div');
                new_div.className = 'alert alert-success';
                const message = document.createTextNode("Restock Berhasil");
                new_div.appendChild(message);
                formWrapper.insertBefore(new_div, sizePart);

                btnRestock.style.display = 'none';
                window.scrollTo(0,0);
            } else {
                btnRestock.innerHTML = 'Restock';

                const formWrapper = document.getElementById("form-wrapper");
                const sizePart = document.getElementById("size-part");
                const existingAlert = document.getElementsByClassName('alert');
                if (existingAlert.length > 0) existingAlert[0].remove();

                var new_div = document.createElement('div');
                new_div.className = 'alert alert-danger';
                const message = document.createTextNode("Restock Gagal");
                new_div.appendChild(message);
                formWrapper.insertBefore(new_div, sizePart);

                btnRestock.style.display = 'none';
                window.scrollTo(0,0);
            }
        })
        .catch(() => {
            btnRestock.innerHTML = 'Restock';

            const formWrapper = document.getElementById("form-wrapper");
            const sizePart = document.getElementById("size-part");
            const existingAlert = document.getElementsByClassName('alert');
            if (existingAlert.length > 0) existingAlert[0].remove();

            var new_div = document.createElement('div');
            new_div.className = 'alert alert-danger';
            const message = document.createTextNode("Restock Gagal");
            new_div.appendChild(message);
            formWrapper.insertBefore(new_div, sizePart);

            btnRestock.style.display = 'none';
            window.scrollTo(0,0);
        });
});