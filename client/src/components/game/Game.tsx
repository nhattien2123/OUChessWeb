import PromoteDialog from "src/share/game/board/PromotionDialog";
import create from "zustand";
import Board from "src/interfaces/gamecore/board/Board";

import { FC, useState, useEffect } from "react";
import { BoardComponent } from "src/share/game/board/Board";
import { GameOverScreen } from "src/share/game/board/GameOverScreen";
import type { History } from "src/share/game/board/History";
import { Sidebar } from "src/share/game/board/Sidebar";
import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Loader } from "src/share/game/board/Loader";
import { BoardModel } from "src/models/Board";
import { Opponent } from "src/share/game/board/Opponent";
import { StatusBar } from "src/share/game/board/StatusBar";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { gameSettingActions } from "src/redux/reducer/gameSettings/GameSettingsReducer";
import { RootState } from "src/app/store";
import { Chat } from "src/share/game/board/Chat";
import { StatusUser } from "src/share/game/board/StatusUser";
import { Vector3 } from "three";
import { matchActions } from "src/redux/reducer/match/MatchReducer";
import { useNavigate } from "react-router-dom";
import { Color, EndGameType, Move, Tile } from "src/interfaces/gameplay/chess";

import "src/components/game/Game.scss";

export type ThreeMouseEvent = {
    stopPropagation: () => void;
};

export type MovingTo = {
    move: Move;
    tile: Tile;
};

export type EndGame = {
    type: EndGameType;
    winner: Color;
};

export const useHistoryState = create<{
    history: History[];
    reset: VoidFunction;
    addItem: (item: History) => void;
    undo: VoidFunction;
}>((set) => ({
    history: [] as History[],
    reset: () => set({ history: [] }),
    addItem: (item) => set((state) => ({ history: [...state.history, item] })),
    undo: () => set((state) => ({ history: state.history.slice(0, -1) })),
}));

const initializeStartPos = (): Board => {
    const board = new Board();
    board.LoadStartPostion();

    return board;
};

export const Game: FC = () => {
    const playerColor = useAppSelector((state: RootState) => state.roomReducer.gameState.playerColor);
    const board = useAppSelector((state: RootState) => state.roomReducer.board);
    const [showPromotionDialog, setShowPromotionDialog] = useState<boolean>(false);
    const [cameraDefault, setCameraDefault] = useState(new Vector3(0, 0, 0));
    const [selected, setSelected] = useState<number | null>(null);
    const [targeted, setTargeted] = useState<number | null>(null);
    const [moves, setMoves] = useState<number[]>([]);
    const [endGame, setEndGame] = useState<EndGame | null>(null);
    const [lastSelected, setLastSelected] = useState<number | null>(null);
    const [movingTo, setMovingTo] = useState<{start: number; target: number;} | null>(null);
    const dispatch = useAppDispatch();
    const nav = useNavigate();

    const roomState = useAppSelector((state: RootState) => state.roomReducer);

    const reset = () => {
        // setBoard(createBoard())
        // setSelected(null)
        // setMoves([])
        // resetHistory()
        // resetTurn()
        // setEndGame(null)
    };

    useEffect(() => {
        if (playerColor === 0) {
            setCameraDefault(new Vector3(0, 10, -6));
        } else {
            setCameraDefault(new Vector3(0, 10, 6));
        }
        return;
    }, [playerColor]);

    useEffect(() => {
        if (roomState.detail === null) {
            nav("/play/online");
        }
        return;
    }, [roomState]);

    return (
        <div className="container-chess">
            <Sidebar board={board} moves={moves} selected={selected} reset={reset} />
            {/* {detail && <Chat />} */}
            <StatusBar />
            <GameOverScreen endGame={endGame} />
            <Loader />
            <StatusUser />
            <PromoteDialog
                showPromotionDialog={showPromotionDialog}
                setShowPromotionDialog={setShowPromotionDialog}
                board={board}
                selected={selected}
                targeted={targeted}
            />
            <Canvas shadows camera={{ position: cameraDefault, fov: 70 }}>
                <Environment files="/dawn.hdr" />
                <Opponent />
                <BoardModel />
                <BoardComponent
                    selected={selected}
                    setSelected={setSelected}
                    targeted={targeted}
                    setTargeted={setTargeted}
                    board={board ? board : initializeStartPos()}
                    moves={moves}
                    setMoves={setMoves}
                    setEndGame={setEndGame}
                    showPromotionDialog={showPromotionDialog}
                    setShowPromotionDialog={setShowPromotionDialog}
                    lastSelected={lastSelected}
                    setLastSelected={setLastSelected}
                />
            </Canvas>
        </div>
    );
};

export default Game;
