import Move from "src/interfaces/gamecore/board/Move";
import { toast } from "react-toastify";
import type { MovingTo } from "src/components/game/Game";
import type { Message } from "src/redux/reducer/messageMatch/Types";
import { opponentActions } from "src/redux/reducer/opponent/OpponentReducer";
import { playerActions } from "src/redux/reducer/player/PlayerReducer";
import { messageMatchActions } from "src/redux/reducer/messageMatch/MessageMatchReducer";
import { gameSettingActions } from "src/redux/reducer/gameSettings/GameSettingsReducer";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { Color, PieceType } from "src/interfaces/gameplay/chess";
import { RootState } from "src/app/store";
import { LeaveRoom } from "src/share/game/board/Sidebar";
import RoomReducer, { roomAction } from "src/redux/reducer/room/RoomReducer";
import { matchActions } from "src/redux/reducer/match/MatchReducer";
import { socket } from "src";
import { Moving } from "src/redux/reducer/room/Types";
import * as UserTypes from "src/redux/reducer/user/Types";
import { GameResult } from "src/interfaces/gamecore/result/GameResult";
import { Friend } from "src/redux/reducer/profile/Types";
import { userActions } from "src/redux/reducer/user/UserReducer";
import * as RoomTypes from "src/redux/reducer/room/Types";
import { CSSProperties, useEffect, useState } from "react";
import {DrawRequestNotify} from "src/share/game/board/Sidebar";
import Cookies from "js-cookie";

export type playerJoinedServer = {
    roomId: string;
    username: string;
    color: Color;
    playerCount: number;
    avatar: string;
};

export type CameraMove = {
    position: [number, number, number];
    room: string;
    color: Color;
};

export type OpponentUser = {
    roomId: string;
    name: string;
    avatar: string;
    color: Color;
    playerCount: number;
};



export interface Room {
    id: string;
    title: string;
    player: (UserTypes.User & { color: number })[];
}

