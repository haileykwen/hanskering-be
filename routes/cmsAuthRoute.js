const express = require('express');
const router = express.Router();
const { get_login, post_login, get_logout } = require('../controllers/cmsAuthController');
const { requireUnauth } = require('../middlewares/cmsAuthMiddleware');

router.get('/login', requireUnauth, get_login);
router.post('/login', requireUnauth, post_login);
router.get('/logout', get_logout);

module.exports = router;