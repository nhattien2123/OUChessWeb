const user = require('../models/user');
const bcrypt = require('bcrypt');

const userReposity = {
    getUserByID: async (_id) => {
        try {
            const User = await user.findOne({
                _id: _id,
            });
            return User;
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    getUser: async (params) => {
        try {
            const User = await user
                .findOne({
                    $or: [{ username: params }, { email: params }],
                })
                .populate('friends');
            return User;
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    getUsers: async (params) => {
        try {
            let searchParams = {};
            const email = params.email || null;
            if (email !== null && email !== '') {
                searchParams.email = email;
            }
            const username = params.username || null;
            if (username !== null && username !== '') {
                searchParams.username = username;
            }
            const phone = params.phone || null;
            if (phone !== null && phone !== '') {
                searchParams.phone = phone;
            }

            const list = await user.find(searchParams);
            return list;
        } catch (error) {
            return null;
        }
    },
    addUser: async (User) => {
        try {
            const newUser = await User.save();
            return newUser;
        } catch (error) {
            console.log(error.message);
            return null;
        }
    },
    updateUser: async (username, changed) => {
        try {
            const state = await user.updateOne(
                {
                    $or: [{ username: username }, { email: username }],
                },
                {
                    $set: changed,
                },
            );
            return state;
        } catch (error) {
            return null;
        }
    },
    deleteUser: async (username) => {},
};

module.exports = userReposity;
