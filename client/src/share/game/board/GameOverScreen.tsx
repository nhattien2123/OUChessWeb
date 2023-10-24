import type { FC } from 'react';
import React from 'react';
import type { EndGame } from 'src/components/game/Game';
import { VscDebugRestart, VscDebugStepBack } from 'react-icons/vsc';
import "src/share/game/board/Board.scss";
import { socket } from "src/index"
import { useAppSelector } from 'src/app/hooks';
import { RootState } from 'src/app/store';
import playerReducer from 'src/redux/reducer/player/PlayerReducer';
import { LeaveRoom } from './Sidebar';
import { useNavigate } from 'react-router-dom';

export const GameOverScreen: FC<{
    endGame: EndGame | null
}> = ({ endGame }) => {
    const roomId = useAppSelector((state: RootState) => state.playerReducer.roomId);
    const nav = useNavigate();
    // const reset = () => {
    //     socket?.emit(`resetGame`, { roomId });
    // }

    const handleLeftGame = () => {
        const data: LeaveRoom = {
            roomId: roomId,
        }
        socket.emit(`setJoinedRoom`, data);
        socket.emit(`leaveRoom`, data);
        nav('/play/online')
    }
    return (
        <>
            {endGame && (
                <div className="container-game-over-screen">
                    <h1>
                        {endGame.type === `checkmate`
                            ? `Checkmate! ${endGame.winner} wins!`
                            : `Stalemate!`}
                    </h1>
                    <button onClick={handleLeftGame}>
                        <VscDebugStepBack />
                    </button>
                </div>
            )}
        </>
    )
}