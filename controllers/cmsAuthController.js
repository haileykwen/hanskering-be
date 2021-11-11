const db = require('../models/db');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const get_login = (req, res) => {
    res.render('login');
}

const post_login = (req, res) => {
    const { email, password } = req.body;
    const sqlGetAdmin = "SELECT * FROM admin where email = ?";
    db.query(sqlGetAdmin, email, (error, success) => {
        if (error) res.status(500).json({
            status: 500,
            message: 'Server error',
            error
        });
        if (success.length > 0) {
            bcrypt.compare(password, success[0].password, (error, response) => {
                if (error) res.status(500).json({
                    status: 500,
                    message: 'Server error',
                    error
                });
                if (response) {
                    const token = jwt.sign({user_id: success[0].user_id}, "skidipapap");
                    const maxAge = 3 * 24 * 60 * 60;
                    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                    res.status(200).json({
                        status: 200,
                        message: "Login berhasil!",
                        token
                    });
                } else {
                    res.status(400).json({ 
                        status: 400,
                        message: "Email atau password salah!" 
                    });
                }
            });
        } else {
            res.status(400).json({ 
                status: 400,
                message: "Anda belum terdaftar sebagai admin!"
            });
        }
    });
}

const get_logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({
        status: 200,
        message: 'logout berhasil!'
    });
}

module.exports = {
    get_login,
    post_login,
    get_logout
}