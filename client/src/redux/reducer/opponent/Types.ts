import { PayloadAction } from "@reduxjs/toolkit";
import { Color } from "src/share/game/logic/pieces";

export type OpponentState = {
    position: [number, number, number];
    mousePosition: [number, number, number];
    name: string;
    avatar: string;
    color: Color | null;
}

export type ActionSetPosition = PayloadAction<{
    position: OpponentState["position"];
}>

export type ActionSetMousePosition = PayloadAction<{
    mousePosition: OpponentState["mousePosition"];
}>

export type ActionSetName = PayloadAction<{
    name: OpponentState["name"];
}>

export type ActionSetAvatar = PayloadAction<{
    avatar: OpponentState["avatar"];
}>

export type ActionSetColor = PayloadAction<{
    color: OpponentState["color"];
}>