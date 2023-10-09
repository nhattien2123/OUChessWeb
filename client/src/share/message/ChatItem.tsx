import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { RootState } from 'src/app/store';
import useDocument from 'src/share/firestore/DocumentHook';
import { ROOT_URL } from 'src/config/ApiConstants';
import { messageAction } from 'src/redux/reducer/messages/messages';
import { messageState } from 'src/redux/reducer/messages/Types';
import 'src/components/messenger/Messenger.scss';

type Props = {
    chat: { [key: string]: any };
    kw: string;
};

const ChatItem: React.FC<Props> = ({ chat: chat, kw: kw }) => {
    const [user, setUser] = useState<{ [key: string]: any }>({});
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const selectedChat = useAppSelector((state: RootState) => state.messageReducer.selectedChat);
    const dispatch = useAppDispatch();

    const chatInfo = useDocument({
        _collection: 'chat',
        _id: chat.key,
    }).sort((a: { [k: string]: any }, b: { [k: string]: any }) => a.key.localeCompare(b.key));

    useEffect(() => {
        const userInfo = chatInfo[1]?.data[0] !== currentUser._id ? chatInfo[1]?.data[0] : chatInfo[1]?.data[1];
        if (chatInfo.length > 0) {
            fetch(`${ROOT_URL}/user/${userInfo}`).then((res) =>
                res.json().then((json) => {
                    const info = json.data.userInfo;
                    setUser(info);
                }),
            );
        }
    }, [chatInfo]);

    const selectChatHandler = () => {
        dispatch(
            messageAction.setSelectedChat({
                selectedChat: chat.key,
                selectedUser: user as messageState['selectedUser'],
            }),
        );
    };

    if (user.username && kw !== "" && !user.username.includes(kw)) {
        return <></>;
    }

    return (
        <>
            {chat && (
                <div
                    className={(selectedChat === chat.key ? 'selected ' : ' ') + 'chat-list-item'}
                    key={chat.id}
                    onClick={selectChatHandler}
                >
                    <div className="item-img">
                        <img src={user?.avatar} alt={user?.username}></img>
                    </div>
                    <div className="item-profile">
                        <div>{user?.username}</div>
                        <div>{chatInfo[0]?.data}</div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatItem;
