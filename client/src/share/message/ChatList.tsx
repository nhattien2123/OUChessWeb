import React, { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import useDocuments from '../firestore/DocumentsHook';
import useDocument from 'src/share/firestore/DocumentHook';
import ChatItem from './ChatItem';
import 'src/components/messenger/Messenger.scss';

interface Props {}

const Chat = (props: Props) => {
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const [kw, setKw] = useState('');
    const [chats, setChats] = useState<any>(null);

    const listChat = useDocument({
        _collection: 'userCharts',
        _id: currentUser._id,
    }).sort((a: { [key: string]: any }, b: { [key: string]: any }) => a.updateAt - b.updateAt);
    // .filter((kw:string) => );

    useEffect(() => {
        console.log(listChat);
    }, []);

    return (
        <>
            <div className="chat-list">
                <div className="chat-list-header">Các cuộc trò truyện</div>
                <div className="chat-list-search">
                    <input
                        type="text"
                        placeholder="Tìm kiếm ..."
                        value={kw}
                        onChange={(evt) => setKw(evt.target.value)}
                    ></input>
                </div>
                <div className="chat-list-items">
                    {listChat.length > 0 &&
                        listChat.map((c: any) => {
                            return <ChatItem chat={c} key={c.id} kw={kw} />;
                        })}
                </div>
            </div>
        </>
    );
};

export default Chat;
