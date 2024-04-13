import Board from "src/interfaces/gamecore/board/Board";
import { PayloadAction } from "@reduxjs/toolkit";
import * as UserType from "src/redux/reducer/user/Types";

export interface Moving {
    startPiece: number;
    targetPiece: number;
    start: number;
    target: number;
    flag?: number;
    promotionPiece?: string;
}

export interface Room {
    detail: {
        id: string;
        title: string;
        player: UserType.User[];
    } | null;
    gameState: {
        board?: Board;
        turn: number;
        isStarted: boolean;
        playerColor: number;
        whiteTimer: number;
        blackTimer: number;
    };
    gameAction: {
        move: {
            start: number | null;
            target: number | null;
            flag?: number;
        };
        isPromotion: boolean;
        promotionPiece: string;
        isAction: boolean;
    };
    history: Moving[];
    type: number;
    lastTime: number;
    isProcessing: boolean;
}

export type CreateRoomRequest = PayloadAction<{
    title: string;
    own: string;
}>;
export type CreatRoomResponse = PayloadAction<{
    detail: {
        id: string;
        title: string;
        player: UserType.User[];
    };
    color: number;
}>;
export type JoinRoomRequest = PayloadAction<{
    rId: string;
    uId: string;
}>;
export type JoinRoomResponse = PayloadAction<{
    detail: {
        id: string;
        title: string;
        player: any[];
    };
    color: number;
    board?: Board;
    history?: Moving[];
}>;
export type MovingRequest = PayloadAction<{
    rId: string;
    timer: number;
    moving: Moving;
}>;
export type MovingResponse = PayloadAction<{
    moving: Moving;
}>;
