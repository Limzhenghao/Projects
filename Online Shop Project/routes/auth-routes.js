const express = require('express');
const authController = require('../controllers/auth-controller');

const router = express.Router();

router.get('/signup', authController.userSignUpForm);

router.get('/login', authController.userLoginForm);

router.post('/signup', authController.userSignUpFunction);

router.post('/login', authController.userLoginFunction);

router.post('/logout', authController.userLogoutFunction);

module.exports = router;