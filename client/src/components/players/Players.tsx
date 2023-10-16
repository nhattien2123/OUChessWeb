import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import 'src/components/players/Players.scss';
type Props = object;

const Players = (props: Props) => {
    const nav = useNavigate();
    const [p] = useSearchParams();

    useEffect(() => {
        console.log({ p });
    }, []);

    return (
        <>
            <div className="players-main">
                <div className="players-title">Danh sách người chơi</div>
                <div className="players-list">
                    <div className="players-item">
                        <div className="player-img">
                            <img
                                src="https://res.cloudinary.com/de0pt2lzw/image/upload/v1697038027/flbjvlhtpjfpaoupidim.jpg"
                                alt="img"
                            />
                        </div>
                        <div className="player-info">
                            <div className="player-name">username</div>
                            <div className="player-elo">elo: 0</div>
                        </div>
                    </div>
                    <div className="players-item">
                        <div className="player-img">
                            <img
                                src="https://res.cloudinary.com/de0pt2lzw/image/upload/v1697038027/flbjvlhtpjfpaoupidim.jpg"
                                alt="img"
                            />
                        </div>
                        <div className="player-info">
                            <div className="player-name">username</div>
                            <div className="player-elo">elo: 0</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Players;
