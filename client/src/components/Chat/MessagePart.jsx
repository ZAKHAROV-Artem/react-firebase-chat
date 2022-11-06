import { useState, useEffect } from "react";
import { Spin } from "antd";
import MessageItem from "./../MessageItem";
import { Input } from "antd";
import { Button } from "antd";
import {
  onSnapshot,
  Timestamp,
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
const MessagePart = ({ currentUser }) => {
  const chat = useSelector((state) => state.chat);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(false);
  useEffect(() => {
    const getUser = () => {
      const unsub = onSnapshot(doc(db, "users", chat.user.uid), (doc) => {
        doc.exists() && setOnline(doc.data().online);
      });
      return () => {
        unsub();
      };
    };
    const getMessages = () => {
      const unsub = onSnapshot(doc(db, "chats", chat.chatId), (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      });
      setLoading(false);
      return () => {
        unsub();
      };
    };

    if (chat.chatId) {
      getUser();
      getMessages();
    }
  }, [chat.chatId, chat.user.uid]);

  async function sendMessage() {
    await updateDoc(doc(db, "chats", chat.chatId), {
      messages: arrayUnion({
        uid: uuid(),
        text: message,
        senderId: currentUser.uid,
        createdAt: Timestamp.now(),
      }),
    });
    await updateDoc(doc(db, "usersChats", currentUser.uid), {
      [chat.chatId + ".lastMessage"]: message,

      [chat.chatId + ".date"]: serverTimestamp(),
    });
    await updateDoc(doc(db, "usersChats", chat.user.uid), {
      [chat.chatId + ".lastMessage"]: message,

      [chat.chatId + ".date"]: serverTimestamp(),
    });

    setMessage("");
  }

  return (
    <div className="h-full">
      {chat.chatId !== "" ? (
        <>
          <div
            style={{ height: "9vh" }}
            className="bg-gray-600 flex items-center px-3"
          >
            <img
              src={chat.user?.photoURL}
              alt="user profile"
              className="h-14 w-14 mr-3 rounded-full"
            />
            <h3 className="text-white text-xl mt-2">
              {chat.user?.displayName}
            </h3>
            <div className="ml-2 mt-1 flex items-center">
              <span className="text-gray-300 italic">
                {online ? "Online" : "Offline"}
              </span>
              <div
                className={`${
                  online ? "bg-green-500" : "bg-red-500"
                } rounded-full w-3 h-3 mt-1 ml-3`}
              />
            </div>
          </div>
          <div
            style={{ maxHeight: "76vh", height: "76vh" }}
            className="overflow-y-scroll flex flex-col "
          >
            {loading ? (
              <div
                style={{ maxHeight: "76vh", height: "76vh" }}
                className="flex items-center justify-center"
              >
                <Spin />
              </div>
            ) : (
              <div className="flex flex-col items-center m-1">
                {messages &&
                  messages.map((item) => (
                    <MessageItem
                      key={item.uid}
                      message={item}
                      my={currentUser.uid === item.senderId}
                    />
                  ))}
              </div>
            )}
          </div>
          <div style={{ height: "5vh" }} className="w-full flex">
            <Input
              placeholder="Message..."
              style={{ fontSize: "20px" }}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <Button
              onClick={sendMessage}
              type="primary"
              className="w-2/12"
              size="large"
              disabled={message === ""}
            >
              SEND
            </Button>
          </div>
        </>
      ) : (
        <div className="h-full flex items-center justify-center">
          Select chat to start messaging
        </div>
      )}
    </div>
  );
};

export default MessagePart;
