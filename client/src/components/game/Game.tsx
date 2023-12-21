import { FC, useState, useEffect } from "react";
import { BoardComponent } from "src/share/game/board/Board";
import { GameOverScreen } from "src/share/game/board/GameOverScreen";
import type { History } from "src/share/game/board/History";
import { Sidebar } from "src/share/game/board/Sidebar";
import { createBoard } from "src/share/game/logic/Board";
import type { Board, Tile, Color, EndGameType, Move, Piece } from "src/interfaces/gameplay/chess";
import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Loader } from "src/share/game/board/Loader";
import { BoardModel } from "src/models/Board";
import { Opponent } from "src/share/game/board/Opponent";
import { StatusBar } from "src/share/game/board/StatusBar";
import { useSockets } from "src/util/Socket";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { gameSettingActions } from "src/redux/reducer/gameSettings/GameSettingsReducer";
import { RootState } from "src/app/store";
import { Chat } from "src/share/game/board/Chat";
import { StatusUser } from "src/share/game/board/StatusUser";
import { Vector3 } from "three";
import { matchActions } from "src/redux/reducer/match/MatchReducer";
import { useNavigate } from "react-router-dom";
import PromoteDialog from "src/share/game/board/PromotionDialog";
import create from "zustand";
import "src/components/game/Game.scss";

export type ThreeMouseEvent = {
    stopPropagation: () => void
}

export type MovingTo = {
    move: Move
    tile: Tile
}

export type EndGame = {
    type: EndGameType
    winner: Color
}

export const useHistoryState = create<{
    history: History[]
    reset: VoidFunction
    addItem: (item: History) => void
    undo: VoidFunction
}>((set) => ({
    history: [] as History[],
    reset: () => set({ history: [] }),
    addItem: (item) => set((state) => ({ history: [...state.history, item] })),
    undo: () => set((state) => ({ history: state.history.slice(0, -1) })),
}))

export const Game: FC = () => {
    const playerColor = useAppSelector((state: RootState) => state.playerReducer.playerColor);
    const [board, setBoard] = useState<Board>(createBoard())
    const [showPromotionDialog, setShowPromotionDialog] = useState<boolean>(false);
    const [tile, setTile] = useState<Tile>({
        position: { x: 0, y: 0 },
        piece: null,
    });
    const [cameraDefault, setCameraDefault] = useState(new Vector3(0, 0, 0));
    const [selected, setSelected] = useState<Piece | null>(null)
    const [moves, setMoves] = useState<Move[]>([])
    const [endGame, setEndGame] = useState<EndGame | null>(null)
    const resetHistory = useHistoryState((state) => state.reset)
    const [turn, setTurn] = useState<Color>(`white`)
    const [lastSelected, setLastSelected] = useState<Tile | null>(null)
    const roomId = useAppSelector((state: RootState) => state.playerReducer.roomId);
    const dispatch = useAppDispatch();
    const nav = useNavigate();

    const resetTurn = () => {
        dispatch(gameSettingActions.resetTurn());
    }

    const joinedRoom = useAppSelector((state: RootState) => state.playerReducer.joinedRoom)

    const reset = () => {
        setBoard(createBoard())
        setSelected(null)
        setMoves([])
        resetHistory()
        resetTurn()
        setEndGame(null)
    }

    useSockets({ reset });

    useEffect(() => {
        if (playerColor === "white") {
            setCameraDefault(new Vector3(0, 10, 6))
        } else {
            setCameraDefault(new Vector3(0, 10, -6))
        }
    }, [playerColor])

    useEffect(() => {
        // console.log("Test")
        dispatch(matchActions.resetLastedMatchId());
    }, [])

    return (
        <div
            className="container-chess"
        >
            <Sidebar
                board={board}
                moves={moves}
                selected={selected}
                reset={reset}
                setBoard={setBoard}
                setTurn={setTurn}
            />
            {joinedRoom && <Chat />}
            <StatusBar />
            <GameOverScreen endGame={endGame} />
            <Loader />
            <StatusUser />
            <PromoteDialog
                showPromotionDialog={showPromotionDialog}
                setShowPromotionDialog={setShowPromotionDialog}
                board={board}
                setBoard={setBoard}
                tile={tile}
                selected={selected}
                setSelected={setSelected}
                lastSelected={lastSelected}
                setLastSelected={setLastSelected}
                setMoves={setMoves}
            />
            <Canvas shadows camera={{ position: cameraDefault, fov: 70 }}>
                <Environment files="/dawn.hdr" />
                <Opponent />
                <BoardModel />
                <BoardComponent
                    selected={selected}
                    setSelected={setSelected}
                    board={board}
                    setBoard={setBoard}
                    moves={moves}
                    setMoves={setMoves}
                    setEndGame={setEndGame}
                    showPromotionDialog={showPromotionDialog}
                    setShowPromotionDialog={setShowPromotionDialog}
                    tile={tile}
                    setTile={setTile}
                    lastSelected={lastSelected}
                    setLastSelected={setLastSelected}
                />
            </Canvas>
        </div>
    )
}

export default Game