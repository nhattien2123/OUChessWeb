const jwt = require('jsonwebtoken');
const httpHandler = require('../helpers/httpHandler');

const middlewareController = {
    verifyToken: async (req, res, next) => {
        const token = req.header('Authorization');
        if (!token) httpHandler.Unauthorized(res, { message: 'Vui lòng đăng nhập' });
        else {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_SECRETKEY, (err, user) => {
                if (err) {
                    httpHandler.Servererror(res, {}, err.message);
                    // httpHandler.Forbidden(res, 'Không được phép thực hiện hành động này');
                } else {
                    req.user = user;
                    next();
                }
            });
        }
    },
};

module.exports = middlewareController;