const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userInfo = {_id: decode.id, username: decode.username, email: decode.email};
        next();
    }
    catch(err) {
        return res.status(401).json({message: "Not authorized"});
    }
}

module.exports = auth;