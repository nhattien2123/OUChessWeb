import { FC, useEffect, useState } from "react";

import { playerActions } from "src/redux/reducer/player/PlayerReducer";
import { gameSettingActions } from "src/redux/reducer/gameSettings/GameSettingsReducer";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";

export const StatusUser: FC = () => {
    const username = useAppSelector((state: RootState) => state.userReducer.currentUser.username);
    const usernameOpponent = useAppSelector((state: RootState) => state.opponentReducer.name);
    const avatar = useAppSelector((state: RootState) => state.userReducer.currentUser.avatar);
    const avatarOpponent = useAppSelector((state: RootState) => state.opponentReducer.avatar);

    const blackTimer = useAppSelector((state: RootState) => state.roomReducer.gameState.blackTimer);
    const whiteTimer = useAppSelector((state: RootState) => state.roomReducer.gameState.blackTimer);
    const color = useAppSelector((state: RootState) => state.roomReducer.gameState.playerColor);
    const turn = useAppSelector((state: RootState) => state.roomReducer.gameState.turn);
    const isStarted = useAppSelector((state: RootState) => state.roomReducer.gameState.isStarted);
    const [whiteCounter, setWhiteCounter] = useState<number>(whiteTimer / 1000);
    const [blackCounter, setBlackCounter] = useState<number>(blackTimer / 1000);

    const MilisecondsToHourMinutes = (ms: number) => {
        // Convert milliseconds to seconds
        let totalSeconds = Math.floor(ms / 1000);

        // Calculate hours
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;

        // Calculate minutes
        const minutes = Math.floor(totalSeconds / 60);

        // Calculate remaining seconds
        const seconds = totalSeconds % 60;

        return { hours, minutes, seconds };
    };

    const Clocker = (s: number) => {
        const { minutes, seconds } = MilisecondsToHourMinutes(s * 1000);
        let flag = false;
        if (seconds < 10) {
            flag = true;
        }

        if (flag) {
            return `${minutes}:0${seconds}`;
        }
        return `${minutes}:${seconds}`;
    };

    useEffect(() => {
        if (isStarted) {
            const counter = setInterval(() => {
                if (turn === 0) {
                    setWhiteCounter((prev) => prev - 1);
                } else {
                    setBlackCounter((prev) => prev - 1);
                }
            }, 1000);

            return () => clearInterval(counter);
        }
    }, [turn, isStarted]);

    return (
        <>
            <div className="player-container">
                <div className="player-bar">
                    <div className="user-avatar">
                        <img src={avatar} alt={username} />
                    </div>
                    <div className="user-info">
                        <div className="user-name">{username}</div>
                    </div>
                    <div className={`timer ${turn === color && "your-turn"}`}>
                        {Clocker(color === 0 ? whiteCounter : blackCounter)}
                    </div>
                </div>
            </div>
            <div className="opponent-container">
                <div className="opponent-bar">
                    <div className="opponent-avatar">
                        <img src={avatarOpponent} alt={usernameOpponent} />
                    </div>
                    <div className="opponent-info">
                        <div className="opponent-name">{usernameOpponent}</div>
                    </div>
                    <div className={`timer ${turn !== color && "your-turn"}`}>
                        {Clocker(color !== 0 ? whiteCounter : blackCounter)}
                    </div>
                </div>
            </div>
        </>
    );
};
