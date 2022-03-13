const { validationResult } = require('express-validator');

exports.createMovie = (req, res, next) => {
    const title = req.body.title;
    // const image = req.body.image;

    const body = req.body.body;


    // ERROR HANDLING
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const err = new Error('Invalid Value');
        err.ErrorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    const result = {
        message: "Added to your movies favorite!",
        data: {
            "mid": 1,
            "title": title,
            // "release_date": "19-05-2020",
            // "image": "imagefile.png"
            "body": body
        }
    }

    res.status(201).json(result);
}