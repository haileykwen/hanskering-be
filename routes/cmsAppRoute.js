const express               = require('express');
const router                = express.Router();
const { get_dashboard }     = require('../controllers/cmsAppController');

router.get('/dashboard', get_dashboard);

module.exports = router;