import { Color } from 'src/share/game/logic/pieces';
import { PayloadAction } from '@reduxjs/toolkit';
import { MovingTo } from 'src/components/game/Game';

export type GameSettingsState = {
    gameType: 'local' | 'online';
    turn: Color;
    gameStarted: boolean;
    movingTo: MovingTo | null;
}

export type ActionSetGameType = PayloadAction<{
    gameType: GameSettingsState['gameType'];
}>

// export type ActionSetTurn = PayloadAction<{
//     turn: GameSettingsState['turn'];
// }>

export type ActionSetGameStarted = PayloadAction<{
    gameStarted: GameSettingsState['gameStarted'];
}>

export type ActionSetMovingTo = PayloadAction<{
    movingTo: GameSettingsState['movingTo'];
}>