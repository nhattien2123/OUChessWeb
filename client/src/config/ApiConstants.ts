export const ROOT_URL = process.env.REACT_APP_NODEJS_HOST !== undefined && process.env.REACT_APP_NODEJS_PORT !== undefined ? process.env.REACT_APP_NODEJS_HOST + ":" + process.env.REACT_APP_NODEJS_PORT : "";
export const CONTENT_TYPE = "application/json; charset=UTF-8";
export const COMMON = {
    API_LOGIN: {
        URL: "/auth/login",
        METHOD: "POST",
    },
    API_CHART: {
        URL: "/engines/chart",
        METHOD: "POST",
    }
};
export const SAMPLE = {
    API_GET_DATA_SAMPLE: {
        URL: "/common/api-get-data-sample",
        METHOD: "POST",
    },
};

