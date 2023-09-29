import { ROOT_URL, CONTENT_TYPE, COMMON } from "../../config/ApiConstants";
import * as Type from "./Types";


export const sendVerify = async (emailVerify: string): Promise<Type.ResFetchSendDataVerify> => {
    const url = ROOT_URL + COMMON.API_SEND_VERIFY.URL;
    console.log(emailVerify);
    const res = await fetch(url, {
        method: COMMON.API_SEND_VERIFY.METHOD,
        body: JSON.stringify({emailVerify}),
        headers: {
            "content-type": CONTENT_TYPE
        }
    });
    return await res.json();
}

export const checkDataRegister = async (): Promise<Type.ResFetchCheckDataRegister> => {
    const url = ROOT_URL;
    const res = await fetch(url, {

    });
    return await res.json();
}

export const sendDataRegister = async (information: object): Promise<Type.ResFetchSendDataRegister> => {
    const url = ROOT_URL + COMMON.API_REGISTER.URL
    console.log(information);
    const res = await fetch(url, {
        method: COMMON.API_REGISTER.METHOD,
        body: JSON.stringify(information),
        headers: {
            'content-type': CONTENT_TYPE
        }
    })
    return await res.json();
}

export const resetPassword = async (emailReset: string, passwordReset: string): Promise<Type.ResFetchChangePassword> => {
    const url = ROOT_URL + COMMON.API_UPDATE_USER.URL;
    const res = await fetch(url, {
        method: COMMON.API_UPDATE_USER.METHOD,
        body: JSON.stringify({emailReset, information: {passwordReset}}),
        headers: {
            'content-type': CONTENT_TYPE
        }
    })
    return await res.json();
}

