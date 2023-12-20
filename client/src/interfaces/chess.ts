// Board.ts
export type Position = { x: number; y: number }

export type Board = Tile[][]

export type Tile = {
    position: Position
    piece: Pawn | Piece | Rook | null
}

// index.ts
export type Piece = {
    type: PieceType
    color: Color
    id: number
    getId: () => string
    position: Position
}

export type Color = `black` | `white`
export type PieceType = `bishop` | `king` | `knight` | `pawn` | `queen` | `rook`

export type PieceArgs = {
    color: Color
    id: number
    type: PieceType
}

export type PieceFactory = PieceArgs & { position: Position }

export type Move = {
    steps: Position
    type: MoveTypes
    piece: Piece
    capture: Piece | null
    newPosition: Position
    castling?: {
        rook: Piece
        rookNewPosition: Position
        rookSteps: Position
    }
}

export const moveTypes = {
    invalid: `invalid` as const,
    valid: `valid` as const,
    capture: `capture` as const,
    captureKing: `captureKing` as const,
    captureEnPassant: `captureEnPassant` as const,
    castling: `castling` as const,
    willBeInCheck: `willBeInCheck` as const,
}

export type MoveTypes = typeof moveTypes[keyof typeof moveTypes]; // keyof typeof moveTypes sẽ trả về invalid | valid | castling | ...

export type MoveFunction<T extends Piece = Piece> = (props: {
    piece: T
    board: Board
    propagateDetectCheck: boolean
}) => Move[]

export type EndGameType = `checkmate` | `stalemate` | `threeford repetition` | `insufficient material`;

// King.ts
export type King = Piece & {
    hasMoved: boolean
}

// Rook.ts
export type Rook = Piece & { hasMoved: boolean }


// Pawn.ts
export type Pawn = Piece & {
    hasMoved: boolean
}