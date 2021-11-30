const btnGanti = document.getElementsByClassName('btn-ganti-foto');
const cancel_up = document.getElementsByClassName('btn-cancel-new');
const img = document.getElementById('foto_produk');
const new_up = document.getElementById('upload');
const newPicPreviewImg = document.getElementById('new-pic-preview');

let radioVal;
let nama = document.getElementById("nama-barang");
let harga = document.getElementById("harga");
let btnUpdate = document.getElementById("btn-update");

const radios = document.querySelectorAll('input[name="brand"]');
radios.forEach(radio => {
  radio.addEventListener('click', function () {
    radioVal = radio.value;
  });
});

let newPic;
let newPicPreview;

btnGanti[0].addEventListener('click', () => {
    img.style.display = "none";
    new_up.style.display = 'block';
    cancel_up[0].style.display = 'block';
    btnGanti[0].style.display = "none";
    new_up.setAttribute('type', 'file');
    if (newPicPreviewImg.hasAttribute('src')) {
        newPicPreviewImg.style.display = 'block';
    } else {
        newPicPreviewImg.style.display = 'none';
    }
});

cancel_up[0].addEventListener('click', () => {
    img.style.display = "block";
    new_up.style.display = 'none';
    cancel_up[0].style.display = 'none';
    btnGanti[0].style.display = "block";
    newPicPreviewImg.removeAttribute('src');
    newPicPreviewImg.style.display = "none";
    newPic = undefined;
    newPicPreview = undefined;
    new_up.setAttribute('type', 'text');
});

new_up.addEventListener("change", (event) => {
    if(event.target.files.length > 0){
        newPic = event.target.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            newPicPreview = reader.result;
        });
        reader.readAsDataURL(event.target.files[0]);

        for (let i = 0; i < event.target.files.length; i++) {
            let url = URL.createObjectURL(event.target.files[i]);
            newPicPreview = url;
        }

        newPicPreviewImg.setAttribute('src', newPicPreview);
        newPicPreviewImg.style.display = 'block';
    } 
});

btnUpdate.addEventListener('click', async () => {
    btnUpdate.innerText = 'Updating...';
    // console.log({
    //     radioVal,
    //     nama: nama.value,
    //     harga: harga.value,
    //     newPic
    // });

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const data = new FormData();
    data.append("file", newPic);
    data.append("upload_preset", "kossep");
    data.append("cloud_name", "harleykwen");
    let resCloudinary;
    if (newPic) {
        resCloudinary = await fetch("https://api.cloudinary.com/v1_1/harleykwen/image/upload", {
            method: "POST",
            body: data
        })
            .then(res => res.json())
            .then(result => result)
            .catch(error => error);
    } else {
        resCloudinary = 'pass';
    }
     
    if (resCloudinary) {
        const data = {
            kode_barang: id,
            nama_barang: nama.value,
            brand: radioVal,
            harga: harga.value,
            foto: resCloudinary == 'pass' ? undefined : resCloudinary.url
        }

        fetch('/api/product/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(result => result.json())
            .then(response => {
                if (response.status === 200) {
                    console.log(response);
                    btnUpdate.innerText = 'Update';

                    const formWrapper = document.getElementById("form-wrapper");
                    const brandPart = document.getElementById("brand-part");
                    const existingAlert = document.getElementsByClassName('alert');
                    if (existingAlert.length > 0) existingAlert[0].remove();

                    var new_div = document.createElement('div');
                    new_div.className = 'alert alert-success';
                    const message = document.createTextNode("Berhasil update produk");
                    new_div.appendChild(message);
                    formWrapper.insertBefore(new_div, brandPart);

                    window.scrollTo(0,0);
                } else {
                    console.log(response);
                    btnUpdate.innerText = 'Update';
                    
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
                }
            })
            .catch(error => {
                console.log(error);
                btnUpdate.innerText = 'Update';
                
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
            })

    } else {
        console.log(error);
        btnUpdate.innerText = 'Update';
    }
});