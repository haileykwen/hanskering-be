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

module.exports = {
    post_create,
    get_all,
    get_product_pagination,
    put_update
}