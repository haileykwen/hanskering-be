const express               = require('express');
const router                = express.Router();
const { 
    get_dashboard, 
    get_product, 
    get_createProduct }     = require('../controllers/cmsAppController');

router.get('/dashboard', get_dashboard);
router.get('/product', get_product);
router.get('/product/create', get_createProduct);

module.exports = router;