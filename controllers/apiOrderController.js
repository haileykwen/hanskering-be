var request         = require("request");
var CryptoJS        = require("crypto-js");
var fetch           = require('node-fetch');
var db              = require("../models/db");
var jwt             = require("jsonwebtoken");
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
    let decodedToken    = jwt.verify(token, process.env.JWT_SECRET);
    let id_pembeli      = decodedToken.user_id;

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

    let getUserResp = await getUser(id_pembeli);
    let user = getUserResp[0];

    var apikey          = process.env.IPAYMU_API_KEY;
    var va              = process.env.IPAYMU_VA;
    var url             = 'https://sandbox.ipaymu.com/api/v2/payment/direct';

    var body            = {
        "name": user.fullname,
        "email": user.email,
        "phone":"081223456789",
        "amount":"5000",
        "notifyUrl": process.env.IPAYMU_NOTIFY_URL,
        "paymentMethod":"va",
        "paymentChannel":"bni",
    };

    var bodyEncrypt     = CryptoJS.SHA256(JSON.stringify(body));
    var stringtosign    = "POST:"+va+":"+bodyEncrypt+":"+apikey;
    var signature       = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(stringtosign, apikey));
    

    const request_order = () => {
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
        const { id_pesanan, id_pembeli, via, channel, expired, total, destination, kurir, status } = data;

        return new Promise((resolve, reject) => {
            db.query('INSERT INTO pesanan (id_pesanan, id_pembeli, via, channel, expired, total, destination, kurir, status)', [id_pesanan, id_pembeli, via, channel, expired, total, destination, kurir, status], (error, elements) => {
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

    let requestOrder = await request_order();
    if (requestOrder.Status === 200) {
        const data = {
            id_pesanan: requestOrder.TransactionId,
            id_pembeli,
            via: requestOrder.Via,
            channel: requestOrder.Channel,
            expired: requestOrder.Expired,
            total: requestOrder.Total,
            destination: JSON.stringify(destination),
            kurir: JSON.stringify(kurir),
            status: "pending"
        }
        
        const insertOrderResp = await insert_order(data);
        if (insertOrderResp) {
            let getOrderResp = await get_order(data.id_pesanan);
            if (getOrderResp) {
                let order = getOrderResp[0];
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
}

module.exports = {
    get_ongkir,
    post_order
}