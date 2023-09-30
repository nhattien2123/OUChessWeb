import type { FC } from 'react';
import React from 'react';
import type { GameOver } from 'src/components/game/Game';
import { VscDebugRestart } from 'react-icons/vsc';
import "src/share/game/board/Board.scss";

export const GameOverScreen: FC<{
    gameOver: GameOver | null
    reset: () => void
}> = ({ gameOver, reset }) => {
    return (
        <>
            {gameOver && (
                <div className="container-game-over-screen">
                    <h1>
                        {gameOver.type === `checkmate`
                            ? `Checkmate! ${gameOver.winner} wins!`
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