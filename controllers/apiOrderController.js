var request         = require("request");
var CryptoJS        = require("crypto-js");
var fetch           = require('node-fetch');
var db              = require("../models/db");
var jwt             = require("jsonwebtoken");
var moment          = require('moment');
require('dotenv').config();

const get_ongkir = (req, res) => {
    let { weight, destination } = req.query;
    weight = parseInt(weight);

    if (weight && destination) {
        var options = {
            method: 'POST',
            url: 'https://api.rajaongkir.com/starter/cost',
            headers: {key: process.env.RAJAONGKIR_API_KEY, 'content-type': 'application/x-www-form-urlencoded'},
            form: {origin: '152', destination: destination, weight: weight*1000, courier: 'jne'}
        };
    
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
    
            body = JSON.parse(body);
            res.json({body});
        });
    } else {
        res.status(400).json({
            status: 400,
            message: 'Parameter weight dan destination tidak boleh kosong'
        });
    }
}

const post_order = async (req, res) => {
    let token           = req.headers.authorization;
    let { amount, paymentMethod, paymentChannel, items, kurir } = req.body;

    const getUser = (id_pembeli) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM pembeli WHERE id_pembeli = ?', id_pembeli, (error, elements) => {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    const request_order = (va, signature, body) => {
        return new Promise((resolve, reject) => {
            fetch(
                url,
                {
                    method: "POST",
                    headers: {
                        Accept: 'application/json', 'Content-Type': 'application/json',
                        va: va,
                        signature: signature
                },
                    body: JSON.stringify(body)
                }
            )
                .then((response) => response.json())
                .then((responseJson) => {
                    return resolve(responseJson);
                })
                .catch((error) => {
                    return reject(error);
                });
        });
    };

    const insert_order = (data) => {
        const { id_pesanan, id_pembeli, items, via, channel, payment_number, expired, total, destination, kurir, status } = data;

        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO pesanan (id_pesanan, id_pembeli, items, via, channel, payment_number, expired, total, destination, kurir, status) VALUES(? ,? ,?, ? ,? , ?, ? ,? ,? ,? ,?)'
            db.query(sql, [id_pesanan, id_pembeli, items, via, channel, payment_number, expired, total, destination, kurir, status], (error, elements) => {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    const get_order = (id_pesanan) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM pesanan WHERE id_pesanan = ?', id_pesanan, (error, elements) => {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    const updateUserCart = (cart, user_id) => {
        return new Promise((resolve, reject) => {
            db.query('UPDATE pembeli SET keranjang = ? WHERE id_pembeli = ?', [cart, user_id], (error, elements) => {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    if (!token) {
        res.status(401).json({
            status: 401,
            message: 'Kamu tidak ter autorisasi'
        });
    }

    if (!amount || !paymentMethod || !paymentChannel || !items || !kurir) {
        res.status(400).json({
            status: 400,
            message: 'Data tidak lengkap'
        });
    }

    if (token && amount && paymentMethod && paymentChannel && items && kurir) {
        let decodedToken    = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decodedToken) {
            let id_pembeli      = decodedToken.user_id;
            items = JSON.stringify(items);
            kurir = JSON.stringify(kurir);

            let getUserResp = await getUser(id_pembeli);
            let user = getUserResp[0];

            var apikey          = process.env.IPAYMU_API_KEY;
            var va              = process.env.IPAYMU_VA;
            var url             = 'https://sandbox.ipaymu.com/api/v2/payment/direct';

            var body            = {
                "name": user.fullname,
                "email": user.email,
                "phone": user.telepon,
                "amount": amount,
                "notifyUrl": process.env.IPAYMU_NOTIFY_URL,
                "paymentMethod": paymentMethod,
                "paymentChannel": paymentChannel,
            };

            var bodyEncrypt     = CryptoJS.SHA256(JSON.stringify(body));
            var stringtosign    = "POST:"+va+":"+bodyEncrypt+":"+apikey;
            var signature       = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(stringtosign, apikey));

            let requestOrder = await request_order(va, signature, body);
            if (requestOrder.Status === 200) {
                const data = {
                    id_pesanan: requestOrder.Data.TransactionId,
                    id_pembeli,
                    items,
                    via: requestOrder.Data.Via,
                    channel: requestOrder.Data.Channel,
                    payment_number: requestOrder.Data.PaymentNo,
                    expired: requestOrder.Data.Expired,
                    total: amount,
                    destination: user.alamat,
                    kurir,
                    status: "pending"
                }
                
                const insertOrderResp = await insert_order(data);
                if (insertOrderResp) {
                    let getOrderResp = await get_order(data.id_pesanan);

                    if (getOrderResp) {
                        let cart = JSON.parse(user.keranjang);
                        items = JSON.parse(items);
                        let barang = items.items;

                        let ids = [];
                        barang.map(item => {
                            return ids.push(item.kode_barang);
                        });

                        ids.map(id => {
                            let targetDelete = cart.findIndex(x => x.kode_barang === id);
                            if (targetDelete > -1 && targetDelete <= cart.length) {
                                cart.splice(targetDelete, 1);
                            }
                        });

                        await updateUserCart(JSON.stringify(cart), id_pembeli);
                    }

                    if (getOrderResp) {
                        let order = getOrderResp[0];
                        order.destination = JSON.parse(order.destination);
                        order.kurir = JSON.parse(order.kurir);
                        order.items = JSON.parse(order.items);

                        res.status(200).json({
                            status: 200,
                            message: "Pesanan kamu berhasil dibuat",
                            data: order
                        });
                    }
                }
            } else {
                res.status(500).json({
                    status: 500,
                    message: "Mohon maaf, server sedang tidak bisa melakukan proses order saat ini. Silahkan coba lagi nanti",
                    process: "POST data ke ipaymu"
                });
            }
        } else {
            res.status(401).json({
                status: 401,
                message: 'Kamu tidak ter autorisasi'
            });
        }
    }
}

const get_userOrder = async (req, res) => {
    let token           = req.headers.authorization;

    const get_userOrder = (id_pembeli) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM pesanan WHERE id_pembeli = ?', id_pembeli, (error, elements) => {
                if (error) {
                    return reject(error);
                }
                return resolve(elements);
            });
        });
    };

    if (token) {
        let decodedToken    = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decodedToken) {
            let id_pembeli = decodedToken.user_id;
            let orders = await get_userOrder(id_pembeli);
            if (orders && orders.length > 0) {
                res.status(200).json({
                    status: 200,
                    data: orders
                });
            } else {
                res.status(400).json({
                    status: 400,
                    message: "Kamu belum punya pesanan"
                });
            }
        } else {
            res.status(401).json({
                status: 401,
                message: 'Kamu tidak ter autorisasi'
            });
        }

    } else {
        res.status(401).json({
            status: 401,
            message: 'Kamu tidak ter autorisasi'
        });
    }
}

