const express = require('express');
const router = express.Router();
const { get_ongkir } = require('../controllers/apiOrderController');

router.get('/ongkir', get_ongkir);

module.exports = router;