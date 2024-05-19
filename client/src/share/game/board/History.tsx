import { useEffect, useState, type FC } from "react";

import type { Board, Position, MoveTypes, Piece } from "src/interfaces/gameplay/chess";
import { useHistoryState } from "src/components/game/Game";
import "src/share/game/board/Board";
import { useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import * as MoveUtility from "src/interfaces/gamecore/helper/MoveUtility";
import Move, { MoveFlag } from "src/interfaces/gamecore/board/Move";
import BoardCore from "src/interfaces/gamecore/board/Board";

export type History = {
    board: Board;
    from: Position;
    to: Position;
    capture: Piece | null;
    type: MoveTypes;
    steps: Position;
    piece: Piece;
};

const convertCoords = (x: number, y: number) => {
    return { y: y + 1, x: numberMap[x] };
};

const numberMap: {
    [key: number]: string;
} = {
    0: `a`,
    1: `b`,
    2: `c`,
    3: `d`,
    4: `e`,
    5: `f`,
    6: `g`,
    7: `h`,
};

const uppercase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const getLastFive = (arr: History[]) => {
    if (arr.length < 5) return arr;
    return arr.slice(arr.length - 5, arr.length);
};

export const HistoryPanel: FC = () => {
    const history = useHistoryState((state) => state.history);
    const [historys, setHistory] = useState<string[]>([]);
    const allGameMove = useAppSelector((root: RootState) => root.roomReducer.history);
    const board = useAppSelector((root: RootState) => root.roomReducer.board);
    const turn = useAppSelector((root: RootState) => root.roomReducer.gameState.turn);

    useEffect(() => {
        if (board) {
            if (allGameMove.length > 0) {
                console.log(allGameMove);
            }
        }
    }, [turn]);

    return (
        <div className="history">
            <h3>LỊCH SỬ NƯỚC ĐI</h3>
            {allGameMove.map((move) => {
                return (
                    <>
                        <div style={{ color: "#fff" }}>{move.moveString}</div>
                    </>
                );
            })}

            {/* {getLastFive(history).map((h, i) => {
                const from = convertCoords(h.from.x, h.from.y)
                const to = convertCoords(h.to.x, h.to.y)
                return (
                    <p key={i}>
                        {uppercase(h.piece?.color)} {uppercase(h.piece?.type)}
                        <span>
                            {` `}from{` `}
                        </span>
                        {from.x + from.y}
                        <span>
                            {` `}to{` `}
                        </span>
                        {to.x + to.y}
                    </p>
                )
            })} */}
        </div>
    );
};
