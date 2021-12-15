const db = require("../models/db");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const res = require("express/lib/response");
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

const put_cart = (req, res) => {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, 'skidipapap');
    const { kode_barang, size } = req.body;
    
    if (decodedToken.user_id) {
        id_pembeli = decodedToken.user_id;

        const sql = "SELECT * FROM pembeli WHERE id_pembeli = ?";
        db.query(sql, id_pembeli, (error, success) => {
            if (error) {
                res.status(500).json({
                    status: 500,
                    message: "Server Error",
                    process: "Get user data"
                });
            }

            let isOnCart = false;
            if (success && success.length > 0) {
                const user = success[0];
                let cart = user.keranjang;

                if (cart) {
                    cart = JSON.parse(cart);

                    cart.map(data => {
                        if (data["kode_barang"] === kode_barang) {
                            isOnCart = true;
                        }
                    })

                    const data = {
                        kode_barang,
                        size
                    }
                    cart.push(data);
                    cart = JSON.stringify(cart);
                } else {
                    const data = {
                        kode_barang,
                        size
                    }
                    cart = [];
                    cart.push(data);
                    cart = JSON.stringify(cart);
                }

                if (isOnCart) {
                    res.status(400).json({
                        status: 400,
                        message: "Produk sudah ada dalam keranjang"
                    });
                } else {
                    const sqlUpdateCart = "UPDATE pembeli SET keranjang = ? WHERE id_pembeli = ?";
                    db.query(sqlUpdateCart, [cart, id_pembeli], (error, success) => {
                        if (error) {
                            res.status(500).json({
                                status: 500,
                                message: "Server Error",
                                process: "Update cart"
                            });
                        }

                        if (success) {
                            res.status(200).json({
                                status: 200,
                                message: "Produk telah disimpan ke keranjang",
                            });
                        } else {
                            res.status(500).json({
                                status: 500,
                                message: "Server Error",
                                process: "Update cart with success condition"
                            });
                        }
                    });
                }
            }
        });
    }
}

const get_cart = (req, res) => {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, 'skidipapap');
    const id_pembeli = decodedToken.user_id;
    
    const sql = "SELECT * FROM pembeli WHERE id_pembeli = ?";
    db.query(sql, id_pembeli, async (error, success) => {
        if (error) {
            res.status(500).json({
                status: 500,
                message: "Server Error",
                process: "Get user base on token"
            });
        }

        const getCart = (id) => {
            return new Promise((resolve, reject)=>{
                db.query('SELECT * FROM barang WHERE kode_barang = ?', id,  (error, elements)=>{
                    if(error){
                        return reject(error);
                    }
                    return resolve(elements);
                });
            });
        };

        if (success && success.length > 0) {
            let respCart = JSON.parse(success[0].keranjang);
            let delivCart = [];

            for (let i = 0; i <= respCart.length; i++) {
                if (i === respCart.length) {
                    res.status(200).json({
                        status: 200,
                        message: 'Get cart successful',
                        data: delivCart
                    });
                } else {
                    let getData = await getCart(respCart[i].kode_barang);
                    let data = getData[0];
                    data.size = JSON.parse(data.size);
                    data.wantSize = respCart[i].size;
                    data.qty = 1;
                    data.available = data.size[data.wantSize] !== "0" && data.size[data.wantSize] !== "" ? true : false;
                    delivCart.push(data);
                }
            }
        } else {
            res.status(500).json({
                status: 500,
                message: "Server Error",
                process: "Get user base on token success case"
            });
        }
    });
}

const delete_cart = async (req, res) => {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, 'skidipapap');
    const id_pembeli = decodedToken.user_id;
    const { kode_barang } = req.query;

    const getUserData = (id) => {
        return new Promise((resolve, reject)=>{
            db.query('SELECT * FROM pembeli WHERE id_pembeli = ?', id,  (error, elements)=>{
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    const updateUserCart = (cart, user_id) => {
        return new Promise((resolve, reject)=>{
            db.query('UPDATE pembeli SET keranjang = ? WHERE id_pembeli = ?', [cart, user_id],  (error, elements)=>{
                if(error){
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    if ( !kode_barang ) {
        res.status(400).json({
            status: 400,
            message: "kode_barang were not provided"
        });
    } else {
        const getUserDataResp = await getUserData(id_pembeli);
        let userData = getUserDataResp[0];
        userData.keranjang = JSON.parse(userData.keranjang);

        let keranjang = userData.keranjang;
        let targetDelete = keranjang.findIndex(x => x.kode_barang === kode_barang);

        if (targetDelete > -1 && targetDelete <= keranjang.length) {
            keranjang.splice(targetDelete, 1);
            keranjang = JSON.stringify(keranjang);
            const updateUserCartResp = await updateUserCart(keranjang, id_pembeli);

            if (updateUserCartResp.affectedRows) {
                res.status(200).json({
                    status: 200,
                    message: "Produk telah dihapus dari keranjang"
                });
            } else {
                res.status(500).json({
                    status: 500,
                    message: "Produk gagal dihapus dari keranjang"
                });
            }
        } else {
            res.status(400).json({
                status: 400,
                message: "Product tidak ada dalam keranjang"
            });
        }
    }
}

module.exports = {
    post_signup,
    post_signin,
    get_signout,
    put_cart,
    get_cart,
    delete_cart
}