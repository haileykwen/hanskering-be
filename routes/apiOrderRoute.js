const express = require('express');
const router = express.Router();
const { get_ongkir, post_order, get_userOrder, get_order, notify } = require('../controllers/apiOrderController');
const { requireAuth } = require('../middlewares/cmsAuthMiddleware');

router.post('/', requireAuth, post_order);
router.get('/', requireAuth, get_order);
router.get('/ongkir', requireAuth, get_ongkir);
router.get('/user', requireAuth, get_userOrder);
router.post('/notify', notify);

module.exports = router;