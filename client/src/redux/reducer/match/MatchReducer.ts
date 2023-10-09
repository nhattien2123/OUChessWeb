import { createSlice } from '@reduxjs/toolkit';
import * as Types from './Types';

const initialState: Types.matchState = {
    match: [],
    isLoading: false,
}

const matchSlice = createSlice({
    name: 'match',
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
            console.log(match);
            state.match.push(match);
            state.isLoading = false;
        },
    }
});

export const matchActions = matchSlice.actions;
export default matchSlice.reducer;