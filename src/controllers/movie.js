const { validationResult } = require('express-validator');
const Movie = require('../models/movie');
const user = require('../models/user');

exports.addMovie = async (req, res, next) => {
    const {
        adult,
        backdrop_path,
        genre_ids,
        id,
        original_language,
        original_title,
        overview,
        popularity,
        poster_path,
        release_date,
        title,
        video,
        vote_average,
        vote_count
    } = req.body?.data?.movie ?? null;

    const { uid } = req.body?.data ?? null;

    if (uid && id !== null) {
        try {
            const exist = await Movie.findOne({ $and: [{movie_id: id}, {uid}]});

            if(!exist) {
                const addMovie = new Movie ({
                    adult,
                    backdrop_path,
                    genre_ids,
                    movie_id : id,
                    original_language,
                    original_title,
                    overview,
                    popularity,
                    poster_path,
                    release_date,
                    title,
                    video,
                    vote_average,
                    vote_count,
                    uid
                })
    
                addMovie.save()
                .then((newMovie) => {
                    res.status(200).json({
                        message: 'Movie added!',
                        movie: newMovie
                    });
                }).catch((err) => {
                    console.log(err)
                    res.status(400).json({
                        message: "Failed add movie to favorite!",
                        error: err.message
                    })
                })
                
            } else {
                res.status(400).json({
                    message: 'Movie had been added!',
                });
            }
    
            
        } catch (err) {
            res.status(400).json({
                message: "Error!",
                error: err
            })
        }
    } else {
        res.status(500).json({
            message: 'Object null',
            uid,
            id
        })
    }
}


exports.getAllMovie = (req, res, next) => {
    Movie.find({}, {"_id": 0, "movie_id": 1, "uid": 1})
    .then((result) => {
        res.status(200).json({
            message: "Get favorite movies successed!",
            data: result,
        });
    })
    .catch((error) => {
        console.log(error.message)
        res.status(400).json({
            message: "Get favorite error!",
            error: error
        });
    })
}

exports.getUserMovies = (req, res, next) => {
    const { uid } = req?.body ?? null;
    if (uid !== null) {
        Movie.find({ uid }, {"_id": 0})
        .then((results) => {
            res.status(200).json({
                message: 'Get user movies successed!',
                data: results,
            })
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Something went wrong!',
                error: err
            })
        })
    } else {
        res.status(500).json({
            message: 'User ID is null!',
        })
    }
}
exports.deleteMovie = async (req, res, next) => {
    const { id, uid } = req?.body ?? null;

    if (uid && id !== null) {
        try {
            const exist = await Movie.findOne({ $and: [{movie_id: id}, {uid}]});
            if(exist) {
                Movie.findByIdAndRemove(exist._id)
                .then(() => {
                    res.status(200).json({
                        message: 'Movie deleted!',
                    })
                }).catch((err) => {
                    res.status(400).json({
                        message: "Delete error!",
                        error: err
                    })
                }) 
            } else {
                res.status(400).json({
                    message: "Movie does not exist!"
                })
            }
        } catch (err) {
            res.status(400).json({
                message: "Delete error!",
                error: err
            })
        }
    } else {
        res.status(400).json({
            message: "Delete error!"
        })
    }
}