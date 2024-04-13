import type { FC } from "react";

import { checkIfSelectedPieceCanMoveHere } from "src/share/game/logic/pieces";

import "src/share/game/board/Board.scss";
import Board from "src/interfaces/gamecore/board/Board";

export const MiniMap: FC<{
    board: Board;
    selected: number | null;
    moves: number[];
}> = ({ board, selected, moves }) => {
    return (
        <div className="mini-map">
            {/* {board.map((row, i) => (
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
            ))} */}
        </div>
    );
};
