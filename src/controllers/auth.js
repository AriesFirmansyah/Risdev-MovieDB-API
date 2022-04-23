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

const axios = require('axios');


exports.login = async (req, res, next) => {
    const email = req?.body?.data?.email ?? null;
    const password  = req?.body?.data?.password ?? null;

    
    if (email && password !== null) {
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
            
            res.status(200).json({ 
                message: 'Login successed!',
                profile: {
                    fullname: exist.fullname,
                    email: exist.email,
                    phone_number: exist.phone_number,
                    image : exist.image,
                    occupation: exist.occupation,
                    region: exist.region,
                }, 
                token: token,
                isAuth: true
            })
        } catch (err) {
            res.status(500).json({ message: "Something went wrong! "});
        }
    } else {
        res.status(500).json({ message: "Something went wrong! "});
    }

}

exports.googleAuthentication = (req, res, next) => {
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
                const token = jwt.sign(
                    { email: exist.email, id: exist._id },  
                    process.env.ACCESS_TOKEN,
                    { expiresIn: "1h" }
                );
                res.status(200).json({
                    message: 'Login successed!',
                    profile: {
                        fullname: exist.fullname,
                        email: exist.email,
                        phone_number: exist.phone_number,
                        image : exist.image,
                        occupation: exist.occupation,
                        region: exist.region,
                    }, 
                    token: token,
                    isAuth: true
                });
            } else {
                const password = email+process.env.PASSWORD_KEY;
                const hashedPassword = await bcrypt.hash(password, 12);
                const phone_number = "0123456789101112";
                
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

                const token = jwt.sign(
                    { email: createSuccessed.email, id: createSuccessed._id },  
                    process.env.ACCESS_TOKEN,
                    { expiresIn: "1h" }
                );
                res.status(201).json({
                    message: "Login successed!",
                    profile: {
                        fullname: exist.fullname,
                        email: exist.email,
                        phone_number: exist.phone_number,
                        image : exist.image,
                        occupation: exist.occupation,
                        region: exist.region,
                    }, 
                    token: token,
                    isAuth: true
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

exports.facebookAuthentication = async (req, res, next) => {
    const { userID, accessToken } = req.body;

    let urlValidation = `https://graph.facebook.com/${userID}?fields=id,name,email, picture&access_token=${accessToken}`;

    try {
        const check = await axios.get(urlValidation);
        const { name, email, picture } = check.data;
        const image =  picture.data.url;

        try {
            const exist = await User.findOne({ email });
            if(exist) {
                const token = jwt.sign(
                    { email: exist.email, id: exist._id },  
                    process.env.ACCESS_TOKEN,
                    { expiresIn: "1h" }
                );
                res.status(200).json({
                    message: 'Login successed!',
                    profile: {
                        fullname: exist.fullname,
                        email: exist.email,
                        phone_number: exist.phone_number,
                        image : exist.image,
                        occupation: exist.occupation,
                        region: exist.region,
                    }, 
                    token: token,
                    isAuth: true
                });
            } else {
                const password = email+process.env.PASSWORD_KEY;
                const hashedPassword = await bcrypt.hash(password, 12);
                const phone_number = "0123456789101112";

                const createUser = new User({
                    fullname        : name,
                    email           : email,
                    password        : hashedPassword,
                    phone_number    : phone_number,
                    image           : image,
                    occupation      : 'none',
                    region          : 'none',
                    google          : false,
                    facebook        : true
                });

                const createSuccessed = await createUser.save();
                
                const token = jwt.sign(
                    { email: createSuccessed.email, id: createSuccessed._id },  
                    process.env.ACCESS_TOKEN,
                    { expiresIn: "1h" }
                );
                res.status(201).json({
                    message: "Login successed!",
                    profile: {
                        fullname: createSuccessed.fullname,
                        email: createSuccessed.email,
                        phone_number: createSuccessed.phone_number,
                        image : createSuccessed.image,
                        occupation: createSuccessed.occupation,
                        region: createSuccessed.region,
                    }, 
                    token: token,
                    isAuth: true
                });

            }
        } catch (err) {
            console.log('Error', err);
            res.status(500).json({ 
                message: "Login Error! ",
                error: err
            })
        }
    } catch (err) {
        console.log('Error', err);
        res.status(500).json({ 
            message: "Login Error! ",
            error: err
        })
    }
}