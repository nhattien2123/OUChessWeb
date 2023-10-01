import { PayloadAction } from "@reduxjs/toolkit";
import { userState } from "../user/Types";

export type messageState = {
    isLoading: boolean,
    selectedChat: string,
    selectedUser: {
        username: string,
        avatar: string
    }
}

export type setSelectedChat = PayloadAction<{
    selectedChat: messageState["selectedChat"],
    selectedUser: messageState["selectedUser"]
}>