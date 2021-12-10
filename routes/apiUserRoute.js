const express = require('express');
const router = express.Router();
const { post_signup, post_signin, get_signout } = require("../controllers/apiUserController");

router.post('/auth/signup', post_signup);
router.post('/auth/signin', post_signin);
router.get('/auth/signout', get_signout);

module.exports = router;