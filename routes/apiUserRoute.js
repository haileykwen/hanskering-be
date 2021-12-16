const express = require('express');
const router = express.Router();
const { post_signup, post_signin, get_signout, put_cart, get_cart, delete_cart, get_userData, get_province, get_city, put_address, put_telepon } = require("../controllers/apiUserController");

router.post('/auth/signup', post_signup);
router.post('/auth/signin', post_signin);
router.get('/auth/signout', get_signout);

router.get('/profile', get_userData);
router.put('/profile/cart', put_cart);
router.get('/profile/cart', get_cart);
router.delete('/profile/cart', delete_cart);
router.get('/profile/province', get_province);
router.get('/profile/city', get_city);
router.put('/profile/address', put_address);
router.put('/profile/phone', put_telepon);

module.exports = router;