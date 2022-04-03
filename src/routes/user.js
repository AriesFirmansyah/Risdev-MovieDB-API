const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const userController = require('../controllers/user');

router.post('/create', 
    // Validation
    [
        body('name').isLength({min: 5}).withMessage(' input nama tidak sesuai'),
        body('body').isLength({min: 5}).withMessage(' input body tidak sesuai'),
    ],    
    userController.createUser
);
router.get('/getusers', userController.getAllUser);
router.get('/getuser/:userid', userController.getUserById);
router.put('/updateuser/:userid', 
    [
        body('name').isLength({min: 5}).withMessage(' input nama tidak sesuai'),
        body('body').isLength({min: 5}).withMessage(' input body tidak sesuai'),
    ],   
    userController.updateUser
);
router.delete('/delete/:userid', userController.deleteUser);

module.exports = router;