const match = require("../models/match");

const matchRepository = {
    getMatch: async (matchId) => {
        try {
            const matchData = await match.findOne({ _id: matchId });
            return matchData;
        } catch (error) {
            console.error(error.message);
            return null;
        }
    },
    getMatches: async () => {
        try {
            const matches = await match.find({});
            return matches;
        } catch (error) {
            console.error(error.message);
            return null;
        }
    },
    addMatch: async (newMatchData) => {
        try {
            delete newMatchData._id;
            
            const newMatch = new match(newMatchData);
            console.log(newMatch);
            const savedMatch = await newMatch.save();
            return savedMatch;
        } catch (error) {
            console.error(error.message);
            return null;
        }
    },
    updateMatch: async (matchId, updatedMatchData) => {
        try {
            const updatedMatch = await match.findOneAndUpdate(
                { _id: matchId },
                { $set: updatedMatchData },
                { new: true }
            );
            return updatedMatch;
        } catch (error) {
            console.error(error.message);
            return null;
        }
    },
    deleteMatch: async (matchId) => {
        try {
            const deletedMatch = await match.findByIdAndDelete(matchId);
            return deletedMatch;
        } catch (error) {
            console.error(error.message);
            return null;
        }
    },
};

module.exports = matchRepository;