import { takeLatest } from "redux-saga/effects";
import { socket } from "src";
import { roomAction } from "src/redux/reducer/room/RoomReducer";
import * as TypesAction from "src/redux/reducer/room/Types";

function* createRoom(action: TypesAction.CreateRoomRequest) {
    yield socket.emit("join-room", {
        type: "new",
        title: action.payload.title,
        id: action.payload.own,
    });
}

function* joinRoom(action: TypesAction.JoinRoomRequest) {
    yield socket.emit("join-room", {
        type: "join",
        rID: action.payload.rId,
        id: action.payload.uId,
    });
}

function* moving(action: TypesAction.MovingRequest) {
    yield socket.emit("send-move", {
        rId: action.payload.rId,
        moving: action.payload.moving,
        time: action.payload.timer,
    });
}

export function* watchRoom() {
    yield takeLatest(roomAction.requestCreateRoom.type, createRoom);
    yield takeLatest(roomAction.requestJoinRoom.type, joinRoom);
    yield takeLatest(roomAction.requestMoving.type, moving);
}
