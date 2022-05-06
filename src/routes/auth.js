const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const authController = require('../controllers/auth');

router.post('/login', authController.login);
router.post('/google-login', authController.googleAuthentication);
router.post('/facebook-login', authController.facebookAuthentication);

module.exports = router;