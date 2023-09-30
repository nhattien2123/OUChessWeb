const apiConstant = {
    API_SIGN_UP: "/authapi-signup",
    API_SIGN_IN: "/authapi-signin",
    API_SEND_VERIFY: "/authapi-sendverify",
    API_UPDATE_USER: "/authapi-update",
    API_GET_CURRENT_USER: "/userapi-getcurrent",
    // API_GET_USER: "/:username",
    API_LOAD_COMMENT_USER: "/:username/commentInfos",
    API_LOAD_MATCH_USER: "/:username/matchs",
    API_UPDATE_USER_PROFILE: "/:username/userapi-updateuser",
    API_UPDATE_USER_PASSWORD: "/:username/userapi-changepassword",
    API_UPDATE_USER_AVATAR: "/:username/userapi-changeavatar"
};

module.exports = apiConstant;