const express               = require('express');
const router                = express.Router();
const { post_create, get_all, get_product_pagination }       = require("../controllers/apiProductController");

router.post('/create', post_create);
router.get('/view-all', get_all);
router.get('/pagination', get_product_pagination);

module.exports = router;