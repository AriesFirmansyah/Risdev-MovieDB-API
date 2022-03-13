const express = require('express');

const router = express.Router();

const usersController = require('../controllers/users');

router.post('/create', usersController.createUser);
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