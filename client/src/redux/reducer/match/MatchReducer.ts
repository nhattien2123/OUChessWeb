import { createSlice } from "@reduxjs/toolkit";
import * as Types from "src/redux/reducer/match/Types";

const initialState: Types.matchState = {
    match: [],
    isLoading: false,
    lastestMatchId: null,
}

const matchSlice = createSlice({
    name: "match",
    initialState,
    reducers: {
        reqGetMatch: (state, action: Types.ActionReqGetMatch) => {
            state.isLoading = true;
        },
        resGetMatch: (state, action: Types.ActionResGetMatch) => {
            const { matches } = action.payload;
            state.match = matches;
            state.isLoading = false;
        },
        reqPostAddMatch: (state, action: Types.ActionReqPostAddMatch) => {
            state.isLoading = true;
        },
        resPostAddMatch: (state, action: Types.ActionResPostAddMatch) => {
            const { match } = action.payload;
            state.match.push(match);
            state.lastestMatchId = match._id;
            state.isLoading = false;
        },
        reqGetMatchById: (state, action: Types.ActionReqGetMatchById) => {
            state.isLoading = true;
        },
        resGetMatchById: (state, action: Types.ActionResGetMatchById) => {
            const { matches } = action.payload;
            state.match = matches;
            state.isLoading = false;
        },
        reqPutMatchById: (state, action: Types.ActionReqPutMatchById) => {
            state.isLoading = true;
        },
        resPutMatchById: (state, action: Types.ActionResPutMatchById) => {
            const { match } = action.payload;
            state.isLoading = false;
        },
        resetLastedMatchId: (state) => {
            state.lastestMatchId = null
        }
    }
});

export const matchActions = matchSlice.actions;
export default matchSlice.reducer;