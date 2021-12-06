const btnDelete = document.getElementById('btn-delete');

btnDelete.addEventListener('click', () => {
    btnDelete.innerText = 'Menghapus Produk ...';

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const currentId = params.id;

    const data = { currentId }

    fetch('/api/product/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(result => result.json())
        .then(response => {
            if (response.status === 200) {
                console.log(response);
                btnDelete.innerText = 'Hapus Produk Ini';

                const formWrapper = document.getElementById("form-wrapper");
                const brandPart = document.getElementById("brand-part");
                const existingAlert = document.getElementsByClassName('alert');
                if (existingAlert.length > 0) existingAlert[0].remove();

                var new_div = document.createElement('div');
                new_div.className = 'alert alert-success';
                const message = document.createTextNode("Produk telah dihapus");
                new_div.appendChild(message);
                formWrapper.insertBefore(new_div, brandPart);

                btnDelete.style.display = 'none';

                window.scrollTo(0,0);
            } else {
                console.log(response);
                btnDelete.innerText = 'Update';
                
                const formWrapper = document.getElementById("form-wrapper");
                const brandPart = document.getElementById("brand-part");
                const existingAlert = document.getElementsByClassName('alert');
                if (existingAlert.length > 0) existingAlert[0].remove();

                var new_div = document.createElement('div');
                new_div.className = 'alert alert-danger';
                const message = document.createTextNode("Gagal update produk");
                new_div.appendChild(message);
                formWrapper.insertBefore(new_div, brandPart);
                btnDelete.innerText = 'Hapus Produk Ini';
                window.scrollTo(0,0);
            }
        })
        .catch(error => {
            console.log(error);
            btnDelete.innerText = 'Hapus Produk Ini';
            
            const formWrapper = document.getElementById("form-wrapper");
            const brandPart = document.getElementById("brand-part");
            const existingAlert = document.getElementsByClassName('alert');
            if (existingAlert.length > 0) existingAlert[0].remove();

            var new_div = document.createElement('div');
            new_div.className = 'alert alert-danger';
            const message = document.createTextNode("Gagal update produk");
            new_div.appendChild(message);
            formWrapper.insertBefore(new_div, brandPart);
            window.scrollTo(0,0);
        });
});