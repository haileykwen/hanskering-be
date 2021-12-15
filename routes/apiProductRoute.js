const express = require('express');
const router = express.Router();
const { post_create, get_all, get_product_pagination, put_update, delete_product, put_restock, get_product } = require("../controllers/apiProductController");

router.post('/create', post_create);
router.get('/view', get_product);
router.get('/view-all', get_all);
router.get('/pagination', get_product_pagination);
router.put('/update', put_update);
router.delete('/delete', delete_product);
router.put('/restock', put_restock);

module.exports = router;