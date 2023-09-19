import { ROOT_URL, CONTENT_TYPE, COMMON } from "../../config/ApiConstants";
import * as Type from "./Types";


export const sendVerify = async (email: string): Promise<Type.ResFetchSendDataVerify> => {
    const url = ROOT_URL + COMMON.API_SEND_VERIFY.URL;
    const res = await fetch(url, {
        method: COMMON.API_SEND_VERIFY.METHOD,
        body: JSON.stringify({email}),
        headers: {
            "content-type": CONTENT_TYPE
        }
    });
    return await res.json();
}

export const sendDataRegister = async (username: string, password:string, email:string ): Promise<Type.ResFetchSendDataRegister> => {
    const url = ROOT_URL + COMMON.API_REGISTER.URL
    const res = await fetch(url, {
        method: COMMON.API_REGISTER.METHOD,
        body: JSON.stringify({username, password, email}),
        headers: {
            'content-type': CONTENT_TYPE
        }
    })
    return await res.json();
}

