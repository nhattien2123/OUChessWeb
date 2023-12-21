import type { FC } from "react"

import type { Board, Move, Piece } from "src/interfaces/gameplay/chess";
import { checkIfSelectedPieceCanMoveHere } from "src/share/game/logic/pieces"
import {
    FaChessPawn,
    FaChessKnight,
    FaChessBishop,
    FaChessRook,
    FaChessQueen,
    FaChessKing,
} from "react-icons/fa"

import "src/share/game/board/Board.scss"

export const MiniMap: FC<{
    board: Board
    selected: Piece | null
    moves: Move[]
}> = ({ board, selected, moves }) => {
    return (
        <div className="mini-map">
            {board.map((row, i) => (
                <div
                    key={i}
                    className="mini-map-row"
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
                                className={`mini-map-tile-move 
                                ${isSelected ? "selected" : `${tile.piece?.color}`} 
                                ${bg === `#a5a5a5` ? "odd" : "even"} 
                                ${canMove ? "can-move" : ""
                                    }`}
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
