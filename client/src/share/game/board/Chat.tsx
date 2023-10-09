// import type { FC } from 'react';
// import { useState } from 'react';

// import type { Message } from '';
// import { useMessageState, usePlayerState } from ''
// import { useSocketState } from '@/utils/socket'

// export type MessageClient = {
//     room: string
//     message: Message
// }

// export const Chat: FC = () => {
//     const [message, setMessage] = useState(``)
//     const [messages] = useMessageState((state) => [state.messages])
//     const { room, username } = usePlayerState((state) => ({
//         room: state.room,
//         username: state.username,
//     }))
//     const socket = useSocketState((state) => state.socket)
//     const sendMessage = async () => {
//         socket?.emit(`createdMessage`, {
//             room: room,
//             message: { author: username, message },
//         })
//         setMessage(``)
//     }

//     const handleKeypress = (e: { keyCode: number }) => {
//         if (e.keyCode === 13) {
//             if (message) {
//                 sendMessage()
//             }
//         }
//     }
//     return (
//         <div className="chat-game-container">
//             <div className="message-game-container">
//                 {messages.map((msg, i) => {
//                     return (
//                         <div className="message-game" key={i}>
//                             <p>
//                                 <span>{msg.author}</span>: {msg.message}
//                             </p>
//                         </div>
//                     )
//                 })}
//             </div>
//             <div className="input-message-game-container">
//                 <input
//                     type="text"
//                     placeholder="New message..."
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     onKeyUp={handleKeypress}
//                 />
//                 <button
//                     onClick={() => {
//                         sendMessage()
//                     }}
//                 >
//                     Send
//                 </button>
//             </div>
//         </div>
//     )
// }

const Example = () => {
    return;
}

export default Example;