import Board from "src/interfaces/gamecore/board/Board";
import { createSlice } from "@reduxjs/toolkit";
import * as Types from "src/redux/reducer/room/Types";

const currentRoom = sessionStorage.getItem("room");

const initialState: Types.Room =
    currentRoom !== null
        ? (JSON.parse(currentRoom) as Types.Room)
        : {
              detail: null,
              gameState: {
                  turn: 0,
                  isStarted: false,
                  playerColor: -1,
                  whiteTimer: 600000,
                  blackTimer: 600000,
              },
              gameAction: {
                  move: {
                      start: null,
                      target: null,
                  },
                  isPromotion: false,
                  promotionPiece: "",
                  isAction: false,
              },
              history: [],
              type: 0,
              lastTime: 0,
              isProcessing: false,
          };

const roomSlice = createSlice({
    name: "roomSlice",
    initialState,
    reducers: {
        // create, join and leave room
        requestCreateRoom: (state, action: Types.CreateRoomRequest) => {
            state.isProcessing = true;
        },
        responseCreateRoom: (state, action: Types.CreatRoomResponse) => {
            state.isProcessing = false;
            const { detail, color } = action.payload;
            state.detail = detail;
            state.gameState.playerColor = color;
        },
        requestJoinRoom: (state, action: Types.JoinRoomRequest) => {
            state.isProcessing = true;
        },
        responseJoinRoom: (state, action: Types.JoinRoomResponse) => {
            state.isProcessing = false;
            const { detail, color } = action.payload;
            state.detail = detail;
            state.gameState.playerColor = color;
        },
        requestLeaveRoom: (state) => {
            state.isProcessing = true;
        },
        responseLeaveRoom: (state) => {
            state = initialState;
        },
        // game action
        resquestStarting: (state) => {
            state.gameState.isStarted = true;
            const board = new Board();
            state.gameState.board = board;
            state.lastTime = Date.now();

            sessionStorage.setItem("room", JSON.stringify(state));
        },
        requestMoving: (state, action: Types.MovingRequest) => {
            state.gameAction.isAction = true;
            if (state.gameState.turn === 0) {
                state.gameState.whiteTimer = state.gameState.whiteTimer - action.payload.timer;
            } else {
                state.gameState.blackTimer = state.gameState.blackTimer - action.payload.timer;
            }
        },
        responseMoving: (state, action: Types.MovingResponse) => {
            state.gameAction.isAction = false;
            const { moving } = action.payload;
            state.gameAction.move = {
                start: moving.start,
                target: moving.target,
                flag: moving.flag,
            };

            state.history.push(moving);
            state.lastTime = Date.now();
            state.gameState.turn = 1 - state.gameState.turn;
            sessionStorage.setItem("room", JSON.stringify(state));
        },
        resClearMoving: (state) => {
            state.gameAction = {
                move: {
                    start: null,
                    target: null,
                },
                isPromotion: false,
                promotionPiece: "",
                isAction: false,
            };
            sessionStorage.setItem("room", JSON.stringify(state));
        },
    },
});

export const roomAction = roomSlice.actions;
export default roomSlice.reducer;
