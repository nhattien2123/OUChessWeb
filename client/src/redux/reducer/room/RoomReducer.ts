import Board from "src/interfaces/gamecore/board/Board";
import { createSlice } from "@reduxjs/toolkit";
import * as Types from "src/redux/reducer/room/Types";
import * as MoveUtility from "src/interfaces/gamecore/helper/MoveUtility";
import Move, { MoveFlag } from "src/interfaces/gamecore/board/Move";


const currentRoom = sessionStorage.getItem("room");
const currentState = sessionStorage.getItem("state");
const history = sessionStorage.getItem("history");

const loadBoardDefault = (): Board => {
    const board = new Board();
    board.LoadStartPostion();
    return board;
}

const baseRoom: Types.Room = {
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
    board: loadBoardDefault(),
};

const initialState: Types.Room =
    currentRoom !== null && currentState !== null && history !== null
        ? {
              detail: JSON.parse(currentRoom),
              gameState: JSON.parse(currentState),
              gameAction: {
                  move: {
                      start: null,
                      target: null,
                  },
                  isPromotion: false,
                  promotionPiece: "",
                  isAction: false,
              },
              history: JSON.parse(history),
              type: 0,
              lastTime: 0,
              isProcessing: false,
              board: new Board(),
          }
        : baseRoom;

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
        requestLeaveRoom: (state, action: Types.LeaveRoomRequest) => {
            state.isProcessing = true;
        },
        responseLeaveRoom: (state) => {
            sessionStorage.removeItem("room");
            sessionStorage.removeItem("state");
            sessionStorage.removeItem("history");
            state.detail = null;
            state = baseRoom;
        },
        // game action
        resquestStarting: (state) => {
            state.gameState.isStarted = true;
            const board = new Board();
            board.LoadStartPostion();
            state.board = board;
            state.lastTime = Date.now();

            sessionStorage.setItem("room", JSON.stringify(state.detail));
            sessionStorage.setItem("state", JSON.stringify(state.gameState));
            sessionStorage.setItem("history", JSON.stringify(state.history));
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
            const newMove = new Move(moving.start, moving.target, moving.flag ? moving.flag : MoveFlag.NoFlag);

            if(state.board){
                const str = MoveUtility.GetMoveNameSAN(newMove, state.board);
                moving.moveString = str;
            }
            state.gameAction.move = {
                start: moving.start,
                target: moving.target,
                flag: moving.flag,
            };

            console.log("redux", moving);
            state.history.push(moving);
            state.lastTime = Date.now();
            state.gameState.turn = 1 - state.gameState.turn;
            sessionStorage.setItem("room", JSON.stringify(state.detail));
            sessionStorage.setItem("state", JSON.stringify(state.gameState));
            sessionStorage.setItem("board", JSON.stringify(state.board?.Square));
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
            sessionStorage.setItem("room", JSON.stringify(state.detail));
            sessionStorage.setItem("state", JSON.stringify(state.gameState));
            sessionStorage.setItem("board", JSON.stringify(state.board?.Square));
            sessionStorage.setItem("history", JSON.stringify(state.history));
        },
    },
});

export const roomAction = roomSlice.actions;
export default roomSlice.reducer;
