exports.createUser = (req, res, next) => {
    res.json({
        message: 'create successed',
        data: {
            id: 1,
            name: 'tes'
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