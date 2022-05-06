const  express = require('express');
const {body} = require('express-validator');

const router = express.Router();

const moviesController = require('../controllers/movie');

// POST : /v1/movie/
router.post('/userfavorite', moviesController.getUserMovies);
router.post('/favorite', moviesController.addMovie);
router.get('/favorite', moviesController.getAllMovie);
router.delete('/favorite', moviesController.deleteMovie);

module.exports = router;