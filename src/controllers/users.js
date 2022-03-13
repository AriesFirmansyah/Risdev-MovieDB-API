exports.createUser = (req, res, next) => {
    console.log("request : ", req.body);
    res.json({
        message: 'create successed',
        data: {
            id: 1,
            name: req.body.name
        }

    });
    
    next();
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