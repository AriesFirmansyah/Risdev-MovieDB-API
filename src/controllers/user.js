const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');
const User = require('../models/user');
const user = require('../models/user');
const images_path = './images';

exports.createUser = (req, res, next) => {
    // ERROR HANDLING
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        if(req.file) cleanImage(req.file.path);

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
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 5;
    let totalData; 

    User.find().countDocuments()
    .then((count) => {
        totalData = count;
        return User.find()
        .skip((parseInt(currentPage) - 1) * parseInt(perPage))
        .limit(parseInt(perPage));
    })
    .then((result) => {
        res.status(200).json({
            message: "Get user successed!",
            data: result,
            total_data: totalData,
            data_per_page: parseInt(perPage),
            current_page: parseInt(currentPage)
        });
    })
    .catch((error) => {
        next(error);
    })
   
};
exports.getUserById = (req, res, next) => {
    const uid = req.params.userid;

    User.findById(uid)
    .then((result) => {
        if (!result) {
            const err = new Error('User tidak ditemukan!');
            err.errorStatus = 404;
            throw err;
        }
        res.status(200).json({
            message: "Get user by id successed!",
            data: result
        });
    })
    .catch((err) => {
        res.status(400).json({
            message: 'User id tidak valid!',
            data: err
        })
        next();
    });
};
exports.updateUser = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        if(req.file) cleanImage(req.file.path);
        
        const err = new Error('Invalid Value');
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    if(!req.file) {
        const err = new Error('Image harus di upload');
        err.errorStatus = 422;
        throw err;
    }

    const name = req.body.name;
    const body = req.body.body;
    const image = req.file.path;
    const uid = req.params.userid;

    // console.log(req.file.path);

    User.findById(uid)
    .then((user) => {
        if (!user) {
            const err = new Error('User tidak ditemukan!');
            err.errorStatus = 404;
            throw err;
        }

        user.name = name;
        user.body = body;
        user.image = image;

        return user.save();
    })
    .then((result) => {
        cleanImagesDirectory();
        const response = {
            message: "Update successed!",
            data: result
        }
        res.status(200).json(response);
    })
    .catch((err) => {
        cleanImage(image);
        res.status(400).json({
            message: 'User id tidak valid!',
            data: err
        });
        next();
    })
};

exports.deleteUser = (req, res, next) => {
    const uid = req.params.userid;

    console.log(uid);

    User.findById(uid)
    .then((user) => {
        if (!user) {
            const err = new Error('User tidak ditemukan!');
            err.errorStatus = 404;
            throw err;
        }
        cleanImage(user.image);
        return User.findByIdAndRemove(uid);
    })
    .then((result) => {
        res.status(200).json({
            message: 'User deleted!',
            data: result
        })
    })
    .catch((err) =>  {
        res.status(400).json({
            message: 'User id tidak valid!',
            data: err
        });
        next();
    })
}

const cleanImage = (filePath) => {
    filePath = path.join(__dirname, '../..', filePath);
    fs.unlink(filePath, (err) => {
        console.log(err)
    });
}

const cleanImagesDirectory = () => {
    let data;

    User.find()
    .then((user) => {
        data = user;
    })
    .then(() => {
        fs.readdir(images_path, (err, files) => {
            files.forEach(file => {
                let temp = data.find(item => item.image === `images\\${file}`);
                if(!temp) {
                    cleanImage(`images\\${file}`);
                }
            });
          });
    })
    .catch((err) => {
        console.log('tes');
    })
    
}