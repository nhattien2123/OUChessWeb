import { ROOT_URL, CONTENT_TYPE, COMMON } from "../../config/ApiConstants";
import * as Types from "./Types";
/**
 * Fetch get data sample
     * @param {string} username
     * @param {string} password
    *@return {object}
 */
export const fetchGetDataSample = async (username: string, password: string ): Promise<Types.ResFetchGetDataSample> => {
    const url = ROOT_URL +  COMMON.API_LOGIN.URL;
    console.log(username,password);
    const response = await fetch(url, {
        method: COMMON.API_LOGIN.METHOD,
        body: JSON.stringify({
            username,
            password
        }),
        headers: {
            "Content-Type": CONTENT_TYPE,
        },
    });
    const data = await response.json();
    console.log("data", data)
    return data;
    
};