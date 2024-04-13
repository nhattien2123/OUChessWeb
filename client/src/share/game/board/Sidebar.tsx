import type { FC } from "react";
import React from "react";

import { useHistoryState } from "src/components/game/Game";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsReverseLayoutSidebarInsetReverse } from "react-icons/bs";

import { HistoryPanel } from "src/share/game/board/History";
import { MiniMap } from "src/share/game/board/MiniMap";
import { socket } from "src/index";
import { RootState } from "src/app/store";
import { useAppSelector } from "src/app/hooks";
import { useNavigate } from "react-router-dom";
import Board from "src/interfaces/gamecore/board/Board";

export type LeaveRoom = {
    roomId?: string | null;
};

export const Sidebar: FC<{
    board: Board;
    moves: number[];
    selected: number | null;
    setBoard: (board: Board) => void;
    reset: () => void;
}> = ({ board, moves, selected, reset, setBoard }) => {
    const [show, setShow] = React.useState<boolean>(false);
    const roomId = useAppSelector((state: RootState) => state.playerReducer.roomId);
    const nav = useNavigate();

    const handleLeaveRoom = () => {
        const data: LeaveRoom = {
            roomId: roomId,
        };
        socket.emit(`leaveRoom`, data);
        nav("/play/online");
    };

    return (
        <>
            {!show && <BsReverseLayoutSidebarInsetReverse onClick={() => setShow(!show)} className="icon-sidebar" />}
            <div className="container-sidebar">
                {show && (
                    <>
                        <AiFillCloseCircle onClick={() => setShow(!show)} />
                        <MiniMap board={board} selected={selected} moves={moves} />
                        <HistoryPanel />
                        <div className="container-sidebar-button">
                            {/* <button onClick={reset}>Reset</button>
                            <button onClick={() => undo()}>Undo</button> */}
                            <button onClick={handleLeaveRoom}>Thoát</button>
                            <button onClick={() => {}}>Hoà cờ</button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
