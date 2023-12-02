import type { FC } from "react"
import { uppercaseFirstLetter } from "src/util/UpperCaseFirstLetter";

import { useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";

export const StatusBar: FC = () => {
    const room = useAppSelector((state: RootState) => state.playerReducer.roomId);
    const joinedRoom = useAppSelector((state: RootState) => state.playerReducer.joinedRoom);
    const playerColor = useAppSelector((state: RootState) => state.playerReducer.playerColor);
    const gameStarted = useAppSelector((state: RootState) => state.gameSettingsReducer.gameStarted);
    const turn = useAppSelector((state: RootState) => state.gameSettingsReducer.turn);

    return (
        <div className="status-bar">
            {joinedRoom && (
                <p>
                    Room{` `}
                    <span>{room}</span>
                    {` | `}Player{` `}
                    <span>{uppercaseFirstLetter(playerColor)}</span>
                    {` | `}Turn{` `}
                    <span>{uppercaseFirstLetter(turn)}</span>
                </p>
            )}
            {!gameStarted && joinedRoom && (
                <p>Share your room name to invite another player.</p>
            )}
        </div>
    )
}
