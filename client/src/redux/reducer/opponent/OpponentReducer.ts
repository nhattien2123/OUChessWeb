import { createSlice } from "@reduxjs/toolkit";
import * as Types from "./Types";

const initialState: Types.OpponentState = {
    position: [0, 100, 0],
    mousePosition: [0, 0, 0],
    name: ``,
    avatar: ``,
    color: null,
};

const opponentSlice = createSlice({
    name: "opponent",
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
        setAvatar: (state, action: Types.ActionSetAvatar) => {
            state.avatar = action.payload.avatar;
        },
        setColor: (state, action: Types.ActionSetColor) => {
            state.color = action.payload.color;
        },
        setDetail: (state, action: Types.ActionSetDetail) => {
            const { name, avatar, color } = action.payload;
            state.color = color;
            state.name = name;
            state.avatar = avatar;
        },
    },
});

export const opponentActions = opponentSlice.actions;
export default opponentSlice.reducer;
