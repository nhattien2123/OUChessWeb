import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import "../../components/Messenger/Messenger.scss"

type Props = {
  chat: { [key: string]: any };
};

const ChatItem: React.FC<Props> = ({ chat: chat }) => {
  const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
  return (
    <>
      {chat && (
        <div className="chat-list-item" key={chat.id}>
          <div>{chat.lastMessage}</div>
        </div>
      )}
    </>
  );
};

export default ChatItem;
