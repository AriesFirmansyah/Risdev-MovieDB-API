const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone_number: {
        type: Number,
        required: true
    },
    image : {
        type: String,
        require: true
    },
    occupation: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    google: {
        type: Boolean,
        required: false
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('User', User);