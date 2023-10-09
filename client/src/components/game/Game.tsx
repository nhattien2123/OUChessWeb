import type { FC } from 'react';
import { useState } from 'react';

import { BoardComponent } from 'src/share/game/board/Board';
import { GameOverScreen } from 'src/share/game/board/GameOverScreen';
import type { History } from 'src/share/game/board/History';
import { Sidebar } from 'src/share/game/board/Sidebar';
// import { css } from '@emotion/react'
import type { Board, Tile } from 'src/share/game/logic/board';
import { createBoard } from 'src/share/game/logic/board';
import type { Color, EndGameType, Move, Piece, PieceType } from 'src/share/game/logic/pieces';
// import { Border } from 'src/models/Border';
import { Environment, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import PromoteDialog from 'src/share/game/board/PromotionDialog';
import create from 'zustand';

import { Loader } from 'src/share/game/board/Loader';
import 'src/components/game/Game.scss';
import { BoardModel } from 'src/models/Board';

export type ThreeMouseEvent = {
    stopPropagation: () => void
}

export type MovingTo = {
    move: Move
    tile: Tile
}

export type EndGame = {
    type: EndGameType
    winner: Color
}

export const useHistoryState = create<{
    history: History[]
    reset: VoidFunction
    addItem: (item: History) => void
    undo: VoidFunction
}>((set) => ({
    history: [] as History[],
    reset: () => set({ history: [] }),
    addItem: (item) => set((state) => ({ history: [...state.history, item] })),
    undo: () => set((state) => ({ history: state.history.slice(0, -1) })),
}))

// export const useGameSettingsState = create<{
//     gameType: `local` | `online`
//     setGameType: (type: `local` | `online`) => void
//     turn: Color
//     setTurn: () => void
//     resetTurn: () => void
//     gameStarted: boolean
//     setGameStarted: (started: boolean) => void
//     movingTo: MovingTo | null
//     setMovingTo: (move: MovingTo | null) => void
// }>((set) => ({
//     gameType: `online`,
//     setGameType: (type) => set({ gameType: type }),
//     turn: `white`,
//     setTurn: () => set((state) => ({ turn: oppositeColor(state.turn) })),
//     resetTurn: () => set({ turn: `white` }),
//     gameStarted: false,
//     setGameStarted: (started: boolean) => set({ gameStarted: started }),
//     movingTo: null,
//     setMovingTo: (move: MovingTo | null) => set({ movingTo: move }),
// }))

// export type Message = {
//     author: string
//     message: string
// }

// export const useMessageState = create<{
//     messages: Message[]
//     addMessage: (message: Message) => void
// }>((set) => ({
//     messages: [] as Message[],
//     addMessage: (message) =>
//         set((state) => ({ messages: [...state.messages, message] })),
// }))

// export const useOpponentState = create<{
//     position: [number, number, number]
//     mousePosition: [number, number, number]
//     setPosition: (position: [number, number, number]) => void
//     setMousePosition: (mousePosition: [number, number, number]) => void
//     name: string
//     setName: (name: string) => void
// }>((set) => ({
//     position: [0, 100, 0],
//     setPosition: (position) => set({ position }),
//     name: ``,
//     setName: (name) => set({ name }),
//     mousePosition: [0, 0, 0],
//     setMousePosition: (mousePosition) => set({ mousePosition }),
// }))

// export const usePlayerState = create<{
//     username: string
//     id: string
//     setUsername: (username: string) => void
//     room: string
//     setRoom: (room: string) => void
//     joinedRoom: boolean
//     setJoinedRoom: (joinedRoom: boolean) => void
//     playerColor: Color
//     setPlayerColor: (color: Color) => void
// }>((set) => ({
//     username: isDev ? `dev` : ``,
//     setUsername: (username) => set({ username }),
//     id: nanoid(),
//     room: isDev ? `room` : ``,
//     setRoom: (room) => set({ room }),
//     joinedRoom: false,
//     setJoinedRoom: (joinedRoom) => set({ joinedRoom }),
//     playerColor: `white`,
//     setPlayerColor: (color: Color) => set({ playerColor: color }),
// }))


export const Game: FC = () => {
    const [board, setBoard] = useState<Board>(createBoard())
    const [showPromotionDialog, setShowPromotionDialog] = useState<boolean>(false);
    const [tile, setTile] = useState<Tile>({
        position: { x: 0, y: 0 },
        piece: null,
    });
    const [selected, setSelected] = useState<Piece | null>(null)
    const [moves, setMoves] = useState<Move[]>([])
    const [endGame, setEndGame] = useState<EndGame | null>(null)
    const resetHistory = useHistoryState((state) => state.reset)
    const [turn, setTurn] = useState<Color>(`white`)
    const [lastSelected, setLastSelected] = useState<Tile | null>(null)
    const [movingTo, setMovingTo] = useState<MovingTo | null>(null)

    const reset = () => {
        setBoard(createBoard())
        setSelected(null)
        setMoves([])
        resetHistory()
        setTurn(`white`)
        setEndGame(null)
    }

    return (
        <div
            className="container-chess"
        >
            <Sidebar
                board={board}
                moves={moves}
                selected={selected}
                reset={reset}
                setBoard={setBoard}
                setTurn={setTurn}
            />
            <GameOverScreen endGame={endGame} reset={reset} />
            <Loader />
            <PromoteDialog
                showPromotionDialog={showPromotionDialog}
                setShowPromotionDialog={setShowPromotionDialog}
                board={board}
                setBoard={setBoard}
                tile={tile}
                selected={selected}
                setSelected={setSelected}
                lastSelected={lastSelected}
                setLastSelected={setLastSelected}
                movingTo={movingTo}
                setMovingTo={setMovingTo}
                setTurn={setTurn}
                setMoves={setMoves}
            />
            <Canvas shadows camera={{ position: [0, 10, 6], fov: 70 }}>
                <Environment files="dawn.hdr" />
                <BoardModel />
                <BoardComponent
                    selected={selected}
                    setSelected={setSelected}
                    board={board}
                    setBoard={setBoard}
                    moves={moves}
                    setMoves={setMoves}
                    setEndGame={setEndGame}
                    turn={turn}
                    setTurn={setTurn}
                    showPromotionDialog={showPromotionDialog}
                    setShowPromotionDialog={setShowPromotionDialog}
                    tile={tile}
                    setTile={setTile}
                    lastSelected={lastSelected}
                    setLastSelected={setLastSelected}
                    movingTo={movingTo}
                    setMovingTo={setMovingTo}
                />
            </Canvas>
        </div>
    )
}

export default Game