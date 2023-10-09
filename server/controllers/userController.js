const userService = require('../services/userService');
const httpHandler = require('../helpers/httpHandler');
const bcrypt = require('bcrypt');

const userController = {
    getCurrentUser: async (req, res) => {
        try {
            const auth = await userService.getUser(req.user.username);
            if (!auth) httpHandler.Fail(res, {}, 'Không tìm thấy người dùng');
            else {
                const { password, ...currentUser } = auth._doc;
                httpHandler.Success(res, { currentUser }, 'Tìm thấy thông tin người dùng');
            }
        } catch (error) {
            httpHandler.Servererror(res, error.message, 'Đã xảy ra lỗi !!!');
        }
    },
    getUserByID: async (req, res) => {
        try {
            const user = await userService.getUserByID(req.params.id);
            console.log({ user, id: req.params.id });

            if (!user) httpHandler.Fail(res, {}, 'Không tìm thấy người dùng');
            else {
                const { password, ...userInfo } = user._doc;
                httpHandler.Success(res, { userInfo }, 'Tìm thấy thông tin người dùng');
            }
        } catch (error) {
            httpHandler.Servererror(res, error.message, 'Đã xảy ra lỗi !!!');
        }
    },
    updateUser: async (req, res) => {
        try {
            const unChangedUser = await userService.getUser(req.params['username']);
            if (req.params['username'] !== req.user.username) {
                httpHandler.Forbidden(res, 'Không thể thực hiện thao tác này');
            } else if (!unChangedUser) {
                httpHandler.Fail(res, {}, 'Người dùng không tồn tại');
            } else {
                const existEmail = await userService.getExistUser(req.params['username'], req.body.email);
                if (existEmail) {
                    httpHandler.Fail(res, {}, 'Email đã có người sử dụng');
                    return;
                }
                const existPhone = await userService.getExistUser(req.params['username'], req.body.email);
                if (existPhone) {
                    httpHandler.Fail(res, {}, 'Số điện thoại đã có người sử dụng');
                    return;
                }

                const state = await userService.updateUser(req.body.username, req.body);

                if (state.modifiedCount !== 0) {
                    const changedUser = await userService.getUser(req.params['username']);
                    const { password, ...currentUser } = changedUser._doc;
                    httpHandler.Success(res, { currentUser }, 'Cập nhật thông tin thành công');
                } else httpHandler.Fail(res, {}, 'Cập nhật thông tin không thành công');
            }
        } catch (error) {
            httpHandler.Servererror(res, error.message, 'Đã có lỗi xảy ra');
        }
    },
    changePassword: async (req, res) => {
        try {
            const auth = await userService.getUser(req.body.username);
            if (!auth) httpHandler.Fail(res, {}, 'Người dùng không tồn tại');
            else {
                const state = await userService.changePassword(req.body.username, req.body.newPassword);

                if (state.modifiedCount > 0) {
                    httpHandler.Success(res, {}, 'Cập nhật mật khẩu thành công');
                } else {
                    httpHandler.Fail(res, {}, 'Cập nhật mật khẩu không thành công');
                }
            }
        } catch (error) {
            httpHandler.Servererror(res, {}, 'Đã có lỗi xảy ra');
        }
    },
    changeAvatar: async (req, res) => {
        try {
            const state = await userService.changeAvatar(req.user.username, req.avatar);
            if (state.modifiedCount > 0) {
                httpHandler.Success(res, { newAvatar: req.avatar }, 'Cập nhật ảnh đại diện thành công');
            } else {
                httpHandler.Fail(res, {}, 'Cập nhật ảnh đại diện thất bại');
            }
        } catch (error) {
            httpHandler.Servererror(res, {}, 'Đã có lỗi xảy ra');
        }
    },
    loadCommentOfUser: async (req, res) => {
        try {
            const username = req.params.username;
            let params = {};
            params.username = username;
            // call service
            //  reuturn
        } catch (error) {}
    },
    loadMatchsOfUser: async (req, res) => {
        try {
            const username = req.params.username;
            let params = {};
            params.username = username;
            // Call service
            // return
        } catch (error) {}
    },
    loadListUser: async (req, res) => {},
    getProfile: async (req, res) => {
        try {
            const { username } = req.params;
            const user = await userService.getUser(username);
            if (!user) {
                httpHandler.Fail(res, {}, 'Không tìm thầy người chơi');
            } else {
                const { _id, username, avatar, friends, createdAt, elo, ...other } = user._doc;
                const profile = { _id, username, avatar, friends, createdAt };
                httpHandler.Success(res, { profile }, 'Tìm thầy người chơi');
            }
        } catch (error) {
            console.log(error)
            httpHandler.Servererror(res, error, 'Đã có lỗi xảy ra');
        }
    },
};

module.exports = userController;
