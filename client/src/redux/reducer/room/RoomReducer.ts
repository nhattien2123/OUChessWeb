import Board from "src/interfaces/gamecore/board/Board";
import { createSlice } from "@reduxjs/toolkit";
import * as Types from "src/redux/reducer/room/Types";
import Cookies from "js-cookie";
import { socket } from "src";
import Move, { MoveFlag } from "src/interfaces/gamecore/board/Move";

const currentRoom = Cookies.get("room");
const currentState = sessionStorage.getItem("state");
const history = sessionStorage.getItem("history");

const loadBoardDefault = (): Board => {
    const board = new Board();
    board.LoadStartPostion();
    return board;
};

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
    currentRoom && currentState !== null && history !== null
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
            socket.auth = {
                ...socket.auth,
                detail: null,
            };
            state = baseRoom;
        },
        // game action
        resquestStarting: (state) => {
            state.gameState.isStarted = true;
            const board = new Board();
            board.LoadStartPostion();
            state.board = board;
            state.lastTime = Date.now();
            socket.auth = {
                ...socket.auth,
                detail: state.detail,
            };
            socket.connect();
            sessionStorage.setItem("state", JSON.stringify(state.gameState));
            sessionStorage.setItem("history", JSON.stringify(state.history));
        },
        requestMoving: (state, action: Types.MovingRequest) => {
            state.gameAction.isAction = true;
        },
        responseMoving: (state, action: Types.MovingResponse) => {
            const { moving } = action.payload;
            state.gameAction.move = {
                start: moving.start,
                target: moving.target,
                flag: moving.flag,
            };
        },
        endMoving: (state, action: Types.MovingResponse) => {
            state.gameAction.isAction = false;
            const { moving } = action.payload;

            state.gameAction = {
                move: {
                    start: null,
                    target: null,
                },
                isPromotion: false,
                promotionPiece: "",
                isAction: false,
            };

            state.history.push(moving);
            state.lastTime = Date.now();
            state.gameState.turn = 1 - state.gameState.turn;
            Cookies.set("room", JSON.stringify(state.detail), {
                path: "/",
            });
            sessionStorage.setItem("state", JSON.stringify(state.gameState));
            sessionStorage.setItem("history", JSON.stringify(state.history));
        },
        opponentDisconnected: (state) => {
            state.gameState.isStarted = false;
        },
        opponentReconneccted: (state, action: Types.Reconnected) => {
            const moves = [] as Move[];
            for(let i = 0; i < action.payload.history.length; i++){
                const move = action.payload.history[i];
                moves[i] = new Move(move.start, move.target, move.flag ? move.flag : MoveFlag.NoFlag);
            }

            let initBoard = new Board();
            initBoard = initBoard.LoadPositionByMove(moves);
            state.board = initBoard;
            state.detail = action.payload.detail;
            state.gameState = action.payload.gameState;
            state.gameState.playerColor = 1 - action.payload.gameState.playerColor;
            state.history = action.payload.history;
            console.log(initBoard);
        },
        initializing: (state) => {},
        requestGameContinue: (state) => {
            state.gameState.isStarted = true;
        },
        tickTimer: (state) => {
            if (!state.gameAction.isAction) {
                if (state.gameState.turn === 0) {
                    state.gameState.whiteTimer -= 1000;
                } else {
                    state.gameState.blackTimer -= 1000;
                }
            }
        },
        endGame: (state, action: Types.GameEnd) => {
            const {EndType} = action.payload;
            state.endGame = EndType;
            state.gameState.isStarted = false;
            state.detail = null;
            Cookies.remove("room");
        },
        resClearMoving: (state) => {},
    },
});

export const roomAction = roomSlice.actions;
export default roomSlice.reducer;
