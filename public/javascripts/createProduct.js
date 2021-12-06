let radioVal;
let nama = document.getElementById("nama-barang");
let size37 = document.getElementById("37");
let size38 = document.getElementById("38");
let size39 = document.getElementById("39");
let size40 = document.getElementById("40");
let size41 = document.getElementById("41");
let size42 = document.getElementById("42");
let size43 = document.getElementById("43");
let harga = document.getElementById("harga");
let btnSubmit = document.getElementById("btn-submit");
let uploadPic = document.getElementById("upload");

const resetForm = () => {
    nama.value = "";
    size37.value = "";
    size38.value = "";
    size39.value = "";
    size40.value = "";
    size41.value = "";
    size42.value = "";
    size43.value = "";
    harga.value = "";
}

const radios = document.querySelectorAll('input[name="brand"]');
radios.forEach(radio => {
  radio.addEventListener('click', function () {
    radioVal = radio.value;
  });
});

let pictures;
let previewPictures;
uploadPic.addEventListener("change", (event) => {
    if(event.target.files.length > 0){
        pictures = event.target.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            previewPictures = reader.result;
        });
        reader.readAsDataURL(event.target.files[0]);

        // for (let i = 0; i < event.target.files.length; i++) {
        //     let url = URL.createObjectURL(event.target.files[i]);
        //     pictures.push(url);
        // }
    } else {
        pictures = [];
    }
});

btnSubmit.addEventListener('click', async () => {
    btnSubmit.innerHTML = 'Membuat Produk ...';
    const data = new FormData();
    data.append("file", pictures);
    data.append("upload_preset", "kossep");
    data.append("cloud_name", "harleykwen");
    const resCloudinary = await fetch("https://api.cloudinary.com/v1_1/harleykwen/image/upload", {
        method: "POST",
        body: data
    })
        .then(res => res.json())
        .then(result => result)
        .catch(error => error);
    if (resCloudinary.url) {
        const data = {
            nama_barang: nama.value,
            brand: radioVal,
            size: {
                "37": size37.value,
                "38": size38.value,
                "39": size39.value,
                "40": size40.value,
                "41": size41.value,
                "42": size42.value,
                "43": size43.value,
            },
            harga: harga.value,
            foto: resCloudinary.url
        }

        fetch('/api/product/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(result => result.json())
            .then(response => {
                if (response.status === 200) {
                    btnSubmit.innerHTML = 'Submit';

                    console.log(response);
                    resetForm();

                    const formWrapper = document.getElementById("form-wrapper");
                    const brandPart = document.getElementById("brand-part");
                    const existingAlert = document.getElementsByClassName('alert');
                    if (existingAlert.length > 0) existingAlert[0].remove();

                    var new_div = document.createElement('div');
                    new_div.className = 'alert alert-success';
                    const message = document.createTextNode("Berhasil menambahkan produk");
                    new_div.appendChild(message);
                    formWrapper.insertBefore(new_div, brandPart);

                    btnSubmit.style.display = 'none';
                    window.scrollTo(0,0);
                } else {
                    btnSubmit.innerHTML = 'Submit';
                    console.log(response);
                    
                    const formWrapper = document.getElementById("form-wrapper");
                    const brandPart = document.getElementById("brand-part");
                    const existingAlert = document.getElementsByClassName('alert');
                    if (existingAlert.length > 0) existingAlert[0].remove();

                    var new_div = document.createElement('div');
                    new_div.className = 'alert alert-danger';
                    const message = document.createTextNode("Gagal menambahkan produk");
                    new_div.appendChild(message);
                    formWrapper.insertBefore(new_div, brandPart);
                    window.scrollTo(0,0);
                }
            })
            .catch(error => {
                btnSubmit.innerHTML = 'Submit';
                console.log(error);
                
                const formWrapper = document.getElementById("form-wrapper");
                const brandPart = document.getElementById("brand-part");
                const existingAlert = document.getElementsByClassName('alert');
                if (existingAlert.length > 0) existingAlert[0].remove();

                var new_div = document.createElement('div');
                new_div.className = 'alert alert-danger';
                const message = document.createTextNode("Gagal menambahkan produk");
                new_div.appendChild(message);
                formWrapper.insertBefore(new_div, brandPart);
                window.scrollTo(0,0);
            })

    } else {
        console.log(error);
    }

    // console.log({
    //     "Brand": radioVal,
    //     "Nama Barang": nama.value,
    //     "Size": {
    //         "37": size37.value,
    //         "38": size38.value,
    //         "39": size39.value,
    //         "40": size40.value,
    //         "41": size41.value,
    //         "42": size42.value,
    //         "43": size43.value,
    //     },
    //     "Gambar": pictures,
    //     "Harga": harga.value
    // })
});