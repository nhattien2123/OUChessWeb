import { PayloadAction } from '@reduxjs/toolkit';

export type User = {
            _id: string;
        username: string;
        firstName: string;
        lastName: string;
        phone: string;
        dateOfBirth: Date;
        email: string;
        elo: number;
        nation: string;
        avatar: string;
        friends: {[key: string]: any}[]
}

export type userState = {
    currentUser: User;
    password: string;
    isLoading?: boolean;
};

export type ActionReqGetCurrentUser = PayloadAction<{}>;
export type ActionResGetCurrentUser = PayloadAction<{
    currentUser: userState['currentUser'];
}>;
export type ActionReqPatchUpdateUser = PayloadAction<{}>;
export type ActionResPatchUpdateUser = PayloadAction<{
    currentUser: userState['currentUser'];
}>;
export type ActionReqPatchChangePassword = PayloadAction<{}>;
export type ActionResPatchChangePassword = PayloadAction<{}>;
export type ActionReqChangeAvatar = PayloadAction<{}>;
export type ActionResChangeAvatar = PayloadAction<{
    newAvatar: userState['currentUser']['avatar'];
}>;
