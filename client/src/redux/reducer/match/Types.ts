import { PayloadAction } from "@reduxjs/toolkit";
import { User } from "src/redux/reducer/user/Types";
import { Room } from "src/util/Socket";

export type Match = {
    _id?: string | null;
    whiteId?: User | null;
    blackId?: User | null;
    matchName?: string;
    state?: number | null;
    mode?: string;
}

export type matchState = {
    rooms: Room[];
    match: Match[];
    playerColor?: string;
    joinedRoom?: boolean;
    isLoading?: boolean;
    lastestMatchId?: string | null;
};

export type ActionReqGetMatch = PayloadAction<{}>;
export type ActionResGetMatch = PayloadAction<{
    matches: matchState["match"];
}>;

export type ActionReqPostAddMatch = PayloadAction<{}>;
export type ActionResPostAddMatch = PayloadAction<{
    match: Match;
}>;

export type ActionReqGetMatchById = PayloadAction<{}>;
export type ActionResGetMatchById = PayloadAction<{
    matches: matchState["match"];
}>;

export type ActionReqPutMatchById = PayloadAction<{}>;
export type ActionResPutMatchById = PayloadAction<{
    match: Match;
}>;

export type GetMatchesRequest = PayloadAction<{}>;
export type GetMatchesResponse = PayloadAction<{
    rooms: Room[]
}>