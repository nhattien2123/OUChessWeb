import { PayloadAction } from '@reduxjs/toolkit';

export type OpponentState = {
    position: [number, number, number];
    mousePosition: [number, number, number];
    name: string;
}

export type ActionSetPosition = PayloadAction<{
    position: OpponentState['position'];
}>

export type ActionSetMousePosition = PayloadAction<{
    mousePosition: OpponentState['mousePosition'];
}>

export type ActionSetName = PayloadAction<{
    name: OpponentState['name'];
}>