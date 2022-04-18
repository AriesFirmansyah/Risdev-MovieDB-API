const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const moment = require('moment');
const fs = require('fs');

const usersRoutes = require('./src/routes/user');
const authRoutes = require('./src/routes/auth');
const movieRoutes = require('./src/routes/movies');

const dbConnectAtlas = 'mongodb+srv://ariesfirmansyah:rH2gCOAzVtg6px3a@cluster0.uuvaw.mongodb.net/MovieDB?retryWrites=true&w=majority';
const dbConnectLocal = 'mongodb://localhost:27017/MovieDB';

const PORT = process.env.PORT ?? 4000;

const server = express();

server.use(bodyParser.json());
server.use(cors());

const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const date = new Date().getTime();
        const imageName = moment(date).format('LL') + ' - ' + date + file.originalname;
        callback(null, imageName.toString());
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

server.use('/v1/user', usersRoutes);
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

mongoose.connect(dbConnectLocal)
.then(() => {
    server.listen(PORT, () => console.log('DB Connected'));
})
.catch(err => console.log(err));
