const { validationResult } = require('express-validator');

exports.register = (req, res, next) => {

    // ERROR HANDLING
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const err = new Error('Invalid Value');
        err.ErrorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    const name = req.body.name;
    const email  = req.body.email;
    const password = req.body.password;
    const no_telp = req.body.no_telp;
    const pekerjaan = req.body.pekerjaan;
    const asal_kota = req.body.asal_kota;

    const result = {
        message: "Register Success",
        data: {
            uid: 1,
            name: name,
            email: email,
        }
    }
    res.status(201).json(result);

    next();
}