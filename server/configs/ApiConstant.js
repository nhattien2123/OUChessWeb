const apiConstant = {
    API_SIGN_UP: "/authapi-signup",
    API_SIGN_IN: "/authapi-signin",
    API_CHECK_EXIST: "/authapi-checkexist",
    API_SEND_VERIFY: "/authapi-sendverify",
    API_RESET_PASSWORD: "/authapi-resetpassword",
    API_GET_CURRENT_USER: "/userapi-getcurrent",
    API_GET_USER_BY_ID: "/:id",
    API_GET_USER_PROFILE: "/:username/userapi-getprofile",
    API_LOAD_COMMENT_USER: "/:username/userapi-getcommentinfo",
    API_LOAD_MATCH_USER: "/:username/matchs",
    API_GET_MATCH: "/matchapi-getmatch",
    API_ADD_MATCH: "/matchapi-addmatch",
    API_UPDATE_MATCH: "/matchapi-updatematch",
    API_DELETE_MATCH: "/matchapi-deletematch",

    API_UPDATE_USER_PROFILE: "/:username/userapi-updateuser",
    API_UPDATE_USER_PASSWORD: "/:username/userapi-changepassword",
    API_UPDATE_USER_AVATAR: "/:username/userapi-changeavatar",
};

module.exports = apiConstant;