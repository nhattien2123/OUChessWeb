const router = require("express").Router();
const authController = require("../controllers/authController");
const apiConstants = require("../configs/ApiConstant");

router.post(apiConstants.API_SIGN_IN, authController.signIn);
router.post(apiConstants.API_SIGN_UP, authController.signUp);
router.post(apiConstants.API_SEND_VERIFY, authController.sendVerify);

module.exports = router;