import type { FC } from 'react';
import React from 'react';
import type { EndGame } from 'src/components/game/Game';
import { VscDebugRestart } from 'react-icons/vsc';
import "src/share/game/board/Board.scss";

export const GameOverScreen: FC<{
    endGame: EndGame | null
    reset: () => void
}> = ({ endGame, reset }) => {
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