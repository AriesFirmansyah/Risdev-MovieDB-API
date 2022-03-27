const express = require('express');
const {body} = require('express-validator');

const router = express.Router();

const usersController = require('../controllers/user');

router.post('/create', 
    // Validation
    [
        body('name').isLength({min: 5}).withMessage(' input nama tidak sesuai'),
        body('body').isLength({min: 5}).withMessage(' input body tidak sesuai'),
    ],    
    usersController.createUser
);
router.get('/users', usersController.getAllUser);


// router.use('/users', (req, res, next) => {
//     console.log('request url : ', req.originalUrl);
//     console.log('request method : ', req.method);

//     res.json({
//         name : "Aries Firmansyah"
//     });
    
//     next();
// })

module.exports = router;