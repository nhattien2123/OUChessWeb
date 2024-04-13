import type { FC } from "react";
import React, { useEffect, useState } from "react";

import Board from "src/interfaces/gamecore/board/Board";
import MoveGenerator from "src/interfaces/gamecore/move/MoveGenerator";
import Move from "src/interfaces/gamecore/board/Move";

import { checkIfPositionsMatch } from "src/share/game/logic/Board";
import type { ModelProps } from "src/models";
import { MeshWrapper } from "src/models";
import { WhiteBishopModel } from "src/models/whitePieces/WhiteBishop";
import { WhiteKingModel } from "src/models/whitePieces/WhiteKing";
import { WhiteKnightModel } from "src/models/whitePieces/WhiteKnight";
import { WhitePawnModel } from "src/models/whitePieces/WhitePawn";
import { WhiteQueenModel } from "src/models/whitePieces/WhiteQueen";
import { WhiteRookModel } from "src/models/whitePieces/WhiteRook";
import { TileModel } from "src/models/Tile";
import type { EndGame, MovingTo, ThreeMouseEvent } from "src/components/game/Game";
import { useSpring, animated } from "@react-spring/three";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { socket } from "src/index";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import { Color, Position } from "src/interfaces/gameplay/chess";
import { roomAction } from "src/redux/reducer/room/RoomReducer";

import * as GameResult from "src/interfaces/gamecore/result/GameResult";
import * as BoardHelper from "src/interfaces/gamecore/helper/BoardHelper";
import * as PieceFunc from "src/share/gamecore/board/Piece";
import * as Piece from "src/interfaces/gamecore/board/Piece";

export type MakeMoveClient = {
    movingTo: MovingTo;
    roomId: string | null | undefined;
};

export type CameraMove = {
    position: [number, number, number];
    roomId: string | null | undefined;
    color: Color;
};

