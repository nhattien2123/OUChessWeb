import React, { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { Root } from "react-dom/client";
import { RootState } from "../../app/store";
import useDocuments from "../firestore/DocumentsHook";
import { db } from "../../config/FirebaseConfig"
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import ChatItem from "./ChatItem";

import "../../components/Messenger/Messenger.scss"

interface Props {};

const Chat = (props: Props) => {
  const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
  const [chats, setChats] = useState<any>(null);

  const chatCondition = useMemo(() => {
    return {
      fieldName: "members",
      operator: "array-contains",
      value: currentUser._id,
    };
  }, []);

  const listChat = useDocuments({
    _collection: "chat",
    _condition: chatCondition,
  });


  return (
    <>
      <div className="chat-list">
        <div className="chat-list-header">Các cuộc trò truyện</div>
        <div className="chat-list-search">
          <input type="text" placeholder="Tìm kiếm ..."></input>
        </div>
        <div className="chat-list-items">
          {listChat.length > 0 &&
            listChat.map((c: any) => {
              return <ChatItem chat={c} key={c.id} />;
            })}
        </div>
      </div>
    </>
  );
};

export default Chat;