const get_order = (req, res) => {
    const { id_pesanan } = req.query;
    const sql = 'SELECT * FROM pesanan WHERE id_pesanan = ?';
    db.query(sql, id_pesanan, (error, success) => {
        if (error) {
            res.status(500).json({
                status: 500,
                message: 'Server Error',
                prcess: 'Get pesanan'
            });
        }

        if (success) {
            let data = success[0];
            data.destination = JSON.parse(data.destination);
            data.items = JSON.parse(data.items);
            data.kurir = JSON.parse(data.kurir);
            data.items = data.items.items;
            res.status(200).json({
                status: 200,
                data: data
            });
        }
    });
}

const notify = (req, res) => {
    const { trx_id, sid, status, via } = req.body;
    if (status === 'berhasil') {
        const paid_on = moment().format('DD-MM-YYYY hh:mm:ss');
        const sql = "UPDATE pesanan SET paid_on = ? AND status = ? WHERE id_pesanan = ?";
        db.query(sql, [paid_on, "success", trx_id], (error, success) => {
            if (error) {
                res.status(500).json({
                    status: 500,
                    message: "Server error. Cannot update pesanan right now"
                });
            }

            if (success) {
                res.status(200).json({
                    status: 200,
                    message: `Pembayaran untuk pesanan ${trx_id} berhasil`,
                    data: { trx_id, sid, status, via }
                });
            }
        });
    }
}

module.exports = {
    get_ongkir,
    post_order,
    get_userOrder,
    get_order,
    notify
}