const btnCreate     = document.getElementById('btn-create');
const pageInput     = document.getElementById('page-input');
const btnNext       = document.getElementById('button-next');
const btnPrevious   = document.getElementById('button-previous');

btnCreate.addEventListener('click', () => {
    window.location.href = '/cms/app/product/create';
});

pageInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        if ( pageInput.value ) {
            const page = pageInput.value;
            window.location.href = `${window.location.origin}/cms/app/product?page=${page}`;
        }
    }
});

btnNext.addEventListener('click', () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const currentPage = params.page;
    window.location.href = `${window.location.origin}/cms/app/product?page=${currentPage+1}`;
});

btnPrevious.addEventListener('click', () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const currentPage = params.page;
    window.location.href = `${window.location.origin}/cms/app/product?page=${currentPage-1}`;
});

function clickBarang(e){
    e = e || window.event;
    var target = e.target || e.srcElement;
    var id = target.parentNode.id
    window.location.href = `${window.location.origin}/cms/app/product/view?id=${id}`;
}

function clickEdit(e){
    e = e || window.event;
    var target = e.target || e.srcElement;
    var id = target.parentNode.parentNode.id
    window.location.href = `${window.location.origin}/cms/app/product/update?id=${id}`;
}