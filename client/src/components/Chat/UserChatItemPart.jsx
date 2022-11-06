import { useState, useContext, useEffect } from "react";
import { Input } from "antd";
import {
  collection,
  where,
  query,
  getDocs,
  setDoc,
  getDoc,
  doc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import { UserOutlined } from "@ant-design/icons";
import { AiOutlineSearch } from "react-icons/ai";
import UserChatItem from "../UserChatItem";
import { useDispatch } from "react-redux";
import { AuthContext } from "./../../context/AuthCotext";
import { changeChat } from "../../redux/reducers/chatSlice";

const UserChatItemPart = () => {
  const [error, setError] = useState("");
  const [searchUsername, setSearchUsername] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, "usersChats", currentUser.uid),
        (doc) => {
          doc.exists() && setChats(Object.entries(doc.data()));
        }
      );
      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const searchUser = async () => {
    setSearchedUser(null);
    const q = query(
      collection(db, "users"),
      where("displayName", "==", searchUsername)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((user) => {
        setSearchedUser(user.data());
      });
      querySnapshot.empty && setError("User not found");
    } catch (error) {
      setError("User not found");
    }
  };

  const addChat = async () => {
    const combineUID =
      currentUser.uid > searchedUser.uid
        ? currentUser.uid + searchedUser.uid
        : searchedUser.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combineUID));
      console.log(res.exists());
      if (!res.exists()) {
        await setDoc(doc(db, "chats", combineUID), { messages: [] });

        await updateDoc(doc(db, "usersChats", currentUser.uid), {
          [combineUID + ".userInfo"]: {
            uid: searchedUser.uid,
            photoURL: searchedUser.photoURL,
            displayName: searchedUser.displayName,
          },
          [combineUID + ".lastMessage"]: "",
          [combineUID + ".date"]: serverTimestamp(),
        });
        await updateDoc(doc(db, "usersChats", searchedUser.uid), {
          [combineUID + ".userInfo"]: {
            uid: currentUser.uid,
            photoURL: currentUser.photoURL,
            displayName: currentUser.displayName,
          },
          [combineUID + ".lastMessage"]: "",
          [combineUID + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log(error);
    }
    setSearchUsername("");
    setSearchedUser(null);
  };

  const startChat = (user) => {
    dispatch(
      changeChat({
        user,
        chatId:
          currentUser.uid > user.uid
            ? currentUser.uid + user.uid
            : user.uid + currentUser.uid,
      })
    );
  };

  return (
    <div className="h-full">
      <div className="flex" style={{ height: "7vh" }}>
        <Input
          placeholder="Search user"
          size="large"
          className=" h-full"
          prefix={<UserOutlined />}
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
        />
        <button
          onClick={searchUser}
          className="bg-blue-400 text-white px-4 py-2 mr-1"
        >
          <AiOutlineSearch size={20} />
        </button>
      </div>
      <div
        style={{ maxHeight: "83vh", height: "83vh" }}
        className="overflow-y-scroll flex flex-col"
      >
        {error !== "" && (
          <span className="text-center text-red-600">{error}</span>
        )}
        {searchedUser && (
          <div onClick={addChat}>
            <UserChatItem
              displayName={searchedUser.displayName}
              photoURL={searchedUser.photoURL}
              lastMessage=""
              searched={true}
            />
          </div>
        )}
        {chats.map((chat) => (
          <div key={chat[0]} onClick={() => startChat(chat[1].userInfo)}>
            <UserChatItem
              displayName={chat[1].userInfo.displayName}
              photoURL={chat[1].userInfo.photoURL}
              lastMessage={chat[1].lastMessage}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserChatItemPart;
