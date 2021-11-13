const express               = require('express');
const router                = express.Router();
const { post_create }       = require("../controllers/apiProductController");

router.post('/create', post_create);

module.exports = router;