const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');


const usersRoutes = require('./src/routes/user');
const authRoutes = require('./src/routes/auth');
const movieRoutes = require('./src/routes/movies');

const server = express();

server.use(bodyParser.json());
server.use(cors());

const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        callback(null, new Date().getTime() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, callback) => {
    if( file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg') {
            callback(null, true);
    } else {
        callback(null, false);
    }
}

server.use('/images', express.static(path.join(__dirname, 'images')));

server.use(
    multer({
        storage: fileStorage,
        fileFilter: fileFilter
    }).single('image')
);


server.use((req, res, next) => {
    console.log('server accessed...');
    next();
})

server.use('/v1/users', usersRoutes);
server.use('/v1/auth', authRoutes);
server.use('/v1/movies', movieRoutes);

// Error Message
server.use((error, req, res, next) => {
    const status = error.errorStatus || 500;
    const message = error.message;
    const data = error.data;

    res.status(status).json({
        message: message,
        data: data
    })
});

mongoose.connect('mongodb+srv://ariesfirmansyah:rH2gCOAzVtg6px3a@cluster0.uuvaw.mongodb.net/MovieDB?retryWrites=true&w=majority')
.then(() => {
    server.listen(4000, () => console.log('DB Connected'));
})
.catch(err => console.log(err));
