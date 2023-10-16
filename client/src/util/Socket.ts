import { useEffect } from 'react'

import { toast } from 'react-toastify'
import type { Socket } from 'socket.io-client'
// eslint-disable-next-line import/no-named-as-default
import io from 'socket.io-client'

import type { MovingTo } from 'src/components/game/Game'
// import type {
//     SocketClientToServer,
//     SocketServerToClient,
//     playerJoinedServer,
// } from '@/pages/api/socket'

import { socket } from 'src/index';
// import { useGameSettingsState } from '@/state/game'
import type { Message } from 'src/redux/reducer/messageMatch/Types';
// import {
//     useOpponentState,
//     usePlayerState,
//     useMessageState,
// } from 'state/player'

import { opponentActions } from 'src/redux/reducer/opponent/OpponentReducer';
import { playerActions } from 'src/redux/reducer/player/PlayerReducer';
import { messageMatchActions } from 'src/redux/reducer/messageMatch/MessageMatchReducer';
import { gameSettingActions } from 'src/redux/reducer/gameSettings/GameSettingsReducer';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { Color } from 'src/share/game/logic/pieces';
import { RootState } from 'src/app/store'

// type ClientSocket = Socket<SocketServerToClient, SocketClientToServer>
// let socket: ClientSocket

// export const useSocketState = create<{
//     socket: ClientSocket | null
//     setSocket: (socket: ClientSocket) => void
// }>((set) => ({
//     socket: null,
//     setSocket: (socket) => set({ socket }),
// }))

export type playerJoinedServer = {
    roomId: string
    username: string
    color: Color
    playerCount: number
}

export type CameraMove = {
    position: [number, number, number]
    room: string
    color: Color
}

export const useSockets = ({ reset }: { reset: VoidFunction }): void => {
    const dispatch = useAppDispatch();
    const roomId = useAppSelector((state: RootState) => state.playerReducer.roomId);
    const userId = useAppSelector((state: RootState) => state.userReducer.currentUser._id);
    const playerColor = useAppSelector((state: RootState) => state.playerReducer.playerColor);
    const username = useAppSelector((state: RootState) => state.userReducer.currentUser.username);

    useEffect(() => {
        socketInitializer()

        return () => {
            if (!socket.connected) {
                socket.emit(`playerLeft`, { roomId: roomId })
                // socket.disconnect()
            }
            socket.removeAllListeners();
        }
    }, [playerColor])

    const socketInitializer = async () => {
        // await fetch(`/api/socket`)
        // socket = io()
        // setSocket(socket)

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
            console.log(split[1]);
            if (split[1] === userId) {
                dispatch(playerActions.setPlayerColor({ playerColor: data.color }));
                dispatch(playerActions.setJoinedRoom({ joinedRoom: true }));
            } else {
                socket.emit(`existingPlayer`, {
                    roomId: data.roomId,
                    name: `${username}#${userId}`,
                })
                dispatch(opponentActions.setName({ name: split[0] }));
            }
        })

        socket.on(`clientExistingPlayer`, (data: string) => {
            const split = data.split(`#`)
            if (split[1] !== userId) {
                dispatch(opponentActions.setName({ name: split[0] }));
            }
        })

        socket.on(`cameraMoved`, (data: CameraMove) => {

            console.log(playerColor, " - ", data.color);
            if (playerColor === data.color) {
                return
            }
            dispatch(opponentActions.setPosition({ position: data.position }))
        })

        socket.on(`moveMade`, (data: MovingTo) => {
            dispatch(gameSettingActions.setMovingTo({ movingTo: data }))
        })

        socket.on(`gameReset`, () => {
            reset()
        })

        socket.on(`playersInRoom`, (data: number) => {
            if (data === 2) {
                dispatch(gameSettingActions.setGameStarted({ gameStarted: true }));
            }
        })

        socket.on(`newError`, (err: string) => {
            toast.error(err, {
                toastId: err,
            })
        })
    }
}
