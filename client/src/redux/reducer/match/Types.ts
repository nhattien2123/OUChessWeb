import { PayloadAction } from '@reduxjs/toolkit';
import { User } from '../user/Types';

export type Match = {
    _id?: string | null;
    whiteId?: User | null;
    blackId?: User | null;
    matchName?: string;
    state?: number | null;
    mode?: string;
}

export type matchState = {
    match: Match[];
    playerColor?: string;
    joinedRoom?: boolean;
    isLoading?: boolean;
    lastestMatchId?: string | null;
};

export type ActionReqGetMatch = PayloadAction<{}>;
export type ActionResGetMatch = PayloadAction<{
    matches: matchState['match'];
}>;

export type ActionReqPostAddMatch = PayloadAction<{}>;
export type ActionResPostAddMatch = PayloadAction<{
    match: Match;
}>;

export type ActionReqGetMatchById = PayloadAction<{}>;
export type ActionResGetMatchById = PayloadAction<{
    matches: matchState['match'];
}>;

export type ActionReqPutMatchById = PayloadAction<{}>;
export type ActionResPutMatchById = PayloadAction<{
    match: Match;
}>;