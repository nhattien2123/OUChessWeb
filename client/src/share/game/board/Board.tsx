import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import type { Position, Tile, Board } from 'src/share/game/logic/board';
import { checkIfPositionsMatch, copyBoard } from 'src/share/game/logic/board';
import type { Color, Move, Piece } from 'src/share/game/logic/pieces';
import {
    createId,
    getTile,
    detectGameOver,
    oppositeColor,
    shouldPromotePawn,
    checkIfSelectedPieceCanMoveHere,
    movesForPiece,
} from 'src/share/game/logic/pieces';
import type { ModelProps } from 'src/models/index';
import { MeshWrapper } from 'src/models/index';
import { WhiteBishopModel } from 'src/models/whitePieces/WhiteBishop';
import { WhiteKingModel } from 'src/models/whitePieces/WhiteKing';
import { WhiteKnightModel } from 'src/models/whitePieces/WhiteKnight';
import { WhitePawnModel } from 'src/models/whitePieces/WhitePawn';
import { WhiteQueenModel } from 'src/models/whitePieces/WhiteQueen';
import { WhiteRookModel } from 'src/models/whitePieces/WhiteRook';

// import { BlackBishopModel } from 'src/models/blackPieces/BlackBishop';
// import { BlackKingModel } from 'src/models/blackPieces/BlackKing';
// import { BlackKnightModel } from 'src/models/blackPieces/BlackKnight';
// import { BlackPawnModel } from 'src/models/blackPieces/BlackPawn';
// import { BlackQueenModel } from 'src/models/blackPieces/BlackQueen';
// import { BlackRookModel } from 'src/models/blackPieces/BlackRook';

import { TileModel } from 'src/models/Tile';
import type { EndGame, MovingTo, ThreeMouseEvent } from 'src/components/game/Game';
import { useHistoryState } from 'src/components/game/Game';
import { useSpring, animated } from '@react-spring/three';

import { isPawn } from 'src/share/game/logic/pieces/pawn';
import { isKing } from 'src/share/game/logic/pieces/king';
import { isRook } from 'src/share/game/logic/pieces/rook';
import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { socket } from 'src/index';

import { gameSettingActions } from "src/redux/reducer/gameSettings/GameSettingsReducer";
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { RootState } from "src/app/store";
import { matchActions } from 'src/redux/reducer/match/MatchReducer';

export type MakeMoveClient = {
    movingTo: MovingTo
    roomId: string | null | undefined
}

export type CameraMove = {
    position: [number, number, number]
    roomId: string | null | undefined
    color: Color
}

