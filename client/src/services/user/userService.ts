import { userState } from '@/redux/reducer/user/Types';
import { ROOT_URL, CONTENT_TYPE, COMMON, USER } from '../../config/ApiConstants';
import * as Types from './Types';
import Cookies from 'js-cookie';

export const fetchGetCurrrentUser = async (): Promise<Types.ResFetchGetCurrrentUser> => {
    const url = ROOT_URL + USER.API_CURRENT_USER.URL;
    const response = await fetch(url, {
        method: USER.API_CURRENT_USER.METHOD,
        headers: {
            'Content-type': CONTENT_TYPE,
            Authorization: `Bearer ${Cookies.get('token')}` || '',
        },
    });
    return await response.json();
};

export const fetchPatchUpdateUser = async (
    profile: userState['currentUser'],
): Promise<Types.ResFetchPatchUpdateUser> => {
    const url = `${ROOT_URL}${USER.API_UPDATE_USER(profile.username).URL}`;
    const res = await fetch(url, {
        method: USER.API_UPDATE_USER(profile.username).METHOD,
        body: JSON.stringify(profile),
        headers: {
            'Content-type': CONTENT_TYPE,
            Authorization: `Bearer ${Cookies.get('token')}` || '',
        },
    });
    return await res.json();
};

export const fetchPatchChangePassword = async (
    username: string,
    newPassword: string,
): Promise<Types.ResFetchPatchChangePassword> => {
    const url = `${ROOT_URL}${USER.API_CHANGE_PASSWORD(username).URL}`;
    console.log(url);
    const res = await fetch(url, {
        method: USER.API_CHANGE_PASSWORD(username).METHOD,
        body: JSON.stringify({ username, newPassword }),
        headers: {
            'Content-type': CONTENT_TYPE,
            Authorization: `Bearer ${Cookies.get('token')}` || '',
        },
    });
    return await res.json();
};

export const fetchPatchChangeAvatar = async (
    username: string,
    form: FormData,
): Promise<Types.ResFetchPatchChangeAvatar> => {
    const { URL, METHOD } = USER.API_CHANGE_AVATAR(username);
    console.log(form);
    const url = `${ROOT_URL}${URL}`;
    const res = await fetch(url, {
        method: METHOD,
        body: form,
        headers: {
            Authorization: `Bearer ${Cookies.get('token')}` || '',
        },
    });
    return await res.json();
};
