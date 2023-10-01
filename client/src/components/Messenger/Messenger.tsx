import React, { useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import uploadImage from '../../config/ImageUpload';
import useDocument from '../../share/firestore/DocumentHook';
import ChatList from '../../share/message/ChatList';
import MessageService from '../../services/message/MessageService';

import { collection, doc, getDoc, onSnapshot, orderBy, serverTimestamp, updateDoc } from 'firebase/firestore';
// import useDocuments from '@share/firestore/DocumentsHook';
import useDocuments from "../../share/firestore/DocumentsHook";
import "../Messenger/Messenger.scss"

interface Props {}

const Messenger = (props: Props) => {
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const selectedChat = useAppSelector((state: RootState) => state.messageReducer.selectedChat);
    const selectedUser = useAppSelector((state: RootState) => state.messageReducer.selectedUser);
    const [message, setMessage] = useState('')
    const [showEmoji, setShowEmoji] = useState(false)
    const ref = useRef(null);

    const _condition = useMemo(() => {
        return {
            fieldName: "chatID",
            operator: "==",
            value: selectedChat
        }
    },[selectedChat])

   const list = useDocuments({
    _collection: "messages",
    _condition: _condition,
    _limit: 100,
    _orderBy: "createdAt"
   })

   console.log({list});

    const emojiHandler = (emoji: any) => {
        setMessage((current) => current + emoji['native']);
    };

    const imageHandler = async (e: any) => {
        const imageUrl = await uploadImage(e.target.files[0], currentUser._id);
        const messID = uuidv4();
        const newMessage = {
            sendID: currentUser._id,
            type: 'image',
            content: imageUrl,
            createAt: serverTimestamp(),
        };

        MessageService.update('messages', selectedChat, { [messID]: newMessage });
        MessageService.update('chat', selectedChat, { lastMessage: 'Đã gửi một ảnh' });
    };
    const sendMessage = async () => {
        if (message === '') {
            return;
        }

        const newMessage = {
            chatID: selectedChat,
            sendID: currentUser._id,
            type: 'text',
            content: message,     
        };

        MessageService.add("messages", newMessage);
        // MessageService.update('messages', selectedChat, { [messID]: newMessage });
        MessageService.update('chat', selectedChat, { lastMessage: message });

        // SetMessages((prevMessages) => [...prevMessages, message]);
        setMessage('');
    };

    useEffect(() => {
        if (ref && ref.current) {
            // ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [list]);

    return (
        <>
            <div className="chat-container">
                <ChatList />
                <div className="chat-field">
                    <div className="chat-header">
                        <div className="header-container">
                            {selectedUser?.avatar !== "" && <img
                                className="header-image"
                                src={selectedUser?.avatar}
                                alt="avatar"
                            ></img>}
                            <div className="active">
                                <p>{selectedUser?.username}</p>
                            </div>
                        </div>
                    </div>

                    <div className="chat-page">
                        <div className="chat-inbox">
                            <div className="chat-msg">
                                <div className="chat-msg-box">
                                    {list.map((m: any, index: number) => {
                                        return (
                                            <>
                                                {m.sendID !== currentUser._id ? (
                                                    <div className="received-box">
                                                        <div className="received-box-img">
                                                            <img
                                                                src={selectedUser.avatar}
                                                                alt="avatar"
                                                            />
                                                        </div>
                                                        <div className="received-box-msg">
                                                            <div className="received-msg">
                                                                {m.type === 'text' && (
                                                                    <div className="received-text">
                                                                        {m.content}
                                                                    </div>
                                                                )}
                                                                {m.type === 'image' && (
                                                                    <img
                                                                        className="received-image"
                                                                        alt="anh"
                                                                        src={m.content}
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div ref={ref} className="sended-box">
                                                        <div className="sended-box-img">
                                                            <img src={currentUser.avatar} alt="avatar" />
                                                        </div>
                                                        <div className="sended-box-msg">
                                                            <div className="sended-msg">
                                                                {m.type === 'text' && (
                                                                    <div className="sended-text">{m.content}</div>
                                                                )}
                                                                {m.type === 'image' && (
                                                                    <img
                                                                        className="sended-image"
                                                                        alt="anh"
                                                                        src={m.content}
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })}
                                    {/* <div className="received-box">
                                        <div className="received-box-img">
                                            <img
                                                // className="header-image"
                                                src="https://res.cloudinary.com/de0pt2lzw/image/upload/v1695581895/g0owu4lsrk7jsagvtaxp.jpg"
                                                alt="avatar"
                                            />
                                        </div>
                                        <div className="received-box-msg">
                                            <div className="received-msg">Đây là tin nhắn </div>
                                        </div>
                                    </div>
                                    <div className="sended-box">
                                        <div className="sended-box-img">
                                            <img
                                                // className="header-image"
                                                src="https://res.cloudinary.com/de0pt2lzw/image/upload/v1695581895/g0owu4lsrk7jsagvtaxp.jpg"
                                                alt="avatar"
                                            />
                                        </div>
                                        <div className="sended-box-msg">
                                            <div className="sended-msg">Đây cũng là tin nhắn</div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="chat-footer">
                        <div className="chat-inputs">
                            <input
                                type="text"
                                className="input-msg"
                                placeholder="Aa..."
                                value={message}
                                onChange={(evt) => setMessage(evt.target.value)}
                            />
                            <div className="chat-inputs-feature">
                                <div className="chat-inputs-image">
                                    <input type="file" id="image" onChange={imageHandler}></input>
                                    <label htmlFor="image">IMG</label>
                                </div>
                                <div className="chat-inputs-emoji">
                                    <div
                                        className="emoji-toggle"
                                        onClick={(evt) => {
                                            evt.stopPropagation();
                                            setShowEmoji(!showEmoji);
                                        }}
                                    >
                                        Emoji
                                    </div>
                                    {showEmoji && (
                                        <div className="emoji-box">
                                            <Picker
                                                locale="vi"
                                                previewPosition="none"
                                                data={data}
                                                navPosition="bottom"
                                                onClickOutside={() => {
                                                    setShowEmoji(false);
                                                }}
                                                onEmojiSelect={emojiHandler}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="chat-inputs-text" onClick={sendMessage}>
                                    Gửi
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Messenger;
