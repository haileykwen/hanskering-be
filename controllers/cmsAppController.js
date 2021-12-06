const db = require("../models/db");

const get_dashboard = (req, res) => {
    res.render('dashboard');
}

const get_createProduct = (req, res) => {
    res.render('createProduct');
}

const get_product = (req, res) => {
    if (!req.query.page) {
        res.redirect('/cms/app/product?page=1');
    } else {
        let pageLength;
        let resultsPerPage = 10;

        const sqlViewAllProduct = "SELECT * FROM barang";
        db.query(sqlViewAllProduct, (error, success) => {
            if (error) res.status(500).json({
                status: 500,
                message: "Server Error"
            });
            if (success) {
                pageLength = Math.ceil(success.length/resultsPerPage);
                allDataLength = success.length;

                if (Number(req.query.page) > pageLength) {
                    res.redirect('/cms/app/product?page=' + encodeURIComponent(pageLength))
                } else {
                    const startingLimit = (req.query.page - 1) * resultsPerPage;

                    sql = `SELECT * FROM barang LIMIT ${startingLimit},${resultsPerPage}`;
                    db.query(sql, (error, success)=>{
                        if (error) {
                            res.status(500).json({
                                status: 500,
                                message: "Server Error"
                            });
                        } else {
                            res.render('product', {
                                data_length: allDataLength,
                                page_length: pageLength,
                                data: success,
                                start_limit: startingLimit + 1,
                                end_limit: startingLimit + success.length,
                                page: req.query.page,
                                next: req.query.page < pageLength ? true : false,
                                previous: req.query.page > 1 ? true : false
                            });
                        }
                    });
                }
            }
        });
    }
}

const get_viewProduct = (req, res) => {
    if (req.query.id) {
        const sqlGet = "SELECT * FROM barang WHERE kode_barang = ?";
        db.query(sqlGet, req.query.id, (error, success) => {
            if (error) {
                res.status(500).json({
                    status: 500,
                    message: "Server Error"
                });
            }
            if (success.length > 0) {
                const sql = "SELECT * FROM barang WHERE kode_barang = ?";
                db.query(sql, req.query.id, (error, success) => {
                    if (error) {
                        res.status(500).json({
                            status: 500,
                            message: "Server Error"
                        });
                    }
                    if (success) {
                        let data = success[0];
                        data.size = JSON.parse(data.size);
                        res.render('viewProduct', {
                            data
                        });
                    }
                });
            } else {
                res.redirect('/cms/app/product?page=1');
            }
        })
    } else {
        res.redirect('/cms/app/product?page=1');
    }
}

const get_updateProduct = (req, res) => {
    if (req.query.id) {
        const sqlGet = "SELECT * FROM barang WHERE kode_barang = ?";
        db.query(sqlGet, req.query.id, (error, success) => {
            if (error) {
                res.status(500).json({
                    status: 500,
                    message: "Server Error"
                });
            }
            if (success.length > 0) {
                const sql = "SELECT * FROM barang WHERE kode_barang = ?";
                db.query(sql, req.query.id, (error, success) => {
                    if (error) {
                        res.status(500).json({
                            status: 500,
                            message: "Server Error"
                        });
                    }
                    if (success) {
                        let data = success[0];
                        data.size = JSON.parse(data.size);
                        res.render('updateProduct', {
                            data
                        });
                    }
                });
            } else {
                res.redirect('/cms/app/product?page=1');
            }
        })
    } else {
        res.redirect('/cms/app/product?page=1');
    }
}

const get_deleteProduct = (req, res) => {
    if (req.query.id) {
        const sqlGet = "SELECT * FROM barang WHERE kode_barang = ?"
        db.query(sqlGet, req.query.id, (error, success) => {
            if (error) {
                res.status(500).json({
                    status: 500,
                    message: "Server Error"
                });
            }
            if (success.length > 0) {
                const sql = "SELECT * FROM barang WHERE kode_barang = ?";
                db.query(sql, req.query.id, (error, success) => {
                    if (error) {
                        res.status(500).json({
                            status: 500,
                            message: "Server Error",
                            error
                        });
                    }
                    if (success) {
                        let data = success[0];
                        data.size = JSON.parse(data.size);
                        res.render('deleteProduct', {
                            data
                        });
                    }
                });
            } else {
                res.redirect('/cms/app/product?page=1');
            }
        })
    } else {
        res.redirect('/cms/app/product?page=1');
    }
}

const get_restock = (req, res) => {
    res.render('restock');
}

module.exports = {
    get_dashboard,
    get_product,
    get_createProduct,
    get_viewProduct,
    get_updateProduct,
    get_deleteProduct,
    get_restock
}