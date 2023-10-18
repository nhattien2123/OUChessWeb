const router = require('express').Router();
const apiConstants = require('../configs/ApiConstant');
const middlewareController = require('../controllers/middlewareController');
const adminController = require("../controllers/adminController");
const cloudinaryConfig = require('../configs/CloundinaryConfig');

router.post(
    apiConstants.API_ADMIN_ADD_USER,
    middlewareController.verifyAdminToken,
    cloudinaryConfig.uploadToCloud,
    adminController.addUser 
);
router.patch(apiConstants.API_ADMIN_UPDATE_USER);
router.delete(apiConstants.API_ADMIN_DELETE_USER);
// router.post(apiConstants.API_RESET_USER);

module.exports = router;
