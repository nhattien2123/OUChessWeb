
import Move from "src/interfaces/gamecore/board/Move";
import { useEffect } from "react";
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
import { roomAction } from "src/redux/reducer/room/RoomReducer";
import { matchActions } from "src/redux/reducer/match/MatchReducer";
import { socket } from "src";
import { Moving } from "src/redux/reducer/room/Types";
import * as UserTypes from "src/redux/reducer/user/Types";

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
    player: UserTypes.User[];
}

export const useSockets = ({ reset }: { reset: VoidFunction }): void => {
    const dispatch = useAppDispatch();
    const userId = useAppSelector((state: RootState) => state.userReducer.currentUser._id);
    const playerColor = useAppSelector((state: RootState) => state.playerReducer.playerColor);
    const username = useAppSelector((state: RootState) => state.userReducer.currentUser.username);
    const avatar = useAppSelector((state: RootState) => state.userReducer.currentUser.avatar);
    const opponentColor = useAppSelector((state: RootState) => state.opponentReducer.color);

    const Socket = socket;

    useEffect(() => {
        socketInitializer();

        return () => {
            if (Socket) {
                // Socket.emit(`playerLeft`, { roomId: roomId });
                Socket.disconnect();
            }
        };
    }, [socket]);

    const socketInitializer = async () => {
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
                    color: `${playerColor}`,
                    playerCount: data.playerCount,
                });
                dispatch(opponentActions.setName({ name: split[0] }));
                dispatch(opponentActions.setAvatar({ avatar: data.avatar }));
                if (playerColor === `black`) dispatch(opponentActions.setColor({ color: `white` }));
                else dispatch(opponentActions.setColor({ color: `black` }));
            }
        });

        socket.on(`leftRoom`, (data: LeaveRoom) => {
            console.log("Left Room");
            dispatch(playerActions.setJoinedRoom({ joinedRoom: false }));
            reset();
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
            if (playerColor === data.color) {
                return;
            }
            dispatch(opponentActions.setPosition({ position: data.position }));
        });

        socket.on(`moveMade`, (data: MovingTo) => {
            dispatch(gameSettingActions.setMovingTo({ movingTo: data }));
        });

        socket.on(`gameReset`, () => {
            reset();
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
                        color: detail.player.findIndex((player) => player._id === userId),
                    }),
                );
                if (detail.player.length === 2) {
                    const opponent = detail.player.filter((player) => player._id !== userId)[0];
                    dispatch(
                        opponentActions.setDetail({
                            name: opponent.username,
                            avatar: opponent.avatar,
                            color: detail.player.findIndex((player) => player._id !== userId) === 1 ? "black" : "white",
                        }),
                    );
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
            toast.info("Player left");
        });

        //interface
        interface mResult {
            moving: Moving;
            timer: number;
        }
        socket.on("req-send-move", (req: mResult) => {
            console.log(req.moving);
            dispatch(
                roomAction.responseMoving({
                    moving: req.moving,
                }),
            );
        });
        //#endregion New Socket
    };
};
