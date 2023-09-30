import type { FC } from 'react';
import { useState } from 'react';

import { BoardComponent } from 'src/share/game/board/Board';
import { GameOverScreen } from 'src/share/game/board/GameOverScreen';
import type { History } from 'src/share/game/board/History';
import { Sidebar } from 'src/share/game/board/Sidebar';
// import { css } from '@emotion/react'
import type { Board, Tile } from 'src/share/game/logic/board';
import { createBoard } from 'src/share/game/logic/board';
import type { Color, GameOverType, Move, Piece, PieceType } from 'src/share/game/logic/pieces';
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
export type GameOver = {
    type: GameOverType
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

export const Game: FC = () => {
    const [board, setBoard] = useState<Board>(createBoard())
    const [showPromotionDialog, setShowPromotionDialog] = useState<boolean>(false);
    const [tile, setTile] = useState<Tile>({
        position: { x: 0, y: 0 },
        piece: null,
    });
    const [selected, setSelected] = useState<Piece | null>(null)
    const [moves, setMoves] = useState<Move[]>([])
    const [gameOver, setGameOver] = useState<GameOver | null>(null)
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
        setGameOver(null)
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
            <GameOverScreen gameOver={gameOver} reset={reset} />
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
            <Canvas shadows camera={{ position: [-10, 5, 6], fov: 70 }}>
                <OrbitControls
                    maxDistance={25}
                    minDistance={7}
                    enabled={!gameOver}
                    enableZoom={true}
                />
                <Environment files="dawn.hdr" />
                <BoardModel />
                <BoardComponent
                    selected={selected}
                    setSelected={setSelected}
                    board={board}
                    setBoard={setBoard}
                    moves={moves}
                    setMoves={setMoves}
                    setGameOver={setGameOver}
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