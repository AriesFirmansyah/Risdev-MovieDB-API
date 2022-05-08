const  express = require('express');
const {body} = require('express-validator');

const router = express.Router();

const moviesController = require('../controllers/movie');
const auth = require('../middleware/auth');

// POST : /v1/movie/
router.post('/userfavorite', auth, moviesController.getUserMovies);
router.post('/favorite', auth, moviesController.addMovie);
router.get('/favorite', moviesController.getAllMovie);
router.delete('/favorite', auth, moviesController.deleteMovie);

module.exports = router;