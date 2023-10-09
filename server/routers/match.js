const router = require("express").Router();
const matchController = require("../controllers/matchController");
const middlewareController = require("../controllers/middlewareController");
const apiConstants = require("../configs/ApiConstant");

const matchRepository = require("../repositories/matchRepository");

router.get(apiConstants.API_GET_MATCH, matchController.getMatches);

router.post(apiConstants.API_ADD_MATCH, matchController.addMatch);

router.patch(apiConstants.API_UPDATE_MATCH, async (req, res) => {
    try {
        const { matchId, updatedMatchData } = req.body;

        const updatedMatch = await matchRepository.updateMatch(matchId, updatedMatchData);

        res.json(updatedMatch);
    } catch (error) {
        res.status(500).json({ error: "Lỗi trong quá trình cập nhật trận đấu." });
    }
});

router.delete(apiConstants.API_DELETE_MATCH, async (req, res) => {
    try {
        const { matchId } = req.params;

        const deletedMatch = await matchRepository.deleteMatch(matchId);

        res.json(deletedMatch);
    } catch (error) {
        res.status(500).json({ error: "Lỗi trong quá trình xoá trận đấu." });
    }
});


module.exports = router;