const express = require('express');
const router = express.Router();
const { get_ongkir, post_order, get_userOrder, get_order, notify } = require('../controllers/apiOrderController');

router.post('/', post_order);
router.get('/', get_order);
router.get('/ongkir', get_ongkir);
router.get('/user', get_userOrder);
router.post('/notify', notify);

module.exports = router;