import { Match } from 'src/redux/reducer/match/Types';
import { ROOT_URL, CONTENT_TYPE, MATCH } from 'src/config/ApiConstants';
import * as Types from 'src/services/match/Types';

export const fetchGetMatch = async (): Promise<Types.ResFetchGetMatch> => {
    const url = ROOT_URL + MATCH.API_GET_MATCH.URL;
    const response = await fetch(url, {
        method: MATCH.API_GET_MATCH.METHOD,
        headers: {
            'Content-type': CONTENT_TYPE,
        },
    });
    return await response.json();
}

export const fetchPostAddMatch = async (match: Match): Promise<Types.ResFetchPostAddMatch> => {
    const url = ROOT_URL + MATCH.API_ADD_MATCH.URL;
    console.log(match)
    const response = await fetch(url, {
        method: MATCH.API_ADD_MATCH.METHOD,
        body: JSON.stringify(match),
        headers: {
            'Content-type': CONTENT_TYPE,
        },
    });
    return await response.json();
}

export const fetchGetMatchById = async (matchId: string): Promise<Types.ResFetchGetMatchById> => {
    const url = `${ROOT_URL}${MATCH.API_GET_MATCH_BY_ID(matchId).URL}`;
    const response = await fetch(url, {
        method: MATCH.API_GET_MATCH_BY_ID(matchId).METHOD,
        headers: {
            'Content-type': CONTENT_TYPE,
        },
    });
    return await response.json();
}

export const fetchPutMatchById = async (matchId: string, match: Match): Promise<Types.ResFetchPutMatchById> => {
    const url = `${ROOT_URL}${MATCH.API_PUT_MATCH_BY_ID(matchId).URL}`;
    const response = await fetch(url, {
        method: MATCH.API_PUT_MATCH_BY_ID(matchId).METHOD,
        body: JSON.stringify({ matchId, match }),
        headers: {
            'Content-type': CONTENT_TYPE,
        }
    });
    return await response.json();
}