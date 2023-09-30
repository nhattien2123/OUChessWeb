import type { MoveFunction, Piece, PieceFactory } from 'src/share/game/logic/pieces'
import { getFarMoves, getBasePiece } from 'src/share/game/logic/pieces'

export const isRook = (value: Piece | Rook | null): value is Rook => {
    return value?.type === `rook`
}

export const rookMoves: MoveFunction = ({
    piece,
    board,
    propagateDetectCheck,
}) => {
    const props = { piece, board, propagateDetectCheck }
    const movesForward = getFarMoves({ direction: { x: 0, y: 1 }, ...props })
    const movesBackward = getFarMoves({ direction: { x: 0, y: -1 }, ...props })
    const movesLeft = getFarMoves({ direction: { x: -1, y: 0 }, ...props })
    const movesRight = getFarMoves({ direction: { x: 1, y: 0 }, ...props })
    return [...movesForward, ...movesBackward, ...movesLeft, ...movesRight]
}

export const createRook = ({ color, id, position }: PieceFactory): Rook => {
    return {
        hasMoved: false,
        ...getBasePiece({ color, id, type: `rook`, position }),
    }
}

export type Rook = Piece & { hasMoved: boolean }
