require('dotenv').config()

const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');
const User = require('../models/user');
const images_path = './images';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
    // console.log(req.body.data);
    if (req.body.data.token) {
        console.log(req.body.data)
    }
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

    res.status(200).send(req.body.data)
}

exports.othersLogin = async (req, res, next) => {
    
}

exports.register = (req, res, next) => {

    next();
}
