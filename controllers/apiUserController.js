const db = require("../models/db");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require("jsonwebtoken");
require('dotenv').config();

const post_signup = (req, res) => {
    let { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        res.status(400).json({
            status: 400,
            message: "Ooops, data kamu belum lengkap. Lengkapi dulu yuk!"
        });
    }

    const sql = "SELECT * FROM pembeli where email = ?";
    db.query(sql, email, (error, success) => {
        if (error) {
            res.status(500).json({
                status: 500,
                message: "Server Error"
            });
        }

        if (success) {
            if (success.length > 0) {
                res.status(400).json({
                    status: 400,
                    message: "Email sudah digunakan, harap gunakan email lain"
                })
            } else {
                const id_pembeli = uuidv4();
                const hash = bcrypt.hashSync(password, saltRounds);
                const sqlCreate = "INSERT INTO pembeli (id_pembeli, fullname, email, password) VALUES (?, ?, ?, ?)";
            
                db.query(sqlCreate, [id_pembeli, fullname, email, hash], (error, success) => {
                    if (error) {
                        res.status(500).json({
                            status: 500,
                            message: "Server Error"
                        });
                    }

                    if (success) {
                        const token = jwt.sign({user_id: id_pembeli}, process.env.JWT_SECRET);
                        const maxAge = 3 * 24 * 60 * 60;
                        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                        res.status(200).json({
                            status: 200,
                            message: "Yeay! Akun kamu berhasil dibuat, lanjut belanja sepatu kecenya yuk!",
                            token
                        });
                    }
                });
            }
        }
    });
}

const post_signin = (req, res) => {
    const { email, password } = req.body;

    if ( !email || !password) {
        res.status(400).json({
            status: 400,
            message: "Ooops, data kamu belum lengkap. Lengkapi dulu yuk!"
        });
    }

    const sql = "SELECT * FROM pembeli where email = ?";
    db.query(sql, email, (error, success) => {
        if (error) {
            res.status(500).json({
                status: 500,
                message: "Server Error"
            });
        }

        if (success) {
            if (success.length === 0) {
                res.status(400).json({
                    status: 400,
                    message: "Ooops, email kamu belum terdaftar. Yuk daftar dulu!"
                })
            } else {
                const data = success[0];
                const hash = data.password;

                const isMatch = bcrypt.compareSync(password, hash);

                if (isMatch) {
                    const token = jwt.sign({user_id: data.id_pembeli}, process.env.JWT_SECRET);
                    const maxAge = 3 * 24 * 60 * 60;
                    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                    res.status(200).json({
                        status: 200,
                        message: "Yuhuuu! Lanjut belanja yuk!",
                        token
                    });
                } else {
                    res.status(400).json({
                        status: 400,
                        message: "Ooops, kata sandi yang kamu masukkan salah"
                    })
                }
            }
        }
    });
}

const get_signout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({
        status: 200,
        message: 'Logout berhasil, nanti mampir lagi yak!'
    });
}

module.exports = {
    post_signup,
    post_signin,
    get_signout
}