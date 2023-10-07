const authRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const user = require('../models/user');
const cloudinaryConfig = require('../configs/CloundinaryConfig');

const userService = {
    getUser: async (param) => {
        return authRepository.getUser(param);
    },
    getUserByID: async (id) => {
        return authRepository.getUserByID(id);
    },
    getExistUser: async (username, params) => {
        return authRepository.getExistUser(username, params);
    },
    addUser: async (User) => {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(User.password, salt);

        if(!User.avatar || User.avatar === ""){
            User.avatar = process.env.DEFAULT_AVATAR;
        }

        const newUser = await new user({
            username: User.username,
            password: hashed,
            firstName: User.firstName,
            lastName: User.lastName,
            dateOfBirth: User.dOb,
            email: User.email,
            phone: User.phone,
            nation: User.nation,
            avatar: User.avatar
        });

        return await authRepository.addUser(newUser);
    },
    updateUser: async (username, changed) => {
        try {
            return authRepository.updateUser(username, changed);
        } catch (error) {
            return null;
        }
    },
    changePassword: async (username, newPassword) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(newPassword, salt);

            return authRepository.updateUser(username, { password: hashed });
        } catch (error) {
            return null;
        }
    },
    changeAvatar: async (username, avatar) => {
        try {
            return authRepository.updateUser(username, { avatar: avatar });
        } catch (error) {
            return null;
        }
    },
    countField: async (field, data) => {
        return authRepository.countUsser(field, data);
    },
};

module.exports = userService;
