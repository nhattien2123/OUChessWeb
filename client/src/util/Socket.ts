import { useEffect } from "react"
import { toast } from "react-toastify"
import type { MovingTo } from "src/components/game/Game"
import { socket } from "src/index";
import type { Message } from "src/redux/reducer/messageMatch/Types";
import { opponentActions } from "src/redux/reducer/opponent/OpponentReducer";
import { playerActions } from "src/redux/reducer/player/PlayerReducer";
import { messageMatchActions } from "src/redux/reducer/messageMatch/MessageMatchReducer";
import { gameSettingActions } from "src/redux/reducer/gameSettings/GameSettingsReducer";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { Color, PieceType } from "src/interfaces/gameplay/chess";
import { RootState } from "src/app/store";
import { LeaveRoom } from "src/share/game/board/Sidebar";

export type playerJoinedServer = {
    roomId: string
    username: string
    color: Color
    playerCount: number
    avatar: string
}

export type CameraMove = {
    position: [number, number, number]
    room: string
    color: Color
}

export type OpponentUser = {
    roomId: string,
    name: string,
    avatar: string,
    color: Color,
    playerCount: number,
}

export const useSockets = ({ reset }: { reset: VoidFunction }): void => {
    const dispatch = useAppDispatch();
    const roomId = useAppSelector((state: RootState) => state.playerReducer.roomId);
    const userId = useAppSelector((state: RootState) => state.userReducer.currentUser._id);
    const playerColor = useAppSelector((state: RootState) => state.playerReducer.playerColor);
    const username = useAppSelector((state: RootState) => state.userReducer.currentUser.username);
    const avatar = useAppSelector((state: RootState) => state.userReducer.currentUser.avatar);
    const opponentColor = useAppSelector((state: RootState) => state.opponentReducer.color);

    useEffect(() => {
        socket.removeAllListeners();
        socketInitializer()

        return () => {
            if (!socket.connected) {
                socket.emit(`playerLeft`, { roomId: roomId })
                // socket.disconnect()
            }
        }
    }, [playerColor])

    const socketInitializer = async () => {
        socket.on(`newIncomingMessage`, (msg: Message) => {
            dispatch(messageMatchActions.addMessage({ messages: msg }))
        })

        socket.on(`playerJoined`, (data: playerJoinedServer) => {
            const split = data.username.split(`#`)
            const message: Message = {
                author: `System`,
                message: `${split[0]} has joined ${data.roomId}`,
            }

            dispatch(messageMatchActions.addMessage({
                messages: message
            }))
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
                })
                dispatch(opponentActions.setName({ name: split[0] }));
                dispatch(opponentActions.setAvatar({ avatar: data.avatar }));
                if (playerColor === `black`)
                    dispatch(opponentActions.setColor({ color: `white` }));
                else dispatch(opponentActions.setColor({ color: `black` }));
            }
        })

        socket.on(`leftRoom`, (data: LeaveRoom) => {
            console.log("Left Room")
            dispatch(playerActions.setJoinedRoom({ joinedRoom: false }));
            reset();
        })

        socket.on(`clientExistingPlayer`, (data: OpponentUser) => {
            const split = data.name.split(`#`)
            console.log(split + " 2")
            if (split[1] !== userId) {
                dispatch(opponentActions.setName({ name: split[0] }));
                dispatch(opponentActions.setAvatar({ avatar: data.avatar }));
                if (data.color === `black`)
                    dispatch(opponentActions.setColor({ color: `white` }));
                else dispatch(opponentActions.setColor({ color: `black` }));
                if (data.playerCount === 1) {
                    if (data.color !== `black`)
                        dispatch(playerActions.setPlayerColor({ playerColor: `black` }));
                    else dispatch(playerActions.setPlayerColor({ playerColor: `white` }));
                }
            }
        })

        socket.on(`cameraMoved`, (data: CameraMove) => {
            if (playerColor === data.color) {
                return
            }
            dispatch(opponentActions.setPosition({ position: data.position }))
        })

        socket.on(`moveMade`, (data: MovingTo) => {
            dispatch(gameSettingActions.setMovingTo({ movingTo: data }))
        })

        socket.on(`gameReset`, () => {
            reset();
        })

        socket.on(`playersInRoom`, (data: number) => {
            if (data === 2) {
                dispatch(gameSettingActions.setGameStarted({ gameStarted: true }));
            }
        })

        socket.on(`promotedPawn`, (data: PieceType) => {
            dispatch(gameSettingActions.setPromotePawn({ promotePawn: data }));
            dispatch(gameSettingActions.setIsPromotePawn({ isPromotePawn: true }));
        })

        socket.on(`newError`, (err: string) => {
            toast.error(err, {
                toastId: err,
            })
        })
    }
}
