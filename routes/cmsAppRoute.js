const express               = require('express');
const router                = express.Router();
const { 
    get_dashboard, 
    get_product, 
    get_createProduct, 
    get_viewProduct,
    get_updateProduct, 
    get_deleteProduct,
    delete_product,
    get_restock}        = require('../controllers/cmsAppController');

router.get('/dashboard', get_dashboard);
router.get('/product', get_product);
router.get('/product/create', get_createProduct);
router.get('/product/view', get_viewProduct);
router.get('/product/update', get_updateProduct);
router.get('/product/delete', get_deleteProduct);
router.get('/product/restock', get_restock);

module.exports = router;