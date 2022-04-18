const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    // console.log(req.session)
    try {
        // console.log(req.headers.authorization.split(" ")[1]);
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500; 
        
        let decodedData;

        if(token && isCustomAuth) {
            decodedData = jwt.verify(token, process.env.ACCESS_TOKEN);
            req.userId = decodedData?.id;
        } else {
            // console.log(decodedData);
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub; 
        }

        next();
    } catch (error) {
        console.log(error);
    }
};
