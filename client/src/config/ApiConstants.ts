export const ROOT_URL =
    process.env.REACT_APP_NODEJS_HOST !== undefined && process.env.REACT_APP_NODEJS_PORT !== undefined
        ? process.env.REACT_APP_NODEJS_HOST + ':' + process.env.REACT_APP_NODEJS_PORT
        : '';
export const CONTENT_TYPE = 'application/json; charset=UTF-8';

export const COMMON = {
    API_LOGIN: {
        URL: '/auth/authapi-signin',
        METHOD: 'POST',
    },
    API_REGISTER: {
        URL: '/auth/authapi-signup',
        METHOD: 'POST',
    },
    API_SEND_VERIFY: {
        URL: '/auth/authapi-sendverify',
        METHOD: 'POST',
    },
    API_CHART: {
        URL: '/engines/chart',
        METHOD: 'POST',
    },
    API_UPDATE_USER: {
        URL: '/auth/authapi-updateuser',
        METHOD: 'POST',
    },
};

export const USER = {
    API_CURRENT_USER: {
        URL: '/user/userapi-getcurrent',
        METHOD: 'GET',
    },
    
    API_UPDATE_USER: (username: string) => {
        return {
            URL: `/user/${username}/userapi-updateuser`,
            METHOD: 'PATCH',
        };
    },
    API_CHANGE_PASSWORD: (username: string) => {
        return {
            URL: `/user/${username}/userapi-changepassword`,
            METHOD: 'PATCH',
        };
    },
    API_CHANGE_AVATAR: (username: string) => {
        return {
            URL: `/user/${username}/userapi-changeavatar`,
            METHOD: 'PATCH',
        };
    },
};
