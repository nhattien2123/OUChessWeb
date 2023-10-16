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

export type JoinRoomClient = {
    roomId: string | null
    username: string
}

export const RoomListComponent: FC<{
    match: Match[];
    createMatchHandler: (e: React.FormEvent) => void;
    newMatch: {
        _id: string;
        whiteId: User | null;
        blackId: User | null;
        matchName: string;
        winnerPlayer: string;
        mode: string;
    };
    setNewMatch: (newMatch: any) => void;
}> = ({
    match,
    createMatchHandler,
    newMatch,
    setNewMatch
}) => {
        const userId = useAppSelector((state: RootState) => state.userReducer.currentUser._id);
        const username = useAppSelector((state: RootState) => state.userReducer.currentUser.username);
        // const joinedRoom = useAppSelector((state: RootState) => state.playerReducer.joinedRoom);
        const roomId = useAppSelector((state: RootState) => state.playerReducer.roomId);
        const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
        const [searchRoomId, setSearchRoomId] = useState('');
        const nav = useNavigate();
        const dispatch = useAppDispatch();

        const handleRoomClick = (match: Match) => {
            sendRoom(match._id);
            // nav(`/game/live/${matchId}`);
            nav(`/game/online`);
            // handleNavigateToGame(selectedRoom)
        };

        const playQuick = () => {

        }

        const handleCreateModal = () => {
            setIsCreateModalOpen(!isCreateModalOpen)
        }

        const handleSearchModal = () => {
            // setIsSearchModalOpen(!isSearchModalOpen)
        }

        const handleCreateRoom = (e: FormEvent) => {
            e.preventDefault();
            createMatchHandler(e);
            // sendRoom();
            // nav(`/game/live/${newMatch._id}`);
            nav(`/game`);
            // setNewMatch({
            //     _id: '',
            //     whiteId: null,
            //     blackId: null,
            //     matchName: '',
            //     winnerPlayer: '',
            //     mode: '',
            // });
        }

        const sendRoom = async (matchId: string | null) => {
            if (!socket) return
            dispatch(playerActions.setRoomId({ roomId: matchId }));
            const data: JoinRoomClient = { roomId: matchId, username: `${username}#${userId}` }
            socket.emit(`joinRoom`, data)
            socket.emit(`fetchPlayers`, { roomId: matchId })
        }

        const handleSearchRoomIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchRoomId(e.target.value);
        };

        const checkCanCreateRoom = (selectedMode: string, roomName: string) => {
            if (selectedMode && roomName) {
                return true;
            } else {
                return false;
            }
        };

        return (
            <>
                <div className="buttons-room">
                    <div className="btn-room-left">
                        <button onClick={handleCreateModal} className="btn-form-create">Tạo Phòng</button>
                        <button onClick={playQuick} className="btn-form-random-matches">Chơi Nhanh</button>
                    </div>
                    <div className="btn-room-right">
                        <input
                            type="text"
                            placeholder="Nhập ID phòng"
                            value={searchRoomId}
                            onChange={handleSearchRoomIdChange}
                        />
                        <button onClick={handleSearchModal} className="btn-form-search">Tìm Kiếm Phòng</button>
                    </div>
                </div>

                {/* {isCreateModalOpen && (
                    <div className="create-room-modal">
                        <div className="modal-content">
                            <h2>Tạo Phòng</h2>
                            <label>Tên Phòng:</label>
                            <input
                                type="text"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                            />
                            <label>Thời Gian Thi Đấu:</label>
                            <input
                                type="text"
                                value={timeMatch}
                                onChange={(e) => setTimeMatch(e.target.value)}
                            />
                            <button onClick={handleCreateModal}>Hủy</button>
                            <button onClick={handleCreateRoom}>Tạo</button>
                        </div>
                    </div>
                )} */}

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
                                <option value="" disabled selected>
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
                    {match.length === 0 && <div className="no-matches-message">
                        Hiện tại không có phòng nào được tạo.
                    </div>}
                </div >
            </>
        );
    }