const user = require('../models/user');
const bcrypt = require('bcrypt');

const userReposity = {
    getUser: async ({username}) => {
        try {
            const User = await user.findOne({
                username: username,
            });
            return User;
        } catch (error) {
            // console.log(error);
            return null;
        }
    },
    addUser: async (User) => {
        try {
            const newUser = await User.save();
            return newUser;
        } catch (error) {
            return null;
        }
    }
};

module.exports = userReposity;
