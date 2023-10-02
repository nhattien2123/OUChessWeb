const userService = require('../services/userService');
const httpHandler = require('../helpers/httpHandler');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const jwtHandler = require('../helpers/jwt');
const mailHandler = require('../helpers/nodemailer');
// const commentInfoService = require("../services/commentInfoService");

const authController = {
    signUp: async (req, res) => {
        try {
            const newUser = await userService.addUser(req.body.information);
            httpHandler.Created(res, newUser, 'Tạo tài khoản thành công');
        } catch (error) {
            console.log(error.message);
            httpHandler.Servererror(res, error.message, 'Đã có lỗi xảy ra!');
        }
    },
    signIn: async (req, res) => {
        try {
            const curUser = await userService.getUser(req.body.username);
            if (req.body.username === '' || req.body.password === '')
                httpHandler.Fail(res, {}, 'Vui lòng nhập đủ thông tin');
            else if (!curUser) {
                httpHandler.Fail(res, {}, 'Tài khoản không đúng');
            } else {
                const validPassword = await bcrypt.compare(req.body.password, curUser.password);
                if (!validPassword) {
                    httpHandler.Fail(res, {}, 'Mật khẩu không đúng');
                } else {
                    const token = jwtHandler.createToken(curUser);
                    const refreshToken = jwtHandler.createToken(curUser);
                    httpHandler.Success(res, { token, refreshToken }, 'Đăng nhập thành công');
                }
            }
        } catch (error) {
            httpHandler.Servererror(res, error.message, 'Có lỗi đã xảy ra');
        }
    },
    sendVerify: async (req, res) => {
        try {
            const verifyCode = crypto.randomBytes(3).toString('hex');
            const verifyToken = jwt.sign(
                {
                    email: req.body.emailVerify,
                    verifyCode: verifyCode,
                },
                process.env.JWT_SECRETKEY,
                {
                    expiresIn: '5m',
                },
            );

            const response = await mailHandler.sendMail(
                req.body.emailVerify,
                'Xác nhận tài khoản OUCHESS',
                `<h3>Mã xác nhận tải khoản của bạn là: ${verifyCode}</h3>`,
            );
            httpHandler.Success(res, { verifyToken }, 'Đã gửi mã xác nhận thành công');
        } catch (error) {
            httpHandler.Servererror(res, error.message, 'Đã có lỗi xảy ra!');
        }
    },


};

module.exports = authController;
