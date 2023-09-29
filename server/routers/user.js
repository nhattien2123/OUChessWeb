const router = require("express").Router();
const userController = require("../controllers/userController");
const middlewareController = require("../controllers/middlewareController");
const apiConstants = require("../configs/ApiConstant");
const cloudinaryConfig = require("../configs/CloundinaryConfig");
const upload = require("../configs/MulterConfig");

router.get(apiConstants.API_GET_CURRENT_USER, middlewareController.verifyToken, userController.getProfile);
router.patch(apiConstants.API_UPDATE_USER_PROFILE, middlewareController.verifyToken, userController.updateUser);
router.patch(apiConstants.API_UPDATE_USER_PASSWORD, middlewareController.verifyToken, userController.changePassword);
router.patch(apiConstants.API_UPDATE_USER_AVATAR, cloudinaryConfig.uploadToCloud ,middlewareController.verifyToken, userController.changeAvatar);
router.patch(apiConstants.API_UPDATE_USER, userController.updateUser);

module.exports = router;