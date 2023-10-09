import type { FC } from 'react'

import type { Board, Position } from 'src/share/game/logic/board'
import type { MoveTypes, Piece } from 'src/share/game/logic/pieces'
import { useHistoryState } from 'src/components/game/Game'
import 'src/share/game/board/Board'

export type History = {
    board: Board
    from: Position
    to: Position
    capture: Piece | null
    type: MoveTypes
    steps: Position
    piece: Piece
}

const convertCoords = (x: number, y: number) => {
    return { y: y + 1, x: numberMap[x] }
}

const numberMap: {
    [key: number]: string
} = {
    0: `a`,
    1: `b`,
    2: `c`,
    3: `d`,
    4: `e`,
    5: `f`,
    6: `g`,
    7: `h`,
}

const uppercase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

const getLastFive = (arr: History[]) => {
    if (arr.length < 5) return arr
    return arr.slice(arr.length - 5, arr.length)
}

export const HistoryPanel: FC = () => {
    const history = useHistoryState((state) => state.history)
    return (
        <div className="history">
            <h1>History</h1>
            {getLastFive(history).map((h, i) => {
                const from = convertCoords(h.from.x, h.from.y)
                const to = convertCoords(h.to.x, h.to.y)
                return (
                    <p key={i}>
                        {uppercase(h.piece?.color)} {uppercase(h.piece?.type)}
                        <span>
                            {` `}from{` `}
                        </span>
                        {from.x + from.y}
                        <span>
                            {` `}to{` `}
                        </span>
                        {to.x + to.y}
                    </p>
                )
            })}
        </div>
    )
}