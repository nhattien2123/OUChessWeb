import { PayloadAction } from '@reduxjs/toolkit';
import { User } from '../user/Types';

export type Match = {
    _id: string | null;
    whiteId: User | null;
    blackId: User | null;
    matchName: string;
    winnerPlayer: string;
    mode: string;
}

export type matchState = {
    match: Match[];
    isLoading?: boolean;
};

export type ActionReqGetMatch = PayloadAction<{}>;
export type ActionResGetMatch = PayloadAction<{
    matches: matchState['match'];
}>;
export type ActionReqPostAddMatch = PayloadAction<{}>;
export type ActionResPostAddMatch = PayloadAction<{
    match: Match;
}>;