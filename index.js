const express = require('express');
const bodyParser = require('body-parser');

const server = express();
// const router = express.Router();

const usersRoutes = require('./src/routes/users');
const authRoutes = require('./src/routes/auth');
const movieRoutes = require('./src/routes/movies');

server.use(bodyParser.json());

// Ketika ada yang akses url server (localhost:4000)
server.use((req, res, next) => {
    console.log('server accessed...');

    // Manual CORS atau bisa install CORS

    // Mengatasi CORS dengan URL specific
    // res.setHeader('Access-Control-Allow-Origin', 'url')

    // Mengatasi CORS dengan all url
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods', 
        'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    )


    // Jika tidak menggunakan next, router lain tidak akan dijalankan (stuck)
    next();
})

server.use('/v1/users', usersRoutes);
server.use('/v1/auth', authRoutes);
server.use('/v1/movies', movieRoutes);

// Set Error Message
server.use((error, req, res, next) => {
    const status = error.errorStatus || 500;
    const message = error.message;
    const data = error.data;

    res.status(status).json({
        message: message,
        data: data
    })
})

server.listen(4000, () => {
    console.log('server running...');
});