const router = require("express").Router();
const authController = require("../controllers/authController");
const apiConstants = require("../configs/ApiConstant");
const authRepository = require("../repositories/userRepository");

router.post(apiConstants.API_SIGN_IN, authController.signIn);
router.post(apiConstants.API_SIGN_UP, authController.signUp);
router.post(apiConstants.API_SEND_VERIFY, authController.sendVerify);

router.post("/list-user", async (req,res) => {
    try {
        
        const list = await authRepository.getUsers(req.body);
        return res.status(200).json(list);
    } catch (error) {
        return res.status(500).json(error);
    }
})


module.exports = router;