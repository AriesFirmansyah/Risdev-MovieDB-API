const { validationResult } = require('express-validator');
const User = require('../models/user');

exports.createUser = (req, res, next) => {
    // ERROR HANDLING
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const err = new Error('Invalid Value');
        err.ErrorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    if(!req.file) {
        const err = new Error('Image harus di upload');
        err.ErrorStatus = 422;
        throw err;
    }

    const name = req.body.name;
    const body = req.body.body;
    const image = req.file.path;

    const Users = new User({
        name: name,
        body: body,
        image: image
    });

    Users.save()
    .then((results) => {
        const result = {
            message: "Create successed!",
            data: results
        }
    
        res.status(201).json(result);
        next();
    })
    .catch(err => {
        console.log(err);
    });
    // next();
};
exports.getAllUser = (req, res, next) => {
    res.json({
        message: 'get successed',
        data: {
            id: 1,
            name: 'tes'
        }
    });
    next();
};