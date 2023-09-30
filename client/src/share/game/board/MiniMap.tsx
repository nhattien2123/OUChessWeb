import type { FC } from 'react'

import type { Board } from 'src/share/game/logic/board'
import type { Move, Piece } from 'src/share/game/logic/pieces'
import { checkIfSelectedPieceCanMoveHere } from 'src/share/game/logic/pieces'
import {
    FaChessPawn,
    FaChessKnight,
    FaChessBishop,
    FaChessRook,
    FaChessQueen,
    FaChessKing,
} from 'react-icons/fa'

export const MiniMap: FC<{
    board: Board
    selected: Piece | null
    moves: Move[]
}> = ({ board, selected, moves }) => {
    return (
        <div>
            {board.map((row, i) => (
                <div
                    key={i}
                    className="mini-map"
                >
                    {row.map((tile, j) => {
                        const bg = `${(i + j) % 2 === 0 ? `#a5a5a5` : `#676767`}`
                        const isSelected = selected?.getId() === tile.piece?.getId?.()
                        const canMove = checkIfSelectedPieceCanMoveHere({
                            selected,
                            moves,
                            tile,
                        })

                        return (
                            <div
                                key={j}
                                className={`mini-map-tile-move ${canMove ? 'can-move' : ''
                                    } ${isSelected ? 'selected' : ''}`}
                            >
                                {tile && (
                                    <>
                                        {tile.piece?.type === `pawn` && <FaChessPawn />}
                                        {tile.piece?.type === `knight` && <FaChessKnight />}
                                        {tile.piece?.type === `bishop` && <FaChessBishop />}
                                        {tile.piece?.type === `rook` && <FaChessRook />}
                                        {tile.piece?.type === `queen` && <FaChessQueen />}
                                        {tile.piece?.type === `king` && <FaChessKing />}
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
    )
}