export const BoardComponent: FC<{
    selected: number | null;
    setSelected: (piece: number | null) => void;
    targeted: number | null;
    setTargeted: (piece: number | null) => void;
    board: Board;
    setBoard: React.Dispatch<React.SetStateAction<Board>>;
    moves: number[];
    setEndGame: (endGame: EndGame | null) => void;
    setMoves: (moves: number[]) => void;
    showPromotionDialog: boolean;
    setShowPromotionDialog: (showPromotionDialog: boolean) => void;
    lastSelected: number | null;
    setLastSelected: (lastSelected: number | null) => void;
}> = ({
    selected,
    setSelected,
    targeted,
    setTargeted,
    board,
    setBoard,
    moves,
    setMoves,
    setEndGame,
    showPromotionDialog,
    setShowPromotionDialog,
    lastSelected,
    setLastSelected,
}) => {
    const playerColor = useAppSelector((state: RootState) => state.playerReducer.playerColor);
    const detail = useAppSelector((state: RootState) => state.roomReducer.detail);
    const turn = useAppSelector((state: RootState) => state.roomReducer.gameState.turn);
    const isStarted = useAppSelector((state: RootState) => state.roomReducer.gameState.isStarted);
    const whiteCounter = useAppSelector((state: RootState) => state.roomReducer.gameState.whiteTimer);
    const blackCounter = useAppSelector((state: RootState) => state.roomReducer.gameState.blackTimer);
    const moving = useAppSelector((state: RootState) => state.roomReducer.gameAction.move);
    const dispatch = useAppDispatch();

    const [redLightPosition, setRedLightPosition] = useState<Position>({
        x: 0,
        y: 0,
    });

    const moveGenerator = new MoveGenerator();
    const IsHightLigt = (board: Board, start: number | null, target: number) => {
        if (start === null) return null;
        const moves = moveGenerator.GenerateMoves(board, false);

        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            if (move.StartSquare() === start && move.TargetSquare() === target) {
                return {
                    target: move.TargetSquare(),
                    flag: move.MoveFlag(),
                };
            }
        }

        return null;
    };
    const getStep = (start: number, target: number, isWhite: boolean) => {
        console.log(start, target);
        const movingTo = {
            x: BoardHelper.FileIndex(Number(target)) - BoardHelper.FileIndex(Number(start)),
            y: BoardHelper.RankIndex(Number(target)) - BoardHelper.RankIndex(Number(start)),
        };

        if (isWhite) {
            movingTo.y = movingTo.y * -1;
        }

        return movingTo;
    };

    const selectThisPiece = (e: ThreeMouseEvent, squareIndex: number | null) => {
        e.stopPropagation();
        const isPlayersTurn = turn === board.MoveColourIndex();
        // if (!isStarted) return;
        if (!isPlayersTurn) return;
        if (!squareIndex) return;

        if (PieceFunc.PieceType(board.Square[squareIndex]) === Piece.PieceType.None && !selected) return;

        if (PieceFunc.PieceType(board.Square[squareIndex]) === Piece.PieceType.None) {
            setSelected(null);
            return;
        }

        setLastSelected(lastSelected !== squareIndex ? selected : null);
        setSelected(squareIndex);
        setRedLightPosition({
            x: BoardHelper.FileIndex(squareIndex),
            y: BoardHelper.RankIndex(squareIndex),
        });
    };

    const startMovingPiece = (e: ThreeMouseEvent, target: number) => {
        if (!socket) return;

        if (selected && target) {
            console.log(selected, target);
            dispatch(
                roomAction.requestMoving({
                    rId: detail?.id || "",
                    timer: board.IsWhiteToMove ? whiteCounter : blackCounter,
                    moving: {
                        startPiece: PieceFunc.PieceType(board.Square[selected]),
                        targetPiece: PieceFunc.PieceType(board.Square[target]),
                        start: selected,
                        target: target,
                    },
                }),
            );
        }
    };

    const finishMovingPiece = (start: number | null, target: number | null, flag: number | null) => {
        if (!target && !start) return;

        board.MakeMove(new Move(Number(start), Number(target), Number(flag)), false);

        setSelected(null);
        dispatch(roomAction.resClearMoving());
    };

    useEffect(() => {
        const gameResult = GameResult.GetGameState(board);

        if (gameResult) {
            // setEndGame({ type: gameOverType, winner: oppositeColor(turn) });
            if (
                gameResult === GameResult.GameResult.Stalemate ||
                gameResult === GameResult.GameResult.InsufficientMaterial
            ) {
                // dispatch(matchActions.reqPutMatchById({ matchId: detail?.id, match: { state: 0 } }));
                console.log("Stalement | Insu");
            }

            if (
                gameResult === GameResult.GameResult.WhiteIsMated ||
                gameResult === GameResult.GameResult.BlackIsMated
            ) {
                // if (board.IsWhiteToMove)
                //     dispatch(matchActions.reqPutMatchById({ matchId:  detail?.id, match: { state: 1 } }));
                // else dispatch(matchActions.reqPutMatchById({ matchId:  detail?.id, match: { state: -1 } }));
                console.log("Game End");
            }
        }
    }, [board]);

    // old code
    // const selectThisPiece = (e: ThreeMouseEvent, tile: Tile | null) => {
    //     e.stopPropagation()
    //     const isPlayersTurn = turn === playerColor
    //     if (!isPlayersTurn || !gameStarted) return
    //     if (!tile?.piece?.type && !selected) return
    //     if (!tile?.piece) {
    //         setSelected(null)
    //         return
    //     }
    //     dispatch(gameSettingActions.setMovingTo({ movingTo: null }));
    //     setMoves(
    //         movesForPiece({ piece: tile.piece, board, propagateDetectCheck: true }),
    //     )
    //     setSelected(tile.piece)
    //     setLastSelected(tile)
    //     setRedLightPosition(tile.position)
    // }

    // const finishMovingPiece = (tile: Tile | null) => {
    //     if (!tile || !movingTo || !socket) return
    //     const selectedTile = getTile(board, movingTo.move.piece.position)
    //     if (!(selectedTile && isPawn(selectedTile.piece) && shouldPromotePawn({ tile }))) {
    //         setBoard((prev) => {
    //             const newBoard = copyBoard(prev)
    //             if (!movingTo.move.piece) return prev
    //             const selectedTile = getTile(newBoard, movingTo.move.piece.position)
    //             const tileToMoveTo = getTile(newBoard, tile.position)

    //             if (!selectedTile || !tileToMoveTo) return prev

    //             if (
    //                 isPawn(selectedTile.piece) ||
    //                 isKing(selectedTile.piece) ||
    //                 isRook(selectedTile.piece)
    //             ) {
    //                 selectedTile.piece = { ...selectedTile.piece, hasMoved: true }
    //             }

    //             if (
    //                 isPawn(selectedTile.piece) &&
    //                 movingTo.move.type === `captureEnPassant`
    //             ) {
    //                 const latestMove = history[history.length - 1]
    //                 const enPassantTile = newBoard[latestMove.to.y][latestMove.to.x]
    //                 enPassantTile.piece = null
    //             }

    //             if (movingTo.move.castling) {
    //                 const rookTile =
    //                     newBoard[movingTo.move.castling.rook.position.y][
    //                     movingTo.move.castling.rook.position.x
    //                     ]
    //                 const rookTileToMoveTo =
    //                     newBoard[movingTo.move.castling.rookNewPosition.y][
    //                     movingTo.move.castling.rookNewPosition.x
    //                     ]
    //                 if (!isRook(rookTile.piece)) return prev

    //                 rookTileToMoveTo.piece = {
    //                     ...rookTile.piece,
    //                     hasMoved: true,
    //                     position: rookTileToMoveTo.position,
    //                 }
    //                 rookTile.piece = null
    //             }

    //             tileToMoveTo.piece = selectedTile.piece
    //                 ? { ...selectedTile.piece, position: tile.position }
    //                 : null
    //             selectedTile.piece = null
    //             return newBoard
    //         })

    //         dispatch(gameSettingActions.setTurn());
    //         dispatch(gameSettingActions.setMovingTo({ movingTo: null }));
    //         setMoves([])
    //         setSelected(null)
    //         setLastSelected(null)
    //     } else {
    //         setTile(tile);
    //         if (playerColor === turn) {
    //             setShowPromotionDialog(true);
    //         }
    //     }
    // }

    // useEffect(() => {
    //     const gameOverType = detectGameOver(board, turn)
    //     if (gameOverType) {
    //         setEndGame({ type: gameOverType, winner: oppositeColor(turn) })
    //         if (gameOverType === `stalemate` || gameOverType === `insufficient material`) {
    //             dispatch(matchActions.reqPutMatchById({ matchId: roomId, match: { state: 0 } }))
    //         }

    //         if (gameOverType === `checkmate`) {
    //             if (oppositeColor(turn) === `white`)
    //                 dispatch(matchActions.reqPutMatchById({ matchId: roomId, match: { state: 1 } }))
    //             else dispatch(matchActions.reqPutMatchById({ matchId: roomId, match: { state: -1 } }))
    //         }
    //     }
    // }, [board, turn])

    // const startMovingPiece = (e: ThreeMouseEvent, tile: Tile, nextTile: Move) => {
    //     e.stopPropagation()
    //     if (!socket) return
    //     const newMovingTo: MovingTo = {
    //         move: nextTile,
    //         tile: tile,
    //     }
    //     const makeMove: MakeMoveClient = {
    //         movingTo: newMovingTo,
    //         roomId: roomId,
    //     }
    //     socket.emit(`makeMove`, makeMove)
    // }

    // old code

    const { intensity } = useSpring({
        intensity: selected ? 0.35 : 0,
    });

    const { camera } = useThree();

    useEffect(() => {
        const interval = setInterval(() => {
            const { x, y, z } = camera.position;
            socket?.emit(`cameraMove`, {
                position: [x, y, z],
                roomId: detail?.id,
                color: playerColor,
            } satisfies CameraMove);
        }, 500);
        return () => clearInterval(interval);
    }, [camera.position, socket, detail, playerColor]);

    // useEffect(() => {
    //     dispatch(gameSettingActions.setIsPromotePawn({ isPromotePawn: false }));
    //     if (!tile || !movingTo || !socket) return
    //     if (playerColor !== turn) {
    //         setBoard((prev) => {
    //             const newBoard = copyBoard(prev)
    //             if (!movingTo.move.piece) return prev
    //             const selectedTile = getTile(newBoard, movingTo.move.piece.position)
    //             const tileToMoveTo = getTile(newBoard, tile.position)

    //             if (tileToMoveTo && selectedTile && isPawn(selectedTile.piece) && shouldPromotePawn({ tile })) {
    //                 selectedTile.piece.type = promotePawn;
    //                 selectedTile.piece.id = selectedTile.piece.id + 2
    //                 tileToMoveTo.piece = selectedTile.piece
    //                     ? { ...selectedTile.piece, position: tile.position }
    //                     : null
    //                 selectedTile.piece = null
    //             }

    //             return newBoard;
    //         });
    //         dispatch(gameSettingActions.setMovingTo({ movingTo: null }));
    //         dispatch(gameSettingActions.setTurn());
    //         setMoves([])
    //         setSelected(null)
    //         setLastSelected(null)
    //     }
    // }, [isPromotePawn])

    useEffect(() => {
        if (detail === null) {
            window.history.back();
        }
    }, []);

    useEffect(() => {}, []);

    return (
        <>
            <group position={[-4, -0.5, -4]}>
                {/* <mesh position={[3.5, 5, 3.5]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#d886b7" />
      </mesh> */}
                <OrbitControls maxDistance={25} minDistance={7} enableZoom={true} enablePan={false} />
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
                {board.Square.map((square, i) => {
                    const file = BoardHelper.FileIndex(i);
                    const rank = BoardHelper.RankIndex(i);
                    const bg = (file + rank) % 2 === 0 ? `white` : `black`;

                    const isHightLight = IsHightLigt(board, selected, i);
                    const isSelected = selected && selected === i ? true : false;
                    let canMoveHere: Position | null = null;
                    if (isHightLight !== null) {
                        canMoveHere = {
                            x: BoardHelper.FileIndex(isHightLight.target),
                            y: BoardHelper.RankIndex(isHightLight.target),
                        };
                    }

                    const pieceIsBeingReplaced = false;
                    // movingTo?.move.piece && tile.piece && movingTo?.move.capture
                    //     ? tileId === createId(movingTo?.move.capture)
                    //     : false;

                    const handleClick = (e: ThreeMouseEvent) => {
                        // if (!isStarted) return;

                        if (selected && targeted) return;

                        const tileContainsOtherPlayersPiece =
                            square !== 0 && PieceFunc.PieceColour(square) !== turn * 8;

                        if (tileContainsOtherPlayersPiece && !canMoveHere) {
                            setSelected(null);
                            return;
                        }

                        canMoveHere ? startMovingPiece(e, i) : selectThisPiece(e, i);
                    };

                    const props: ModelProps = {
                        position: [file, 0.5, rank],
                        scale: [0.5, 0.5, 0.5],
                        color: PieceFunc.PieceColour(square) === 0 ? `white` : `black`,
                        onClick: handleClick,
                        isSelected: isSelected,
                        wasSelected: false,
                        canMoveHere: canMoveHere,
                        movingTo:
                            moving &&
                            moving.start !== null &&
                            moving.target !== null &&
                            checkIfPositionsMatch(
                                { x: BoardHelper.FileIndex(i), y: BoardHelper.RankIndex(i) },
                                {
                                    x: BoardHelper.FileIndex(Number(targeted)),
                                    y: BoardHelper.RankIndex(Number(targeted)),
                                },
                            )
                                ? getStep(moving.start, moving.target, board.IsWhiteToMove)
                                : null,
                        pieceIsBeingReplaced: false,
                        finishMovingPiece: () =>
                            finishMovingPiece(
                                moving.start,
                                moving.target,
                                moving.flag && moving.flag !== null ? moving.flag : null,
                            ),
                    };

                    return (
                        <group key={`${file}-${rank}`}>
                            <TileModel
                                color={bg}
                                position={[file, 0.25, rank]}
                                onClick={handleClick}
                                canMoveHere={canMoveHere}
                            />
                            <MeshWrapper key={i} {...props}>
                                {PieceFunc.PieceType(square) === 1 && <WhitePawnModel />}
                                {PieceFunc.PieceType(square) === 4 && <WhiteRookModel />}
                                {PieceFunc.PieceType(square) === 2 && <WhiteKnightModel />}
                                {PieceFunc.PieceType(square) === 3 && <WhiteBishopModel />}
                                {PieceFunc.PieceType(square) === 5 && <WhiteQueenModel />}
                                {PieceFunc.PieceType(square) === 6 && <WhiteKingModel />}
                                {/* 
                                    {tile.piece?.type === `pawn` && tile.piece?.color === `black` && <BlackPawnModel />}
                                    {tile.piece?.type === `rook` && tile.piece?.color === `black` && <BlackRookModel />}
                                    {tile.piece?.type === `knight` && tile.piece?.color === `black` && <BlackKnightModel />}
                                    {tile.piece?.type === `bishop` && tile.piece?.color === `black` && <BlackBishopModel />}
                                    {tile.piece?.type === `queen` && tile.piece?.color === `black` && <BlackQueenModel />}
                                    {tile.piece?.type === `king` && tile.piece?.color === `black` && <BlackKingModel />} */}
                            </MeshWrapper>
                        </group>
                    );
                })}
            </group>
        </>
    );
};
