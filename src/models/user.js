const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    name: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true
    },
    image : {
        type: String,
        require: true
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('User', User);