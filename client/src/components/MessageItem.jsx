import React from "react";
import { useSelector } from "react-redux";

const MessageItem = ({ message, my }) => {
  const chat = useSelector((state) => state.chat);
  function getDate(date = Date.now()) {
    let hours = new Date(date).getHours();
    let minutes = new Date(date).getMinutes();

    return `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }`;
  }

  return (
    <div
      style={{ maxWidth: "70%" }}
      className={`flex items-center mt-3 rounded-2xl  text-white px-3 py-2 w-fit text-lg ${
        my
          ? "self-end rounded-br-none bg-sky-600"
          : "self-start bg-gray-700 rounded-bl-none"
      }`}
    >
      {!my && (
        <img
          src={chat.user.photoURL}
          className="w-10 h-10 mr-2  rounded-full"
          alt=""
        />
      )}
      <div>
        {message.text}
        <div className="text-sm">
          <span className="italic">{message.displayName}</span>
          <span className="ml-2">
            {message.createdAt
              ? getDate(message.createdAt.seconds * 1000)
              : getDate()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
