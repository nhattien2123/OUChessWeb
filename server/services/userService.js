const authRepository = require('../repositories/userRepository');
const user = require('../models/user');

const authService = {
    getUser: async (username) => {
        return authRepository.getUser(username);
    },
    addUser: async (User) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(User.password, salt);

            const newUser = await new user({
                username: User.username,
                password: hashed,
                firstName: User.firstName,
                lastName: User.lastName,
                dateOfBirth: User.dateOfBirth,
                email: User.email,
                phone: User.phone,
                nation: User.nation,
            });

            return await authRepository.addUser(newUser);
        } catch (error) {
            return null;
        }
    },
};

module.exports = authService;
