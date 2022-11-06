import React from "react";

const UserChatItem = ({
  displayName,
  photoURL,
  lastMessage = "",
  searched = false,
}) => {
  return (
    <div
      className={`${
        searched ? "bg-slate-500" : "bg-slate-700"
      } flex p-2 border-b-2`}
    >
      <img
        src={photoURL}
        className="h-14 w-14 mr-3 rounded-full"
        alt="user profile"
      ></img>
      <div>
        <h3 className="text-white text-xl mb-0">{displayName}</h3>
        <span className="text-gray-300 italic">
          {lastMessage.length > 25
            ? lastMessage.slice(0, 25) + "..."
            : lastMessage}
        </span>
      </div>
    </div>
  );
};

export default UserChatItem;
