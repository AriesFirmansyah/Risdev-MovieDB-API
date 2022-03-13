const  express = require('express');
const {body} = require('express-validator');

const router = express.Router();

const moviesController = require('../controllers/movies');

// POST : /v1/movies/post
router.post(
    '/postfavorite', 
    // Validation
    [
        body('title').isLength({min: 5}).withMessage(' input title tidak sesuai'),
        body('body').isLength({min: 5})
    ],
    moviesController.createMovie
);

module.exports = router;