const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const userController = require('../controllers/user');
const auth = require('../middleware/auth');

router.post('/create', 
    // Validation
    [
        body('fullname').isLength({min: 5}).withMessage('input fullname minimal 5 karakter'),
        body('password').isLength({min: 8}).withMessage('input password minimal 8 karakter'),
        body('phone_number').isLength({min: 11}).withMessage('phone number minimal 11 digits'),
    ],    
    userController.createUser
);
router.get('/getusers', userController.getAllUser);
router.get('/getuser/:userid', userController.getUserById);
router.put('/updateuser/:userid', 
    auth,
    [
        body('fullname').isLength({min: 5}).withMessage('input fullname minimal 5 karakter'),
        // body('phone_number').isLength({min: 11}).withMessage('phone number minimal 11 digits'),
    ],    
    userController.updateUser
);
router.delete('/delete/:userid', auth, userController.deleteUser);

module.exports = router;