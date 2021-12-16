const express = require('express');
const router = express.Router();
const { get_ongkir, post_order } = require('../controllers/apiOrderController');

router.post('/', post_order);
router.get('/ongkir', get_ongkir);

module.exports = router;