const match = require("../models/match");


const matchRepository = {
    getMatch: async(username) => {
        try {
            const current = await match.findOne({
                username: username
            })
        } catch (error) {
            
        }
    },
};

module.exports = matchRepository;