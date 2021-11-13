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
    size = `${size}`;
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


module.exports = {
    post_create
}