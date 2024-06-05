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
import { roomAction } from "src/redux/reducer/room/RoomReducer";
import { GameResult } from "src/interfaces/gamecore/result/GameResult";
import { isDiffSet } from "@react-three/fiber/dist/declarations/src/core/utils";

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
    const room = useAppSelector((state: RootState) => state.roomReducer.detail);
    const whiteTimer = useAppSelector((state: RootState) => state.roomReducer.gameState.whiteTimer);
    const blackTimer = useAppSelector((state: RootState) => state.roomReducer.gameState.blackTimer);
    const [showPromotionDialog, setShowPromotionDialog] = useState<boolean>(false);
    const [cameraDefault, setCameraDefault] = useState(new Vector3(0, 0, 0));
    const [selected, setSelected] = useState<number | null>(null);
    const [targeted, setTargeted] = useState<number | null>(null);
    const [moves, setMoves] = useState<number[]>([]);
    const [endGame, setEndGame] = useState<EndGame | null>(null);
    const [lastSelected, setLastSelected] = useState<number | null>(null);
    const [end, setEnd] = useState<number>(-1);
    const nav = useNavigate();
    const dispatch = useAppDispatch();

    const roomState = useAppSelector((state: RootState) => state.roomReducer);
    const endType = useAppSelector((state: RootState) => state.roomReducer.endGame);

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

    const checkWinner = (playerColor: number, result: GameResult) => {
        const whiteWin = [GameResult.BlackTimeout, GameResult.BlackIsMated, GameResult.BlackIllegalMove];
        const blackWin = [GameResult.WhiteTimeout, GameResult.WhiteIsMated, GameResult.WhiteIllegalMove];
        const draw = [
            GameResult.Stalemate,
            GameResult.Repetition,
            GameResult.FiftyMoveRule,
            GameResult.InsufficientMaterial,
            GameResult.DrawByArbiter,
        ];
        const nothing = [GameResult.NotStarted, GameResult.InProgress];

        if (!endType || !playerColor) {
            return null; // or handle invalid input appropriately
        }

        const isWhiteWin = whiteWin.includes(endType);
        const isBlackWin = blackWin.includes(endType);

        if (isWhiteWin) {
            if (playerColor === 0) return 0;
            return 1;
        } else if (isBlackWin) {
            if (playerColor === 1) return 0;
            return 1;
        } else if (draw.includes(result)) {
            return 2;
        } else {
            return -1; // or handle unexpected result appropriately
        }
    };

    useEffect(() => {
        if (endType) {
            const isWin = checkWinner(playerColor, endType);
            if (isWin === 0) {
                setEnd(1);
            } else if (isWin === 1){
                setEnd(2);
            } else if (isWin === 2){
                setEnd(3);
            }
        }
    }, [endType]);

    return (
        <div className="container-chess">
            <Sidebar board={board} moves={moves} selected={selected} />
            {room?.id && <Chat />}
            <StatusBar />
            <GameOverScreen endGame={endGame} endState={end} />
            <Loader />
            <StatusUser whiteTimer={whiteTimer} blackTimer={blackTimer} />
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
                    blackTimer={blackTimer}
                    whiteTimer={whiteTimer}
                />
            </Canvas>
        </div>
    );
};

export default Game;
