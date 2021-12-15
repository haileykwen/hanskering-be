var request = require("request");
require('dotenv').config();

const get_ongkir = (req, res) => {
    let { weight } = req.query;
    weight = parseInt(weight);

    var options = {
        method: 'POST',
        url: 'https://api.rajaongkir.com/starter/cost',
        headers: {key: process.env.RAJAONGKIR_API_KEY, 'content-type': 'application/x-www-form-urlencoded'},
        form: {origin: '501', destination: '114', weight: weight*1000, courier: 'jne'}
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        body = JSON.parse(body);
        res.json({body});
    });
}

module.exports = {
    get_ongkir
}