const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const authController = require('../controllers/auth');

router.post('/login', 
    // [
    //     body('fullname').isLength({min: 5}).withMessage('input fullname minimal 5 karakter'),
    //     body('password').isLength({min: 8}).withMessage('input password minimal 8 karakter'),
    //     body('phone_number').isLength({min: 11}).withMessage('phone number minimal 11 digits'),
    // ], 
    authController.login
);

router.post('/others-login', authController.othersLogin);

module.exports = router;