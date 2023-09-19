export const ROOT_URL = process.env.REACT_APP_NODEJS_HOST !== undefined && process.env.REACT_APP_NODEJS_PORT !== undefined ? process.env.REACT_APP_NODEJS_HOST + ":" + process.env.REACT_APP_NODEJS_PORT : "";
export const CONTENT_TYPE = "application/json; charset=UTF-8";

export const COMMON = {
    API_LOGIN: {
        URL: "/auth/authapi-signin",
        METHOD: "POST",
    },
    API_REGISTER: {
        URL: "/auth/authapi-signup",
        METHOD: "POST"
    },
    API_SEND_VERIFY: {
        URL: "/auth/authapi-sendverify",
        METHOD: "POST"
    },
    API_CHART: {
        URL: "/engines/chart",
        METHOD: "POST",
    }
};
