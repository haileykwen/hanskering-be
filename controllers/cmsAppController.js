const get_dashboard = (req, res) => {
    res.render('dashboard');
}

const get_product = (req, res) => {
    res.render('product');
}

const get_createProduct = (req, res) => {
    res.render('createProduct');
}

module.exports = {
    get_dashboard,
    get_product,
    get_createProduct
}