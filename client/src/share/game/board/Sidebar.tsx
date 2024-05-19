import type { FC } from "react";
import React from "react";

import { useHistoryState } from "src/components/game/Game";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsReverseLayoutSidebarInsetReverse } from "react-icons/bs";

import { HistoryPanel } from "src/share/game/board/History";
import { MiniMap } from "src/share/game/board/MiniMap";
import { socket } from "src/index";
import { RootState } from "src/app/store";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { Router, redirect, useNavigate } from "react-router-dom";
import Board from "src/interfaces/gamecore/board/Board";
import { roomAction } from "src/redux/reducer/room/RoomReducer";

export type LeaveRoom = {
    roomId?: string | null;
};

export const Sidebar: FC<{
    board?: Board;
    moves: number[];
    selected: number | null;
    setBoard?: (board: Board) => void;
    reset: () => void;
}> = ({ board, moves, selected, reset, setBoard }) => {
    const [show, setShow] = React.useState<boolean>(false);
    const roomId = useAppSelector((state: RootState) => state.playerReducer.roomId);
    const detail = useAppSelector((state: RootState) => state.roomReducer.detail);
    const curentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const dispatch = useAppDispatch();
    const nav = useNavigate();

    const  handleLeavingRoom =  async () => {
        dispatch(roomAction.requestLeaveRoom({
            rId: detail?.id || "",
            uId: curentUser._id
        }));
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
                            <button onClick={handleLeavingRoom}>Thoát</button>
                            <button onClick={() => {}}>Hoà cờ</button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
