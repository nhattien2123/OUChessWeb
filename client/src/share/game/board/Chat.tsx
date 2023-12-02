import type { FC } from "react";
import { useState } from "react";
import { socket } from "src/index";
import { useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";

export type Message = {
    author: string
    message: string
}

export type MessageClient = {
    room: string
    message: Message
}

export const Chat: FC = () => {
    const [message, setMessage] = useState(``)
    // const [messages] = useMessageState((state) => [state.messages])
    const [messages] = useAppSelector((state: RootState) => [state.messageMatchReducer.messages]);
    const roomId = useAppSelector((state: RootState) => state.playerReducer.roomId);
    const username = useAppSelector((state: RootState) => state.userReducer.currentUser.username);
    const sendMessage = async () => {
        socket?.emit(`createdMessage`, {
            roomId: roomId,
            message: { author: username, message },
        })
        setMessage(``)
    }

    const handleKeypress = (e: { keyCode: number }) => {
        if (e.keyCode === 13) {
            if (message) {
                sendMessage()
            }
        }
    }
    return (
        <div className="chat-game-container">
            <div className="message-game-container">
                {messages.map((msg, i) => {
                    return (
                        <div className="message-game" key={i}>
                            <p>
                                <span>{msg.author}</span>: {msg.message}
                            </p>
                        </div>
                    )
                })}
            </div>
            <div className="input-message-game-container">
                <input
                    type="text"
                    placeholder="New message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyUp={handleKeypress}
                />
                <button
                    onClick={() => {
                        sendMessage()
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    )
}

// const Example = () => {
//     return;
// }

// export default Example;