export const useSockets = (): void => {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const username = useAppSelector((state: RootState) => state.userReducer.currentUser.username);
    const avatar = useAppSelector((state: RootState) => state.userReducer.currentUser.avatar);
    const opponentColor = useAppSelector((state: RootState) => state.opponentReducer.color);
    const friends = useAppSelector((state: RootState) => state.userReducer.friends);

    const Socket = socket;

    useEffect(() => {
        socketInitializer(currentUser._id);
        return () => {
            Socket.removeAllListeners();
            if (Socket) {
                Socket.disconnect();
            }
        };
    }, [currentUser, Socket]);

    const socketInitializer = (userId: string) => {
        socket.on(`newIncomingMessage`, (msg: Message) => {
            dispatch(messageMatchActions.addMessage({ messages: msg }));
        });

        socket.on(`playerJoined`, (data: playerJoinedServer) => {
            const split = data.username.split(`#`);
            const message: Message = {
                author: `System`,
                message: `${split[0]} has joined ${data.roomId}`,
            };

            dispatch(
                messageMatchActions.addMessage({
                    messages: message,
                }),
            );
            if (split[1] === userId) {
                if (data.playerCount === 0) {
                    if (!opponentColor || opponentColor === `black`)
                        dispatch(playerActions.setPlayerColor({ playerColor: `white` }));
                    else dispatch(playerActions.setPlayerColor({ playerColor: `black` }));
                }
                dispatch(playerActions.setJoinedRoom({ joinedRoom: true }));
            } else {
                socket.emit(`existingPlayer`, {
                    roomId: data.roomId,
                    name: `${username}#${userId}`,
                    avatar: `${avatar}`,
                    color: `white`,
                    playerCount: data.playerCount,
                });
                dispatch(opponentActions.setName({ name: split[0] }));
                dispatch(opponentActions.setAvatar({ avatar: data.avatar }));
                // if (playerColor === `black`) dispatch(opponentActions.setColor({ color: `white` }));
                // else dispatch(opponentActions.setColor({ color: `black` }));
            }
        });

        socket.on(`leftRoom`, (data: LeaveRoom) => {
            console.log("Left Room");
            dispatch(playerActions.setJoinedRoom({ joinedRoom: false }));
        });

        socket.on(`clientExistingPlayer`, (data: OpponentUser) => {
            const split = data.name.split(`#`);
            console.log(split + " 2");
            if (split[1] !== userId) {
                dispatch(opponentActions.setName({ name: split[0] }));
                dispatch(opponentActions.setAvatar({ avatar: data.avatar }));
                if (data.color === `black`) dispatch(opponentActions.setColor({ color: `white` }));
                else dispatch(opponentActions.setColor({ color: `black` }));
                if (data.playerCount === 1) {
                    if (data.color !== `black`) dispatch(playerActions.setPlayerColor({ playerColor: `black` }));
                    else dispatch(playerActions.setPlayerColor({ playerColor: `white` }));
                }
            }
        });

        socket.on(`cameraMoved`, (data: CameraMove) => {
            dispatch(opponentActions.setPosition({ position: data.position }));
        });

        socket.on(`moveMade`, (data: MovingTo) => {
            dispatch(gameSettingActions.setMovingTo({ movingTo: data }));
        });

        socket.on(`playersInRoom`, (data: number) => {
            if (data === 2) {
                dispatch(gameSettingActions.setGameStarted({ gameStarted: true }));
            }
        });

        socket.on(`promotedPawn`, (data: PieceType) => {
            dispatch(gameSettingActions.setPromotePawn({ promotePawn: data }));
            dispatch(gameSettingActions.setIsPromotePawn({ isPromotePawn: true }));
        });

        socket.on(`newError`, (err: string) => {
            toast.error(err, {
                toastId: err,
            });
        });

        socket.on("acceptedRequest", (friend: Friend) => {
            toast.success(`${friend.recipient.username} đã chấp nhận lời mời kết bạn`);
        });

        socket.on("addRequest", (friend: Friend) => {
            const newList = [...friends, friend];
            dispatch(userActions.reqSetFriends({ friends: newList }));
        });

        socket.on("removeRequest", (friend: Friend) => {
            const newList = friends.filter((f: Friend) => {
                return f.recipient._id !== friend.recipient._id;
            });
            dispatch(userActions.reqSetFriends({ friends: newList }));
        });

        //#region New Scoket

        // interface

        // get lits room - need redux for this.
        socket.on(`rep-get-rooms`, (rooms: Room[]) => {
            dispatch(
                matchActions.responeGettingRoom({
                    rooms: rooms,
                }),
            );
        });

        // interface
        interface rResult {
            detail: Room;
            status: number;
            color: number;
        }

        socket.on("rep-join-room", (req: rResult) => {
            const { detail, status } = req;
            if (status === 1) {
                dispatch(
                    roomAction.responseCreateRoom({
                        detail: {
                            id: detail.id,
                            title: detail.title,
                            player: detail.player,
                        },
                        color: detail.player.filter((player) => player._id === userId)[0].color,
                    }),
                );
                if (detail.player.length === 2) {
                    const opponent = detail.player.filter((player) => player._id !== userId)[0];
                    dispatch(
                        opponentActions.setDetail({
                            name: opponent.username,
                            avatar: opponent.avatar,
                            color:
                                detail.player.filter((player) => player._id !== userId)[0].color === 0
                                    ? "black"
                                    : "white",
                            status: 1,
                        }),
                    );
                    dispatch(roomAction.resquestStarting());
                    const message: Message = {
                        author: `System`,
                        message: `${opponent.username} has joined room`,
                    };

                    dispatch(
                        messageMatchActions.addMessage({
                            messages: message,
                        }),
                    );
                }
            } else if (status === 2) {
                toast.info("The room is full");
            } else if (status === 3) {
                toast.info("The server has erros. Please try again later");
            } else {
                toast.info("The server has erros. Please try again later");
            }
        });

        socket.on("req-leave-room", () => {
            // Player left
            // Clear room state.
            // Clear player state.
            // Clear opponent state.
            // Clear session.
            dispatch(roomAction.responseLeaveRoom());
            dispatch(opponentActions.clearDetail());
            toast.info("Player left");
        });

        socket.on("res-draw", () => {

            const detail = Cookies.get("room");

            if(!detail) return;

            toast(DrawRequestNotify({}, JSON.parse(detail).id), {
                closeOnClick: false,
                closeButton: false,
                pauseOnHover: false,
                position: "top-right",
                draggable: true,
            });
        });

        socket.on("req-draw-result", () => {
            toast.info("Đối phương từ chối hoà cờ");
        });

        socket.on("game-end", (result) => {
            dispatch(roomAction.endGame({EndType: GameResult.DrawByArbiter}));
        });

        socket.on("reconnect-room", () => {
            toast.info("Opponent Reconected");
            dispatch(opponentActions.setStatus({ status: 1 }));
            dispatch(roomAction.initializing());
        });

        socket.on("opponent-disconnect", () => {
            toast.info("Opponent disconect");
            dispatch(opponentActions.setStatus({ status: 0 }));
            dispatch(roomAction.opponentDisconnected());
        });

        interface InitializePack {
            detail: Room;
            gameState: RoomTypes.Room["gameState"];
            history: RoomTypes.Room["history"];
        }

        socket.on("initializing-detail", (payload: InitializePack) => {
            toast.info("init");

            const opponent = payload.detail.player.filter((player) => player._id !== userId)[0];
            dispatch(
                opponentActions.setDetail({
                    name: opponent.username,
                    avatar: opponent.avatar,
                    color:
                        payload.detail.player.filter((player) => player._id !== userId)[0].color === 0
                            ? "black"
                            : "white",
                    status: 1,
                }),
            );

            dispatch(roomAction.opponentReconneccted(payload));
        });

        socket.on("respone-continue-game", () => {
            dispatch(roomAction.requestGameContinue());
        })

        //interface
        interface mResult {
            moving: Moving;
            timer: number;
        }
        socket.on("req-send-move", (req: mResult) => {
            dispatch(
                roomAction.responseMoving({
                    moving: req.moving,
                }),
            );
        });
        //#endregion New Socket
    };
};
