const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const Movie = new Schema({
    adult: {
        type: Boolean,
        required: true,
    },
    backdrop_path: {
        type: String,
        required: true,
    },
    genre_ids: {
        type: Array,
        required: true,
    },
    movie_id: {
        type: String,
        required: true,
        index: true,
        unique: false
    },
    original_language: {
        type: String,
        required: true,
    },
    original_title: {
        type: String,
        required: true,
    },
    overview: {
        type: String,
        required: true,
    },
    popularity: {
        type: Number,
        required: true,
    },
    poster_path: {
        type: String,
        required: true,
    },
    release_date: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    video: {
        type: Boolean,
        required: true,
    },
    vote_average: {
        type: Number,
        required: true,
    },
    vote_count: {
        type: Number,
        required: true,
    },
    uid: {
        type: String,
        require: true,
        // unique: false,
        // index: true
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Movie', Movie);