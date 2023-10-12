import { Color } from 'src/share/game/logic/pieces';
import { PayloadAction } from '@reduxjs/toolkit';

export type PlayerState = {
    userId: string,
    playerColor: Color,
    mode: string,
    joinedRoom: boolean,
    roomId: string | null,
}

export type ActionSetUserId = PayloadAction<{
    userId: PlayerState['userId'];
}>;

export type ActionSetPlayerColor = PayloadAction<{
    playerColor: PlayerState['playerColor'];
}>;

export type ActionSetMode = PayloadAction<{
    mode: PlayerState['mode'];
}>;

export type ActionSetJoinedRoom = PayloadAction<{
    joinedRoom: PlayerState['joinedRoom'];
}>;

export type ActionSetRoomId = PayloadAction<{
    roomId: PlayerState['roomId'];
}>;