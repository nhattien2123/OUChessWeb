import React, { useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import { db } from '../../config/FirebaseConfig';
import uploadImage from '../../config/ImageUpload';
import useDocument from '../../share/firestore/DocumentHook';
import ChatList from '../../share/message/ChatList';
import MessageService from '../../services/message/MessageService';
import '../Messenger/Messenger.scss';
import { collection, doc, getDoc, onSnapshot, orderBy, serverTimestamp, updateDoc } from 'firebase/firestore';

interface Props {}

const Messenger = (props: Props) => {
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const [message, setMessage] = useState('');
    const [image, setImage] = useState<any>(null);
    const [messages, SetMessages] = useState<string[]>([]);
    const [showEmoji, setShowEmoji] = useState(false);
    // const [list, setList] = useState<any>(null);
    const ref = useRef<any>(null);

    const combineID = '6501e12f7de12e2971822b17' + '65056ed848c2bc331ff6c324';

    const list =
        useDocument({
            _collection: 'messages',
            _id: combineID,
        }) || null;

    // useEffect(() => {
    //     const unsub = onSnapshot(doc(db, 'messages', combineID), (doc) => {
    //         if (doc.exists()) {
    //             const document = Object.keys(doc.data())
    //                 .map((key: string) => ({
    //                     ...doc.data()[key],
    //                     id: key,
    //                 }))
    //                 .sort((a: any, b: any) => a.createAt - b.createAt);
    //             setList(document);
    //         }
    //     });

    //     return () => {
    //         unsub();
    //     };
    // }, [currentUser._id]);

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

        MessageService.update('messages', combineID, { [messID]: newMessage });
        MessageService.update('chat', combineID, { lastMessage: 'Đã gửi một ảnh' });
    };
    const sendMessage = async () => {
        if (message === '') {
            return;
        }

        const messID = uuidv4();
        const newMessage = {
            sendID: currentUser._id,
            type: 'text',
            content: message,
            createAt: serverTimestamp(),
        };

        MessageService.update('messages', combineID, { [messID]: newMessage });
        MessageService.update('chat', combineID, { lastMessage: message });

        SetMessages((prevMessages) => [...prevMessages, message]);
        setMessage('');
    };

    useEffect(() => {
        if (list.length > 0) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [list]);

    return (
        <>
            <div className="chat-container">
                <ChatList />
                <div className="chat-field">
                    <div className="chat-header">
                        <div className="header-container">
                            <img
                                className="header-image"
                                src="https://res.cloudinary.com/de0pt2lzw/image/upload/v1695581895/g0owu4lsrk7jsagvtaxp.jpg"
                                alt="avatar"
                            ></img>
                            <div className="active">
                                <p>Username</p>
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
                                                                // className="header-image"
                                                                src="https://res.cloudinary.com/de0pt2lzw/image/upload/v1695581895/g0owu4lsrk7jsagvtaxp.jpg"
                                                                alt="avatar"
                                                            />
                                                        </div>
                                                        <div className="received-box-msg">
                                                            <div className="received-msg">
                                                                {m.type === 'text' && (
                                                                    <div className="received-text">{m.content}</div>
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
                                                            <img
                                                                // className="header-image"
                                                                src={currentUser.avatar}
                                                                alt="avatar"
                                                            />
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
