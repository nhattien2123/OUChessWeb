import { createSlice } from "@reduxjs/toolkit";
import * as Types from "./Types";
import Cookies from "js-cookie";


const currentState = Cookies.get("user") || ""

const initialState: Types.userState = {
    currentUser: currentState !== "" ? JSON.parse(currentState) : {
        _id: "",
        username: "",
        firstName: "",
        lastName: "",
        phone: "",
        dateOfBirth: new Date(),
        email: "",
        elo: 0,
        nation: '',
        avatar: '',
        friends: []
    },
    password: "",
    isLoading: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        reqGetCurrentUser: (state, action: Types.ActionReqGetCurrentUser) => {
            state.isLoading = true;
        },
        resGetCurrrentUser: (state, action: Types.ActionResGetCurrentUser) => {
            const { currentUser } = action.payload;
            state.currentUser = currentUser;
            state.isLoading = false;
        },
        reqPatchUpdateUser: (state, action: Types.ActionReqPatchUpdateUser) => {
            state.isLoading = true;
        },
        resPatchUpdateUser: (state, action: Types.ActionResPatchUpdateUser) => {
            const {currentUser} = action.payload;
            state.currentUser = currentUser;
            state.isLoading = false;
        },
        reqPatchChangPassword: (state, action: Types.ActionReqPatchChangePassword) => {
            state.isLoading = true;
        },
        resPatchChangePassword: (state, action: Types.ActionResPatchChangePassword) => {
            state.isLoading = false;
        },
        reqPatchChangeAvatar: (state, action: Types.ActionReqChangeAvatar) => {
            state.isLoading = true;
        },
        resPatchChangeAvatar: (state, action: Types.ActionResChangeAvatar) => {
            const {newAvatar} = action.payload;
            state.currentUser.avatar = newAvatar;
            state.isLoading = false;    
        }
    } 
});

export const userActions = userSlice.actions;
export default userSlice.reducer;