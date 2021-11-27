const btnCreate     = document.getElementById('btn-create');
const pageInput     = document.getElementById('page-input');

btnCreate.addEventListener('click', () => {
    window.location.href = '/cms/app/product/create';
});

pageInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        if ( pageInput.value ) {
            const page = pageInput.value;
            const target = `${window.location.origin}/cms/app/product?page=9`;
            console.log(target);
            window.location.href = `${window.location.origin}/cms/app/product?page=9`;
        }
    }
});