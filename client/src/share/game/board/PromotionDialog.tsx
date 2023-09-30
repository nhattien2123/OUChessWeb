import React, { FC } from 'react';
import { Color, Move, Piece, PieceType, getTile, oppositeColor, shouldPromotePawn } from '../logic/pieces';
import { Board, Tile, copyBoard } from '../logic/board';
import { isPawn } from '../logic/pieces/pawn';
import { MovingTo } from 'src/components/game/Game';



const PromoteDialog: FC<{
    showPromotionDialog: boolean;
    setShowPromotionDialog: (showPromotionDialog: boolean) => void;
    board: Board
    setBoard: React.Dispatch<React.SetStateAction<Board>>
    tile: Tile,
    selected: Piece | null
    setSelected: (piece: Piece | null) => void
    lastSelected: Tile | null
    setLastSelected: (lastSelected: Tile | null) => void
    movingTo: MovingTo | null
    setMovingTo: (movingTo: MovingTo | null) => void
    setTurn: React.Dispatch<React.SetStateAction<Color>>
    setMoves: (moves: Move[]) => void
}> = ({
    showPromotionDialog,
    setShowPromotionDialog,
    board,
    setBoard,
    tile,
    selected,
    setSelected,
    lastSelected,
    setLastSelected,
    movingTo,
    setMovingTo,
    setTurn,
    setMoves
}) => {
        const handleSelectPieceType = (pieceType: PieceType) => {
            setBoard((prev) => {
                const newBoard = copyBoard(prev)
                console.log(newBoard);
                const selectedTile = selected ? getTile(newBoard, selected.position) : null;
                const tileToMoveTo = getTile(newBoard, tile.position)
                console.log(selectedTile)
                console.log(selected);
                if (tileToMoveTo && selectedTile && isPawn(selectedTile.piece) && shouldPromotePawn({ tile })) {
                    selectedTile.piece.type = pieceType;
                    selectedTile.piece.id = selectedTile.piece.id + 2
                    tileToMoveTo.piece = selectedTile.piece
                        ? { ...selectedTile.piece, position: tile.position }
                        : null
                    selectedTile.piece = null
                }

                return newBoard;
            });

            setShowPromotionDialog(false);

            setTurn((prev) => oppositeColor(prev))
            setMovingTo(null)
            setMoves([])
            setSelected(null)
            setLastSelected(null)
        };

        return (
            <>
                {showPromotionDialog &&
                    <div className="promotion-dialog">
                        <div className="promotion-row">
                            <h3>Chọn quân cờ bạn muốn thăng cấp</h3>
                        </div>
                        <div className="promotion-row">
                            <div className="piece-buttons">
                                <button onClick={() => handleSelectPieceType('queen')}>
                                    <img src="path/to/queen.png" alt="Queen" />
                                    Hoa hậu (Queen)
                                </button>
                                <button onClick={() => handleSelectPieceType('rook')}>
                                    <img src="path/to/rook.png" alt="Rook" />
                                    Xe (Rook)
                                </button>
                                <button onClick={() => handleSelectPieceType('bishop')}>
                                    <img src="path/to/bishop.png" alt="Bishop" />
                                    Tượng (Bishop)
                                </button>
                                <button onClick={() => handleSelectPieceType('knight')}>
                                    <img src="path/to/knight.png" alt="Knight" />
                                    Mã (Knight)
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </>
        );
    }

export default PromoteDialog;
