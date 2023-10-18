const userService = require('../services/userService');
const httpHandler = require('../helpers/httpHandler');
const bcrypt = require('bcrypt');

const adminController = {
    addUser: async (req, res) => {
        return await userService.addUser(req.body);
    },
    updateUser: async (req, res) => {},
    deleteUser: async (req, res) => {},
};

module.exports = adminController;
