const express = require('express');
const router = express.Router();
const { post_signup, post_signin, get_signout, put_cart, get_cart, delete_cart, get_userData } = require("../controllers/apiUserController");

router.post('/auth/signup', post_signup);
router.post('/auth/signin', post_signin);
router.get('/auth/signout', get_signout);

router.get('/profile', get_userData);
router.put('/profile/cart', put_cart);
router.get('/profile/cart', get_cart);
router.delete('/profile/cart', delete_cart);

module.exports = router;