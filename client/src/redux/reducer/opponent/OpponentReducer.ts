import { createSlice } from '@reduxjs/toolkit';
import * as Types from './Types';

const initialState: Types.OpponentState = {
    position: [0, 100, 0],
    mousePosition: [0, 0, 0],
    name: ""
}

const opponentSlice = createSlice({
    name: 'opponent',
    initialState,
    reducers: {
        setPosition: (state, action: Types.ActionSetPosition) => {
            state.position = action.payload.position;
        },
        setMousePosition: (state, action: Types.ActionSetMousePosition) => {
            state.mousePosition = action.payload.mousePosition;
        },
        setName: (state, action: Types.ActionSetName) => {
            state.name = action.payload.name;
        },
    }
})


export const opponentActions = opponentSlice.actions;
export default opponentSlice.reducer;