const userService = require('../services/userService');
const httpHandler = require('../helpers/httpHandler');
const bcrypt = require('bcrypt');

const userController = {
    getProfile: async (req, res) => {
        try {
            const auth = await userService.getUser(req.user.username);
            if (!auth) httpHandler.Fail(res, {}, 'Không tìm thấy người dùng');
            else{
                const {password, ...currentUser} = auth._doc;
                httpHandler.Success(res, { currentUser }, 'Tìm thấy thông tin người dùng');
            }
        } catch (error) {
            httpHandler.Servererror(res, error.message, 'Đã xảy ra lỗi !!!');
        }
    },
    updateUser: async (req, res) => {
        try {
            const unChangedUser = await userService.getUser(req.params["username"]);
            if (req.params['username'] !== req.user.username) {
                httpHandler.Forbidden(res, 'Không thể thực hiện thao tác này');
            } else if (!unChangedUser) {
                httpHandler.Fail(res, {}, 'Người dùng không tồn tại');
            } else {
                console.log(req.body);
                const state = await userService.updateUser(req.body.username, req.body);
                
                if (state.modifiedCount !== 0){
                    const changedUser = await userService.getUser(req.params["username"]);
                    const {password, ...currentUser} = changedUser._doc;
                    httpHandler.Success(res, {currentUser}, 'Cập nhật thông tin thành công');
                }
                else httpHandler.Fail(res, {}, 'Cập nhật thông tin không thành công');
            }
        } catch (error) {
            httpHandler.Servererror(res, error.message, 'Đã có lỗi xảy ra');
        }
    },
    changePassword: async (req,res) => {
        try {
            const auth = await userService.getUser(req.body.username);
            if(!auth)
                httpHandler.Fail(res, {}, "Người dùng không tồn tại");
            else{
                const state = await userService.changePassword(req.body.username, req.body.newPassword);
                
                if(state.modifiedCount > 0){
                    httpHandler.Success(res, {}, "Cập nhật mật khẩu thành công");
                }else{
                    httpHandler.Fail(res, {}, "Cập nhật mật khẩu không thành công");
                }
            }
        } catch (error) {
            httpHandler.Servererror(res, {}, "Đã có lỗi xảy ra");
        }
    },
    changeAvatar: async (req, res) => {
        try {
            const state = await userService.changeAvatar(req.user.username, req.avatar);
            if(state.modifiedCount > 0){
                httpHandler.Success(res, {newAvatar: req.avatar}, "Cập nhật ảnh đại diện thành công");
            }else{
                httpHandler.Fail(res, {}, "Cập nhật ảnh đại diện thất bại");
            }
        } catch (error) {
            httpHandler.Servererror(res, {}, "Đã có lỗi xảy ra");
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
};

module.exports = userController;
