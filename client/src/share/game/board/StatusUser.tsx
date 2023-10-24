import { FC, useEffect } from 'react'

import { playerActions } from "src/redux/reducer/player/PlayerReducer";
import { gameSettingActions } from "src/redux/reducer/gameSettings/GameSettingsReducer";
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { RootState } from "src/app/store";

export const StatusUser: FC = () => {
    const username = useAppSelector((state: RootState) => state.userReducer.currentUser.username);
    const usernameOpponent = useAppSelector((state: RootState) => state.opponentReducer.name);
    const avatar = useAppSelector((state: RootState) => state.userReducer.currentUser.avatar);
    const avatarOpponent = useAppSelector((state: RootState) => state.opponentReducer.avatar);

    useEffect(() => {

    }, [])

    return (<>
        <div className="player-container">
            <div className="player-bar">
                <div className="user-avatar">
                    <img src={avatar} alt={username} />
                </div>
                <div className="user-info">
                    <div className="user-name">
                        {username}
                    </div>
                </div>
            </div>
        </div>
        <div className="opponent-container">
            <div className="opponent-bar">
                <div className="opponent-avatar">
                    <img src={avatarOpponent} alt={usernameOpponent} />
                </div>
                <div className="opponent-info">
                    <div className="opponent-name">
                        {usernameOpponent}
                    </div>
                </div>
            </div>
        </div>
    </>)
}

