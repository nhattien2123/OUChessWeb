import { Match } from 'src/redux/reducer/match/Types';
import type { FC, FormEvent } from 'react';
import React, { useEffect, useState } from 'react';
import 'src/share/roomList/RoomList.scss';
import { User } from 'src/redux/reducer/user/Types';
import { socket } from 'src/index';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { RootState } from 'src/app/store';
import { useNavigate } from 'react-router-dom';
import { playerActions } from 'src/redux/reducer/player/PlayerReducer';
import { matchActions } from 'src/redux/reducer/match/MatchReducer';

export type JoinRoomClient = {
    roomId: string | null | undefined
    username: string
    avatar: string
}

export const RoomListComponent: FC<{
    match: Match[];
    newMatch: Match;
    setNewMatch: (newMatch: any) => void;
}> = ({
    match,
    newMatch,
    setNewMatch
}) => {
        const userId = useAppSelector((state: RootState) => state.userReducer.currentUser._id);
        const username = useAppSelector((state: RootState) => state.userReducer.currentUser.username);
        const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
        // const joinedRoom = useAppSelector((state: RootState) => state.playerReducer.joinedRoom);
        // const roomId = useAppSelector((state: RootState) => state.playerReducer.roomId);
        const lastestMatchId = useAppSelector((state: RootState) => state.matchReducer.lastestMatchId);
        const avatar = useAppSelector((state: RootState) => state.userReducer.currentUser.avatar);
        const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
        const [searchRoomId, setSearchRoomId] = useState('');
        const [isSearch, setIsSearch] = useState(false);
        const nav = useNavigate();
        const dispatch = useAppDispatch();

        const handleRoomClick = (match: Match) => {
            joinRoom(match._id);
            updateRoom(match);
        };

        const handleCreateModal = () => {
            setIsCreateModalOpen(!isCreateModalOpen)
        }

        const handleSearchRoom = () => {
            if (!searchRoomId) {
                setIsSearch(true);
                dispatch(matchActions.reqGetMatch({}))
            }
            else {
                setIsSearch(false);
                dispatch(matchActions.reqGetMatchById({ matchId: searchRoomId }));
            }
        }

        const handleCreateRoom = () => {
            dispatch(matchActions.reqPostAddMatch({ match: { ...newMatch, whiteId: currentUser._id } }))
        };

        const joinRoom = (matchId: string | null | undefined) => {
            if (!socket) return;
            dispatch(playerActions.setRoomId({ roomId: matchId }));
            // dispatch(matchActions.reqPutMatchById({ matchId: matchId, match: match }));
            const data: JoinRoomClient = { roomId: matchId, username: `${username}#${userId}`, avatar: avatar };
            socket.emit(`joinRoom`, data);
            socket.emit(`fetchPlayers`, { roomId: matchId });
            nav(`/game/live/${matchId}`);
        };

        const updateRoom = (match: Match) => {
            dispatch(matchActions.reqPutMatchById({ matchId: match._id, match: { ...match, blackId: currentUser._id } }));
        }

        const handleSearchRoomIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchRoomId(e.target.value);
        };

        const checkCanCreateRoom = (selectedMode: string | undefined, roomName: string | undefined) => {
            if (selectedMode && roomName) {
                return true;
            } else {
                return false;
            }
        };

        useEffect(() => {
            if (lastestMatchId != null) {
                joinRoom(lastestMatchId);
            }
        }, [lastestMatchId])

        return (
            <>
                <div className="buttons-room">
                    <div className="btn-room-left">
                        <button onClick={handleCreateModal} className="btn-form-create">Tạo Phòng</button>
                        <button className="btn-form-random-matches">Chơi Nhanh</button>
                    </div>
                    <div className="btn-room-right">
                        <input
                            type="text"
                            placeholder="Nhập ID phòng"
                            value={searchRoomId}
                            onChange={handleSearchRoomIdChange}
                        />
                        <button onClick={handleSearchRoom} className="btn-form-search">Tìm Kiếm Phòng</button>
                    </div>
                </div>

                {isCreateModalOpen && (
                    <div className="create-room-modal">
                        <div className="modal-content">
                            <h2>Tạo Phòng</h2>
                            <label>Tên Phòng:</label>
                            <input
                                type="text"
                                value={newMatch.matchName}
                                onChange={(e) => {
                                    setNewMatch({ ...newMatch, matchName: e.target.value })
                                    checkCanCreateRoom(e.target.value, newMatch.matchName)
                                }}
                            />
                            <label>Chế Độ:</label>
                            <select
                                value={newMatch.mode}
                                onChange={(e) => {
                                    setNewMatch({ ...newMatch, mode: e.target.value })
                                }}
                            >
                                <option value="" disabled>
                                    Chọn chế độ
                                </option>
                                <option value="Siêu chớp">Siêu chớp</option>
                                <option value="Chớp">Chớp</option>
                                <option value="Nhanh">Nhanh</option>
                            </select>
                            <button onClick={handleCreateModal} className="decline-button">Huỷ</button>
                            <button
                                onClick={handleCreateRoom}
                                disabled={!checkCanCreateRoom(newMatch.matchName, newMatch.mode)}
                                className="create-button">
                                Tạo
                            </button>
                        </div>
                    </div >
                )}

                <div className="room-list">
                    <h2>Danh Sách Phòng</h2>
                    {match.length > 0 &&
                        <table>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên Phòng</th>
                                    <th>Chế Độ</th>
                                    <th>Số Người Chơi</th>
                                    <th>Trạng Thái</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {match.map((matchItem, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{matchItem.matchName}</td>
                                            <td>{matchItem.mode}</td>
                                            <td></td>
                                            <td></td>
                                            <td>
                                                <button onClick={() => {
                                                    if (matchItem) {
                                                        handleRoomClick(matchItem)
                                                    }
                                                }}>Vào phòng</button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>}
                    {!isSearch && match.length === 0 && <div className="no-matches-message">
                        Hiện tại không có phòng nào được tạo.
                    </div>}
                    {isSearch && match.length === 0 && <div className="no-matches-message">
                        Không tìm thấy trận đấu bạn đang tìm!
                    </div>}
                </div>
            </>
        );
    }