const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');
const User = require('../models/user');
const images_path = './images';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res, next) => {
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

    const { 
        fullname,
        email, 
        password, 
        phone_number, 
        occupation, 
        region 
    } = req.body;

    const image = req.file.path;
    const hashedPassword = await bcrypt.hash(password, 12);
    // console.log(hashedPassword)

    const Users = new User({
        fullname        : fullname,
        email           : email,
        password        : hashedPassword,
        phone_number    : phone_number,
        image           : image,
        occupation      : occupation,
        region          : region,
    });

    User.find({ email }).countDocuments()
    .then((count) => {
        if (count !== 0) {
            cleanImage(req.file.path);
            res.status(400).json({
                message: "Email has been used, please login or input another value!",
            });
            next();
        } else {
            Users.save()
            .then((result) => {
                const token = jwt.sign(
                    { email: result.email, id: result._id },  
                    process.env.ACCESS_TOKEN,
                    { expiresIn: "1h" }
                );

                res.status(201).json({
                    message: "Create successed!",
                    data: result,
                    token: token,
                });
                // next();
            })
            .catch(err => {
                cleanImage(req.file.path);
                res.status(400).json({
                    message: "Error!",
                });
                // next(err);
            });
        }
    })
    .catch(err => {
        next(err);
    });

    
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
        next(err);
    });
};
exports.updateUser = (req, res, next) => {

    // Middleware
    if (!req.userId) return res.json({ message: "Unauthecticated! Please login." });

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        if(req.file) cleanImage(req.file.path);

        const err = new Error('Invalid Value');
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    const { 
        fullname,
        phone_number, 
        occupation, 
        region 
    } = req.body;

    const uid = req.params.userid;
    let image;

    if (req.file) image = req.file.path;

    User.findById(uid).countDocuments()
    .then((count) => {
        if(count === 0) {
            const err = new Error('User tidak ditemukan!');
            err.errorStatus = 404;
            throw err;
        } else {
            User.findById(uid)
            .then((user) => {
                if (!req.file) {
                    image = user.image;
                } 

                user.fullname        = fullname;
                user.phone_number    = phone_number;
                user.image           = image;
                user.occupation      = occupation;
                user.region          = region;
        
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
                next(err);
            })
        }
    })
    .catch((err) => {
        if (req.file) cleanImage(image);
        next(err);
    })
    
};

exports.deleteUser = (req, res, next) => {
    const uid = req.params.userid;

    // console.log(uid);

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
        next(err);
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
        console.log(err);
    })
    
}