export const BoardComponent: FC<{
    selected: Piece | null
    setSelected: (piece: Piece | null) => void
    board: Board
    setBoard: React.Dispatch<React.SetStateAction<Board>>
    moves: Move[]
    setEndGame: (endGame: EndGame | null) => void
    setMoves: (moves: Move[]) => void
    showPromotionDialog: boolean
    setShowPromotionDialog: (showPromotionDialog: boolean) => void
    tile: Tile
    setTile: (tile: Tile) => void
    lastSelected: Tile | null
    setLastSelected: (lastSelected: Tile | null) => void
}> = ({
    selected,
    setSelected,
    board,
    setBoard,
    moves,
    setMoves,
    setEndGame,
    showPromotionDialog,
    setShowPromotionDialog,
    tile,
    setTile,
    lastSelected,
    setLastSelected,
}) => {
        const playerColor = useAppSelector((state: RootState) => state.playerReducer.playerColor);
        const roomId = useAppSelector((state: RootState) => state.playerReducer.roomId);
        const turn = useAppSelector((state: RootState) => state.gameSettingsReducer.turn);
        const gameStarted = useAppSelector((state: RootState) => state.gameSettingsReducer.gameStarted);
        const movingTo = useAppSelector((state: RootState) => state.gameSettingsReducer.movingTo);
        const promotePawn = useAppSelector((state: RootState) => state.gameSettingsReducer.promotePawn);
        const isPromotePawn = useAppSelector((state: RootState) => state.gameSettingsReducer.isPromotePawn);
        // const matchId = useParams();
        const dispatch = useAppDispatch();

        const [history, setHistory] = useHistoryState((state) => [
            state.history,
            state.addItem,
        ])

        const [redLightPosition, setRedLightPosition] = useState<Position>({
            x: 0,
            y: 0,
        })

        const selectThisPiece = (e: ThreeMouseEvent, tile: Tile | null) => {
            e.stopPropagation()
            const isPlayersTurn = turn === playerColor
            if (!isPlayersTurn || !gameStarted) return
            if (!tile?.piece?.type && !selected) return
            if (!tile?.piece) {
                setSelected(null)
                return
            }

            dispatch(gameSettingActions.setMovingTo({ movingTo: null }));
            setMoves(
                movesForPiece({ piece: tile.piece, board, propagateDetectCheck: true }),
            )
            setSelected(tile.piece)
            setLastSelected(tile)
            setRedLightPosition(tile.position)
        }

        const finishMovingPiece = (tile: Tile | null) => {
            if (!tile || !movingTo || !socket) return
            const selectedTile = getTile(board, movingTo.move.piece.position)
            if (!(selectedTile && isPawn(selectedTile.piece) && shouldPromotePawn({ tile }))) {
                setBoard((prev) => {
                    const newBoard = copyBoard(prev)
                    if (!movingTo.move.piece) return prev
                    const selectedTile = getTile(newBoard, movingTo.move.piece.position)
                    const tileToMoveTo = getTile(newBoard, tile.position)

                    if (!selectedTile || !tileToMoveTo) return prev

                    if (
                        isPawn(selectedTile.piece) ||
                        isKing(selectedTile.piece) ||
                        isRook(selectedTile.piece)
                    ) {
                        selectedTile.piece = { ...selectedTile.piece, hasMoved: true }
                    }

                    if (
                        isPawn(selectedTile.piece) &&
                        movingTo.move.type === `captureEnPassant`
                    ) {
                        const latestMove = history[history.length - 1]
                        const enPassantTile = newBoard[latestMove.to.y][latestMove.to.x]
                        enPassantTile.piece = null
                    }

                    if (movingTo.move.castling) {
                        const rookTile =
                            newBoard[movingTo.move.castling.rook.position.y][
                            movingTo.move.castling.rook.position.x
                            ]
                        const rookTileToMoveTo =
                            newBoard[movingTo.move.castling.rookNewPosition.y][
                            movingTo.move.castling.rookNewPosition.x
                            ]
                        if (!isRook(rookTile.piece)) return prev

                        rookTileToMoveTo.piece = {
                            ...rookTile.piece,
                            hasMoved: true,
                            position: rookTileToMoveTo.position,
                        }
                        rookTile.piece = null
                    }

                    tileToMoveTo.piece = selectedTile.piece
                        ? { ...selectedTile.piece, position: tile.position }
                        : null
                    selectedTile.piece = null
                    return newBoard
                })

                dispatch(gameSettingActions.setTurn());
                dispatch(gameSettingActions.setMovingTo({ movingTo: null }));
                setMoves([])
                setSelected(null)
                setLastSelected(null)
            } else {
                setTile(tile);
                if (playerColor === turn) {
                    setShowPromotionDialog(true);
                }
            }
        }

        useEffect(() => {
            const gameOverType = detectGameOver(board, turn)
            if (gameOverType) {
                setEndGame({ type: gameOverType, winner: oppositeColor(turn) })
                if (gameOverType === `stalemate`) {
                    dispatch(matchActions.reqPutMatchById({ matchId: roomId, match: { state: 0 } }))
                }

                if (gameOverType === `checkmate`) {
                    if (oppositeColor(turn) === `white`)
                        dispatch(matchActions.reqPutMatchById({ matchId: roomId, match: { state: 1 } }))
                    else dispatch(matchActions.reqPutMatchById({ matchId: roomId, match: { state: -1 } }))
                }

                // if (gameOverType === `checkmate`) {

                // }
            }
        }, [board, turn])

        const startMovingPiece = (e: ThreeMouseEvent, tile: Tile, nextTile: Move) => {
            e.stopPropagation()
            if (!socket) return
            const newMovingTo: MovingTo = {
                move: nextTile,
                tile: tile,
            }
            const makeMove: MakeMoveClient = {
                movingTo: newMovingTo,
                roomId: roomId,
            }
            socket.emit(`makeMove`, makeMove)
        }

        const { intensity } = useSpring({
            intensity: selected ? 0.35 : 0,
        })

        const { camera } = useThree();

        useEffect(() => {
            const interval = setInterval(() => {
                const { x, y, z } = camera.position
                socket?.emit(`cameraMove`, {
                    position: [x, y, z],
                    roomId: roomId,
                    color: playerColor,
                } satisfies CameraMove)
            }, 500)
            return () => clearInterval(interval)
        }, [camera.position, socket, roomId, playerColor])

        useEffect(() => {
            dispatch(gameSettingActions.setIsPromotePawn({ isPromotePawn: false }));
            if (!tile || !movingTo || !socket) return
            if (playerColor !== turn) {
                setBoard((prev) => {
                    const newBoard = copyBoard(prev)
                    if (!movingTo.move.piece) return prev
                    const selectedTile = getTile(newBoard, movingTo.move.piece.position)
                    const tileToMoveTo = getTile(newBoard, tile.position)

                    if (tileToMoveTo && selectedTile && isPawn(selectedTile.piece) && shouldPromotePawn({ tile })) {
                        selectedTile.piece.type = promotePawn;
                        selectedTile.piece.id = selectedTile.piece.id + 2
                        tileToMoveTo.piece = selectedTile.piece
                            ? { ...selectedTile.piece, position: tile.position }
                            : null
                        selectedTile.piece = null
                    }

                    return newBoard;
                });
                dispatch(gameSettingActions.setMovingTo({ movingTo: null }));
                dispatch(gameSettingActions.setTurn());
                setMoves([])
                setSelected(null)
                setLastSelected(null)
            }
        }, [isPromotePawn])

        return (
            <>
                <group position={[-4, -0.5, -4]}>
                    {/* <mesh position={[3.5, 5, 3.5]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#d886b7" />
      </mesh> */}
                    <OrbitControls
                        maxDistance={25}
                        minDistance={7}
                        enableZoom={true}
                        enablePan={false}
                    />
                    <pointLight
                        shadow-mapSize={[2048, 2048]}
                        castShadow
                        position={[3.5, 10, 3.5]}
                        intensity={0.65}
                        color="#ffe0ec"
                    />
                    <hemisphereLight intensity={0.5} color="#ffa4a4" groundColor="#d886b7" />

                    <animated.pointLight
                        intensity={intensity}
                        color="red"
                        position={[redLightPosition.x, 1, redLightPosition.y]}
                    />
                    {board.map((row, i) => {
                        return row.map((tile, j) => {
                            const bg = `${(i + j) % 2 === 0 ? `white` : `black`}`
                            const isSelected =
                                tile.piece && selected?.getId() === tile.piece.getId()

                            const canMoveHere = checkIfSelectedPieceCanMoveHere({
                                tile,
                                moves,
                                selected,
                            })

                            const tileId = tile.piece?.getId()
                            const pieceIsBeingReplaced =
                                movingTo?.move.piece && tile.piece && movingTo?.move.capture
                                    ? tileId === createId(movingTo?.move.capture)
                                    : false
                            const rookCastled = movingTo?.move.castling?.rook
                            const isBeingCastled =
                                rookCastled && createId(rookCastled) === tile.piece?.getId()

                            const handleClick = (e: ThreeMouseEvent) => {
                                if (movingTo) {
                                    return
                                }

                                const tileContainsOtherPlayersPiece =
                                    tile.piece && tile.piece?.color !== turn

                                if (tileContainsOtherPlayersPiece && !canMoveHere) {
                                    setSelected(null)
                                    return
                                }

                                canMoveHere
                                    ? startMovingPiece(e, tile, canMoveHere)
                                    : selectThisPiece(e, tile)
                            }

                            const props: ModelProps = {
                                position: [j, 0.5, i],
                                scale: [0.5, 0.5, 0.5],
                                color: tile.piece?.color || `white`,
                                onClick: handleClick,
                                isSelected: isSelected ? true : false,
                                wasSelected: lastSelected
                                    ? lastSelected?.piece?.getId() === tile.piece?.getId()
                                    : false,
                                canMoveHere: canMoveHere?.newPosition ?? null,
                                movingTo:
                                    checkIfPositionsMatch(
                                        tile.position,
                                        movingTo?.move.piece?.position,
                                    ) && movingTo
                                        ? movingTo.move.steps
                                        : isBeingCastled
                                            ? movingTo.move.castling?.rookSteps ?? null
                                            : null,
                                pieceIsBeingReplaced: pieceIsBeingReplaced ? true : false,
                                finishMovingPiece: () =>
                                    isBeingCastled ? null : finishMovingPiece(movingTo?.tile ?? null),
                            }

                            const pieceId = tile.piece?.getId() ?? `empty-${j}-${i}`

                            return (
                                <group key={`${j}-${i}`}>
                                    <TileModel
                                        color={bg}
                                        position={[j, 0.25, i]}
                                        onClick={handleClick}
                                        canMoveHere={canMoveHere?.newPosition ?? null}
                                    />
                                    <MeshWrapper key={pieceId} {...props}>
                                        {tile.piece?.type === `pawn` && <WhitePawnModel />}
                                        {tile.piece?.type === `rook` && <WhiteRookModel />}
                                        {tile.piece?.type === `knight` && <WhiteKnightModel />}
                                        {tile.piece?.type === `bishop` && <WhiteBishopModel />}
                                        {tile.piece?.type === `queen` && <WhiteQueenModel />}
                                        {tile.piece?.type === `king` && <WhiteKingModel />}
                                        {/* 
                                    {tile.piece?.type === `pawn` && tile.piece?.color === `black` && <BlackPawnModel />}
                                    {tile.piece?.type === `rook` && tile.piece?.color === `black` && <BlackRookModel />}
                                    {tile.piece?.type === `knight` && tile.piece?.color === `black` && <BlackKnightModel />}
                                    {tile.piece?.type === `bishop` && tile.piece?.color === `black` && <BlackBishopModel />}
                                    {tile.piece?.type === `queen` && tile.piece?.color === `black` && <BlackQueenModel />}
                                    {tile.piece?.type === `king` && tile.piece?.color === `black` && <BlackKingModel />} */}
                                    </MeshWrapper>
                                </group>
                            )
                        })
                    })}
                </group>
            </>
        )
    }
