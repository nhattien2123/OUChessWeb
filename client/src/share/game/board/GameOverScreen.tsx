import type { FC } from 'react';
import React from 'react';
import type { EndGame } from 'src/components/game/Game';
import { VscDebugRestart } from 'react-icons/vsc';
import "src/share/game/board/Board.scss";
import { socket } from "src/index"
import { useAppSelector } from 'src/app/hooks';
import { RootState } from 'src/app/store';
import playerReducer from 'src/redux/reducer/player/PlayerReducer';

export const GameOverScreen: FC<{
    endGame: EndGame | null
}> = ({ endGame }) => {
    const roomId = useAppSelector((state: RootState) => state.playerReducer.roomId);
    const reset = () => {
        socket?.emit(`resetGame`, { roomId });
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
                    <button onClick={reset}>
                        <VscDebugRestart />
                    </button>
                </div>
            )}
        </>
    )
}