require('dotenv').config()

const { validationResult } = require('express-validator');

const path = require('path');
const fs = require('fs');

const User = require('../models/user');
const user_controller = require('./user');
const images_path = './images';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.OAuth2Client);

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    
    try {
        const exist = await User.findOne({ email });

        if(!exist) return res.status(404).json({
            message: "User doesn't exist!"
        })

        const isPasswordCorrect = await bcrypt.compare(password, exist.password);

        if (!isPasswordCorrect) return res.status(400).json({
            message: "Invalid credentials!"
        })

        const token = jwt.sign(
            { email: exist.email, id: exist._id },  
            process.env.ACCESS_TOKEN,
            { expiresIn: "1h" }
        );
        
        res.status(200).json({ result: exist, token})
    } catch (err) {
        res.status(500).json({ message: "Something went wrong! "})
    }

}

exports.othersLogin = (req, res, next) => {
    const tokenId = req.body.data.token;

    client.verifyIdToken({idToken: tokenId, audience: process.env.OAuth2Client})
    .then(async (result) => {
        const {
            email_verified, 
            email,
            name,
            picture,
        } = result.payload;
        
        if (email_verified) {
            const exist = await User.findOne({ email });
            if(exist) {
                const {_id, fullname, email} = exist;
                const token = jwt.sign(
                    { email: exist.email, id: exist._id },  
                    process.env.ACCESS_TOKEN,
                    { expiresIn: "1h" }
                );
                res.status(200).json({
                    message: 'Login successed!',
                    data : {
                        id : _id,
                        name : fullname,
                        email : email,
                        token : token
                    }
                });
            } else {
                const password = email+process.env.PASSWORD_KEY;
                const hashedPassword = await bcrypt.hash(password, 12);
                const phone_number = "0123456789101112";
                console.log(hashedPassword);
                const createUser = new User({
                    fullname        : name,
                    email           : email,
                    password        : hashedPassword,
                    phone_number    : phone_number,
                    image           : picture,
                    occupation      : 'none',
                    region          : 'none',
                    google          : true
                });
                
                const createSuccessed = await createUser.save();
                res.status(201).json({
                    message: "Create successed!",
                    data: createSuccessed,
                });

            }
        }
    })
    .catch(err => {
        console.log('Error', err);
        res.status(500).json({ 
            message: "Login Error! ",
            error: err
        })
    })
}

exports.register = (req, res, next) => {

    next();
}
