import type { FC } from 'react'
import React from 'react'

import type { Board } from 'src/share/game/logic/board'
import type { Color, Move, Piece } from 'src/share/game/logic/pieces'
import { useHistoryState } from 'src/components/game/Game'
import { AiFillCloseCircle } from 'react-icons/ai'
import { BsReverseLayoutSidebarInsetReverse } from 'react-icons/bs'

import { HistoryPanel } from './History'
import { MiniMap } from './MiniMap'

export const Sidebar: FC<{
    board: Board
    moves: Move[]
    selected: Piece | null
    setTurn: React.Dispatch<React.SetStateAction<Color>>
    setBoard: (board: Board) => void
    reset: () => void
}> = ({ board, moves, selected, reset, setBoard, setTurn }) => {
    const [show, setShow] = React.useState<boolean>(false)
    const [history, undoHistory] = useHistoryState((state) => [
        state.history,
        state.undo,
    ])
    const undo = () => {
        if (history.length > 0) {
            const last = history[history.length - 1]
            setBoard(last.board)
            setTurn((prev) => (prev === `white` ? `black` : `white`))
            undoHistory()
        }
    }
    return (
        <>
            {!show && (
                <BsReverseLayoutSidebarInsetReverse
                    onClick={() => setShow(!show)}
                    className="icon-sidebar"
                />
            )}
            <div className="container-sidebar">
                {show && (
                    <>
                        <AiFillCloseCircle onClick={() => setShow(!show)} />
                        <MiniMap board={board} selected={selected} moves={moves} />
                        <HistoryPanel />
                        <div className='container-sidebar-button'>
                            <button onClick={reset}>Reset</button>
                            <button onClick={() => undo()}>Undo</button>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
