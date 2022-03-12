const express = require('express');

const server = express();
// const router = express.Router();

const usersRoutes = require('./src/routes/users');


// Ketika ada yang akses url server (localhost:4000)
server.use((req, res, next) => {
    console.log('server accessed...');

    // Mengatasi CORS dengan URL specific
    res.setHeader('Access-Control-Allow-Origin', 'url')

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

server.use('/', usersRoutes);

server.listen(4000, () => {
    console.log('server running...');
});