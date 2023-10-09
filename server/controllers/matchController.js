const matchService = require('../services/matchService');
const httpHandler = require('../helpers/httpHandler');

const matchController = {
    getMatch: async (req, res) => {
        try {
            const matchId = req.params.matchId;
            const match = await matchService.getMatch(matchId);

            if (!match) {
                httpHandler.Fail(res, {}, 'Không tìm thấy trận đấu');
            } else {
                httpHandler.Success(res, { match }, 'Tìm thấy thông tin trận đấu');
            }
        } catch (error) {
            httpHandler.Servererror(res, error.message, 'Đã xảy ra lỗi !!!');
        }
    },
    getMatches: async (req, res) => {
        try {
            const matches = await matchService.getMatches();

            if (!matches) {
                httpHandler.Fail(res, {}, 'Không tìm thấy trận đấu');
            } else {
                httpHandler.Success(res, { matches }, 'Tìm thấy danh sách trận đấu');
            }
        } catch (error) {
            httpHandler.Servererror(res, error.message, 'Đã xảy ra lỗi !!!');
        }
    },
    addMatch: async (req, res) => {
        try {
            const newMatchData = req.body;
            const match = await matchService.addMatch(newMatchData);

            if (!match) {
                httpHandler.Fail(res, {}, 'Thêm trận đấu không thành công');
            } else {
                httpHandler.Success(res, { match }, 'Thêm trận đấu thành công');
            }
        } catch (error) {
            httpHandler.Servererror(res, error.message, 'Đã xảy ra lỗi !!!');
        }
    },
    updateMatch: async (req, res) => {
        try {
            const matchId = req.params.matchId;
            const updatedMatchData = req.body;

            const updatedMatch = await matchService.updateMatch(matchId, updatedMatchData);

            if (!updatedMatch) {
                httpHandler.Fail(res, {}, 'Cập nhật trận đấu không thành công');
            } else {
                httpHandler.Success(res, { updatedMatch }, 'Cập nhật trận đấu thành công');
            }
        } catch (error) {
            httpHandler.Servererror(res, error.message, 'Đã xảy ra lỗi !!!');
        }
    },
    deleteMatch: async (req, res) => {
        try {
            const matchId = req.params.matchId;
            const deletedMatch = await matchService.deleteMatch(matchId);

            if (!deletedMatch) {
                httpHandler.Fail(res, {}, 'Xoá trận đấu không thành công');
            } else {
                httpHandler.Success(res, { deletedMatch }, 'Xoá trận đấu thành công');
            }
        } catch (error) {
            httpHandler.Servererror(res, error.message, 'Đã xảy ra lỗi !!!');
        }
    },
};

module.exports = matchController;



