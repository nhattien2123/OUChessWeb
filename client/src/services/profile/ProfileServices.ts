import { ROOT_URL, CONTENT_TYPE, PROFILE } from 'src/config/ApiConstants';
import * as Types from './Types';

export const fetchProfile = async (username: string): Promise<Types.ResFetchGetProfile> => {
    const url = ROOT_URL + PROFILE.API_GET_PROFILE(username).URL;

    const res = await fetch(url, {
        method: PROFILE.API_GET_PROFILE(username).METHOD,
        headers: {
            'content-type': CONTENT_TYPE,
        },
    });

    return await res.json();
};
