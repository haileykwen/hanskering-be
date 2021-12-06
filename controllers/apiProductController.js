const db = require("../models/db");
const { v4: uuidv4 } = require("uuid");

const post_create = (req, res) => {
    let { nama_barang, brand, size, harga, foto } = req.body;
    if ( !nama_barang || !brand || !size || !harga || !foto ) res.status(400).json({
        status: 400,
        message: "Data belum lengkap",
        error
    });
    const kode_barang = uuidv4();
    size = JSON.stringify(size);
    const sqlCreatePhrase = "INSERT INTO barang (kode_barang, nama_barang, brand, size, harga, foto) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sqlCreatePhrase, [kode_barang, nama_barang, brand, size, harga, foto], (error, success) => {
        if (error) res.status(500).json({
            status: 500,
            message: "Server Error",
            error
        });
        if (success) res.status(200).json({
            status: 200,
            message: "Add product successful",
            success
        });
    });
};

const delete_product = (req, res) => {
    const { currentId } = req.body;
    const sqlGet = "SELECT * FROM barang WHERE kode_barang = ?"
    db.query(sqlGet, currentId, (error, success) => {
        if (error) {
            res.status(500).json({
                status: 500,
                message: "Server Error"
            });
        }
        if (success.length > 0) {
            const sql = "DELETE FROM barang WHERE kode_barang = ?";
            db.query(sql, currentId, (error, success) => {
                if (error) {
                    res.status(500).json({
                        status: 500,
                        message: "Server Error",
                        error
                    });
                }
                if (success) {
                    res.status(200).json({
                        status: 200,
                        message: "Produk telah dihapus"
                    });
                }
            });
        } else {
            res.redirect("/app/cms/product");
        }
    });
}

const put_update = (req, res) => {
    let { nama_barang, brand, harga, foto, kode_barang } = req.body;

    if ( !nama_barang || !harga ) res.status(400).json({
        status: 400,
        message: "Data belum lengkap",
        error
    });

    let objectInitValues = {
        nama_barang, brand, foto, harga
    }
    let objectValues = [];
    Object.keys(objectInitValues).map(val => {
        // console.log(val);
        if (objectInitValues[val] !== '' && objectInitValues[val] !== undefined) objectValues.push(`${val} = ?`);
    });
    // console.log(objectValues);

    let initValues = [nama_barang, brand, foto, harga];
    let values = [];
    for (let i = 0; i < initValues.length; i++){
        if (initValues[i] !== '' && initValues[i] !== undefined) values.push(initValues[i]);
    }

    // console.log(values);
    // console.log({ nama_barang, brand, harga, foto, kode_barang });

    const sql = `UPDATE barang SET ${objectValues} WHERE kode_barang = ? `;
    // console.log(sql);

    db.query(sql, [...values, kode_barang], (error, success) => {
        if (error) res.status(500).json({
            status: 500,
            message: "Server Error",
            error
        });
        if (success) res.status(200).json({
            status: 200,
            message: "Update product successful",
            success
        });
    });
};

const get_all = (req, res) => {
    const sqlViewAllProduct = "SELECT * FROM barang";
    db.query(sqlViewAllProduct, (error, success) => {
        if (error) res.status(500).json({
            status: 500,
            message: "Server Error",
            error
        });
        if (success) res.status(200).json({
            status: 200,
            message: "Get all product successful",
            success
        });
    });
}

const get_product_pagination = (req, res) => {
    const limit = 10;
    const page = req.query.page ? req.query.page : 1;
    const offset = (page - 1) * limit;
    const sqlGetProdutWithPagination = "SELECT * FROM barang limit "+limit+" OFFSET "+offset;

    let productLength;
    let pageLength;

    const sqlViewAllProduct = "SELECT * FROM barang";
    db.query(sqlViewAllProduct, (error, success) => {
        if (error) res.status(500).json({
            status: 500,
            message: "Server Error",
            error
        });
        if (success) {
            productLength = success.length;
            pageLength = Math.ceil(success.length / limit);
        }
    });

    db.query(sqlGetProdutWithPagination, (error, success) => {
        if (error) res.status(500).json({
            status: 500,
            message: "Server Error",
            error
        });
        if (success) res.status(200).json({
            status: 200,
            message: "Get all product successful",
            data: success,
            current_page: page,
            all_page_count: pageLength,
            all_product_count: productLength
        });
    });
}

const put_restock = (req, res) => {
    let { id, size37, size38, size39, size40, size41, size42, size43 } = req.body;
    console.log({ id, size37, size38, size39, size40, size41, size42, size43 });

    const sqlGet = "SELECT * FROM barang WHERE kode_barang = ?";
    db.query(sqlGet, id, (error, success) => {
        if (error) {
            res.status(500).json({
                status: 500,
                message: "Server Error"
            });
        }
        if (success.length > 0) {
            let existing = success[0];
            let oldSizes = JSON.parse(existing.size);
            let newSizes = {};

            if ( size37 !== '' ) {
                newSizes['37'] = parseInt(oldSizes['37']) + parseInt(size37);
            } else {
                newSizes['37'] = oldSizes['37'];
            }

            if ( size38 !== '' ) {
                newSizes['38'] = parseInt(oldSizes['38']) + parseInt(size38);
            } else {
                newSizes['38'] = oldSizes['38'];
            }

            if ( size39 !== '' ) {
                newSizes['39'] = parseInt(oldSizes['39']) + parseInt(size39);
            } else {
                newSizes['39'] = oldSizes['39'];
            }

            if ( size40 !== '' ) {
                newSizes['40'] = parseInt(oldSizes['40']) + parseInt(size40);
            } else {
                newSizes['40'] = oldSizes['40'];
            }

            if ( size41 !== '' ) {
                newSizes['41'] = parseInt(oldSizes['41']) + parseInt(size41);
            } else {
                newSizes['41'] = oldSizes['41'];
            }

            if ( size42 !== '' ) {
                newSizes['42'] = parseInt(oldSizes['42']) + parseInt(size42);
            } else {
                newSizes['42'] = oldSizes['42'];
            }

            if ( size43 !== '' ) {
                newSizes['43'] = parseInt(oldSizes['43']) + parseInt(size43);
            } else {
                newSizes['43'] = oldSizes['43'];
            }

            let data = JSON.stringify(newSizes);
            let sqlUpdate = "UPDATE barang SET size = ? WHERE kode_barang = ?";
            db.query(sqlUpdate, [data, id], (error, success) => {
                if (error) {
                    console.log('Restock Gagal');
                    res.status(500).json({
                        status: 500,
                        message: "Server Error"
                    });
                }
                if (success) {
                    console.log('Restock Berhasil');
                    res.status(200).json({
                        status: 200,
                        message: "Restock Berhasil"
                    });
                }
            });
        } else {
            res.redirect('/cms/app/product?page=1');
        }
    });
}

module.exports = {
    post_create,
    get_all,
    get_product_pagination,
    put_update,
    delete_product,
    put_restock
}